import axios from 'axios';
import { Notification, UpdateStatusPayload, PaginatedResponse } from '@/types/notifications';

const API_BASE_URL = 'https://ykvoepukr0.execute-api.us-east-1.amazonaws.com';

// CONFIGURACIÓN: Tamaño de página por defecto
export const DEFAULT_PAGE_SIZE = 20;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging y manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const notificationsApi = {
  /**
   * GET /notifications
   * Obtener todas las notificaciones con paginación
   */
  getAll: async (
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE
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

  /**
   * GET /notifications/{id}
   * Obtener una notificación específica por ID
   */
  getById: async (id: string): Promise<Notification> => {
    const { data } = await apiClient.get(`/notifications/${id}`);
    return data;
  },

  /**
   * PUT /notifications/{id}/status
   * Actualizar el estado de una notificación
   */
  updateStatus: async (
    id: string,
    payload: UpdateStatusPayload
  ): Promise<Notification> => {
    const { data } = await apiClient.put(`/notifications/${id}/status`, payload);
    return data;
  },

  /**
   * GET /notifications/status/{status}
   * Obtener notificaciones filtradas por estado
   * @param status - pending | validated | rejected
   */
  getByStatus: async (
    status: 'pending' | 'validated' | 'rejected',
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE
  ): Promise<PaginatedResponse<Notification>> => {
    const { data } = await apiClient.get(`/notifications/status/${status}`, {
      params: { page, pageSize }
    });

    if (Array.isArray(data)) {
      return {
        data: data,
        pagination: {
          page,
          pageSize,
          total: data.length,
          totalPages: Math.ceil(data.length / pageSize),
        }
      };
    }

    return {
      data: [],
      pagination: {
        page: 1,
        pageSize,
        total: 0,
        totalPages: 0,
      }
    };
  },

  /**
   * GET /notifications/device/{device_id}
   * Obtener notificaciones de un dispositivo específico
   */
  getByDevice: async (
    deviceId: string,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE
  ): Promise<PaginatedResponse<Notification>> => {
    const { data } = await apiClient.get(`/notifications/device/${deviceId}`, {
      params: { page, pageSize }
    });

    if (Array.isArray(data)) {
      return {
        data: data,
        pagination: {
          page,
          pageSize,
          total: data.length,
          totalPages: Math.ceil(data.length / pageSize),
        }
      };
    }

    return {
      data: [],
      pagination: {
        page: 1,
        pageSize,
        total: 0,
        totalPages: 0,
      }
    };
  },

  /**
   * GET /notifications/search
   * Buscar notificaciones con múltiples criterios
   * @param params - Parámetros de búsqueda
   */
  search: async (params: {
    code?: string;
    deviceId?: string;
    status?: string;
    amountMin?: number;
    amountMax?: number;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Notification>> => {
    const { data } = await apiClient.get('/notifications/search', {
      params: {
        code: params.code,
        device_id: params.deviceId,
        status: params.status,
        amount_min: params.amountMin,
        amount_max: params.amountMax,
        date_from: params.dateFrom,
        date_to: params.dateTo,
        page: params.page || 1,
        pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
      }
    });

    if (Array.isArray(data)) {
      return {
        data: data,
        pagination: {
          page: params.page || 1,
          pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
          total: data.length,
          totalPages: Math.ceil(data.length / (params.pageSize || DEFAULT_PAGE_SIZE)),
        }
      };
    }

    return {
      data: [],
      pagination: {
        page: 1,
        pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
        total: 0,
        totalPages: 0,
      }
    };
  },
};