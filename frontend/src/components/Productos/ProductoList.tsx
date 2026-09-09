import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, IconButton, Chip, Dialog, DialogActions, DialogContent,  // ← Asegurar que Button esté aquí
    DialogContentText, DialogTitle, CircularProgress, Alert,
    TextField, Select, MenuItem, FormControl, InputLabel, Box,
    Pagination, Grid, Tooltip, Typography
} from '@mui/material';
import { Edit, Delete, Visibility, Search, Add } from '@mui/icons-material';
import { Producto } from '../../interfaces/producto.interface';
import { productosApi } from '../../api/productosApi';
import { categoriasApi } from '../../api/categoriasApi';
import { Categoria } from '../../interfaces/categoria.interface';

interface ProductoListProps {
    onEdit: (producto: Producto) => void;
    onView: (producto: Producto) => void;
    onAdd: () => void;
    refreshTrigger?: number;
}

const ProductoList: React.FC<ProductoListProps> = ({ onEdit, onView, onAdd, refreshTrigger }) => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoriaFilter, setCategoriaFilter] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productoToDelete, setProductoToDelete] = useState<Producto | null>(null);

    useEffect(() => {
        loadData();
    }, [page, searchTerm, categoriaFilter, refreshTrigger]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Cargar categorías
            try {
                const categoriasData = await categoriasApi.getAll();
                setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
            } catch (err) {
                console.error('Error al cargar categorías:', err);
                setCategorias([]);
            }

            // Cargar productos con filtros
            const filters: any = {};
            if (searchTerm) filters.search = searchTerm;
            if (categoriaFilter) filters.categoria_id = parseInt(categoriaFilter);

            const response = await productosApi.getAll(page, 10, filters);
            setProductos(response?.data || []);
            setTotalPages(response?.meta?.last_page || 1);
        } catch (err: any) {
            console.error('Error al cargar productos:', err);
            setError(err?.message || 'Error al cargar los productos');
            setProductos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (producto: Producto) => {
        setProductoToDelete(producto);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!productoToDelete) return;
        try {
            await productosApi.delete(productoToDelete.id);
            await loadData();
            setDeleteDialogOpen(false);
            setProductoToDelete(null);
        } catch (err: any) {
            setError(err?.message || 'Error al eliminar el producto');
            console.error(err);
        }
    };

    const getEstadoColor = (estado: string): 'success' | 'warning' | 'error' => {
        switch (estado) {
            case 'STOCK_OK': return 'success';
            case 'STOCK_BAJO': return 'warning';
            case 'SIN_STOCK': return 'error';
            default: return 'success';
        }
    };

    const getEstadoLabel = (estado: string): string => {
        switch (estado) {
            case 'STOCK_OK': return 'Stock OK';
            case 'STOCK_BAJO': return 'Stock Bajo';
            case 'SIN_STOCK': return 'Sin Stock';
            default: return estado;
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
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Categoría</InputLabel>
                            <Select
                                value={categoriaFilter}
                                onChange={(e) => setCategoriaFilter(e.target.value)}
                                label="Categoría"
                            >
                                <MenuItem value="">Todas</MenuItem>
                                {categorias.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id.toString()}>
                                        {cat.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" startIcon={<Add />} onClick={onAdd}>
                            Nuevo Producto
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {productos.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        No hay productos registrados
                    </Typography>
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Código</TableCell>
                                    <TableCell>Producto</TableCell>
                                    <TableCell>Categoría</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell>Precio Venta</TableCell>
                                    <TableCell>Estado Stock</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productos.map((producto) => (
                                    <TableRow key={producto.id}>
                                        <TableCell>{producto.codigo}</TableCell>
                                        <TableCell>
                                            <Box>
                                                <div><strong>{producto.nombre}</strong></div>
                                                {producto.descripcion && (
                                                    <div style={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                                        {producto.descripcion.substring(0, 50)}
                                                    </div>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{producto.categoria?.nombre || 'Sin categoría'}</TableCell>
                                        <TableCell>
                                            <Box>
                                                <div><strong>{producto.stock}</strong></div>
                                                <div style={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                                                    Min: {producto.stock_minimo}
                                                </div>
                                            </Box>
                                        </TableCell>
                                        <TableCell>S/. {typeof producto.precio_venta === 'number' ? producto.precio_venta.toFixed(2) : parseFloat(producto.precio_venta || '0').toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getEstadoLabel(producto.estado_stock)}
                                                color={getEstadoColor(producto.estado_stock)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Ver">
                                                <IconButton onClick={() => onView(producto)} color="primary" size="small">
                                                    <Visibility />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <IconButton onClick={() => onEdit(producto)} color="info" size="small">
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton onClick={() => handleDeleteClick(producto)} color="error" size="small">
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            color="primary"
                        />
                    </Box>
                </>
            )}

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de eliminar el producto "{productoToDelete?.nombre}"?
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

export default ProductoList;