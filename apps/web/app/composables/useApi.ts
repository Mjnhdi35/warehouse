/**
 * API Error type
 */
export interface ApiError {
  message: string;
  statusCode?: number;
  data?: unknown;
}

/**
 * Composable để gọi API thông qua proxy server
 * @param url - API endpoint (sẽ được prefix với /api)
 * @param options - Fetch options (method, body, headers, etc.)
 * @throws {ApiError} Khi có lỗi xảy ra
 */
export const useApi = async <T = unknown>(
  url: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
    body?: Record<string, unknown> | FormData | string | null;
    headers?: Record<string, string>;
    query?: Record<string, unknown>;
    [key: string]: unknown;
  },
): Promise<T> => {
  const apiBaseUrl = '/api';
  const fullUrl = `${apiBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;

  try {
    const result = (await $fetch(fullUrl, {
      ...options,
      onResponseError({ response }) {
        const error: ApiError = {
          message:
            (response._data as { message?: string })?.message ||
            'An error occurred',
          statusCode: response.status,
          data: response._data,
        };
        throw error;
      },
    } as Parameters<typeof $fetch>[1])) as T;
    return result;
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      throw error as ApiError;
    }
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      data: error,
    };
    throw apiError;
  }
};

/**
 * Lazy version của useApi - trả về reactive state
 * @param url - API endpoint (sẽ được prefix với /api)
 * @param options - Fetch options (method, body, headers, etc.)
 */
export const useApiLazy = <T = unknown>(
  url: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
    body?: unknown;
    headers?: Record<string, string>;
    query?: Record<string, unknown>;
    [key: string]: unknown;
  },
) => {
  const apiBaseUrl = '/api';
  const fullUrl = `${apiBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;

  return useLazyFetch<T>(
    fullUrl,
    options as Parameters<typeof useLazyFetch<T>>[1],
  );
};
