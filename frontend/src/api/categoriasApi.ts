import axios from 'axios';
import type { Categoria, CreateCategoriaDTO, UpdateCategoriaDTO } from '../interfaces/categoria.interface';

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

export const categoriasApi = {
    getAll: async (): Promise<Categoria[]> => {
        try {
            const response = await api.get('/categorias');
            console.log('Response categorías:', response.data);
            return response.data.data || [];
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            return [];
        }
    },

    getById: async (id: number): Promise<Categoria> => {
        try {
            const response = await api.get(`/categorias/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener categoría:', error);
            throw error;
        }
    },

    create: async (data: CreateCategoriaDTO): Promise<Categoria> => {
        try {
            const response = await api.post('/categorias', data);
            return response.data.data;
        } catch (error) {
            console.error('Error al crear categoría:', error);
            throw error;
        }
    },

    update: async (id: number, data: UpdateCategoriaDTO): Promise<Categoria> => {
        try {
            const response = await api.put(`/categorias/${id}`, data);
            return response.data.data;
        } catch (error) {
            console.error('Error al actualizar categoría:', error);
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            await api.delete(`/categorias/${id}`);
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            throw error;
        }
    },
};