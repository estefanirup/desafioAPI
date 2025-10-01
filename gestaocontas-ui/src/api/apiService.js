import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Funções para Pessoas
export const getPessoas = () => apiClient.get('/pessoas');
export const getPessoaById = (id) => apiClient.get(`/pessoas/${id}`);
export const createPessoa = (pessoaData) => apiClient.post('/pessoas', pessoaData);

// Funções para Contas
export const getContasPorPessoa = (idPessoa) => apiClient.get(`/contas/pessoa/${idPessoa}`);
