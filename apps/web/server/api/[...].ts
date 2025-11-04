import {
  buildProxyUrl,
  getRequestBody,
  getForwardHeaders,
  handleProxyError,
} from '../utils/proxy';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl;

  // Get request info
  const path = getRouterParam(event, '_') || '';
  const query = getQuery(event);
  const method = event.method || 'GET';
  const headers = getHeaders(event);

  // Build target URL
  const url = buildProxyUrl(apiBaseUrl, path, query);

  // Get request body
  const body = await getRequestBody(event, method);

  // Get forward headers
  const forwardHeaders = getForwardHeaders(
    headers as Partial<Record<string, string | string[] | undefined>>,
  );

  try {
    // Use manual redirect handling for OAuth flows
    // Don't follow redirects automatically - let browser handle them
    const response = await $fetch(url, {
      method: method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
      headers: forwardHeaders,
      body: method === 'GET' ? undefined : body,
      redirect: 'manual', // Manual redirect handling for OAuth
      onResponse({ response: res }) {
        // Forward response headers (except excluded ones)
        res.headers.forEach((value, key) => {
          const lowerKey = key.toLowerCase();
          if (
            ![
              'content-encoding',
              'content-length',
              'transfer-encoding',
            ].includes(lowerKey)
          ) {
            setHeader(event, key, value);
          }
        });

        // Handle redirect responses (302, 301) for OAuth flows
        // Passport will redirect to Google OAuth, forward to browser
        if (res.status >= 300 && res.status < 400) {
          const location = res.headers.get('location');
          if (location) {
            setResponseStatus(event, res.status);
            setHeader(event, 'Location', location);
          }
        }
      },
    });

    return response;
  } catch (err: unknown) {
    const error = err as {
      response?: { status: number; headers?: Headers };
      message?: string;
    };

    // Handle redirect responses in error case (for OAuth flows)
    if (
      error.response?.status &&
      error.response.status >= 300 &&
      error.response.status < 400
    ) {
      const location = error.response.headers?.get('location');
      if (location) {
        setResponseStatus(event, error.response.status);
        setHeader(event, 'Location', location);
        return; // Let browser handle the redirect
      }
    }

    return handleProxyError(event, err);
  }
});
