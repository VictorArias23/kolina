import React, { useState, useEffect } from 'react';
import {
    Grid, Card, CardContent, Typography, Box,
    CircularProgress, Alert, LinearProgress, List, ListItem,
    ListItemText, ListItemAvatar, Avatar, Chip, Divider
} from '@mui/material';
import {
    Inventory, Warning, Block, AttachMoney,
    TrendingUp, TrendingDown
} from '@mui/icons-material';
import { movimientosApi } from '../api/movimientosApi';

const DashboardInventario: React.FC = () => {
    const [resumen, setResumen] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await movimientosApi.getResumen();
            setResumen(data);
        } catch (err) {
            setError('Error al cargar el dashboard');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    const cards = [
        {
            title: 'Total Productos',
            value: resumen?.total_productos || 0,
            icon: <Inventory sx={{ fontSize: 40, color: '#1976d2' }} />,
            color: '#e3f2fd'
        },
        {
            title: 'Stock Total',
            value: resumen?.stock_total || 0,
            icon: <AttachMoney sx={{ fontSize: 40, color: '#2e7d32' }} />,
            color: '#e8f5e9'
        },
        {
            title: 'Stock Bajo',
            value: resumen?.stock_bajo || 0,
            icon: <Warning sx={{ fontSize: 40, color: '#ed6c02' }} />,
            color: '#fff3e0'
        },
        {
            title: 'Sin Stock',
            value: resumen?.sin_stock || 0,
            icon: <Block sx={{ fontSize: 40, color: '#d32f2f' }} />,
            color: '#ffebee'
        }
    ];

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Dashboard de Inventario
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ backgroundColor: card.color }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="h4" component="div">
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
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Valor del Inventario
                            </Typography>
                            <Typography variant="h3" color="primary">
                                S/. {resumen?.valor_inventario || '0.00'}
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={65}
                                sx={{ mt: 2, height: 10, borderRadius: 5 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Últimos Movimientos
                            </Typography>
                            <List>
                                {resumen?.ultimos_movimientos?.slice(0, 5).map((mov: any, index: number) => (
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
                                                primary={mov.producto?.nombre || 'Producto'}
                                                secondary={
                                                    <>
                                                        <Chip
                                                            label={mov.tipo_movimiento}
                                                            size="small"
                                                            color={
                                                                mov.tipo_movimiento === 'ENTRADA' ? 'success' :
                                                                    mov.tipo_movimiento === 'SALIDA' ? 'error' : 'warning'
                                                            }
                                                            sx={{ mr: 1 }}
                                                        />
                                                        {mov.cantidad} unidades
                                                        {mov.motivo && ` - ${mov.motivo}`}
                                                    </>
                                                }
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(mov.created_at).toLocaleDateString()}
                                            </Typography>
                                        </ListItem>
                                        {index < 4 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardInventario;