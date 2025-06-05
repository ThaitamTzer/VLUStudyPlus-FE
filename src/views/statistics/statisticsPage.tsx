'use client'

import { useState, useMemo } from 'react'

import useSWR from 'swr'
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  FormControl,
  MenuItem,
  Typography,
  Box,
  TablePagination
} from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ColumnDef, Table as TableType } from '@tanstack/react-table'
import {
  createColumnHelper,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFilteredRowModel,
  useReactTable,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  getPaginationRowModel
} from '@tanstack/react-table'

import statisticsService from '@/services/statistics.service'
import termService from '@/services/term.service'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import TanstackTable from '@/components/TanstackTable'
import { fuzzyFilter } from '../apps/invoice/list/InvoiceListTable'

interface StatisticsData {
  termAbbreviatName: string
  majorName: string
  count: number
}

interface StatusStatisticsData {
  status?: string
  termAbbreviatName: string
  majorName: string
  count: number
}

interface CVHTStatisticsData {
  cvht: string
  classCode: string
  termAbbreviatName: string
  majorName: string
  countslxl: number
  countsslcxl: number
  count: number
}

interface StatisticsResponse {
  statistics: StatisticsData[]
}

interface StatusStatisticsResponse {
  statistics: StatusStatisticsData[]
}

interface CVHTStatisticsResponse {
  statistics: CVHTStatisticsData[]
}

export default function StatisticsPage() {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('2024-2025')
  const [selectedTerm, setSelectedTerm] = useState<string>('')
  const [globalFilter, setGlobalFilter] = useState('')

  // Tạo danh sách năm học
  const academicYears = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const years = []

    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      years.push(`${i}-${i + 1}`)
    }

    return years
  }, [])

  // Tách năm học thành startYear và endYear
  const { startYear, endYear } = useMemo(() => {
    if (!selectedAcademicYear) return { startYear: undefined, endYear: undefined }
    const [start, end] = selectedAcademicYear.split('-')

    return { startYear: start, endYear: end }
  }, [selectedAcademicYear])

  // Fetch danh sách học kỳ từ termService
  const { data: termsData, error: termsError } = useSWR('terms', () => termService.getAll(1, 100), {
    revalidateOnFocus: false,
    dedupingInterval: 300000
  })

  // Fetch dữ liệu thống kê theo học kỳ
  const { data, error, isLoading } = useSWR<StatisticsResponse>(
    ['statistics', startYear, endYear, selectedTerm],
    () => statisticsService.getStatistics(startYear, endYear, selectedTerm || undefined),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000
    }
  )

  // Fetch dữ liệu thống kê theo CVHT
  const {
    data: cvhtData,
    error: cvhtError,
    isLoading: isLoadingCVHT
  } = useSWR<CVHTStatisticsResponse>(
    ['cvht-statistics', startYear, endYear, selectedTerm],
    () =>
      statisticsService.getStatistics(startYear, endYear, selectedTerm || undefined, {
        processOfCVHT: true
      }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000
    }
  )

  // Fetch dữ liệu thống kê theo trạng thái
  const {
    data: statusData,
    error: statusError,
    isLoading: isLoadingStatus
  } = useSWR<StatusStatisticsResponse>(
    ['status-statistics', startYear, endYear, selectedTerm],
    () =>
      statisticsService.getStatistics(startYear, endYear, selectedTerm || undefined, {
        status: true
      }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000
    }
  )

  // Xử lý dữ liệu cho biểu đồ theo học kỳ
  const chartData = useMemo(() => {
    if (!data?.statistics) return []

    const groupedData = data.statistics.reduce((acc, item) => {
      const existingTerm = acc.find(term => term.termAbbreviatName === item.termAbbreviatName)

      if (existingTerm) {
        existingTerm[item.majorName] = item.count
        existingTerm.total += item.count
      } else {
        acc.push({
          termAbbreviatName: item.termAbbreviatName,
          [item.majorName]: item.count,
          total: item.count
        })
      }

      return acc
    }, [] as any[])

    return groupedData.sort((a, b) => a.termAbbreviatName.localeCompare(b.termAbbreviatName))
  }, [data])

  // Lấy danh sách major unique để tạo legend cho biểu đồ
  const availableMajors = useMemo(() => {
    if (!data?.statistics) return []

    return Array.from(new Set(data.statistics.map(item => item.majorName)))
  }, [data])

  // Lấy danh sách trạng thái động từ dữ liệu
  const availableStatuses = useMemo(() => {
    if (!statusData?.statistics) return []

    return Array.from(new Set(statusData.statistics.filter(item => item.status).map(item => item.status!))).sort()
  }, [statusData])

  // Hàm tạo màu sắc động
  const generateStatusColors = useMemo(() => {
    const baseColors = [
      '#8884d8',
      '#82ca9d',
      '#ffc658',
      '#ff7300',
      '#00ff00',
      '#ff6b6b',
      '#4ecdc4',
      '#45b7d1',
      '#96ceb4',
      '#ffeaa7',
      '#dda0dd',
      '#98d8c8',
      '#f7dc6f',
      '#bb8fce',
      '#85c1e9'
    ]

    const colorMap: { [key: string]: string } = {}

    availableStatuses.forEach((status, index) => {
      colorMap[status] = baseColors[index % baseColors.length]
    })

    return colorMap
  }, [availableStatuses])

  // Màu sắc cho các major khác nhau
  const majorColors = {
    'Công nghệ thông tin': '#8884d8',
    'Mạng máy tính và truyền thông dữ liệu': '#82ca9d',
    'Hệ thống thông tin': '#ffc658',
    'Khoa học máy tính': '#ff7300',
    'An toàn thông tin': '#00ff00'
  }

  const columnHelper = createColumnHelper<CVHTStatisticsData>()

  // Khởi tạo TanStack Table cho thống kê CVHT
  const columns = useMemo<ColumnDef<CVHTStatisticsData, any>[]>(
    () => [
      columnHelper.accessor('cvht', {
        header: 'CVHT'
      }),
      columnHelper.accessor('termAbbreviatName', {
        header: 'Học kỳ',
        cell: info => info.getValue<string>().replace('HK', '')
      }),
      columnHelper.accessor('majorName', {
        header: 'Ngành'
      }),
      columnHelper.accessor('classCode', {
        header: 'Lớp'
      }),
      columnHelper.accessor('countslxl', {
        header: 'Số đã XLHT'
      }),
      columnHelper.accessor('countsslcxl', {
        header: 'Số chưa XLHT'
      }),
      columnHelper.accessor('count', {
        header: 'Tổng số XLHT'
      })
    ],
    [columnHelper]
  )

  const table = useReactTable({
    data: cvhtData?.statistics || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { globalFilter },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    filterFns: {
      fuzzy: fuzzyFilter
    },
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onGlobalFilterChange: setGlobalFilter
  })

  const optionsTerm = useMemo(() => {
    return [{ _id: '', abbreviatName: 'Tất cả', termName: 'Tất cả' }, ...(termsData?.terms || [])]
  }, [termsData])

  // Xử lý dữ liệu cho biểu đồ theo trạng thái - Stacked Bar Chart
  const statusChartData = useMemo(() => {
    if (!statusData?.statistics || availableStatuses.length === 0) return []

    // Lọc ra chỉ những bản ghi có status (loại bỏ tổng)
    const statusOnlyData = statusData.statistics.filter(item => item.status)

    // Nhóm theo học kỳ và ngành
    const groupedData = statusOnlyData.reduce((acc, item) => {
      const key = `${item.termAbbreviatName}_${item.majorName}`

      if (!acc[key]) {
        acc[key] = {
          termAbbreviatName: item.termAbbreviatName,
          majorName: item.majorName,
          display: `${item.majorName}`
        }

        // Khởi tạo tất cả trạng thái với giá trị 0
        availableStatuses.forEach(status => {
          acc[key][status] = 0
        })
      }

      if (item.status) {
        acc[key][item.status] = item.count
      }

      return acc
    }, {} as any)

    return Object.values(groupedData).sort(
      (a: any, b: any) =>
        a.termAbbreviatName.localeCompare(b.termAbbreviatName) || a.majorName.localeCompare(b.majorName)
    )
  }, [statusData, availableStatuses])

  // Xử lý dữ liệu cho biểu đồ hình tròn - Pie Chart
  // const statusPieData = useMemo(() => {
  //   if (!statusData?.statistics) return []

  //   // Tính tổng theo từng trạng thái
  //   const statusTotals = statusData.statistics
  //     .filter(item => item.status)
  //     .reduce(
  //       (acc, item) => {
  //         if (!acc[item.status!]) {
  //           acc[item.status!] = 0
  //         }

  //         acc[item.status!] += item.count

  //         return acc
  //       },
  //       {} as { [key: string]: number }
  //     )

  //   return Object.entries(statusTotals)
  //     .map(([status, count]) => ({
  //       name: status,
  //       value: count,
  //       percentage: 0 // sẽ được tính sau
  //     }))
  //     .sort((a, b) => b.value - a.value) // Sắp xếp theo giá trị giảm dần
  // }, [statusData])

  // Tính phần trăm cho pie chart
  // const statusPieDataWithPercentage = useMemo(() => {
  //   const total = statusPieData.reduce((sum, item) => sum + item.value, 0)

  //   return statusPieData.map(item => ({
  //     ...item,
  //     percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
  //   }))
  // }, [statusPieData])

  // Màu sắc động cho pie chart
  // const pieColors = useMemo(() => {
  //   return statusPieDataWithPercentage.map(
  //     (item, index) => generateStatusColors[item.name] || `hsl(${index * 137.5}, 70%, 50%)`
  //   )
  // }, [statusPieDataWithPercentage, generateStatusColors])

  if (error || termsError || cvhtError || statusError) {
    return (
      <Card>
        <CardContent>
          <Typography color='error'>Có lỗi xảy ra khi tải dữ liệu thống kê</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* <Typography variant='h4' sx={{ mb: 3, fontWeight: 'bold' }}>
        Thống kê sinh viên bị xử lý học tập
      </Typography> */}

      {/* Bộ lọc */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title='Bộ lọc' />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <CustomTextField
                  value={selectedAcademicYear}
                  label='Năm học'
                  select
                  onChange={e => setSelectedAcademicYear(e.target.value)}
                >
                  {academicYears.map(year => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {/* <CustomAutocomplete
                options={optionsTerm}
                getOptionLabel={option => `${option.abbreviatName}` || ''}
                defaultValue={optionsTerm[0]}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                onChange={(_, value) => {
                  if (value || value === '') {
                    if (value._id === '') {
                      setSelectedTerm('')
                    } else {
                      setSelectedTerm(value._id || '')
                    }
                  } else {
                    setSelectedTerm('')
                  }
                }}
                value={termsData?.terms.find(term => term._id === selectedTerm) || null}
                renderInput={params => (
                  <CustomTextField
                    SelectProps={{
                      displayEmpty: true
                    }}
                    {...params}
                    label='Học kỳ'
                  />
                )}
                loading={isLoadingTerms}
                noOptionsText='Không tìm thấy học kỳ'
                filterOptions={(options, state) => {
                  const filtered = options?.filter(option =>
                    option.termName.toLowerCase().includes(state.inputValue.toLowerCase())
                  )

                  return filtered
                }}
              /> */}
              <CustomTextField
                value={selectedTerm}
                label='Học kỳ'
                fullWidth
                select
                SelectProps={{
                  displayEmpty: true
                }}
                onChange={e => setSelectedTerm(e.target.value)}
              >
                {optionsTerm.map(term => (
                  <MenuItem key={term._id} value={term._id}>
                    {term.abbreviatName}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Thống kê theo học kỳ */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title='Thống kê số lượng sinh viên các ngành bị xử lý học tập theo học kỳ' />
        <CardContent>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography>Đang tải dữ liệu...</Typography>
            </Box>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width='100%' height={400}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='termAbbreviatName' angle={-45} textAnchor='end' height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                {availableMajors.map((major, index) => (
                  <Bar
                    key={major}
                    dataKey={major}
                    fill={majorColors[major as keyof typeof majorColors] || `hsl(${index * 60}, 70%, 50%)`}
                    name={major}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography>Không có dữ liệu để hiển thị</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Thống kê theo trạng thái xử lý */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={12}>
          <Card>
            <CardHeader title='Thống kê số lượng xử lý học tập theo trạng thái và học kỳ' />
            <CardContent>
              {isLoadingStatus ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <Typography>Đang tải dữ liệu trạng thái...</Typography>
                </Box>
              ) : statusChartData.length > 0 ? (
                <ResponsiveContainer width='100%' height={400}>
                  <BarChart data={statusChartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='display' angle={-30} textAnchor='end' height={120} interval={0} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {availableStatuses.map((status, index) => (
                      <Bar
                        key={status}
                        dataKey={status}
                        stackId='status'
                        fill={generateStatusColors[status] || `hsl(${index * 137.5}, 70%, 50%)`}
                        name={status}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <Typography>Không có dữ liệu trạng thái để hiển thị</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid item xs={12} lg={4}>
          <Card>
            <CardHeader title='Tỷ lệ các trạng thái xử lý học tập' />
            <CardContent>
              {isLoadingStatus ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <Typography>Đang tải dữ liệu...</Typography>
                </Box>
              ) : statusPieDataWithPercentage.length > 0 ? (
                <>
                  <ResponsiveContainer width='100%' height={300}>
                    <PieChart>
                      <Pie
                        data={statusPieDataWithPercentage}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill='#8884d8'
                        dataKey='value'
                      >
                        {statusPieDataWithPercentage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ mt: 2 }}>
                    {statusPieDataWithPercentage.map((item, index) => (
                      <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            backgroundColor: pieColors[index % pieColors.length],
                            mr: 1,
                            borderRadius: '50%'
                          }}
                        />
                        <Typography variant='body2'>
                          {item.name}: {item.value.toLocaleString()} ({item.percentage}%)
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <Typography>Không có dữ liệu để hiển thị</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>

      {/* Thống kê chi tiết theo cố vấn học tập */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title='Thống kê số lượng XLHT của các CVHT theo học kỳ' />
        <CardContent>
          {isLoadingCVHT ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography>Đang tải dữ liệu CVHT...</Typography>
            </Box>
          ) : (
            <>
              <TanstackTable table={table} loading={isLoadingCVHT} minWidth={1000} />
              <TablePagination
                component={() => <TablePaginationComponent table={table as TableType<unknown>} />}
                count={table.getFilteredRowModel().rows.length}
                rowsPerPage={table.getState().pagination.pageSize}
                page={table.getState().pagination.pageIndex + 1}
                onPageChange={(_, page) => table.setPageIndex(page - 1)}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Tổng kết */}
      {/* {(data?.statistics || cvhtData?.statistics) && (
        <Card sx={{ mt: 3 }}>
          <CardHeader title='Tổng kết' />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 1 }}>
                  <Typography variant='h4'>
                    {data?.statistics ? data.statistics.reduce((sum, item) => sum + item.count, 0).toLocaleString() : 0}
                  </Typography>
                  <Typography variant='body2'>Tổng SV XLHT (theo học kỳ)</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.main', color: 'white', borderRadius: 1 }}>
                  <Typography variant='h4'>
                    {cvhtData?.statistics
                      ? cvhtData.statistics.reduce((sum, item) => sum + item.count, 0).toLocaleString()
                      : 0}
                  </Typography>
                  <Typography variant='body2'>Tổng SV XLHT (theo CVHT)</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.main', color: 'white', borderRadius: 1 }}>
                  <Typography variant='h4'>
                    {cvhtData?.statistics ? Array.from(new Set(cvhtData.statistics.map(item => item.cvht))).length : 0}
                  </Typography>
                  <Typography variant='body2'>Số CVHT</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.main', color: 'white', borderRadius: 1 }}>
                  <Typography variant='h4'>{selectedAcademicYear}</Typography>
                  <Typography variant='body2'>Năm học</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )} */}
    </Box>
  )
}
