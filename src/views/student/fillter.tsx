'use client'
import { useRouter } from 'next/navigation'

import { CardContent, Grid, MenuItem } from '@mui/material'
import useSWR from 'swr'

import CustomTextField from '@/@core/components/mui/TextField'
import cohortService from '@/services/cohort.service'

type StudentFillerProps = {
  filterField: string
  filterValue: string
  page: number
  limit: number
  searchKey: string
}

export default function StudentFiller({ filterValue, searchKey }: StudentFillerProps) {
  const { data } = useSWR('cohortOption', cohortService.getAll)
  const router = useRouter()

  const onChangeFilterCohort = (e: React.ChangeEvent<HTMLInputElement>) => {
    const param = new URLSearchParams()

    param.append('filterField', 'cohortId')
    param.append('filterValue', e.target.value)

    if (searchKey) {
      param.append('searchKey', searchKey)
    }

    router.push(`?${param.toString()}`, {
      scroll: false
    })
  }

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <CustomTextField
            onChange={onChangeFilterCohort}
            value={filterValue}
            select
            label='Lọc theo niên khóa'
            fullWidth
            SelectProps={{
              displayEmpty: true
            }}
          >
            <MenuItem value=''>Tất cả</MenuItem>
            {data?.map(cohort => (
              <MenuItem key={cohort._id} value={cohort.cohortId}>
                {cohort.cohortId}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}
