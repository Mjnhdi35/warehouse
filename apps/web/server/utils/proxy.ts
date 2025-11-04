import type { H3Event } from 'h3';

/**
 * Build target URL từ path và query params
 */
export function buildProxyUrl(
  baseUrl: string,
  path: string,
  query: Record<string, unknown>,
): string {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const apiPrefix = cleanBaseUrl.endsWith('/api') ? '' : '/api';
  const pathSegment = path ? `/${path}` : '';
  const queryString =
    Object.keys(query).length > 0
      ? `?${new URLSearchParams(query as Record<string, string>).toString()}`
      : '';

  return `${cleanBaseUrl}${apiPrefix}${pathSegment}${queryString}`;
}

/**
 * Read request body nếu method là POST, PUT, PATCH, DELETE
 */
export async function getRequestBody(
  event: H3Event,
  method: string,
): Promise<BodyInit | Record<string, unknown> | null | undefined> {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return undefined;
  }

  try {
    const rawBody = await readBody(event);
    return rawBody as BodyInit | Record<string, unknown>;
  } catch {
    // Body không có hoặc đã đọc rồi
    return undefined;
  }
}

/**
 * Filter và forward headers từ request
 */
export function getForwardHeaders(
  headers: Partial<Record<string, string | string[] | undefined>>,
): Record<string, string> {
  const forwardHeaders: Record<string, string> = {};
  const excludedHeaders = [
    'host',
    'connection',
    'content-length',
    'transfer-encoding',
  ];

  Object.keys(headers).forEach((key) => {
    const lowerKey = key.toLowerCase();
    const value = headers[key];

    if (
      value !== undefined &&
      !excludedHeaders.includes(lowerKey) &&
      !lowerKey.startsWith('x-forwarded-') &&
      !lowerKey.startsWith('x-nuxt-')
    ) {
      const headerValue = Array.isArray(value) ? value[0] : value;
      if (headerValue !== undefined) {
        forwardHeaders[key] = headerValue;
      }
    }
  });

  return forwardHeaders;
}

/**
 * Forward response headers từ backend
 */
export function forwardResponseHeaders(
  event: H3Event,
  responseHeaders: Headers,
): void {
  const excludedHeaders = [
    'content-encoding',
    'content-length',
    'transfer-encoding',
  ];

  responseHeaders.forEach((value, key) => {
    if (!excludedHeaders.includes(key.toLowerCase())) {
      setHeader(event, key, value);
    }
  });
}

/**
 * Handle proxy error
 */
export function handleProxyError(
  event: H3Event,
  err: unknown,
): { error: string; message: string } {
  const error = err as {
    response?: { status: number; _data?: unknown };
    message?: string;
  };

  if (error.response) {
    setResponseStatus(event, error.response.status);
    return {
      error: 'Backend error',
      message:
        (error.response._data as { message?: string })?.message ||
        error.message ||
        'Unknown error',
    };
  }

  setResponseStatus(event, 500);
  return {
    error: 'Proxy error',
    message: error.message || 'Unknown error',
  };
}
