import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, fetchApi, fetchShowsIndexPage } from '@/shared/api/fetch'

describe('ApiError', () => {
  it('captures status and optional payload', () => {
    const err = new ApiError('failed', 502, { message: 'x' })
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('ApiError')
    expect(err.status).toBe(502)
    expect(err.data).toEqual({ message: 'x' })
  })
})

describe('fetchApi', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
      } as Response)
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('returns parsed JSON on success', async () => {
    await expect(fetchApi<{ ok: boolean }>('/test')).resolves.toEqual({ ok: true })
  })

  it('throws ApiError when response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ detail: 'nope' }),
    } as unknown as Response)
    await expect(fetchApi('/bad')).rejects.toMatchObject({ name: 'ApiError', status: 500 })
  })
})

describe('fetchShowsIndexPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('returns an empty list on 404', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      status: 404,
      ok: false,
      json: async () => ({}),
    } as unknown as Response)
    await expect(fetchShowsIndexPage(99)).resolves.toEqual([])
  })
})
