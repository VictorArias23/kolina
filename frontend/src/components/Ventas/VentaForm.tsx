import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Select, MenuItem, FormControl,
    InputLabel, Box, Alert, CircularProgress, Grid,
    IconButton, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { Venta, CreateVentaDTO, DetalleVenta } from '../../interfaces/venta.interface';
import { ventasApi } from '../../api/ventasApi';
import { productosApi } from '../../api/productosApi';
import { clientesApi } from '../../api/clientesApi';
import { Producto } from '../../interfaces/producto.interface';
import { Cliente } from '../../interfaces/venta.interface';

interface VentaFormProps {
    open: boolean;
    venta?: Venta | null;
    onClose: () => void;
    onSuccess: () => void;
}

const VentaForm: React.FC<VentaFormProps> = ({ open, venta, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<CreateVentaDTO>({
        cliente_id: 0,
        subtotal: 0,
        igv: 0,
        descuento: 0,
        total: 0,
        metodo_pago: 'EFECTIVO',
        observaciones: '',
        detalles: []
    });
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedProducto, setSelectedProducto] = useState<number>(0);
    const [cantidad, setCantidad] = useState<number>(1);

    useEffect(() => {
        loadData();
        if (venta) {
            // Cargar datos de la venta para editar
            setFormData({
                cliente_id: venta.cliente_id,
                subtotal: venta.subtotal,
                igv: venta.igv,
                descuento: venta.descuento,
                total: venta.total,
                metodo_pago: venta.metodo_pago,
                observaciones: venta.observaciones || '',
                detalles: venta.detalles.map(d => ({
                    producto_id: d.producto_id,
                    cantidad: d.cantidad,
                    precio_unitario: d.precio_unitario,
                    subtotal: d.subtotal,
                    descuento: d.descuento || 0,
                    total: d.total
                }))
            });
        }
    }, [venta, open]);

    const loadData = async () => {
        try {
            const [clientesData, productosData] = await Promise.all([
                clientesApi.getAll(),
                productosApi.getAll(1, 100)
            ]);
            setClientes(clientesData);
            setProductos(productosData.data);
        } catch (err) {
            console.error('Error loading data:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'cliente_id' ? parseInt(value) : value
        }));
    };

    const handleMetodoPagoChange = (e: any) => {
        setFormData(prev => ({
            ...prev,
            metodo_pago: e.target.value
        }));
    };

    const addProducto = () => {
        if (!selectedProducto || cantidad <= 0) return;

        const producto = productos.find(p => p.id === selectedProducto);
        if (!producto) return;

        const subtotal = producto.precio_venta * cantidad;
        const total = subtotal;

        const detalle: DetalleVenta = {
            producto_id: producto.id,
            cantidad,
            precio_unitario: producto.precio_venta,
            subtotal,
            descuento: 0,
            total,
            producto: producto
        };

        setFormData(prev => {
            const nuevosDetalles = [...prev.detalles, detalle];
            const subtotalTotal = nuevosDetalles.reduce((sum, d) => sum + d.subtotal, 0);
            const igv = subtotalTotal * 0.18;
            const total = subtotalTotal + igv - prev.descuento;

            return {
                ...prev,
                detalles: nuevosDetalles,
                subtotal: subtotalTotal,
                igv: igv,
                total: total
            };
        });

        setSelectedProducto(0);
        setCantidad(1);
    };

    const removeProducto = (index: number) => {
        setFormData(prev => {
            const nuevosDetalles = prev.detalles.filter((_, i) => i !== index);
            const subtotalTotal = nuevosDetalles.reduce((sum, d) => sum + d.subtotal, 0);
            const igv = subtotalTotal * 0.18;
            const total = subtotalTotal + igv - prev.descuento;

            return {
                ...prev,
                detalles: nuevosDetalles,
                subtotal: subtotalTotal,
                igv: igv,
                total: total
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            if (formData.detalles.length === 0) {
                setError('Debe agregar al menos un producto');
                return;
            }

            if (venta) {
                // Actualizar venta
                await ventasApi.update(venta.id, {
                    metodo_pago: formData.metodo_pago,
                    observaciones: formData.observaciones
                });
            } else {
                // Crear nueva venta
                await ventasApi.create(formData);
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al guardar la venta');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {venta ? 'Editar Venta' : 'Nueva Venta'}
                </DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Cliente</InputLabel>
                                <Select
                                    name="cliente_id"
                                    value={formData.cliente_id || ''}
                                    onChange={handleChange}
                                    label="Cliente"
                                    disabled={!!venta}
                                >
                                    <MenuItem value="">Seleccionar cliente</MenuItem>
                                    {clientes.map((cliente) => (
                                        <MenuItem key={cliente.id} value={cliente.id}>
                                            {cliente.nombre} {cliente.apellido} - {cliente.documento}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Método de Pago</InputLabel>
                                <Select
                                    value={formData.metodo_pago}
                                    onChange={handleMetodoPagoChange}
                                    label="Método de Pago"
                                >
                                    <MenuItem value="EFECTIVO">Efectivo</MenuItem>
                                    <MenuItem value="TARJETA">Tarjeta</MenuItem>
                                    <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Agregar Productos
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Producto</InputLabel>
                                    <Select
                                        value={selectedProducto}
                                        onChange={(e) => setSelectedProducto(Number(e.target.value))}
                                        label="Producto"
                                    >
                                        <MenuItem value={0}>Seleccionar producto</MenuItem>
                                        {productos.map((producto) => (
                                            <MenuItem key={producto.id} value={producto.id}>
                                                {producto.nombre} - Stock: {producto.stock}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    type="number"
                                    label="Cantidad"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(Number(e.target.value))}
                                    fullWidth
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={addProducto}
                                    fullWidth
                                    sx={{ height: '100%' }}
                                >
                                    Agregar
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    {formData.detalles.length > 0 && (
                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Producto</TableCell>
                                        <TableCell align="right">Cantidad</TableCell>
                                        <TableCell align="right">Precio</TableCell>
                                        <TableCell align="right">Subtotal</TableCell>
                                        <TableCell align="right">Acción</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formData.detalles.map((detalle, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {detalle.producto?.nombre || `Producto ID: ${detalle.producto_id}`}
                                            </TableCell>
                                            <TableCell align="right">{detalle.cantidad}</TableCell>
                                            <TableCell align="right">S/. {detalle.precio_unitario.toFixed(2)}</TableCell>
                                            <TableCell align="right">S/. {detalle.subtotal.toFixed(2)}</TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => removeProducto(index)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body2">Subtotal:</Typography>
                            </Grid>
                            <Grid item xs={6} textAlign="right">
                                <Typography variant="body2">S/. {formData.subtotal.toFixed(2)}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2">IGV (18%):</Typography>
                            </Grid>
                            <Grid item xs={6} textAlign="right">
                                <Typography variant="body2">S/. {formData.igv.toFixed(2)}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2">Descuento:</Typography>
                            </Grid>
                            <Grid item xs={6} textAlign="right">
                                <TextField
                                    type="number"
                                    size="small"
                                    value={formData.descuento}
                                    onChange={(e) => {
                                        const descuento = Number(e.target.value);
                                        setFormData(prev => ({
                                            ...prev,
                                            descuento,
                                            total: prev.subtotal + prev.igv - descuento
                                        }));
                                    }}
                                    inputProps={{ min: 0 }}
                                    sx={{ width: '100px' }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6">Total:</Typography>
                            </Grid>
                            <Grid item xs={6} textAlign="right">
                                <Typography variant="h6" color="primary">
                                    S/. {formData.total.toFixed(2)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    <TextField
                        name="observaciones"
                        label="Observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : (venta ? 'Actualizar' : 'Crear')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default VentaForm;