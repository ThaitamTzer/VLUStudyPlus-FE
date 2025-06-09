'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import type { ApexOptions } from 'apexcharts'

import classNames from 'classnames'

// Service Imports
import dashboardService from '@/services/dashboard.service'
import AppReactApexCharts from '@/libs/styles/AppReactApexCharts'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { useSettings } from '@/@core/hooks/useSettings'
import type { StatisticsProcessByTerm } from '@/types/statisticsType'
import statisticsService from '@/services/statistics.service'

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
}

export default function StatisticsPage() {
  const theme = useTheme()
  const { settings } = useSettings()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Gọi tất cả API song song để tối ưu hiệu suất
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

        setStats({
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
        })
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu dashboard')
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Chuẩn bị dữ liệu cho bar chart
  const chartData =
    stats?.studentCountByCohort.filter(item => item.studentCount > 0).sort((a, b) => b.studentCount - a.studentCount) ||
    []

  const series = [
    {
      name: 'Số lượng sinh viên',
      data: chartData.map(item => ({
        x: `Khóa ${item.cohortId}`,
        y: item.studentCount
      }))
    }
  ]

  // Chuẩn bị dữ liệu cho pie chart (tốt nghiệp đúng hạn)
  // const pieChartData = stats?.onTimeGraduatedStudentCountByCohort.filter(item => item.onTimeGraduatedCount > 0) || []

  const pieChartData = [
    {
      cohortId: 'K28',
      onTimeGraduatedCount: 100
    },
    {
      cohortId: 'K26',
      onTimeGraduatedCount: 100
    },
    {
      cohortId: 'K29',
      onTimeGraduatedCount: 100
    },
    {
      cohortId: 'K31',
      onTimeGraduatedCount: 100
    },
    {
      cohortId: 'K21',
      onTimeGraduatedCount: 100
    }
  ]

  const pieSeries = pieChartData.map(item => item.onTimeGraduatedCount) || []

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
          return val + ' sinh viên'
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

  if (loading) {
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
            title='Tổng Sinh Viên'
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
            title='Tổng Giảng Viên'
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
            title='Tổng Lớp Học'
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
              title='SV Tốt Nghiệp Đúng Hạn'
              subtitle='Tổng số sinh viên'
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
                    Biểu Đồ Sinh Viên Theo Khóa
                  </Typography>
                  <Typography variant='body2' sx={{ color: colorPalette.blue }}>
                    Thống kê số lượng sinh viên các khóa có sinh viên
                  </Typography>
                </Box>
              </Box>
              <AppReactApexCharts type='bar' height={350} width='100%' series={series} options={options} />
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
                  SV Tốt Nghiệp Đúng Hạn Theo Khóa
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
                      colorPalette.green,
                      colorPalette.blue,
                      colorPalette.orange,
                      colorPalette.purple,
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
      </Grid>
    </Box>
  )
}
