'use client'

import { useCallback } from 'react'

import useSWR, { type KeyedMutator } from 'swr'

import CacheManager from '@/utils/cache'

interface UseCacheOptions<T> {
  cacheKey: string
  fetcher: () => Promise<T>
  cacheExpiry?: number // milliseconds
  swrOptions?: any
}

interface UseCacheReturn<T> {
  data: T | undefined
  error: any
  isLoading: boolean
  mutate: KeyedMutator<T>
  clearCache: () => void
  refreshFromAPI: () => Promise<T | undefined>
  isCached: boolean
}

/**
 * Hook kết hợp SWR với localStorage cache
 * @param options - Cấu hình cache và SWR
 * @returns Object chứa data, các function quản lý cache
 */
export function useCache<T>({
  cacheKey,
  fetcher,
  cacheExpiry = 5 * 60 * 1000, // 5 phút mặc định
  swrOptions = {}
}: UseCacheOptions<T>): UseCacheReturn<T> {
  // Fetcher với cache logic
  const cachedFetcher = useCallback(async (): Promise<T> => {
    // Thử lấy từ cache trước
    const cached = CacheManager.get<T>(cacheKey)

    if (cached) {
      return cached
    }

    // Nếu không có cache, gọi API
    const data = await fetcher()

    // Lưu vào cache
    CacheManager.set(cacheKey, data, cacheExpiry)

    return data
  }, [cacheKey, fetcher, cacheExpiry])

  const { data, error, isLoading, mutate } = useSWR<T>(cacheKey, cachedFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    ...swrOptions
  })

  // Xóa cache cho key này
  const clearCache = useCallback(() => {
    CacheManager.remove(cacheKey)
    mutate() // Trigger SWR revalidation
  }, [cacheKey, mutate])

  // Bỏ qua cache và gọi API trực tiếp
  const refreshFromAPI = useCallback(async (): Promise<T | undefined> => {
    try {
      CacheManager.remove(cacheKey) // Xóa cache cũ
      const freshData = await fetcher()

      CacheManager.set(cacheKey, freshData, cacheExpiry) // Cache data mới
      mutate(freshData, false) // Update SWR data mà không revalidate

      return freshData
    } catch (error) {
      console.error('Lỗi khi refresh từ API:', error)
      throw error
    }
  }, [cacheKey, fetcher, cacheExpiry, mutate])

  // Kiểm tra xem data hiện tại có từ cache không
  const isCached = CacheManager.isValid(cacheKey)

  return {
    data,
    error,
    isLoading,
    mutate,
    clearCache,
    refreshFromAPI,
    isCached
  }
}

/**
 * Hook đơn giản để chỉ quản lý cache không kết hợp SWR
 */
export function useSimpleCache() {
  const setCache = useCallback(<T>(key: string, data: T, expiry?: number) => {
    CacheManager.set(key, data, expiry)
  }, [])

  const getCache = useCallback(<T>(key: string): T | null => {
    return CacheManager.get<T>(key)
  }, [])

  const removeCache = useCallback((key: string) => {
    CacheManager.remove(key)
  }, [])

  const clearAllCache = useCallback(() => {
    CacheManager.clear()
  }, [])

  const isCacheValid = useCallback((key: string): boolean => {
    return CacheManager.isValid(key)
  }, [])

  const getCacheMetadata = useCallback((key: string) => {
    return CacheManager.getMetadata(key)
  }, [])

  return {
    setCache,
    getCache,
    removeCache,
    clearAllCache,
    isCacheValid,
    getCacheMetadata
  }
}
