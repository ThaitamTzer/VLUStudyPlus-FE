'use client'

import { Card, CardHeader, Grid } from '@mui/material'

import useSWR from 'swr'

import PageHeader from '@/components/page-header'
import classLecturerService from '@/services/classLecturer.service'

export default function ClassLecturerPage() {
  const { data } = useSWR('/api/class/view-list-class-of-CVHT', classLecturerService.getList)

  return (
    <>
      <PageHeader title='Danh sách lớp' />
      <Grid container spacing={5}>
        {data
          ? data.map(item => (
              <Grid item xs={4} key={item._id}>
                <Card key={item._id}>
                  <CardHeader>{item.classId}</CardHeader>
                </Card>
              </Grid>
            ))
          : null}
      </Grid>
    </>
  )
}
