import axios from 'axios';
import type { 
    Producto, 
    CreateProductoDTO, 
    UpdateProductoDTO, 
    ProductoFilters 
} from '../interfaces/producto.interface';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const productosApi = {
    // Obtener productos con paginación y filtros
    getAll: async (page: number = 1, perPage: number = 10, filters?: ProductoFilters): Promise<any> => {
        try {
            const params: any = { page, per_page: perPage };
            if (filters?.search) params.search = filters.search;
            if (filters?.categoria_id) params.categoria_id = filters.categoria_id;
            if (filters?.activo !== undefined) params.activo = filters.activo;
            
            const response = await api.get('/productos', { params });
            console.log('Productos cargados:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return { data: [], meta: { last_page: 1 } };
        }
    },

    // Obtener productos con stock bajo
    getStockBajo: async (): Promise<Producto[]> => {
        try {
            const response = await api.get('/productos/stock/bajo');
            return response.data.data || [];
        } catch (error) {
            console.error('Error al obtener productos con stock bajo:', error);
            return [];
        }
    },

    // Obtener productos sin stock
    getSinStock: async (): Promise<Producto[]> => {
        try {
            const response = await api.get('/productos/stock/sin-stock');
            return response.data.data || [];
        } catch (error) {
            console.error('Error al obtener productos sin stock:', error);
            return [];
        }
    },

    // Obtener un producto por ID
    getById: async (id: number): Promise<Producto> => {
        try {
            const response = await api.get(`/productos/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener producto:', error);
            throw error;
        }
    },

    // Crear producto
    create: async (data: CreateProductoDTO): Promise<Producto> => {
        try {
            const response = await api.post('/productos', data);
            return response.data.data;
        } catch (error) {
            console.error('Error al crear producto:', error);
            throw error;
        }
    },

    // Actualizar producto
    update: async (id: number, data: UpdateProductoDTO): Promise<Producto> => {
        try {
            const response = await api.put(`/productos/${id}`, data);
            return response.data.data;
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    },

    // Eliminar producto
    delete: async (id: number): Promise<void> => {
        try {
            await api.delete(`/productos/${id}`);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    },

    // Ajustar stock
    ajustarStock: async (id: number, cantidad: number, motivo: string): Promise<Producto> => {
        try {
            const response = await api.post(`/productos/${id}/ajustar-stock`, { cantidad, motivo });
            return response.data.data;
        } catch (error) {
            console.error('Error al ajustar stock:', error);
            throw error;
        }
    },

    // Buscar productos
    search: async (query: string): Promise<Producto[]> => {
        try {
            const response = await api.get('/productos/search', { params: { q: query } });
            return response.data.data || [];
        } catch (error) {
            console.error('Error al buscar productos:', error);
            return [];
        }
    },
};