import axios from 'axios';
import { Notification, UpdateStatusPayload, PaginatedResponse } from '@/types/notifications';

const API_BASE_URL = 'https://q5v1k37mn6.execute-api.us-east-1.amazonaws.com/';

export const DEFAULT_PAGE_SIZE = 50;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface ApiParams {
  limit?: number;
  last_key?: string;
  code?: string;
  device_id?: string;
  status?: string;
  name?: string;
  min_amount?: number;
  max_amount?: number;
  from_timestamp?: number;
  to_timestamp?: number;
}

// Función para normalizar lastKey (convertir floats a integers)
function normalizeLastKey(lastKeyString?: string): string | undefined {
  if (!lastKeyString) return undefined;

  try {
    const parsed = JSON.parse(lastKeyString);

    // Convertir timestamp de float a integer si existe
    if (parsed.timestamp && typeof parsed.timestamp === 'number') {
      parsed.timestamp = Math.floor(parsed.timestamp);
    }

    const normalized = JSON.stringify(parsed);
    return normalized;
  } catch {
    return lastKeyString;
  }
}

export const notificationsApi = {
  getAll: async (
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE,
    lastKey?: string
  ): Promise<PaginatedResponse<Notification>> => {

    const params: ApiParams = {
      limit: pageSize,
    };

    if (lastKey) {
      params.last_key = normalizeLastKey(lastKey);
    }

    const { data } = await apiClient.get('/notifications', { params });

    const result: PaginatedResponse<Notification> = {
      data: data.data || [],
      pagination: {
        page: page,
        pageSize: pageSize,
        total: data.count || 0,
        totalPages: data.has_more ? page + 1 : page,
        hasMore: data.has_more || false,
        lastKey: data.last_key,
      }
    };
    return result;
  },

  /**
   * GET /notifications/{id}
   */
  getById: async (id: string): Promise<Notification> => {
    const { data } = await apiClient.get(`/notifications/${id}`);
    return data.data; // Tu API envuelve en {data: {...}}
  },

  /**
   * PUT /notifications/{id}/status
   */
  updateStatus: async (
    id: string,
    payload: UpdateStatusPayload
  ): Promise<Notification> => {
    const { data } = await apiClient.put(`/notifications/${id}/status`, payload);
    return data.data; // Tu API envuelve en {data: {...}}
  },

  /**
   * GET /notifications/status/{status}
   */
  getByStatus: async (
    status: 'pending' | 'validated' | 'rejected',
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE,
    lastKey?: string
  ): Promise<PaginatedResponse<Notification>> => {

    const params: ApiParams = {
      limit: pageSize,
    };

    if (lastKey) {
      params.last_key = normalizeLastKey(lastKey);
    }

    const { data } = await apiClient.get(`/notifications/status/${status}`, { params });

    return {
      data: data.data || [],
      pagination: {
        page,
        pageSize,
        total: data.count || 0,
        totalPages: data.has_more ? page + 1 : page,
        hasMore: data.has_more || false,
        lastKey: data.last_key,
      }
    };
  },

  /**
   * GET /notifications/device/{device_id}
   */
  getByDevice: async (
    deviceId: string,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE,
    lastKey?: string
  ): Promise<PaginatedResponse<Notification>> => {
    const params: ApiParams = {
      limit: pageSize,
    };

    if (lastKey) {
      params.last_key = normalizeLastKey(lastKey);
    }

    const { data } = await apiClient.get(`/notifications/device/${deviceId}`, { params });

    return {
      data: data.data || [],
      pagination: {
        page,
        pageSize,
        total: data.count || 0,
        totalPages: data.has_more ? page + 1 : page,
        hasMore: data.has_more || false,
        lastKey: data.last_key,
      }
    };
  },

  /**
   * GET /notifications/search
   * Mapeo de parámetros del frontend a los de tu API
   */
  search: async (params: {
    code?: string;
    deviceId?: string;
    status?: string;
    name?: string;
    amountMin?: number;
    amountMax?: number;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    pageSize?: number;
    lastKey?: string;
  }): Promise<PaginatedResponse<Notification>> => {

    const searchParams: ApiParams = {
      limit: params.pageSize || DEFAULT_PAGE_SIZE,
    };

    if (params.code) searchParams.code = params.code;
    if (params.deviceId) searchParams.device_id = params.deviceId;
    if (params.status && params.status !== 'all') searchParams.status = params.status;
    if (params.name) searchParams.name = params.name;
    if (params.amountMin) searchParams.min_amount = params.amountMin;
    if (params.amountMax) searchParams.max_amount = params.amountMax;
    if (params.lastKey) searchParams.last_key = normalizeLastKey(params.lastKey);

    if (params.dateFrom) {
      const fromDate = new Date(params.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      searchParams.from_timestamp = fromDate.getTime();
    }

    if (params.dateTo) {
      const toDate = new Date(params.dateTo);
      toDate.setHours(23, 59, 59, 999);
      searchParams.to_timestamp = toDate.getTime();
    }

    const { data } = await apiClient.get('/notifications/search', {
      params: searchParams
    });

    return {
      data: data.data || [],
      pagination: {
        page: params.page || 1,
        pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
        total: data.count || 0,
        totalPages: data.has_more ? (params.page || 1) + 1 : (params.page || 1),
        hasMore: data.has_more || false,
        lastKey: data.last_key,
      }
    };
  },
};