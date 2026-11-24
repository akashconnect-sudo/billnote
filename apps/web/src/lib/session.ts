const ACCESS_KEY = 'bn_access'

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.sessionStorage.getItem(ACCESS_KEY)
}

export function setAccessToken(token: string): void {
  window.sessionStorage.setItem(ACCESS_KEY, token)
}

export function clearAccessToken(): void {
  window.sessionStorage.removeItem(ACCESS_KEY)
}
