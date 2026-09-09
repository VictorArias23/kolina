import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, IconButton, Chip, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, CircularProgress, Alert, Box, Tooltip
} from '@mui/material';
import { Edit, Delete, Visibility, CheckCircle, Cancel } from '@mui/icons-material';
import { Venta } from '../../interfaces/venta.interface';
import { ventasApi } from '../../api/ventasApi';

interface VentaListProps {
    onEdit: (venta: Venta) => void;
    onView: (venta: Venta) => void;
    refreshTrigger?: number;
}

const VentaList: React.FC<VentaListProps> = ({ onEdit, onView, refreshTrigger }) => {
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [ventaToDelete, setVentaToDelete] = useState<Venta | null>(null);

    useEffect(() => {
        loadVentas();
    }, [refreshTrigger]);

    const loadVentas = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ventasApi.getAll();
            setVentas(data);
        } catch (err) {
            setError('Error al cargar las ventas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (venta: Venta) => {
        setVentaToDelete(venta);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!ventaToDelete) return;
        try {
            await ventasApi.delete(ventaToDelete.id);
            await loadVentas();
            setDeleteDialogOpen(false);
            setVentaToDelete(null);
        } catch (err) {
            setError('Error al eliminar la venta');
            console.error(err);
        }
    };

    const handleCambiarEstado = async (id: number, estado: string) => {
        try {
            await ventasApi.cambiarEstado(id, estado);
            await loadVentas();
        } catch (err) {
            alert('Error al cambiar el estado');
            console.error(err);
        }
    };

    const getEstadoColor = (estado: string): 'default' | 'success' | 'warning' | 'error' => {
        switch (estado) {
            case 'COMPLETADA': return 'success';
            case 'PENDIENTE': return 'warning';
            case 'CANCELADA': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Factura</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Método Pago</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ventas.map((venta) => (
                            <TableRow key={venta.id}>
                                <TableCell>{venta.numero_factura}</TableCell>
                                <TableCell>
                                    {venta.cliente?.nombre_completo || 'N/A'}
                                </TableCell>
                                <TableCell>S/. {venta.total}</TableCell>
                                <TableCell>{venta.metodo_pago}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={venta.estado}
                                        color={getEstadoColor(venta.estado)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {new Date(venta.fecha_venta).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Ver">
                                        <IconButton onClick={() => onView(venta)} color="primary" size="small">
                                            <Visibility />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton onClick={() => onEdit(venta)} color="info" size="small">
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Completar">
                                        <IconButton 
                                            onClick={() => handleCambiarEstado(venta.id, 'COMPLETADA')}
                                            color="success" 
                                            size="small"
                                            disabled={venta.estado === 'COMPLETADA'}
                                        >
                                            <CheckCircle />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cancelar">
                                        <IconButton 
                                            onClick={() => handleCambiarEstado(venta.id, 'CANCELADA')}
                                            color="error" 
                                            size="small"
                                            disabled={venta.estado === 'CANCELADA'}
                                        >
                                            <Cancel />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton 
                                            onClick={() => handleDeleteClick(venta)} 
                                            color="error" 
                                            size="small"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de eliminar la venta #{ventaToDelete?.numero_factura}?
                        Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default VentaList;