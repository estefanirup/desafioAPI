import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListaPessoas from './pages/ListaPessoas';
import DetalhesCliente from './pages/DetalhesCliente'; 
import { CssBaseline, Container } from '@mui/material';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Container>
        <Routes>
          <Route path="/" element={<ListaPessoas />} />
          <Route path="/clientes/:id" element={<DetalhesCliente />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;