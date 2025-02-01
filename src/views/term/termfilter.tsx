import { useRouter } from 'next/navigation'

import { CardContent, Grid, MenuItem } from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { fDate } from '@/utils/format-time'

type TermFilterProps = {
  academicYear: string
  startDate: string
  endDate: string
  limit: number
  filterField: string
  filterValue: string
  getTermYears: () => string[]
}

export default function TermFilter(props: TermFilterProps) {
  const { academicYear, startDate, endDate, limit, filterField, filterValue, getTermYears } = props

  const router = useRouter()

  const onChangeAcademicYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams()

    params.set('page', '1')
    params.set('limit', limit.toString())
    params.set('filterField', filterField)
    params.set('filterValue', filterValue)
    params.set('startDate', startDate)
    params.set('endDate', endDate)
    params.set('academicYear', e.target.value)
    router.push(`?${params.toString()}`)
  }

  const onChangeStartDate = (date: Date | null) => {
    const params = new URLSearchParams()

    params.set('page', '1')
    params.set('limit', limit.toString())
    params.set('filterField', filterField)
    params.set('filterValue', filterValue)
    params.set('startDate', date ? fDate(date.toISOString(), 'yyyy-MM-dd') : '')
    params.set('endDate', '')
    params.set('academicYear', academicYear)
    router.push(`?${params.toString()}`)
  }

  const onChangeEndDate = (date: Date | null) => {
    const params = new URLSearchParams()

    params.set('page', '1')
    params.set('limit', limit.toString())
    params.set('filterField', filterField)
    params.set('filterValue', filterValue)
    params.set('startDate', startDate)
    params.set('endDate', date ? fDate(date.toISOString(), 'yyyy-MM-dd') : '')
    params.set('academicYear', academicYear)
    router.push(`?${params.toString()}`)
  }

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='academicYear'
            label='Năm học'
            value={academicYear}
            onChange={onChangeAcademicYear}
            SelectProps={{
              displayEmpty: true,
              MenuProps: {
                PaperProps: {
                  sx: {
                    maxHeight: '300px'
                  }
                }
              }
            }}
          >
            <MenuItem value=''>Tất cả</MenuItem>
            {getTermYears()
              .reverse()
              .map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <AppReactDatepicker
            isClearable
            locale='vi'
            id='startDate'
            dateFormat='dd/MM/yyyy'
            showYearDropdown
            showMonthDropdown
            selected={startDate ? new Date(startDate) : null}
            onChange={onChangeStartDate}
            placeholderText='Ngày bắt đầu'
            customInput={<CustomTextField fullWidth label='Ngày bắt đầu' />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <AppReactDatepicker
            locale='vi'
            id='endDate'
            isClearable
            disabled={!startDate}
            showYearDropdown
            showMonthDropdown
            dateFormat='dd/MM/yyyy'
            selected={endDate ? new Date(endDate) : null}
            minDate={startDate ? new Date(startDate) : undefined}
            onChange={onChangeEndDate}
            placeholderText='Ngày kết thúc'
            customInput={<CustomTextField fullWidth label='Ngày kết thúc' />}
          />
        </Grid>
      </Grid>
    </CardContent>
  )
}
