export type ErrorDetail = {
  path: string
  message: string
}

export type ApiErrorBody = {
  code: string
  message: string
  details: ErrorDetail[]
  requestId: string | null
}

export function ok<T>(data: T, meta: Record<string, unknown> = {}) {
  return {
    data,
    meta: { requestId: null as string | null, ...meta },
    error: null as null,
  }
}

export function fail(
  code: string,
  message: string,
  details: ErrorDetail[] = [],
  requestId: string | null = null,
): { data: null; error: ApiErrorBody } {
  return {
    data: null,
    error: { code, message, details, requestId },
  }
}
