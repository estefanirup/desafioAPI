import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ListaPessoas from './pages/ListaPessoas';
import DetalhesCliente from './pages/DetalhesCliente';

function App() { // Rotas principais da aplicação 
  return (
    <Router> 
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ListaPessoas />} />
          <Route path="/clientes/:id" element={<DetalhesCliente />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;