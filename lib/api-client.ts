import axios from 'axios';
import { Notification, UpdateStatusPayload, PaginatedResponse } from '@/types/notifications';

const API_BASE_URL = 'https://ykvoepukr0.execute-api.us-east-1.amazonaws.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const notificationsApi = {
  getAll: async (
    page: number = 1, 
    pageSize: number = 20
  ): Promise<PaginatedResponse<Notification>> => {
    const { data } = await apiClient.get('/notifications', {
      params: { page, pageSize }
    });
    
    // Si la API devuelve un formato paginado
    if (data?.data && Array.isArray(data.data)) {
      return {
        data: data.data,
        pagination: {
          page: data.pagination?.page || page,
          pageSize: data.pagination?.pageSize || pageSize,
          total: data.pagination?.total || data.data.length,
          totalPages: data.pagination?.totalPages || 1,
        }
      };
    }
    
    // Si la API devuelve solo un array
    if (Array.isArray(data)) {
      return {
        data: data,
        pagination: {
          page,
          pageSize,
          total: data.length,
          totalPages: 1,
        }
      };
    }
    
    // Fallback para objeto único
    if (data && typeof data === 'object') {
      return {
        data: [data],
        pagination: {
          page: 1,
          pageSize: 1,
          total: 1,
          totalPages: 1,
        }
      };
    }
    
    // Sin datos
    return {
      data: [],
      pagination: {
        page: 1,
        pageSize: pageSize,
        total: 0,
        totalPages: 0,
      }
    };
  },

  updateStatus: async (
    id: string, 
    payload: UpdateStatusPayload
  ): Promise<Notification> => {
    const { data } = await apiClient.put(`/notifications/${id}/status`, payload);
    return data;
  },
};