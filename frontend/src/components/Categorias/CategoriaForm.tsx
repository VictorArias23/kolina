import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, FormControlLabel, Switch,
    Box, Alert, CircularProgress
} from '@mui/material';
import { Categoria, CreateCategoriaDTO } from '../../interfaces/categoria.interface';
import { categoriasApi } from '../../api/categoriasApi';

interface CategoriaFormProps {
    open: boolean;
    categoria?: Categoria | null;
    onClose: () => void;
    onSuccess: () => void;
}

const CategoriaForm: React.FC<CategoriaFormProps> = ({ open, categoria, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<CreateCategoriaDTO>({
        nombre: '',
        codigo: '',
        descripcion: '',
        color: '#3490dc',
        icono: '',
        activo: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (categoria) {
            setFormData({
                nombre: categoria.nombre || '',
                codigo: categoria.codigo || '',
                descripcion: categoria.descripcion || '',
                color: categoria.color || '#3490dc',
                icono: categoria.icono || '',
                activo: categoria.activo !== undefined ? categoria.activo : true,
            });
        } else {
            setFormData({
                nombre: '',
                codigo: '',
                descripcion: '',
                color: '#3490dc',
                icono: '',
                activo: true,
            });
        }
        setError(null);
    }, [categoria, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'activo' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            if (categoria) {
                await categoriasApi.update(categoria.id, formData);
            } else {
                await categoriasApi.create(formData);
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error al guardar:', err);
            setError(err?.response?.data?.message || err?.message || 'Error al guardar la categoría');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
                </DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            name="nombre"
                            label="Nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name="codigo"
                            label="Código"
                            value={formData.codigo}
                            onChange={handleChange}
                            fullWidth
                            helperText="Déjalo vacío para generar automáticamente"
                        />
                        <TextField
                            name="descripcion"
                            label="Descripción"
                            value={formData.descripcion}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            fullWidth
                        />
                        <TextField
                            name="color"
                            label="Color"
                            type="color"
                            value={formData.color}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            name="icono"
                            label="Icono (FontAwesome)"
                            value={formData.icono}
                            onChange={handleChange}
                            fullWidth
                            placeholder="fa-laptop"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    name="activo"
                                    checked={formData.activo}
                                    onChange={handleChange}
                                />
                            }
                            label="Activo"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : (categoria ? 'Actualizar' : 'Crear')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CategoriaForm;