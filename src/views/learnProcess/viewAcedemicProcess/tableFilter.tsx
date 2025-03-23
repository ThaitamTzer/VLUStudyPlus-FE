import { CardContent, Checkbox, FormControlLabel, Grid, MenuItem } from '@mui/material'

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
        <Grid item container xs={12}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={e => {
                    setFilterField('status')
                    setFilterValue(e.target.checked)
                    setPage(1)
                  }}
                />
              }
              label='Chỉ hiển thị XLHV đã xử lý'
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={e => {
                    setFilterField('status')
                    setFilterValue(e.target.checked)
                    setPage(1)
                  }}
                />
              }
              label='Chỉ hiển thị sinh viên đã làm đơn'
            />
          </Grid>
        </Grid>
      </Grid>
    </CardContent>
  )
}
