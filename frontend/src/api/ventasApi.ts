import axios from 'axios';
import type { Venta, CreateVentaDTO, UpdateVentaDTO } from '../interfaces/venta.interface';

const API_URL = 'http://localhost:8000/api/v1';

export const ventasApi = {
    // Obtener todas las ventas
    getAll: async (): Promise<Venta[]> => {
        const response = await axios.get(`${API_URL}/ventas`);
        return response.data.data;
    },

    // Obtener una venta por ID
    getById: async (id: number): Promise<Venta> => {
        const response = await axios.get(`${API_URL}/ventas/${id}`);
        return response.data.data;
    },

    // Crear nueva venta
    create: async (data: CreateVentaDTO): Promise<Venta> => {
        const response = await axios.post(`${API_URL}/ventas`, data);
        return response.data.data;
    },

    // Actualizar venta
    update: async (id: number, data: UpdateVentaDTO): Promise<Venta> => {
        const response = await axios.put(`${API_URL}/ventas/${id}`, data);
        return response.data.data;
    },

    // Eliminar venta
    delete: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/ventas/${id}`);
    },

    // Cambiar estado
    cambiarEstado: async (id: number, estado: string): Promise<Venta> => {
        const response = await axios.patch(`${API_URL}/ventas/${id}/estado`, { estado });
        return response.data.data;
    }
};