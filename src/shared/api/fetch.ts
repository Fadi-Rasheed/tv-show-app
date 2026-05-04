import type { ShowsResponse } from '@/shared/types/show'

type QueryValue = string | number | boolean

type FetchApiOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | Record<string, unknown>
  query?: Record<string, QueryValue | null | undefined>
}

export class ApiError extends Error {
  readonly status: number
  readonly data?: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

const buildUrl = (path: string, query?: FetchApiOptions['query']) => {
  const url = new URL(path, apiBaseUrl)

  if (!query) {
    return url.toString()
  }

  for (const [key, value] of Object.entries(query)) {
    if (value == null) {
      continue
    }

    url.searchParams.set(key, String(value))
  }

  return url.toString()
}

export const fetchApi = async <T>(path: string, options: FetchApiOptions = {}): Promise<T> => {
  const { query, headers, body, ...rest } = options
  const hasBody = body !== undefined

  const isJsonBody = hasBody && !(body instanceof FormData)
  let requestBody: BodyInit | undefined

  if (hasBody) {
    requestBody = isJsonBody ? JSON.stringify(body) : body
  }

  const response = await fetch(buildUrl(path, query), {
    ...rest,
    body: requestBody,
    headers: {
      ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status, data)
  }

  return data as T
}

export const fetchShowsIndexPage = async (page?: number): Promise<ShowsResponse> => {
  const response = await fetch(buildUrl('/shows', page === undefined ? undefined : { page }), {
    headers: { Accept: 'application/json' },
  })

  if (response.status === 404) {
    return []
  }

  const data: unknown = await response.json()

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status, data)
  }

  return data as ShowsResponse
}
