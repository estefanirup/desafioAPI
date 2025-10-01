import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPessoas = () => apiClient.get('/pessoas');
export const getPessoaById = (id) => apiClient.get(`/pessoas/${id}`);
export const createPessoa = (pessoaData) => apiClient.post('/pessoas', pessoaData);

