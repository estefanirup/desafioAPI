import React, { useState, useEffect, useCallback } from 'react';
import { getPessoas } from '../api/apiService';
import CriarPessoaForm from '../components/CriarPessoaForm';
import { Link as RouterLink } from 'react-router-dom'; 
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography, Box, CircularProgress,
    Button, Dialog, DialogContent, Snackbar, Alert,
    Link 
} from '@mui/material';

function ListaPessoas() {

    const [pessoas, setPessoas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setFormOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchPessoas = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getPessoas();
            setPessoas(response.data);
        } catch (err) {
            setError('Falha ao carregar os dados das pessoas. A API está rodando?');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPessoas();
    }, [fetchPessoas]);


    const handleFormSuccess = () => {
        setFormOpen(false); 
        setSnackbar({ open: true, message: 'Cliente adicionado com sucesso!', severity: 'success' }); 
        fetchPessoas();
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading && pessoas.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>A carregar clientes...</Typography>
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">
                    Lista de Clientes
                </Typography>
                <Button variant="contained" onClick={() => setFormOpen(true)}>
                    Adicionar Cliente
                </Button>
            </Box>
            
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="tabela de clientes">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>CPF</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Data de Nascimento</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pessoas.map((pessoa) => (
                            <TableRow 
                                key={pessoa.idPessoa}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{pessoa.idPessoa}</TableCell>
                                
                                <TableCell>
                                    <Link component={RouterLink} to={`/clientes/${pessoa.idPessoa}`} underline="hover">
                                        {pessoa.nome}
                                    </Link>
                                </TableCell>

                                <TableCell>{pessoa.cpf}</TableCell>
                                <TableCell>{new Date(pessoa.dataNascimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isFormOpen} onClose={() => setFormOpen(false)}>
                <DialogContent>
                    <CriarPessoaForm 
                        onSuccess={handleFormSuccess} 
                        onCancel={() => setFormOpen(false)} 
                    />
                </DialogContent>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ListaPessoas;