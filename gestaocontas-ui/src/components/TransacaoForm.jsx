import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';

// Um formulário genérico para operações com valor (depósito/saque)
// - title: "Depositar" ou "Sacar"
// - onSubmit: A função a ser chamada quando o formulário for submetido
// - onCancel: A função para fechar o formulário
function TransacaoForm({ title, onSubmit, onCancel }) {
    const [valor, setValor] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await onSubmit(parseFloat(valor));
        } catch (err) {
            const errorMsg = err.response?.data?.message || `Erro ao realizar a operação.`;
            setError(errorMsg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
                margin="normal"
                required
                fullWidth
                id="valor"
                label="Valor (R$)"
                name="valor"
                type="number"
                autoFocus
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                inputProps={{ step: "0.01", min: "0.01" }}
            />
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={onCancel} color="secondary">
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !valor}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    {loading ? 'Processando...' : 'Confirmar'}
                </Button>
            </Box>
        </Box>
    );
}

export default TransacaoForm;