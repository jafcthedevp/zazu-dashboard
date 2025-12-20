import axios from 'axios';
import { Notification, UpdateStatusPayload, PaginatedResponse } from '@/types/notifications';

const API_BASE_URL = 'https://brgzom3jw4.execute-api.us-east-1.amazonaws.com';

export const DEFAULT_PAGE_SIZE = 20;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 API REQUEST:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`,
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('❌ REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API RESPONSE:', {
      status: response.status,
      url: response.config.url,
      dataType: Array.isArray(response.data) ? 'Array' : typeof response.data,
      dataLength: response.data?.count || (Array.isArray(response.data) ? response.data.length : 'N/A'),
      hasMore: response.data?.has_more,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ API ERROR:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

function parseLastKey(lastKeyString?: string): any {
  if (!lastKeyString) return undefined;
  try {
    return JSON.parse(lastKeyString);
  } catch {
    return undefined;
  }
}

export const notificationsApi = {
  getAll: async (
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE,
    lastKey?: string
  ): Promise<PaginatedResponse<Notification>> => {
    console.log('📋 getAll() called:', { page, pageSize, lastKey });

    const params: any = {
      limit: pageSize,
    };

    if (lastKey) {
      params.last_key = lastKey;
    }

    const { data } = await apiClient.get('/notifications', { params });

    console.log('📋 getAll() raw response:', {
      count: data.count,
      hasMore: data.has_more,
      hasLastKey: !!data.last_key,
      dataLength: data.data?.length,
    });

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

    console.log('📋 getAll() returning:', result);
    return result;
  },

  /**
   * GET /notifications/{id}
   */
  getById: async (id: string): Promise<Notification> => {
    console.log('🔍 getById() called:', { id });
    const { data } = await apiClient.get(`/notifications/${id}`);
    console.log('🔍 getById() response:', data);
    return data.data; // Tu API envuelve en {data: {...}}
  },

  /**
   * PUT /notifications/{id}/status
   */
  updateStatus: async (
    id: string,
    payload: UpdateStatusPayload
  ): Promise<Notification> => {
    console.log('✏️ updateStatus() called:', { id, payload });
    const { data } = await apiClient.put(`/notifications/${id}/status`, payload);
    console.log('✏️ updateStatus() response:', data);
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
    console.log('🏷️ getByStatus() called:', { status, page, pageSize, lastKey });

    const params: any = {
      limit: pageSize,
    };

    if (lastKey) {
      params.last_key = lastKey;
    }

    const { data } = await apiClient.get(`/notifications/status/${status}`, { params });

    console.log('🏷️ getByStatus() response:', {
      count: data.count,
      hasMore: data.has_more,
    });

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
    console.log('📱 getByDevice() called:', { deviceId, page, pageSize, lastKey });

    const params: any = {
      limit: pageSize,
    };

    if (lastKey) {
      params.last_key = lastKey;
    }

    const { data } = await apiClient.get(`/notifications/device/${deviceId}`, { params });

    console.log('📱 getByDevice() response:', {
      count: data.count,
      hasMore: data.has_more,
    });

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
    amountMin?: number;
    amountMax?: number;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    pageSize?: number;
    lastKey?: string;
  }): Promise<PaginatedResponse<Notification>> => {
    console.log('🔎 search() called with params:', params);

    let fromTimestamp: number | undefined;
    let toTimestamp: number | undefined;

    const parseDateToTimestamp = (dateStr: string, endOfDay = false): number | undefined => {
      try {
        const date = new Date(dateStr);

        if (isNaN(date.getTime())) {
          console.warn(`Invalid date: ${dateStr}`);
          return undefined;
        }

        if (endOfDay) {
          date.setHours(23, 59, 59, 999);
        } else {
          date.setHours(0, 0, 0, 0);
        }

        return date.getTime();
      } catch (error) {
        console.error(`Error parsing date ${dateStr}:`, error);
        return undefined;
      }
    };

    // Usar en search:
    const searchParams: any = {
      limit: params.pageSize || DEFAULT_PAGE_SIZE,
    };

    // Mapear parámetros del frontend a los de tu API
    if (params.code) searchParams.code = params.code;
    if (params.deviceId) searchParams.device_id = params.deviceId;
    if (params.status && params.status !== 'all') searchParams.status = params.status;
    if (params.amountMin) searchParams.min_amount = params.amountMin;
    if (params.amountMax) searchParams.max_amount = params.amountMax;
    if (fromTimestamp) searchParams.from_timestamp = fromTimestamp;
    if (toTimestamp) searchParams.to_timestamp = toTimestamp;
    if (params.lastKey) searchParams.last_key = params.lastKey;

    console.log('🔎 search() formatted params:', searchParams);

    const { data } = await apiClient.get('/notifications/search', {
      params: searchParams
    });

    console.log('🔎 search() response:', {
      count: data.count,
      hasMore: data.has_more,
      filtersApplied: data.filters_applied,
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