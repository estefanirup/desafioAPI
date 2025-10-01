import React, { useState } from 'react';
import { createPessoa } from '../api/apiService';
import {
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';

// Este formulário recebe duas funções como props:
// - onSuccess: para ser chamada quando a pessoa for criada com sucesso.
// - onCancel: para fechar o formulário.
function CriarPessoaForm({ onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        dataNascimento: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Impede o recarregamento da página
        setLoading(true);
        setError(null);

        try {
            await createPessoa(formData);
            onSuccess(); // Chama a função de sucesso passada pelo componente pai
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Erro ao criar a pessoa. Verifique os dados e tente novamente.';
            setError(errorMsg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h6" gutterBottom>
                Adicionar Novo Cliente
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
                margin="normal"
                required
                fullWidth
                id="nome"
                label="Nome Completo"
                name="nome"
                autoComplete="name"
                autoFocus
                value={formData.nome}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="cpf"
                label="CPF (apenas números)"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="dataNascimento"
                label="Data de Nascimento"
                name="dataNascimento"
                type="date"
                InputLabelProps={{
                    shrink: true,
                }}
                value={formData.dataNascimento}
                onChange={handleChange}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={onCancel} color="secondary">
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    {loading ? 'A Guardar...' : 'Guardar'}
                </Button>
            </Box>
        </Box>
    );
}

export default CriarPessoaForm;