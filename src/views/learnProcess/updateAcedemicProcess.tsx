'use client'
import { useEffect, useState } from 'react'

import { Button, Grid } from '@mui/material'
import type { KeyedMutator } from 'swr'
import * as v from 'valibot'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import CustomTextField from '@/@core/components/mui/TextField'
import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import learnProcessService from '@/services/learnProcess.service'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import { CustomDialog } from '@/components/CustomDialog'
import { useShare } from '@/hooks/useShare'

type UpdateAcedemicProcessProps = {
  mutate: KeyedMutator<any>
}

const schema = v.object({
  title: v.pipe(
    v.string(),
    v.nonEmpty('Tiêu đề xử lý không được để trống'),
    v.maxLength(255, 'Tiêu đề xử lý không được quá 255 ký tự')
  ),
  termId: v.pipe(v.string(), v.nonEmpty('Mã loại xử lý không được để trống'))
})

type UpdateAcedemicProcessForm = v.InferInput<typeof schema>

export default function UpdateAcedemicProcess(props: UpdateAcedemicProcessProps) {
  const { mutate } = props
  const [loading, setLoading] = useState<boolean>(false)
  const { termOptions } = useShare()

  const { openUpdateAcedemicProcess, toogleUpdateAcedemicProcess, acedemicProcess } = useAcedemicProcessStore()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpdateAcedemicProcessForm>({
    mode: 'all',
    resolver: valibotResolver(schema),
    defaultValues: {
      title: '',
      termId: ''
    }
  })

  useEffect(() => {
    if (acedemicProcess) {
      reset({
        title: acedemicProcess.title,
        termId: acedemicProcess.termId._id || ''
      })
    }
  }, [acedemicProcess, reset])

  const handleClose = () => {
    toogleUpdateAcedemicProcess()
    reset()
  }

  const onSubmit = handleSubmit(async data => {
    if (!acedemicProcess) return

    const toastID = toast.loading('Đang cập nhật...')

    setLoading(true)
    await learnProcessService.update(
      acedemicProcess?._id,
      data,
      () => {
        toast.update(toastID, {
          render: 'Cập nhật thành công',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
        setLoading(false)
        handleClose()
        mutate()
      },
      err => {
        toast.update(toastID, {
          render: err.message,
          type: 'error',
          isLoading: false,
          autoClose: 2000
        })
        setLoading(false)
      }
    )
  })

  return (
    <CustomDialog
      open={openUpdateAcedemicProcess}
      onClose={handleClose}
      title='Cập nhật kỳ xử lý học tập'
      onSubmit={onSubmit}
      canDrag
      maxWidth='sm'
      fullWidth
      actions={
        <>
          <Button variant='outlined' onClick={handleClose}>
            Hủy
          </Button>
          <LoadingButton loading={loading} type='submit' variant='contained'>
            Lưu
          </LoadingButton>
        </>
      }
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Controller
            control={control}
            name='termId'
            render={({ field }) => (
              <CustomAutocomplete
                {...field}
                options={termOptions.sort((b, a) => a.abbreviatName.localeCompare(b.abbreviatName)) || []}
                getOptionLabel={option => option.abbreviatName || ''}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderOption={(props, option) => <li {...props}>{option.abbreviatName}</li>}
                onChange={(_, value) => {
                  if (value) {
                    field.onChange(value._id)
                  } else {
                    field.onChange('')
                  }
                }}
                value={termOptions.find(term => term._id === field.value) || null}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Học kỳ'
                    {...(errors.termId && {
                      error: true,
                      helperText: errors.termId.message?.toString()
                    })}
                  />
                )}
                noOptionsText='Không tìm thấy học kỳ'
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='title'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Mã loại xử lý'
                {...(errors.title && { error: true, helperText: errors.title.message })}
              />
            )}
          />
        </Grid>
      </Grid>
    </CustomDialog>

    // <Dialog open={openUpdateAcedemicProcess} onClose={handleClose} fullWidth maxWidth='sm'>
    //   <form onSubmit={onSubmit} autoComplete='off'>
    //     <DialogTitle>
    //       <Typography variant='h4'>Cập nhật tiêu đề xử lý học tập</Typography>
    //       <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={handleClose}>
    //         <Iconify icon='mdi:close' />
    //       </IconButton>
    //     </DialogTitle>
    //     <DialogContent>
    //       <Grid container spacing={4}>
    //         <Grid item xs={12}>
    //           <Controller
    //             control={control}
    //             name='termId'
    //             render={({ field }) => (
    //               <CustomAutocomplete
    //                 {...field}
    //                 options={terms?.terms || []}
    //                 getOptionLabel={option => option.abbreviatName || ''}
    //                 isOptionEqualToValue={(option, value) => option._id === value._id}
    //                 renderOption={(props, option) => <li {...props}>{option.abbreviatName}</li>}
    //                 onChange={(_, value) => {
    //                   if (value) {
    //                     field.onChange(value._id)
    //                   } else {
    //                     field.onChange('')
    //                   }
    //                 }}
    //                 value={terms?.terms.find(term => term._id === field.value) || null}
    //                 renderInput={params => (
    //                   <CustomTextField
    //                     {...params}
    //                     label='Học kỳ'
    //                     {...(errors.termId && {
    //                       error: true,
    //                       helperText: errors.termId.message?.toString()
    //                     })}
    //                   />
    //                 )}
    //                 ListboxProps={{
    //                   onScroll: handleScroll
    //                 }}
    //                 loading={isLoadingTerms}
    //                 noOptionsText='Không tìm thấy học kỳ'
    //                 filterOptions={(options, state) => {
    //                   const filtered = options?.filter(option =>
    //                     option.termName.toLowerCase().includes(state.inputValue.toLowerCase())
    //                   )

    //                   return filtered
    //                 }}
    //               />
    //             )}
    //           />
    //         </Grid>
    //         <Grid item xs={12}>
    //           <Controller
    //             name='title'
    //             control={control}
    //             render={({ field }) => (
    //               <CustomTextField
    //                 {...field}
    //                 fullWidth
    //                 label='Mã loại xử lý'
    //                 {...(errors.title && { error: true, helperText: errors.title.message })}
    //               />
    //             )}
    //           />
    //         </Grid>
    //       </Grid>
    //     </DialogContent>
    //     <DialogActions>
    //       <Button variant='outlined' onClick={handleClose}>
    //         Hủy
    //       </Button>
    //       <LoadingButton loading={loading} type='submit' variant='contained'>
    //         Lưu
    //       </LoadingButton>
    //     </DialogActions>
    //   </form>
    // </Dialog>
  )
}
