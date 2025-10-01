import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Stack,
    Grid, Card, CardHeader, CardContent, Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function DetalhesCliente() {
    const { id } = useParams();
    const [cliente, setCliente] = useState(null);
    const [contas, setContas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
        <Stack spacing={4}>
            <Box>
                <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />}>
                    Voltar à Lista de Clientes
                </Button>
            </Box>

            <Card>
                <CardHeader title="Detalhes do Cliente" />
                <CardContent>
                    <Typography variant="h5" gutterBottom>{cliente.nome}</Typography>
                    <Typography variant="body2" color="text.secondary"><strong>CPF:</strong> {cliente.cpf}</Typography>
                    <Typography variant="body2" color="text.secondary"><strong>Data de Nascimento:</strong> {new Date(cliente.dataNascimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</Typography>
                </CardContent>
            </Card>

            <Card>
                <CardHeader
                    title="Contas Bancárias"
                    action={
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCriarContaModal}>
                            Criar Nova Conta
                        </Button>
                    }
                />
                <CardContent>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Saldo</TableCell>
                                    <TableCell align="center">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {contas.length > 0 ? (
                                    contas.map((conta) => (
                                        <TableRow key={conta.idConta}>
                                            <TableCell>{conta.idConta}</TableCell>
                                            <TableCell>{conta.tipoConta === 1 ? 'Corrente' : 'Poupança'}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={conta.flagAtivo ? 'Ativa' : 'Bloqueada'} 
                                                    color={conta.flagAtivo ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(conta.saldo)}</TableCell>
                                            <TableCell align="center">
                                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="center">
                                                    <Button size="small" variant="outlined" startIcon={<AttachMoneyIcon />} onClick={() => handleOpenTransacaoModal('deposito', conta.idConta)} disabled={!conta.flagAtivo}>Depositar</Button>
                                                    <Button size="small" variant="outlined" color="secondary" startIcon={<MoneyOffIcon />} onClick={() => handleOpenTransacaoModal('saque', conta.idConta)} disabled={!conta.flagAtivo}>Sacar</Button>
                                                    <Button size="small" variant="outlined" color="primary" startIcon={<SyncAltIcon />} onClick={() => handleOpenTransferenciaModal(conta.idConta)} disabled={!conta.flagAtivo}>Transferir</Button>
                                                    <Button size="small" variant="contained" color={conta.flagAtivo ? "warning" : "success"} startIcon={conta.flagAtivo ? <BlockIcon /> : <CheckCircleOutlineIcon />} onClick={() => handleOpenBloqueioModal(conta)}>
                                                        {conta.flagAtivo ? 'Bloquear' : 'Reativar'}
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, color: 'text.secondary' }}>
                                                <AccountBalanceWalletIcon sx={{ fontSize: 40, mb: 1 }} />
                                                <Typography>Este cliente ainda não possui contas.</Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <Dialog open={transacaoModal.open} onClose={handleCloseTransacaoModal}><DialogContent><TransacaoForm title={transacaoModal.type === 'deposito' ? 'Realizar Depósito' : 'Realizar Saque'} onSubmit={handleSubmitTransacao} onCancel={handleCloseTransacaoModal} /></DialogContent></Dialog>
            <Dialog open={transferenciaModal.open} onClose={handleCloseTransferenciaModal}><DialogContent><TransferenciaForm onSubmit={handleSubmitTransferencia} onCancel={handleCloseTransferenciaModal} /></DialogContent></Dialog>
            <Dialog open={bloqueioModal.open} onClose={handleCloseBloqueioModal}><DialogTitle>Confirmar Ação</DialogTitle><DialogContent><DialogContentText>Tem a certeza que deseja {bloqueioModal.conta?.flagAtivo ? 'BLOQUEAR' : 'REATIVAR'} a conta {bloqueioModal.conta?.idConta}?</DialogContentText></DialogContent><DialogActions><Button onClick={handleCloseBloqueioModal}>Cancelar</Button><Button onClick={handleConfirmarBloqueio} autoFocus>Confirmar</Button></DialogActions></Dialog>
            <Dialog open={criarContaModal} onClose={handleCloseCriarContaModal}><DialogContent><CriarContaForm onSubmit={handleSubmitCriarConta} onCancel={handleCloseCriarContaModal} /></DialogContent></Dialog>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}><Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert></Snackbar>
        </Stack>
    );
}

export default DetalhesCliente;