import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ProductoList from '../components/Productos/ProductoList';
import { Producto } from '../interfaces/producto.interface';

const ProductosPage: React.FC = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleAdd = () => {
        console.log('Agregar producto');
    };

    const handleEdit = (producto: Producto) => {
        console.log('Editar producto:', producto);
    };

    const handleView = (producto: Producto) => {
        console.log('Ver producto:', producto);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Gestión de Productos
                </Typography>

                <ProductoList
                    onEdit={handleEdit}
                    onView={handleView}
                    onAdd={handleAdd}
                    refreshTrigger={refreshTrigger}
                />
            </Paper>
        </Box>
    );
};

export default ProductosPage;