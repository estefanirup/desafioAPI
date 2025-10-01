import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';

function TransferenciaForm({ onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        idContaDestino: '',
        valor: '',
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
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await onSubmit({
                idContaDestino: parseInt(formData.idContaDestino, 10),
                valor: parseFloat(formData.valor)
            });
        } catch (err) {
            const errorMsg = err.response?.data?.message || `Erro ao realizar a transferência.`;
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h6" gutterBottom>
                Realizar Transferência
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
                margin="normal"
                required
                fullWidth
                id="idContaDestino"
                label="ID da Conta de Destino"
                name="idContaDestino"
                type="number"
                autoFocus
                value={formData.idContaDestino}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="valor"
                label="Valor (R$)"
                name="valor"
                type="number"
                value={formData.valor}
                onChange={handleChange}
                inputProps={{ step: "0.01", min: "0.01" }}
            />
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={onCancel} color="secondary">
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !formData.idContaDestino || !formData.valor}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    {loading ? 'Transferindo...' : 'Confirmar'}
                </Button>
            </Box>
        </Box>
    );
}

export default TransferenciaForm;