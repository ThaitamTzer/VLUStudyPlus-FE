'use client'

import { useEffect, useState } from 'react'

import useSWR from 'swr'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import type { SxProps, Theme } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import type { ApexOptions } from 'apexcharts'

import classNames from 'classnames'

// Service Imports
import dashboardService from '@/services/dashboard.service'
import AppReactApexCharts from '@/libs/styles/AppReactApexCharts'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { useSettings } from '@/@core/hooks/useSettings'
import type { StatisticsProcessByTerm, StatisticsProcessOfCVHT } from '@/types/statisticsType'
import statisticsService from '@/services/statistics.service'
import { useShare } from '@/hooks/useShare'

// Types
type StudentCountByCohortType = {
  cohortId: string
  studentCount: number
}

type OnTimeGraduatedStudentCountByCohortType = {
  cohortId: string
  onTimeGraduatedCount: number
}

type DashboardStats = {
  studentCount: number
  lectureCount: number
  classCount: number
  academicProcessingCount: number
  gradeCount: number
  onTimeGraduatedStudentCount: number
  studentCountByCohort: StudentCountByCohortType[]
  onTimeGraduatedStudentCountByCohort: OnTimeGraduatedStudentCountByCohortType[]
  academicProcessingStatusDht: any
  academicProcessingStatusCht: any
  statisticsXLHTByTerm: StatisticsProcessByTerm
  getStatisticsByprocessOfCVHT: StatisticsProcessOfCVHT | null
}

export default function StatisticsPage() {
  const theme = useTheme()
  const { settings } = useSettings()
  const { termOptions } = useShare()

  const [selectedTerm, setSelectedTerm] = useState('')

  useEffect(() => {
    const today = new Date()

    const currentTerm = termOptions.find(term => {
      const startDate = new Date(term.startDate)
      const endDate = new Date(term.endDate)

      return today >= startDate && today <= endDate
    })

    setSelectedTerm(currentTerm?._id || '')
  }, [termOptions])

  // Định nghĩa các tông màu đa dạng
  const colorPalette = {
    // Xanh dương
    darkBlue: '#1565C0',
    blue: '#1976D2',
    lightBlue: '#42A5F5',
    skyBlue: '#64B5F6',
    paleBlue: '#90CAF9',
    navy: '#0D47A1',

    // Xanh lá cây
    darkGreen: '#2E7D32',
    green: '#4CAF50',
    lightGreen: '#66BB6A',

    // Cam/Vàng
    orange: '#FF9800',
    lightOrange: '#FFB74D',
    amber: '#FFC107',

    // Tím
    purple: '#9C27B0',
    lightPurple: '#BA68C8',

    // Đỏ
    red: '#F44336',
    lightRed: '#EF5350'
  }

  // Sử dụng useSWR để fetch và cache dữ liệu dashboard chính
  const {
    data: stats,
    error,
    isLoading
  } = useSWR<DashboardStats>(
    'dashboard-stats',
    async () => {
      // Gọi tất cả API song song để tối ưu hiệu suất (trừ API CVHT chậm)
      const [
        studentCount,
        lectureCount,
        classCount,
        academicProcessingCount,
        gradeCount,
        onTimeGraduatedStudentCount,
        studentCountByCohort,
        onTimeGraduatedStudentCountByCohort,
        academicProcessingStatusDht,
        academicProcessingStatusCht,
        statisticsXLHTByTerm
      ] = await Promise.all([
        dashboardService.studentCount(),
        dashboardService.lectureCount(),
        dashboardService.classCount(),
        dashboardService.academicProcessingCount(),
        dashboardService.gradeCount(),
        dashboardService.onTimeGraduatedStudentCount(),
        dashboardService.studentCountByCohort(),
        dashboardService.onTimeGraduatedStudentCountByCohort(),
        dashboardService.academicProcessingStatusDht(),
        dashboardService.academicProcessingStatusCht(),
        statisticsService.getStatistics()
      ])

      return {
        studentCount,
        lectureCount,
        classCount,
        academicProcessingCount,
        gradeCount,
        onTimeGraduatedStudentCount,
        studentCountByCohort,
        onTimeGraduatedStudentCountByCohort,
        academicProcessingStatusDht,
        academicProcessingStatusCht,
        statisticsXLHTByTerm,
        getStatisticsByprocessOfCVHT: null // Sẽ được cập nhật riêng
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 5 * 60 * 1000 // Refresh mỗi 5 phút
    }
  )

  // useSWR riêng để gọi API CVHT chậm
  const {
    data: cvhtStats,
    error: cvhtError,
    isLoading: cvhtLoading
  } = useSWR<StatisticsProcessOfCVHT>(
    ['cvht-stats', selectedTerm],
    () => statisticsService.getStatisticsByprocessOfCVHT('', '', selectedTerm),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 10 * 60 * 1000 // Refresh mỗi 10 phút do API chậm
    }
  )

  // Chuẩn bị dữ liệu cho bar chart (tốt nghiệp đúng hạn)
  const chartData = stats?.onTimeGraduatedStudentCountByCohort

  // const chartData = [
  //   {
  //     cohortId: 'K28',
  //     onTimeGraduatedCount: 80
  //   },
  //   {
  //     cohortId: 'K27',
  //     onTimeGraduatedCount: 106
  //   },
  //   {
  //     cohortId: 'K29',
  //     onTimeGraduatedCount: 80
  //   },
  //   {
  //     cohortId: 'K30',
  //     onTimeGraduatedCount: 70
  //   }
  // ].sort((a, b) => b.onTimeGraduatedCount - a.onTimeGraduatedCount)

  const series = [
    {
      name: 'SV tốt nghiệp đúng hạn',
      data: chartData?.map(item => ({
        x: `Khóa ${item.cohortId}`,
        y: item.onTimeGraduatedCount
      }))
    }
  ]

  // Chuẩn bị dữ liệu cho pie chart (sinh viên theo khóa)
  const pieChartData = stats?.studentCountByCohort.filter(item => item.studentCount > 0) || []

  const pieSeries = pieChartData.map(item => item.studentCount) || []

  const pieLabels = pieChartData.map(item => `Khóa ${item.cohortId}`)

  // Chuẩn bị dữ liệu cho stacked bar chart
  const stackedBarData = stats?.statisticsXLHTByTerm?.statistics || []

  // Lấy danh sách các học kỳ duy nhất (categories)
  const termCategories = [...new Set(stackedBarData.map(item => item.termAbbreviatName))].sort()

  // Lấy danh sách các ngành duy nhất (series)
  const majorNames = [...new Set(stackedBarData.map(item => item.majorName))]

  // Tạo series data cho từng ngành
  const stackedSeries = majorNames.map(majorName => ({
    name: majorName,
    data: termCategories.map(term => {
      const found = stackedBarData.find(item => item.termAbbreviatName === term && item.majorName === majorName)

      return found ? found.count : 0
    })
  }))

  // Chuẩn bị dữ liệu cho biểu đồ Top 10 CVHT
  const cvhtDataArray = cvhtStats?.statistics || []

  // Tính tổng số liệu cho mỗi CVHT
  const cvhtSummary = cvhtDataArray.reduce((acc: any, item: any) => {
    const cvht = item.cvht

    if (!acc[cvht]) {
      acc[cvht] = {
        cvht: cvht,
        countslxl: 0,
        countsslcxl: 0,
        count: 0
      }
    }

    acc[cvht].countslxl += item.countslxl
    acc[cvht].countsslcxl += item.countsslcxl
    acc[cvht].count += item.count

    return acc
  }, {})

  // Lấy top 10 CVHT theo tổng count và sắp xếp giảm dần
  const top10CVHT = Object.values(cvhtSummary)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10)

  // Tạo series cho biểu đồ CVHT horizontal stacked bar
  const cvhtSeries = [
    {
      name: 'Đã xử lý',
      data: top10CVHT.map((item: any) => item.countslxl)
    },
    {
      name: 'Chưa xử lý',
      data: top10CVHT.map((item: any) => item.countsslcxl)
    }
  ]

  const cvhtCategories = top10CVHT.map((item: any) => item.cvht)

  // Cấu hình cho biểu đồ CVHT horizontal stacked bar
  const cvhtBarOptions: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      type: 'bar',
      stacked: true
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
        borderRadius: 6,
        borderRadiusApplication: 'end',
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '12px',
              fontWeight: 700,
              color: colorPalette.darkBlue
            }
          }
        }
      }
    },
    colors: [
      colorPalette.blue, // Sinh viên loại xuống lớp
      colorPalette.orange // Sinh viên sắp sẽ loại xuống lớp
    ],
    grid: {
      strokeDashArray: 8,
      borderColor: 'var(--mui-palette-divider)',
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: false }
      },
      padding: {
        top: 0,
        left: 20,
        right: 20,
        bottom: 0
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'],
        fontSize: '11px',
        fontWeight: 600
      },
      formatter: function (val: number) {
        return val > 0 ? val.toString() : ''
      }
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: '14px'
      },
      y: {
        formatter: function (val: number) {
          return `${val} sinh viên`
        }
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      floating: false,
      fontSize: '12px',
      fontFamily: 'inherit',
      fontWeight: 500
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      labels: {
        style: {
          fontSize: '12px',
          colors: colorPalette.darkBlue,
          fontWeight: 500
        },
        formatter: function (val: string) {
          return val.toString()
        }
      },
      title: {
        text: 'Số lượng XLHT',
        style: {
          color: colorPalette.darkBlue,
          fontSize: '14px',
          fontWeight: 600
        }
      },
      categories: cvhtCategories
    },
    yaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      labels: {
        style: {
          fontSize: '11px',
          colors: colorPalette.darkBlue,
          fontWeight: 600
        },
        maxWidth: 200
      }
    }
  }

  // Cấu hình cho stacked bar chart
  const stackedBarOptions: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      type: 'bar',
      stacked: true
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 6,
        borderRadiusApplication: 'end',
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 900
            }
          }
        }
      }
    },
    colors: [
      colorPalette.blue,
      colorPalette.green,
      colorPalette.orange,
      colorPalette.purple,
      colorPalette.red,
      colorPalette.lightBlue
    ],
    grid: {
      strokeDashArray: 8,
      borderColor: 'var(--mui-palette-divider)',
      xaxis: {
        lines: { show: false }
      },
      yaxis: {
        lines: { show: true }
      },
      padding: {
        top: 0,
        left: 20,
        right: 20,
        bottom: 0
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'],
        fontSize: '12px',
        fontWeight: 600
      },
      formatter: function (val: number) {
        return val > 0 ? val.toString() : ''
      }
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: '14px'
      },
      y: {
        formatter: function (val: number) {
          return `${val} sinh viên`
        }
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      floating: false,
      fontSize: '12px',
      fontFamily: 'inherit',
      fontWeight: 500
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: termCategories,
      labels: {
        style: {
          fontSize: '12px',
          colors: colorPalette.darkBlue,
          fontWeight: 600
        }
      },
      title: {
        text: 'Học kỳ',
        style: {
          color: colorPalette.darkBlue,
          fontSize: '14px',
          fontWeight: 600
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: colorPalette.darkBlue,
          fontWeight: 500
        },
        formatter: function (val: number) {
          return val.toString()
        }
      },
      title: {
        text: 'Số lượng XLHT',
        style: {
          color: colorPalette.darkBlue,
          fontSize: '14px',
          fontWeight: 600
        }
      }
    }
  }

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      type: 'bar'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
        borderRadius: 8,
        borderRadiusApplication: 'end',
        dataLabels: {
          position: 'center',
          orientation: 'horizontal'
        }
      }
    },
    colors: [colorPalette.blue],
    grid: {
      strokeDashArray: 8,
      borderColor: 'var(--mui-palette-divider)',
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: false }
      },
      padding: {
        top: 0,
        left: 20,
        right: 20,
        bottom: 0
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: 0,
      offsetY: 0,
      textAnchor: 'middle',
      distributed: false,
      style: {
        colors: ['#fff'],
        fontWeight: 600,
        fontSize: '12px'
      },
      formatter: function (val: number) {
        return val + ' SV'
      }
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: '14px'
      },
      y: {
        formatter: function (val: number) {
          return val + ' sinh viên tốt nghiệp đúng hạn'
        }
      }
    },
    legend: {
      show: false
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.15
        }
      },
      active: {
        filter: {
          type: 'darken',
          value: 0.15
        }
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      labels: {
        style: {
          fontSize: '12px',
          colors: colorPalette.darkBlue,
          fontWeight: 500
        },
        formatter: function (val: string) {
          return val.toString()
        }
      },
      title: {
        text: 'Số lượng sinh viên',
        style: {
          color: colorPalette.darkBlue,
          fontSize: '14px',
          fontWeight: 600
        }
      }
    },
    yaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      labels: {
        style: {
          fontSize: '12px',
          colors: colorPalette.darkBlue,
          fontWeight: 600
        }
      }
    }
  }

  if (isLoading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='400px'
        sx={{
          background: `linear-gradient(135deg, ${colorPalette.lightBlue}20, ${colorPalette.skyBlue}20)`
        }}
      >
        <Box textAlign='center'>
          <CircularProgress size={60} thickness={4} sx={{ color: colorPalette.blue, mb: 2 }} />
          <Typography variant='h6' sx={{ color: colorPalette.darkBlue }}>
            Đang tải dữ liệu...
          </Typography>
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
        <Card sx={{ p: 4, borderLeft: `4px solid ${colorPalette.darkBlue}` }}>
          <Typography color={colorPalette.darkBlue} variant='h6'>
            {error}
          </Typography>
        </Card>
      </Box>
    )
  }

  if (!stats) {
    return null
  }

  function CardStatHorizontalCustom({
    stats,
    title,
    avatarColor,
    avatarSkin,
    avatarSize,
    avatarIcon,
    sx
  }: {
    stats: string
    title: string
    avatarColor: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
    avatarSkin: 'light' | 'light-static' | 'filled'
    avatarSize: number
    avatarIcon: string
    sx?: SxProps<Theme>
  }) {
    return (
      <Card className='bs-full' sx={sx}>
        <CardContent>
          <div className='flex items-center flex-wrap gap-1 justify-between'>
            <div className='flex flex-col gap-x-4 gap-y-0.5'>
              <Typography variant='h3' sx={{ fontWeight: 700 }}>
                {stats}
              </Typography>
              <Typography variant='h5' color={settings.mode === 'light' ? 'black' : 'white'}>
                {title}
              </Typography>
            </div>
            <CustomAvatar variant='rounded' color={avatarColor} skin={avatarSkin} size={avatarSize}>
              <i className={classNames(avatarIcon, 'text-[26px]')} />
            </CustomAvatar>
          </div>
        </CardContent>
      </Card>
    )
  }

  const CardStatsVerticalCustom = ({
    stats,
    title,
    subtitle,
    avatarIcon,
    avatarColor,
    avatarSize,
    avatarSkin,
    sx
  }: {
    stats: string
    title: string
    subtitle: string
    avatarIcon: string
    avatarColor: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
    avatarSkin: 'light' | 'light-static' | 'filled'
    avatarSize: number
    sx?: SxProps<Theme>
  }) => {
    return (
      <Card sx={sx}>
        <CardContent className='flex flex-col gap-y-3 items-start'>
          <CustomAvatar variant='rounded' skin={avatarSkin} size={avatarSize} color={avatarColor}>
            <i className={classNames(avatarIcon, 'text-[28px]')} />
          </CustomAvatar>
          <div className='flex flex-col gap-y-1'>
            <Typography variant='h5'>{title}</Typography>
            <Typography color='text.disabled'>{subtitle}</Typography>
            <Typography variant='h3' sx={{ fontWeight: 700 }}>
              {stats}
            </Typography>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.background.default}, ${colorPalette.paleBlue}10)`,
        minHeight: '100vh',
        pb: 4
      }}
    >
      <Grid container spacing={6}>
        {/* Main Statistics Cards với màu sắc đa dạng */}
        <Grid item xs={12} sm={6} md={3}>
          <CardStatHorizontalCustom
            stats={stats.studentCount.toLocaleString()}
            title='Sinh Viên'
            avatarIcon='tabler-users'
            avatarColor='primary'
            avatarSkin='light'
            avatarSize={42}
            sx={{
              borderBottom: `5px solid ${colorPalette.blue}`,
              background: theme =>
                theme.palette.mode === 'light' ? `${colorPalette.lightBlue}20` : `${colorPalette.blue}20`
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CardStatHorizontalCustom
            stats={stats.lectureCount.toLocaleString()}
            title='Giảng Viên'
            avatarIcon='tabler-user-check'
            avatarColor='success'
            avatarSkin='light'
            avatarSize={42}
            sx={{
              borderBottom: `5px solid ${colorPalette.green}`,
              background: theme =>
                theme.palette.mode === 'light' ? `${colorPalette.lightGreen}20` : `${colorPalette.green}20`
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CardStatHorizontalCustom
            stats={stats.classCount.toLocaleString()}
            title='Lớp Học'
            avatarIcon='tabler-school'
            avatarColor='warning'
            avatarSkin='light'
            avatarSize={42}
            sx={{
              borderBottom: `5px solid ${colorPalette.orange}`,
              background: theme =>
                theme.palette.mode === 'light' ? `${colorPalette.lightOrange}20` : `${colorPalette.orange}20`
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CardStatHorizontalCustom
            stats={stats.academicProcessingCount.toLocaleString()}
            title='Xử Lý Học Vụ'
            avatarIcon='tabler-clipboard-check'
            avatarColor='error'
            avatarSkin='light'
            avatarSize={42}
            sx={{
              borderBottom: `5px solid ${colorPalette.red}`,
              background: theme =>
                theme.palette.mode === 'light' ? `${colorPalette.lightRed}20` : `${colorPalette.red}20`
            }}
          />
        </Grid>

        {/* Additional Statistics với các tông màu xanh */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${colorPalette.lightBlue}20, ${colorPalette.blue}20)`,
              border: `2px solid ${colorPalette.lightBlue}40`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${colorPalette.lightBlue}30`,
                transition: 'all 0.3s ease'
              }
            }}
          >
            <CardStatsVerticalCustom
              stats={stats.gradeCount.toLocaleString()}
              title='Tổng sinh viên đã nhập điểm'
              subtitle='Số lượng bản ghi điểm'
              avatarIcon='tabler-chart-bar'
              avatarColor='primary'
              avatarSkin='light'
              avatarSize={42}
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${colorPalette.skyBlue}30, ${colorPalette.lightBlue}20)`,
              border: `2px solid ${colorPalette.skyBlue}40`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${colorPalette.skyBlue}30`,
                transition: 'all 0.3s ease'
              }
            }}
          >
            <CardStatsVerticalCustom
              stats={stats.onTimeGraduatedStudentCount.toLocaleString()}
              title='SV Tốt Nghiệp Đúng Hạn '
              subtitle='Tổng số sinh viên (Dự đoán)'
              avatarIcon='tabler-medal'
              avatarColor='info'
              avatarSkin='light'
              avatarSize={42}
            />
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${colorPalette.paleBlue}30, ${colorPalette.skyBlue}20)`,
              border: `2px solid ${colorPalette.blue}40`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${colorPalette.blue}30`,
                transition: 'all 0.3s ease'
              }
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center' mb={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colorPalette.blue}, ${colorPalette.darkBlue})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <Typography variant='h5' color='white'>
                    📈
                  </Typography>
                </Box>
                <Typography variant='h6' gutterBottom fontWeight='bold' sx={{ color: colorPalette.darkBlue }}>
                  Tình Trạng Xử Lý Học Vụ
                </Typography>
              </Box>
              <Box mt={2}>
                <Box mb={2}>
                  <Typography variant='body2' color='textSecondary' fontWeight='bold'>
                    Đã Hoàn Thành:
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{
                      color: colorPalette.blue,
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}
                  >
                    {JSON.stringify(stats.academicProcessingStatusDht)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='body2' color='textSecondary' fontWeight='bold'>
                    Chưa Hoàn Thành:
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{
                      color: colorPalette.lightBlue,
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}
                  >
                    {JSON.stringify(stats.academicProcessingStatusCht)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart - Sinh viên theo khóa */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${colorPalette.paleBlue}10, ${colorPalette.skyBlue}05)`,
              border: `2px solid ${colorPalette.lightBlue}30`,
              '&:hover': {
                boxShadow: `0 8px 25px ${colorPalette.lightBlue}20`,
                transition: 'all 0.3s ease'
              }
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center' mb={3}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colorPalette.blue}, ${colorPalette.lightBlue})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <Typography variant='h5' color='white'>
                    📊
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='h6' gutterBottom fontWeight='bold' sx={{ color: colorPalette.darkBlue }}>
                    SV Tốt Nghiệp Đúng Hạn Theo Khóa
                  </Typography>
                  <Typography variant='body2' sx={{ color: colorPalette.blue }}>
                    Số lượng dự đoán sinh viên tốt nghiệp đúng hạn theo từng khóa
                  </Typography>
                </Box>
              </Box>
              <AppReactApexCharts type='bar' height={350} width='100%' series={series as any} options={options} />
            </CardContent>
          </Card>
        </Grid>

        {/* On-time Graduated Students by Cohort */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${colorPalette.skyBlue}20, ${colorPalette.paleBlue}20)`,
              border: `2px solid ${colorPalette.lightBlue}30`,
              '&:hover': {
                boxShadow: `0 8px 25px ${colorPalette.lightBlue}20`,
                transition: 'all 0.3s ease'
              }
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center' mb={3}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colorPalette.lightBlue}, ${colorPalette.skyBlue})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <Typography variant='h5' color='white'>
                    🏆
                  </Typography>
                </Box>
                <Typography variant='h6' gutterBottom fontWeight='bold' sx={{ color: colorPalette.darkBlue }}>
                  Biểu Đồ Sinh Viên Theo Khóa
                </Typography>
              </Box>
              <Box mt={2}>
                <AppReactApexCharts
                  type='pie'
                  height={350}
                  width='100%'
                  series={pieSeries}
                  options={{
                    chart: {
                      parentHeightOffset: 0,
                      toolbar: { show: false }
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val: number) {
                        return `${val.toFixed(1)}%`
                      },
                      style: {
                        fontSize: '12px',
                        fontWeight: 600,
                        colors: ['#fff']
                      },
                      dropShadow: {
                        enabled: false
                      }
                    },
                    labels: pieLabels,
                    colors: [
                      colorPalette.lightGreen,
                      colorPalette.skyBlue,
                      colorPalette.lightOrange,
                      colorPalette.lightPurple,
                      colorPalette.lightBlue,
                      colorPalette.darkGreen
                    ],
                    legend: {
                      show: true,
                      position: 'right',
                      horizontalAlign: 'center',
                      floating: false,
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      fontWeight: 500,
                      formatter: function (seriesName: string, opts: any) {
                        return `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]} SV`
                      }
                    },
                    plotOptions: {
                      pie: {
                        expandOnClick: true,
                        dataLabels: {
                          offset: 0,
                          minAngleToShowLabel: 10
                        }
                      }
                    },
                    tooltip: {
                      enabled: true,
                      y: {
                        formatter: function (val: number) {
                          return `${val} sinh viên`
                        }
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Stacked Bar Chart - Thống kê XLHT theo học kỳ và ngành */}
        <Grid item xs={12}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${colorPalette.lightGreen}10, ${colorPalette.paleBlue}10)`,
              border: `2px solid ${colorPalette.green}30`,
              '&:hover': {
                boxShadow: `0 8px 25px ${colorPalette.green}20`,
                transition: 'all 0.3s ease'
              }
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center' mb={3}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colorPalette.green}, ${colorPalette.darkGreen})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <Typography variant='h5' color='white'>
                    📊
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='h6' gutterBottom fontWeight='bold' sx={{ color: colorPalette.darkGreen }}>
                    Thống Kê XLHT Theo Học Kỳ và Ngành
                  </Typography>
                  <Typography variant='body2' sx={{ color: colorPalette.green }}>
                    Số lượng sinh viên xử lý học tập theo từng học kỳ và ngành
                  </Typography>
                </Box>
              </Box>
              <AppReactApexCharts
                type='bar'
                height={400}
                width='100%'
                series={stackedSeries}
                options={stackedBarOptions}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Top 10 CVHT Chart - Biểu đồ Top 10 giảng viên CVHT */}
        <Grid item xs={12}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${colorPalette.lightRed}10, ${colorPalette.lightOrange}10)`,
              border: `2px solid ${colorPalette.red}30`,
              '&:hover': {
                boxShadow: `0 8px 25px ${colorPalette.red}20`,
                transition: 'all 0.3s ease'
              }
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center' justifyContent='space-between' mb={3}>
                <Box display='flex' alignItems='center'>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${colorPalette.red}, ${colorPalette.orange})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}
                  >
                    <Typography variant='h5' color='white'>
                      👨‍🏫
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant='h6' gutterBottom fontWeight='bold' sx={{ color: colorPalette.red }}>
                      Top CVHT Xử Lý Học Tập
                    </Typography>
                    <Typography variant='body2' sx={{ color: colorPalette.orange }}>
                      Thống kê sinh viên xử lý học tập theo từng CVHT
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ minWidth: 200 }}>
                  <FormControl fullWidth size='small'>
                    <InputLabel id='term-select-label' sx={{ color: colorPalette.red }}>
                      Chọn học kỳ
                    </InputLabel>
                    <Select
                      labelId='term-select-label'
                      value={selectedTerm}
                      label='Chọn học kỳ'
                      onChange={e => setSelectedTerm(e.target.value as string)}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300
                          }
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: colorPalette.red + '40'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: colorPalette.red
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: colorPalette.red
                        }
                      }}
                    >
                      <MenuItem value=''>
                        <em>Tất cả học kỳ</em>
                      </MenuItem>
                      {termOptions
                        .sort((b, a) => a.abbreviatName.localeCompare(b.abbreviatName))
                        .map(term => (
                          <MenuItem key={term._id} value={term._id}>
                            {term.abbreviatName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              {cvhtLoading ? (
                <Box display='flex' justifyContent='center' alignItems='center' height={400}>
                  <Box textAlign='center'>
                    <CircularProgress size={40} thickness={4} sx={{ color: colorPalette.red, mb: 2 }} />
                    <Typography variant='body2' sx={{ color: colorPalette.red }}>
                      Đang tải dữ liệu CVHT...
                    </Typography>
                  </Box>
                </Box>
              ) : cvhtError ? (
                <Box display='flex' justifyContent='center' alignItems='center' height={400}>
                  <Typography color={colorPalette.red} variant='body1'>
                    {cvhtError}
                  </Typography>
                </Box>
              ) : (
                <AppReactApexCharts type='bar' height={400} width='100%' series={cvhtSeries} options={cvhtBarOptions} />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
