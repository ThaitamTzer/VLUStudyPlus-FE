import { useMemo, useCallback, useState } from 'react'

// Simple debounce implementation to avoid external dependency
function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export interface UseTablePerformanceOptions {
  itemsPerPage?: number
  debounceDelay?: number
}

export function useTablePerformance<T>(data: T[], options: UseTablePerformanceOptions = {}) {
  const { itemsPerPage = 50, debounceDelay = 300 } = options

  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!searchQuery) return data

    return data.filter((item: any) => {
      const searchableText = JSON.stringify(item).toLowerCase()

      return searchableText.includes(searchQuery.toLowerCase())
    })
  }, [data, searchQuery])

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const currentData = useMemo(() => {
    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, currentPage, itemsPerPage])

  // Debounced search
  const debouncedSetSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query)
      setCurrentPage(0) // Reset to first page on search
    }, debounceDelay),
    [debounceDelay]
  )

  // Navigation functions with loading state
  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setIsLoading(true)
      setTimeout(() => {
        setCurrentPage(prev => prev + 1)
        setIsLoading(false)
      }, 100)
    }
  }, [currentPage, totalPages])

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0) {
      setIsLoading(true)
      setTimeout(() => {
        setCurrentPage(prev => prev - 1)
        setIsLoading(false)
      }, 100)
    }
  }, [currentPage])

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < totalPages) {
        setIsLoading(true)
        setTimeout(() => {
          setCurrentPage(page)
          setIsLoading(false)
        }, 100)
      }
    },
    [totalPages]
  )

  // Reset functions
  const resetPagination = useCallback(() => {
    setCurrentPage(0)
    setSearchQuery('')
  }, [])

  return {
    // Data
    currentData,
    filteredData,
    totalItems: filteredData.length,

    // Pagination
    currentPage,
    totalPages,
    itemsPerPage,

    // States
    isLoading,
    searchQuery,

    // Actions
    goToNextPage,
    goToPrevPage,
    goToPage,
    setSearch: debouncedSetSearch,
    resetPagination,

    // Computed
    hasNextPage: currentPage < totalPages - 1,
    hasPrevPage: currentPage > 0,
    startIndex: currentPage * itemsPerPage + 1,
    endIndex: Math.min((currentPage + 1) * itemsPerPage, filteredData.length)
  }
}

// Hook for virtual scrolling
export function useVirtualList<T>(items: T[], itemHeight: number, containerHeight: number) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length)

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index
    }))
  }, [items, startIndex, endIndex])

  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  }
}
