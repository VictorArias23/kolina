import axios from 'axios';
import { Cliente } from '../interfaces/venta.interface';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const clientesApi = {
    getAll: async (): Promise<Cliente[]> => {
        const response = await api.get('/clientes');
        return response.data.data;
    },
    
    getById: async (id: number): Promise<Cliente> => {
        const response = await api.get(`/clientes/${id}`);
        return response.data.data;
    }
};