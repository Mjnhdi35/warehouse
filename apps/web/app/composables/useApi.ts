/**
 * Composable để gọi API thông qua proxy server
 * @param url - API endpoint (sẽ được prefix với /api)
 * @param options - Fetch options (method, body, headers, etc.)
 */
export const useApi = async <T = unknown>(
  url: string,
  options?: Record<string, unknown>,
): Promise<T> => {
  const apiBaseUrl = '/api';
  const fullUrl = `${apiBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;

  return $fetch<T>(fullUrl, options) as unknown as T;
};

/**
 * Lazy version của useApi - trả về reactive state
 * @param url - API endpoint (sẽ được prefix với /api)
 * @param options - Fetch options (method, body, headers, etc.)
 */
export const useApiLazy = <T = unknown>(
  url: string,
  options?: Record<string, unknown>,
) => {
  const apiBaseUrl = '/api';
  const fullUrl = `${apiBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;

  return useLazyFetch<T>(fullUrl, options);
};
