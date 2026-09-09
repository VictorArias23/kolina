import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Chip, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, CircularProgress, Alert, Box,
    Tooltip, Typography, Button  // ← Agregar Button aquí
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { Categoria } from '../../interfaces/categoria.interface';
import { categoriasApi } from '../../api/categoriasApi';

interface CategoriaListProps {
    onEdit: (categoria: Categoria) => void;
    onView: (categoria: Categoria) => void;
    refreshTrigger?: number;
}

const CategoriaList: React.FC<CategoriaListProps> = ({ onEdit, onView, refreshTrigger }) => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoriaToDelete, setCategoriaToDelete] = useState<Categoria | null>(null);

    useEffect(() => {
        loadCategorias();
    }, [refreshTrigger]);

    const loadCategorias = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await categoriasApi.getAll();
            console.log('Categorías cargadas:', data);
            setCategorias(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error('Error al cargar categorías:', err);
            setError(err?.message || 'Error al cargar las categorías');
            setCategorias([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (categoria: Categoria) => {
        setCategoriaToDelete(categoria);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!categoriaToDelete) return;
        try {
            await categoriasApi.delete(categoriaToDelete.id);
            await loadCategorias();
            setDeleteDialogOpen(false);
            setCategoriaToDelete(null);
        } catch (err: any) {
            setError(err?.message || 'Error al eliminar la categoría');
            console.error(err);
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

    if (categorias.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    No hay categorías registradas
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Código</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Color</TableCell>
                            <TableCell>Productos</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categorias.map((categoria) => (
                            <TableRow key={categoria.id}>
                                <TableCell>{categoria.codigo}</TableCell>
                                <TableCell>{categoria.nombre}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{
                                            width: 20,
                                            height: 20,
                                            backgroundColor: categoria.color,
                                            borderRadius: '50%',
                                            border: '1px solid #ddd'
                                        }} />
                                        {categoria.color}
                                    </Box>
                                </TableCell>
                                <TableCell>{categoria.total_productos || 0}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={categoria.activo ? 'Activo' : 'Inactivo'}
                                        color={categoria.activo ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Ver">
                                        <IconButton onClick={() => onView(categoria)} color="primary" size="small">
                                            <Visibility />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton onClick={() => onEdit(categoria)} color="info" size="small">
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton onClick={() => handleDeleteClick(categoria)} color="error" size="small">
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
                        ¿Estás seguro de eliminar la categoría "{categoriaToDelete?.nombre}"?
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

export default CategoriaList;