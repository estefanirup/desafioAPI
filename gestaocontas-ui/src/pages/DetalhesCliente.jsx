import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
    getPessoaById,
    getContasPorPessoa,
    depositarEmConta,
    sacarDeConta,
    transferirEntreContas,
    alterarStatusConta,
    criarConta
} from '../api/apiService';
import TransacaoForm from '../components/TransacaoForm';
import TransferenciaForm from '../components/TransferenciaForm';
import CriarContaForm from '../components/CriarContaForm';
import {
    Box, Typography, CircularProgress, Alert, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Stack
} from '@mui/material';

function DetalhesCliente() {
    const { id } = useParams();
    const [cliente, setCliente] = useState(null);
    const [contas, setContas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Estados para os modais
    const [transacaoModal, setTransacaoModal] = useState({ open: false, type: '', contaId: null });
    const [transferenciaModal, setTransferenciaModal] = useState({ open: false, contaOrigemId: null });
    const [bloqueioModal, setBloqueioModal] = useState({ open: false, conta: null });
    const [criarContaModal, setCriarContaModal] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [resCliente, resContas] = await Promise.all([getPessoaById(id), getContasPorPessoa(id)]);
            setCliente(resCliente.data);
            setContas(resContas.data);
        } catch (err) {
            setError('Falha ao carregar os dados do cliente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
    const handleOpenTransacaoModal = (type, contaId) => setTransacaoModal({ open: true, type, contaId });
    const handleCloseTransacaoModal = () => setTransacaoModal({ open: false, type: '', contaId: null });
    const handleSubmitTransacao = async (valor) => {
        const { type, contaId } = transacaoModal;
        const apiCall = type === 'deposito' ? depositarEmConta : sacarDeConta;
        try {
            await apiCall(contaId, valor);
            handleCloseTransacaoModal();
            setSnackbar({ open: true, message: `${type.charAt(0).toUpperCase() + type.slice(1)} realizado com sucesso!`, severity: 'success' });
            fetchData();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Ocorreu um erro.';
            handleCloseTransacaoModal();
            setSnackbar({ open: true, message: errorMsg, severity: 'error' });
        }
    };

    const handleOpenTransferenciaModal = (contaOrigemId) => setTransferenciaModal({ open: true, contaOrigemId });
    const handleCloseTransferenciaModal = () => setTransferenciaModal({ open: false, contaOrigemId: null });
    const handleSubmitTransferencia = async ({ idContaDestino, valor }) => {
        try {
            await transferirEntreContas(transferenciaModal.contaOrigemId, idContaDestino, valor);
            handleCloseTransferenciaModal();
            setSnackbar({ open: true, message: 'Transferência realizada com sucesso!', severity: 'success' });
            fetchData();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Erro ao realizar a transferência.';
            console.error('Falha na transferência:', err);
            throw err;
        }
    };

    const handleOpenBloqueioModal = (conta) => setBloqueioModal({ open: true, conta });
    const handleCloseBloqueioModal = () => setBloqueioModal({ open: false, conta: null });
    const handleConfirmarBloqueio = async () => {
        try {
            await alterarStatusConta(bloqueioModal.conta.idConta);
            handleCloseBloqueioModal();
            setSnackbar({ open: true, message: 'Status da conta alterado com sucesso!', severity: 'success' });
            fetchData();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Erro ao alterar o status da conta.';
            handleCloseBloqueioModal();
            setSnackbar({ open: true, message: errorMsg, severity: 'error' });
        }
    };

    const handleOpenCriarContaModal = () => setCriarContaModal(true);
    const handleCloseCriarContaModal = () => setCriarContaModal(false);
    const handleSubmitCriarConta = async (formData) => {
        try {
            const contaData = { ...formData, idPessoa: id };
            await criarConta(contaData);
            handleCloseCriarContaModal();
            setSnackbar({ open: true, message: 'Nova conta criada com sucesso!', severity: 'success' });
            fetchData();
        } catch (err) {
            console.error('Falha ao criar conta:', err);
            throw err;
        }
    };



    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>A carregar dados...</Typography>
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
    }

    if (!cliente) {
        return <Alert severity="warning" sx={{ m: 3 }}>Cliente não encontrado.</Alert>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Button component={RouterLink} to="/" sx={{ mb: 2 }}>
                &larr; Voltar para a Lista de Clientes
            </Button>

            <Typography variant="h4" component="h1" gutterBottom>
                Painel do Cliente
            </Typography>

            {/* Secção de Informações do Cliente */}
            <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f9f9f9' }}>
                <Typography variant="h6">{cliente.nome}</Typography>
                <Typography><strong>CPF:</strong> {cliente.cpf}</Typography>
                <Typography><strong>Data de Nascimento:</strong> {new Date(cliente.dataNascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Typography>
            </Paper>

            {/* Cabeçalho da secção de Contas com o novo botão */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2">
                    Contas Bancárias
                </Typography>
                <Button variant="contained" onClick={handleOpenCriarContaModal}>
                    Adicionar Nova Conta
                </Button>
            </Box>

            {/* Tabela que lista as contas existentes */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Saldo</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="center">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contas.length > 0 ? (
                            contas.map((conta) => (
                                <TableRow key={conta.idConta}>
                                    <TableCell>{conta.idConta}</TableCell>
                                    <TableCell>{conta.tipoConta === 1 ? 'Corrente' : 'Poupança'}</TableCell>
                                    <TableCell align="right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(conta.saldo)}</TableCell>
                                    <TableCell>
                                        <Typography color={conta.flagAtivo ? 'green' : 'red'}>
                                            {conta.flagAtivo ? 'Ativa' : 'Bloqueada'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="center">
                                            <Button size="small" variant="outlined" onClick={() => handleOpenTransacaoModal('deposito', conta.idConta)} disabled={!conta.flagAtivo}>Depositar</Button>
                                            <Button size="small" variant="outlined" color="secondary" onClick={() => handleOpenTransacaoModal('saque', conta.idConta)} disabled={!conta.flagAtivo}>Sacar</Button>
                                            <Button size="small" variant="outlined" color="primary" onClick={() => handleOpenTransferenciaModal(conta.idConta)} disabled={!conta.flagAtivo}>Transferir</Button>
                                            <Button size="small" variant="contained" color={conta.flagAtivo ? "warning" : "success"} onClick={() => handleOpenBloqueioModal(conta)}>
                                                {conta.flagAtivo ? 'Bloquear' : 'Reativar'}
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Este cliente ainda não possui contas.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal de Depósito/Saque */}
            <Dialog open={transacaoModal.open} onClose={handleCloseTransacaoModal}>
                <DialogContent>
                    <TransacaoForm
                        title={transacaoModal.type === 'deposito' ? 'Realizar Depósito' : 'Realizar Saque'}
                        onSubmit={handleSubmitTransacao}
                        onCancel={handleCloseTransacaoModal}
                    />
                </DialogContent>
            </Dialog>

            {/* Modal de Transferência */}
            <Dialog open={transferenciaModal.open} onClose={handleCloseTransferenciaModal}>
                <DialogContent>
                    <TransferenciaForm
                        onSubmit={handleSubmitTransferencia}
                        onCancel={handleCloseTransferenciaModal}
                    />
                </DialogContent>
            </Dialog>

            {/* Modal de Confirmação de Bloqueio */}
            <Dialog open={bloqueioModal.open} onClose={handleCloseBloqueioModal}>
                <DialogTitle>Confirmar Ação</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem a certeza que deseja {bloqueioModal.conta?.flagAtivo ? 'BLOQUEAR' : 'REATIVAR'} a conta {bloqueioModal.conta?.idConta}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseBloqueioModal}>Cancelar</Button>
                    <Button onClick={handleConfirmarBloqueio} autoFocus>Confirmar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal para Criar Conta */}
            <Dialog open={criarContaModal} onClose={handleCloseCriarContaModal}>
                <DialogContent>
                    <CriarContaForm
                        onSubmit={handleSubmitCriarConta}
                        onCancel={handleCloseCriarContaModal}
                    />
                </DialogContent>
            </Dialog>

            {/* Notificação para feedback ao utilizador */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default DetalhesCliente;