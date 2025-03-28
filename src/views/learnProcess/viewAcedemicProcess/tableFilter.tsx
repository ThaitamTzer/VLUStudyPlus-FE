import { CardContent, Grid, MenuItem } from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField'
import { getAcademicYear } from '@/views/term/helper'
import type { Cohort } from '@/types/management/cohortType'

type TableFilterProps = {
  cohorOptions: Cohort[]
  setPage: any
  setFilterField: any
  setFilterValue: any
}

export default function TableFilter(props: TableFilterProps) {
  const { cohorOptions, setPage, setFilterField, setFilterValue } = props

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={3}>
          <CustomTextField
            select
            fullWidth
            defaultValue=''
            label='Lọc theo niên khóa'
            SelectProps={{
              displayEmpty: true,
              MenuProps: {
                sx: {
                  maxHeight: 300
                }
              }
            }}
            onChange={e => {
              setFilterField('cohortName')
              setFilterValue(e.target.value)
              setPage(1)
            }}
          >
            <MenuItem value=''>Tất cả</MenuItem>
            {cohorOptions?.map(option => (
              <MenuItem key={option._id} value={option.cohortId}>
                {option.cohortId}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomTextField
            select
            fullWidth
            defaultValue=''
            label='Lọc theo năm học'
            SelectProps={{
              displayEmpty: true,
              MenuProps: {
                sx: {
                  maxHeight: 300
                }
              }
            }}
            onChange={e => {
              setFilterField('year')
              setFilterValue(e.target.value)
              setPage(1)
            }}
          >
            <MenuItem value=''>Tất cả</MenuItem>
            {getAcademicYear()?.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomTextField
            select
            fullWidth
            defaultValue=''
            label='Lọc theo CVHT đã xử lý'
            onChange={e => {
              setFilterField('status')
              setFilterValue(e.target.value)
              setPage(1)
            }}
            SelectProps={{
              displayEmpty: true,
              MenuProps: {
                sx: {
                  maxHeight: 300
                }
              }
            }}
          >
            <MenuItem value=''>Tất cả</MenuItem>
            <MenuItem value='true'>Đã xử lý</MenuItem>
            <MenuItem value='false'>Chưa xử lý</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CustomTextField
            select
            fullWidth
            defaultValue=''
            label='Lọc theo trạng thái làm đơn'
            onChange={e => {
              setFilterField('commitment')
              setFilterValue(e.target.value)
              setPage(1)
            }}
            SelectProps={{
              displayEmpty: true,
              MenuProps: {
                sx: {
                  maxHeight: 300
                }
              }
            }}
          >
            <MenuItem value=''>Tất cả</MenuItem>
            <MenuItem value='true'>Đã làm đơn</MenuItem>
            <MenuItem value='false'>Chưa làm đơn</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}
