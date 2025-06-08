interface CacheItem<T> {
  data: T
  timestamp: number
  expiry: number // thời gian hết hạn (ms)
}

class CacheManager {
  private static readonly PREFIX = 'app_cache_'
  private static readonly DEFAULT_EXPIRY = 5 * 60 * 1000 // 5 phút

  /**
   * Lưu dữ liệu vào cache
   * @param key - Key để lưu cache
   * @param data - Dữ liệu cần cache
   * @param expiry - Thời gian hết hạn (ms), mặc định 5 phút
   */
  static set<T>(key: string, data: T, expiry: number = this.DEFAULT_EXPIRY): void {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiry
      }

      localStorage.setItem(this.PREFIX + key, JSON.stringify(cacheItem))
    } catch (error) {
      console.error('Không thể lưu cache:', error)
    }
  }

  /**
   * Lấy dữ liệu từ cache
   * @param key - Key của cache
   * @returns Dữ liệu nếu hợp lệ, null nếu không tồn tại hoặc hết hạn
   */
  static get<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(this.PREFIX + key)

      if (!cached) return null

      const cacheItem: CacheItem<T> = JSON.parse(cached)
      const now = Date.now()

      // Kiểm tra xem cache có hết hạn không
      if (now - cacheItem.timestamp > cacheItem.expiry) {
        this.remove(key)

        return null
      }

      return cacheItem.data
    } catch (error) {
      console.error('Không thể đọc cache:', error)
      this.remove(key)

      return null
    }
  }

  /**
   * Xóa một cache item
   * @param key - Key của cache cần xóa
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(this.PREFIX + key)
    } catch (error) {
      console.error('Không thể xóa cache:', error)
    }
  }

  /**
   * Xóa tất cả cache
   */
  static clear(): void {
    try {
      const keys = Object.keys(localStorage)

      keys.filter(key => key.startsWith(this.PREFIX)).forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('Không thể xóa tất cả cache:', error)
    }
  }

  /**
   * Kiểm tra xem cache có tồn tại và hợp lệ không
   * @param key - Key của cache
   * @returns true nếu cache hợp lệ, false nếu không
   */
  static isValid(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Lấy thông tin metadata của cache
   * @param key - Key của cache
   * @returns Metadata hoặc null nếu không tồn tại
   */
  static getMetadata(key: string): { timestamp: number; expiry: number; isExpired: boolean } | null {
    try {
      const cached = localStorage.getItem(this.PREFIX + key)

      if (!cached) return null

      const cacheItem: CacheItem<any> = JSON.parse(cached)
      const now = Date.now()
      const isExpired = now - cacheItem.timestamp > cacheItem.expiry

      return {
        timestamp: cacheItem.timestamp,
        expiry: cacheItem.expiry,
        isExpired
      }
    } catch (error) {
      return null
    }
  }
}

export default CacheManager

// Các key cache được sử dụng trong app
export const CACHE_KEYS = {
  COHORT_OPTIONS: 'cohort_options',
  CLASS_OPTIONS: 'class_options',
  TERM_OPTIONS: 'term_options',
  STUDENT_OPTIONS: 'student_options',
  TYPE_PROCESS: 'type_process',
  CLASS_CVHT: 'class_cvht',
  RESULT_PROCESS: 'result_process',
  MAJOR_OPTIONS: 'major_options'
} as const

// Helper hooks để sử dụng cache dễ dàng hơn
export const useCacheWithFallback = <T>(cacheKey: string, fallbackFn: () => Promise<T>, expiry?: number) => {
  const getCachedOrFetch = async (): Promise<T> => {
    // Thử lấy từ cache trước
    const cached = CacheManager.get<T>(cacheKey)

    if (cached) {
      return cached
    }

    // Nếu không có cache, gọi API và cache kết quả
    const data = await fallbackFn()

    CacheManager.set(cacheKey, data, expiry)

    return data
  }

  return { getCachedOrFetch }
}
