'use client'
import { useEffect } from 'react'

import { Dialog, DialogContent, DialogTitle, Typography, IconButton, Grid } from '@mui/material'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { InferInput } from 'valibot'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'

import { useMajorStore } from '@/stores/major/major'
import Iconify from '@/components/iconify'
import { schema } from '@/schema/majorSchema'
import majorService from '@/services/major.service'
import AddConcentration from './addConcentration'
import { MajorInfo, ConcentrationList } from './components'

type FormData = InferInput<typeof schema>

export default function ViewMajor() {
  const { openViewMajor, toogleViewMajor, major, toogleAddConcentration } = useMajorStore()

  const {
    data: concentrations,
    isLoading,
    mutate
  } = useSWR(major ? `/api/major/view-list-concentration/${major._id}` : null, () =>
    majorService.getConcerntrationByMajor(major?._id || '')
  )

  const {
    control,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      majorName: ''
    }
  })

  useEffect(() => {
    if (major) {
      reset(major)
    }
  }, [major, reset])

  const handleClose = () => {
    toogleViewMajor()
    reset()
  }

  const handleAddConcentration = () => {
    toogleAddConcentration()
  }

  const handleUpdate = () => {
    mutate()
  }

  return (
    <>
      <Dialog open={openViewMajor} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogTitle>
          <Typography variant='h4'>Chi tiết ngành</Typography>
        </DialogTitle>
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8
          }}
          onClick={handleClose}
        >
          <Iconify icon='material-symbols:close-rounded' />
        </IconButton>
        <DialogContent>
          <Grid container spacing={4}>
            <MajorInfo control={control} errors={errors} />

            <ConcentrationList
              concentrations={concentrations || []}
              isLoading={isLoading}
              onAddConcentration={handleAddConcentration}
              onUpdate={handleUpdate}
            />
          </Grid>
        </DialogContent>
      </Dialog>
      <AddConcentration />
    </>
  )
}
