import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Inventory, Category, Dashboard, ShoppingCart } from '@mui/icons-material';
import CategoriasPage from './pages/CategoriasPage';
import ProductosPage from './pages/ProductosPage';
import VentasPage from './pages/VentasPage';
import DashboardInventarioPage from './pages/DashboardInventarioPage';

function App() {
    return (
        <Router>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Inventory sx={{ mr: 2 }} />
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Kolina - Sistema de Gestión
                        </Typography>
                        <Button color="inherit" component={Link} to="/" startIcon={<Dashboard />}>
                            Dashboard
                        </Button>
                        <Button color="inherit" component={Link} to="/ventas" startIcon={<ShoppingCart />}>
                            Ventas
                        </Button>
                        <Button color="inherit" component={Link} to="/categorias" startIcon={<Category />}>
                            Categorías
                        </Button>
                        <Button color="inherit" component={Link} to="/productos" startIcon={<Inventory />}>
                            Productos
                        </Button>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Routes>
                        <Route path="/" element={<DashboardInventarioPage />} />
                        <Route path="/ventas" element={<VentasPage />} />
                        <Route path="/categorias" element={<CategoriasPage />} />
                        <Route path="/productos" element={<ProductosPage />} />
                    </Routes>
                </Container>
            </Box>
        </Router>
    );
}

export default App;