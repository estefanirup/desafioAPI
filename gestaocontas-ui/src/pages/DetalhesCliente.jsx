
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { getPessoaById, getContasPorPessoa } from '../api/apiService';
import { 
    Box, Typography, CircularProgress, Alert, Paper, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button 
} from '@mui/material';

function DetalhesCliente() {
    const { id } = useParams(); // Obtém o ID do cliente a partir do URL
    const [cliente, setCliente] = useState(null);
    const [contas, setContas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Faz as duas chamadas à API em paralelo para mais eficiência
                const [resCliente, resContas] = await Promise.all([
                    getPessoaById(id),
                    getContasPorPessoa(id)
                ]);
                setCliente(resCliente.data);
                setContas(resContas.data);
            } catch (err) {
                setError('Falha ao carregar os dados do cliente.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]); // O efeito é re-executado sempre que o ID no URL mudar

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Button component={RouterLink} to="/" sx={{ mb: 2 }}>
                &larr; Voltar para a Lista
            </Button>
            <Typography variant="h4" component="h1" gutterBottom>
                Detalhes do Cliente
            </Typography>

            {/* Informações do Cliente */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6">{cliente.nome}</Typography>
                <Typography><strong>CPF:</strong> {cliente.cpf}</Typography>
                <Typography><strong>Data de Nascimento:</strong> {new Date(cliente.dataNascimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</Typography>
            </Paper>

            {/* Lista de Contas */}
            <Typography variant="h5" component="h2" gutterBottom>
                Contas Bancárias
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID da Conta</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Saldo</TableCell>
                            <TableCell>Ativa</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contas.map((conta) => (
                            <TableRow key={conta.idConta}>
                                <TableCell>{conta.idConta}</TableCell>
                                <TableCell>{conta.tipoConta === 1 ? 'Conta Corrente' : 'Poupança'}</TableCell>
                                <TableCell>R$ {conta.saldo.toFixed(2)}</TableCell>
                                <TableCell>{conta.flagAtivo ? 'Sim' : 'Não'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default DetalhesCliente;
