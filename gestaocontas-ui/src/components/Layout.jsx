import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

function Layout() {
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <AccountBalanceIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" noWrap component="div">
                        Gestão de Contas
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) => theme.palette.background.default,
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar /> {/* Espaçador para o conteúdo não ficar por baixo da AppBar */}
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Outlet /> {/* Onde as páginas são renderizadas*/}
                </Container>
            </Box>
        </Box>
    );
}

export default Layout;