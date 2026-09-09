import axios from 'axios';
import { Venta, CreateVentaDTO, UpdateVentaDTO } from '../interfaces/venta.interface';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const ventasApi = {
    getAll: async (): Promise<Venta[]> => {
        const response = await api.get('/ventas');
        return response.data.data;
    },

    getById: async (id: number): Promise<Venta> => {
        const response = await api.get(`/ventas/${id}`);
        return response.data.data;
    },

    create: async (data: CreateVentaDTO): Promise<Venta> => {
        const response = await api.post('/ventas', data);
        return response.data.data;
    },

    update: async (id: number, data: UpdateVentaDTO): Promise<Venta> => {
        const response = await api.put(`/ventas/${id}`, data);
        return response.data.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/ventas/${id}`);
    },

    cambiarEstado: async (id: number, estado: string): Promise<Venta> => {
        const response = await api.patch(`/ventas/${id}/estado`, { estado });
        return response.data.data;
    }
};