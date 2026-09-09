import React, { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';
import CategoriaList from '../components/Categorias/CategoriaList';
import CategoriaForm from '../components/Categorias/CategoriaForm';
import { Categoria } from '../interfaces/categoria.interface';

const CategoriasPage: React.FC = () => {
    const [formOpen, setFormOpen] = useState(false);
    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleAdd = () => {
        setSelectedCategoria(null);
        setFormOpen(true);
    };

    const handleEdit = (categoria: Categoria) => {
        setSelectedCategoria(categoria);
        setFormOpen(true);
    };

    const handleView = (categoria: Categoria) => {
        console.log('Ver categoría:', categoria);
    };

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">
                        Gestión de Categorías
                    </Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
                        Nueva Categoría
                    </Button>
                </Box>

                <CategoriaList
                    onEdit={handleEdit}
                    onView={handleView}
                    refreshTrigger={refreshTrigger}
                />

                <CategoriaForm
                    open={formOpen}
                    categoria={selectedCategoria}
                    onClose={() => setFormOpen(false)}
                    onSuccess={handleSuccess}
                />
            </Paper>
        </Box>
    );
};

export default CategoriasPage;