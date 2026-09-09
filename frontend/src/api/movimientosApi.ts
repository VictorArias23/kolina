import axios from 'axios';
import { MovimientoInventario, CreateMovimientoDTO, ResumenInventario } from '../interfaces/movimiento.interface';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const movimientosApi = {
    getAll: async (): Promise<MovimientoInventario[]> => {
        try {
            const response = await api.get('/movimientos');
            return response.data.data || [];
        } catch (error) {
            console.error('Error al obtener movimientos:', error);
            return [];
        }
    },

    getById: async (id: number): Promise<MovimientoInventario> => {
        const response = await api.get(`/movimientos/${id}`);
        return response.data.data;
    },

    create: async (data: CreateMovimientoDTO): Promise<MovimientoInventario> => {
        const response = await api.post('/movimientos', data);
        return response.data.data;
    },

    getResumen: async (): Promise<ResumenInventario> => {
        try {
            const response = await api.get('/movimientos/resumen');
            return response.data.data || {
                total_productos: 0,
                stock_total: 0,
                stock_bajo: 0,
                sin_stock: 0,
                valor_inventario: '0.00',
                ultimos_movimientos: []
            };
        } catch (error) {
            console.error('Error al obtener resumen:', error);
            return {
                total_productos: 0,
                stock_total: 0,
                stock_bajo: 0,
                sin_stock: 0,
                valor_inventario: '0.00',
                ultimos_movimientos: []
            };
        }
    },

    getByProducto: async (productoId: number): Promise<MovimientoInventario[]> => {
        try {
            const response = await api.get(`/movimientos/producto/${productoId}`);
            return response.data.data || [];
        } catch (error) {
            console.error('Error al obtener movimientos del producto:', error);
            return [];
        }
    },

    getByTipo: async (tipo: string): Promise<MovimientoInventario[]> => {
        try {
            const response = await api.get(`/movimientos/tipo/${tipo}`);
            return response.data.data || [];
        } catch (error) {
            console.error('Error al obtener movimientos por tipo:', error);
            return [];
        }
    },
};