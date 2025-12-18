import axios from 'axios';
import { Notification, UpdateStatusPayload } from '@/types/notifications';

const API_BASE_URL = 'https://ykvoepukr0.execute-api.us-east-1.amazonaws.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token si es necesario
apiClient.interceptors.request.use((config) => {
  // Aquí puedes agregar el token de autenticación si tu API lo requiere
  // const token = getToken(); // desde tu session de Supabase
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await apiClient.get('/notifications');
    // Manejar tanto arrays como objetos únicos
    if (Array.isArray(data)) {
      return data;
    }
    // Si es un objeto único, convertirlo a array
    if (data && typeof data === 'object') {
      return [data];
    }
    // Si no hay datos, devolver array vacío
    return [];
  },

  updateStatus: async (id: string, payload: UpdateStatusPayload): Promise<Notification> => {
    const { data } = await apiClient.put(`/notifications/${id}/status`, payload);
    return data;
  },
};