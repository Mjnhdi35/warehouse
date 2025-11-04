import {
  buildProxyUrl,
  getRequestBody,
  getForwardHeaders,
  forwardResponseHeaders,
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

  // Forward request đến backend
  try {
    const response = await $fetch(url, {
      method: method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
      headers: forwardHeaders,
      body,
      onResponse({ response: res }) {
        forwardResponseHeaders(event, res.headers);
      },
    });

    return response;
  } catch (err: unknown) {
    return handleProxyError(event, err);
  }
});
