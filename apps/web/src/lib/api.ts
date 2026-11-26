// Empty string = same origin (Caddy proxies /api → Nest). Local dev hits :4000.
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000')

export type ApiResult<T> = {
  data: T | null
  error: { code: string; message: string } | null
}

export async function api<T>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<ApiResult<T>> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  if (init.token) headers.set('Authorization', `Bearer ${init.token}`)
  headers.set('X-Billnote-Request', '1')

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers,
      credentials: 'include',
    })
    return (await response.json()) as ApiResult<T>
  } catch {
    return {
      data: null,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Cannot reach the API. Check that the site/API containers are running.',
      },
    }
  }
}

export { API_BASE }
