import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPessoas } from '../api/apiService';
import CriarPessoaForm from '../components/CriarPessoaForm';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography, Box, CircularProgress,
    Button, Dialog, DialogContent, Snackbar, Alert, Card, CardContent, CardHeader
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

function ListaPessoas() {
    // Navegação, estados e funções principais
    const navigate = useNavigate();
    const [pessoas, setPessoas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setFormOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleRowClick = (id) => {
        navigate(`/clientes/${id}`);
    };
    
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

    // Hook 
    useEffect(() => { fetchPessoas(); }, [fetchPessoas]);

    const handleFormSuccess = () => {
        setFormOpen(false);
        setSnackbar({ open: true, message: 'Cliente adicionado com sucesso!', severity: 'success' });
        fetchPessoas();
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>A carregar clientes...</Typography>
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error" sx={{m: 3}}>{error}</Alert>;
    }

    return (
        <Card>
            <CardHeader
                title="Lista de Clientes"
                action={
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
                        Adicionar Cliente
                    </Button>
                }
            />
            <CardContent>
                <TableContainer component={Paper} variant="outlined">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>CPF</TableCell>
                                <TableCell>Data de Nascimento</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pessoas.length > 0 ? (
                                pessoas.map((pessoa) => (
                                    <TableRow
                                        key={pessoa.idPessoa}
                                        hover
                                        onClick={() => handleRowClick(pessoa.idPessoa)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{pessoa.idPessoa}</TableCell>
                                        <TableCell>{pessoa.nome}</TableCell>
                                        <TableCell>{pessoa.cpf}</TableCell>
                                        <TableCell>{new Date(pessoa.dataNascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, color: 'text.secondary' }}>
                                            <PeopleOutlineIcon sx={{ fontSize: 48, mb: 1 }} />
                                            <Typography>Nenhum cliente encontrado.</Typography>
                                            <Button onClick={() => setFormOpen(true)} sx={{ mt: 1 }}>Adicionar o primeiro</Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>

            <Dialog open={isFormOpen} onClose={() => setFormOpen(false)}><DialogContent><CriarPessoaForm onSuccess={handleFormSuccess} onCancel={() => setFormOpen(false)} /></DialogContent></Dialog>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}><Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert></Snackbar>
        </Card>
    );
}

export default ListaPessoas;