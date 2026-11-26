function resolveApiBase(): string {
  // Browser on the live domain must never call localhost — use same origin (Caddy → API).
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return ''
    }
  }
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (process.env.NODE_ENV === 'production') return ''
  return 'http://localhost:4000'
}

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
    const response = await fetch(`${resolveApiBase()}${path}`, {
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

export const API_BASE = resolveApiBase()
