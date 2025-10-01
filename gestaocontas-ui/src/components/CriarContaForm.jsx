import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';

function CriarContaForm({ onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        limiteSaqueDiario: '',
        tipoConta: '1', // '1' para Conta Corrente por defeito
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
                limiteSaqueDiario: parseFloat(formData.limiteSaqueDiario),
                tipoConta: parseInt(formData.tipoConta, 10),
            });
        } catch (err) {
            const errorMsg = err.response?.data?.message || `Erro ao criar a conta.`;
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ minWidth: 300 }}>
            <Typography variant="h6" gutterBottom>
                Adicionar Nova Conta
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
                margin="normal"
                required
                fullWidth
                id="limiteSaqueDiario"
                label="Limite de Saque Diário (R$)"
                name="limiteSaqueDiario"
                type="number"
                autoFocus
                value={formData.limiteSaqueDiario}
                onChange={handleChange}
                inputProps={{ step: "0.01", min: "0" }}
            />
            
            <FormControl fullWidth margin="normal">
                <InputLabel id="tipoConta-label">Tipo de Conta</InputLabel>
                <Select
                    labelId="tipoConta-label"
                    id="tipoConta"
                    name="tipoConta"
                    value={formData.tipoConta}
                    label="Tipo de Conta"
                    onChange={handleChange}
                >
                    <MenuItem value={'1'}>Conta Corrente</MenuItem>
                    <MenuItem value={'2'}>Poupança</MenuItem>
                </Select>
            </FormControl>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={onCancel} color="secondary">
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !formData.limiteSaqueDiario}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    {loading ? 'A Criar...' : 'Criar Conta'}
                </Button>
            </Box>
        </Box>
    );
}

export default CriarContaForm;