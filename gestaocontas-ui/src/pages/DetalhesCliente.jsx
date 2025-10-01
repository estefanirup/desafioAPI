import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
    getPessoaById,
    getContasPorPessoa,
    depositarEmConta,
    sacarDeConta,
    transferirEntreContas, 
    alterarStatusConta 
} from '../api/apiService';
import TransacaoForm from '../components/TransacaoForm';
import TransferenciaForm from '../components/TransferenciaForm';
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

            <Typography variant="h5" component="h2" gutterBottom>
                Contas Bancárias
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell align="right">Saldo</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contas.map((conta) => (
                            <TableRow key={conta.idConta}>
                                <TableCell>{conta.idConta}</TableCell>
                                <TableCell>{conta.tipoConta === 1 ? 'Corrente' : 'Poupança'}</TableCell>
                                <TableCell align="right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(conta.saldo)}</TableCell>
                                <TableCell>{conta.flagAtivo ? 'Ativa' : 'Bloqueada'}</TableCell>
                                <TableCell align="center">
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="center">
                                        <Button size="small" variant="outlined" onClick={() => handleOpenTransacaoModal('deposito', conta.idConta)}>Depositar</Button>
                                        <Button size="small" variant="outlined" color="secondary" onClick={() => handleOpenTransacaoModal('saque', conta.idConta)}>Sacar</Button>
                                        <Button size="small" variant="outlined" color="primary" onClick={() => handleOpenTransferenciaModal(conta.idConta)}>Transferir</Button>
                                        <Button size="small" variant="contained" color={conta.flagAtivo ? "warning" : "success"} onClick={() => handleOpenBloqueioModal(conta)}>
                                            {conta.flagAtivo ? 'Bloquear' : 'Reativar'}
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal de Depósito/Saque */}
            <Dialog open={transacaoModal.open} onClose={handleCloseTransacaoModal}><DialogContent><TransacaoForm title={transacaoModal.type === 'deposito' ? 'Realizar Depósito' : 'Realizar Saque'} onSubmit={handleSubmitTransacao} onCancel={handleCloseTransacaoModal} /></DialogContent></Dialog>

            {/* Modal de Transferência */}
            <Dialog open={transferenciaModal.open} onClose={handleCloseTransferenciaModal}><DialogContent><TransferenciaForm onSubmit={handleSubmitTransferencia} onCancel={handleCloseTransferenciaModal} /></DialogContent></Dialog>

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

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}><Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert></Snackbar>
        </Box>
    );
}

export default DetalhesCliente;