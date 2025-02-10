'use client'

import { CardContent, Grid, MenuItem } from '@mui/material'

import useSWR from 'swr'

import CustomTextField from '@/@core/components/mui/TextField'

import termService from '@/services/term.service'

type StudentFillerProps = {
  filterField: string
  filterValue: string
}

export default function StudentFiller({ filterField, filterValue }: StudentFillerProps) {
  const { data } = useSWR('termOptions', () => termService.getAll(1, 9999, '', '', '', '', ''))

  console.log(filterValue)

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <CustomTextField select label='Lọc theo niên khóa' value={filterField} fullWidth>
            {data?.terms.map(term => (
              <MenuItem key={term._id} value={term._id}>
                {term.termName}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}
