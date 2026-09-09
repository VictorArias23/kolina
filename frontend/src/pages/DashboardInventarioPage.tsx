import React, { useState, useEffect } from 'react';
import {
    Grid, Card, CardContent, Typography, Box,
    CircularProgress, Alert, LinearProgress, List, ListItem,
    ListItemText, ListItemAvatar, Avatar, Chip, Divider,
    Paper, Button
} from '@mui/material';
import {
    Inventory, Warning, Block, AttachMoney,
    TrendingUp, TrendingDown, ShoppingCart,
    Category, Assessment, Refresh
} from '@mui/icons-material';
import { movimientosApi } from '../api/movimientosApi';
import { productosApi } from '../api/productosApi';
import { categoriasApi } from '../api/categoriasApi';

const DashboardInventarioPage: React.FC = () => {
    const [resumen, setResumen] = useState<any>(null);
    const [productosStockBajo, setProductosStockBajo] = useState<any[]>([]);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Cargar datos en paralelo
            const [resumenData, stockBajoData, categoriasData] = await Promise.all([
                movimientosApi.getResumen(),
                productosApi.getStockBajo(),
                categoriasApi.getAll()
            ]);

            setResumen(resumenData);
            setProductosStockBajo(stockBajoData.slice(0, 5)); // Solo los primeros 5
            setCategorias(categoriasData.slice(0, 4)); // Solo los primeros 4
        } catch (err) {
            setError('Error al cargar el dashboard');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert 
                    severity="error" 
                    action={
                        <Button color="inherit" size="small" onClick={loadDashboardData}>
                            Reintentar
                        </Button>
                    }
                >
                    {error}
                </Alert>
            </Box>
        );
    }

    const cards = [
        {
            title: 'Total Productos',
            value: resumen?.total_productos || 0,
            icon: <Inventory sx={{ fontSize: 40, color: '#1976d2' }} />,
            color: '#e3f2fd',
            bgColor: '#1976d2'
        },
        {
            title: 'Stock Total',
            value: resumen?.stock_total || 0,
            icon: <AttachMoney sx={{ fontSize: 40, color: '#2e7d32' }} />,
            color: '#e8f5e9',
            bgColor: '#2e7d32'
        },
        {
            title: 'Stock Bajo',
            value: resumen?.stock_bajo || 0,
            icon: <Warning sx={{ fontSize: 40, color: '#ed6c02' }} />,
            color: '#fff3e0',
            bgColor: '#ed6c02'
        },
        {
            title: 'Sin Stock',
            value: resumen?.sin_stock || 0,
            icon: <Block sx={{ fontSize: 40, color: '#d32f2f' }} />,
            color: '#ffebee',
            bgColor: '#d32f2f'
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Dashboard de Inventario
                </Typography>
                <Button 
                    variant="outlined" 
                    startIcon={<Refresh />} 
                    onClick={loadDashboardData}
                    disabled={loading}
                >
                    Actualizar
                </Button>
            </Box>

            {/* Tarjetas de estadísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ 
                            backgroundColor: card.color,
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'scale(1.02)'
                            }
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="h3" component="div" fontWeight="bold">
                                            {card.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {card.title}
                                        </Typography>
                                    </Box>
                                    {card.icon}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Valor del Inventario */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Valor del Inventario
                            </Typography>
                            <Typography variant="h2" color="primary" fontWeight="bold">
                                S/. {resumen?.valor_inventario || '0.00'}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={65}
                                    sx={{ height: 10, borderRadius: 5 }}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    {resumen?.total_productos || 0} productos en inventario
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Categorías destacadas */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Categorías Destacadas
                            </Typography>
                            <Grid container spacing={1}>
                                {categorias.map((cat) => (
                                    <Grid item xs={6} key={cat.id}>
                                        <Box sx={{ 
                                            p: 1.5, 
                                            bgcolor: cat.color + '20',
                                            borderRadius: 1,
                                            border: '1px solid ' + cat.color + '40'
                                        }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                {cat.nombre}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {cat.total_productos || 0} productos
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Últimos Movimientos */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Últimos Movimientos
                            </Typography>
                            <List>
                                {resumen?.ultimos_movimientos?.length > 0 ? (
                                    resumen.ultimos_movimientos.slice(0, 8).map((mov: any, index: number) => (
                                        <React.Fragment key={mov.id}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar sx={{
                                                        bgcolor: mov.tipo_movimiento === 'ENTRADA' ? '#2e7d32' :
                                                            mov.tipo_movimiento === 'SALIDA' ? '#d32f2f' : '#ed6c02'
                                                    }}>
                                                        {mov.tipo_movimiento === 'ENTRADA' ? <TrendingUp /> :
                                                            mov.tipo_movimiento === 'SALIDA' ? <TrendingDown /> : <Warning />}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="body1">
                                                                {mov.producto?.nombre || 'Producto'}
                                                            </Typography>
                                                            <Chip
                                                                label={mov.tipo_movimiento}
                                                                size="small"
                                                                color={
                                                                    mov.tipo_movimiento === 'ENTRADA' ? 'success' :
                                                                        mov.tipo_movimiento === 'SALIDA' ? 'error' : 'warning'
                                                                }
                                                                sx={{ ml: 1 }}
                                                            />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="body2" component="span">
                                                                {mov.cantidad} unidades - S/. {mov.costo_total.toFixed(2)}
                                                            </Typography>
                                                            {mov.motivo && (
                                                                <Typography variant="caption" display="block" color="text.secondary">
                                                                    Motivo: {mov.motivo}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    }
                                                />
                                                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80, textAlign: 'right' }}>
                                                    {new Date(mov.created_at).toLocaleDateString()}
                                                </Typography>
                                            </ListItem>
                                            {index < resumen.ultimos_movimientos.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                                        No hay movimientos recientes
                                    </Typography>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Productos con Stock Bajo - Alerta */}
                {productosStockBajo.length > 0 && (
                    <Grid item xs={12}>
                        <Card sx={{ bgcolor: '#fff3e0', border: '1px solid #ffb74d' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="#e65100">
                                    ⚠️ Alertas de Stock Bajo
                                </Typography>
                                <Grid container spacing={2}>
                                    {productosStockBajo.map((producto) => (
                                        <Grid item xs={12} sm={6} md={4} key={producto.id}>
                                            <Paper sx={{ p: 2, bgcolor: 'white' }}>
                                                <Typography variant="body1" fontWeight="bold">
                                                    {producto.nombre}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Código: {producto.codigo}
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                    <Typography variant="body2" color="error">
                                                        Stock: {producto.stock}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Mínimo: {producto.stock_minimo}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default DashboardInventarioPage;