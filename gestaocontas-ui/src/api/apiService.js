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
export const depositarEmConta = (idConta, valor) => apiClient.post(`/contas/${idConta}/deposito`, { valor });
export const sacarDeConta = (idConta, valor) => apiClient.post(`/contas/${idConta}/saque`, { valor });
export const transferirEntreContas = (idContaOrigem, idContaDestino, valor) => 
    apiClient.post(`/contas/${idContaOrigem}/transferencia`, { idContaDestino, valor });
export const alterarStatusConta = (idConta) => apiClient.patch(`/contas/${idConta}/alterar-status`);
export const criarConta = (contaData) => apiClient.post('/contas', contaData);