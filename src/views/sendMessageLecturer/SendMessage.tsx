'use client'

import React, { useState, useRef, useEffect } from 'react'

import useSWR from 'swr'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  FormHelperText,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox
} from '@mui/material'

import JoditEditor from 'jodit-react'
import { toast } from 'react-toastify'

import * as v from 'valibot'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { useForm, Controller } from 'react-hook-form'

import { LoadingButton } from '@mui/lab'

import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import CustomTextField from '@/@core/components/mui/TextField'
import classService from '@/services/class.service'
import Iconify from '@/components/iconify'
import sendNotificateService from '@/services/sendNotificate.service'

const schema = v.object({
  email: v.pipe(v.array(v.string()), v.minLength(1, 'Vui lòng chọn người nhận')),
  subject: v.pipe(v.string(), v.minLength(1, 'Vui lòng nhập tiêu đề')),
  content: v.pipe(v.string(), v.minLength(1, 'Vui lòng nhập nội dung'))
})

type FormData = v.InferOutput<typeof schema>

export default function SendMessage() {
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [dialogSelected, setDialogSelected] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [allClasses, setAllClasses] = useState<any[]>([])
  const listboxRef = useRef<HTMLUListElement | null>(null)
  const scrollPositionRef = useRef<number>(0)

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: { email: [], subject: '', content: '' }
  })

  // Cấu hình cho Jodit Editor
  const joditConfig = { readonly: false, height: 300, placeholder: 'Nhập nội dung thông báo...' }

  // Lấy danh sách lớp của giảng viên
  const { isValidating: classesLoading } = useSWR(['classLecturerBCNK', page], () => classService.getAll(page, 10), {
    revalidateOnFocus: false,
    onSuccess: data => {
      setTotalPage(data.pagination.totalPages)

      if (page === 1) {
        setAllClasses(data.data)
      } else {
        setAllClasses(prev => [...prev, ...data.data])
      }
    }
  })

  // Khi chọn lớp, lấy danh sách sinh viên trong lớp
  const {
    data: students,
    isLoading: studentsLoading,
    isValidating: studentsValidating
  } = useSWR(
    selectedClass ? ['students', selectedClass.classId] : null,
    () => classService.getListStudentByClass(selectedClass.classId),
    { revalidateOnFocus: false }
  )

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget

    if (scrollTop + clientHeight >= scrollHeight - 5 && !classesLoading && page < totalPage) {
      // Lưu vị trí cuộn trước khi tải thêm
      scrollPositionRef.current = scrollTop
      setPage(prev => prev + 1)
    }
  }

  // Khôi phục vị trí cuộn sau khi cập nhật allClasses
  useEffect(() => {
    if (page > 1 && listboxRef.current) {
      listboxRef.current.scrollTop = scrollPositionRef.current
    }
  }, [allClasses, page])

  const onSubmit = handleSubmit(async data => {
    if (!selectedClass) {
      toast.error('Vui lòng chọn lớp')

      return
    }

    const toastId = toast.loading('Đang gửi thông báo...')

    await sendNotificateService.sendMailForStudent(
      data,
      () => {
        toast.update(toastId, {
          render: 'Gửi thông báo thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })

        setSelectedClass(null)
        reset()
        setIsLoading(false)
      },
      err => {
        toast.update(toastId, {
          render: err.message || 'Gửi thông báo thất bại',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })

        setIsLoading(false)
      }
    )
  })

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <CustomAutocomplete
                options={allClasses}
                getOptionLabel={option => option.classId}
                loading={classesLoading}
                fullWidth
                size='small'
                value={selectedClass}
                ListboxProps={{
                  onScroll: handleScroll,
                  ref: listboxRef
                }}
                onChange={(_, value) => setSelectedClass(value)}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Chọn lớp'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {classesLoading && <CircularProgress size={20} />}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => {
                  const displayValue = Array.isArray(field.value) ? field.value.join(', ') : ''

                  return (
                    <>
                      <CustomTextField
                        fullWidth
                        multiline
                        rows={2}
                        size='small'
                        label='Người nhận'
                        placeholder='Nhập email người nhận'
                        value={displayValue}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        onChange={e => {
                          const val = e.target.value

                          const arr = val
                            .split(',')
                            .map(item => item.trim())
                            .filter(item => item)

                          field.onChange(arr)
                        }}
                        InputProps={{
                          endAdornment: (
                            <Tooltip title='Lấy danh sách sinh viên'>
                              <IconButton
                                size='large'
                                onClick={() => {
                                  setDialogSelected(field.value || [])
                                  setDialogOpen(true)
                                }}
                                disabled={!selectedClass}
                              >
                                <Iconify icon='mdi:list-box-outline' style={{ color: '#00CAFF' }} />
                              </IconButton>
                            </Tooltip>
                          )
                        }}
                      />
                      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth='sm'>
                        <DialogTitle>Danh sách sinh viên lớp {selectedClass?.classId}</DialogTitle>
                        <DialogContent dividers sx={{ maxHeight: '500px', overflowY: 'auto', p: 0 }}>
                          {students?.length === 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                              <Typography>Không có sinh viên trong lớp</Typography>
                            </Box>
                          )}
                          {studentsLoading || studentsValidating ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                              <CircularProgress />
                            </Box>
                          ) : (
                            <List>
                              {students?.map(stu => (
                                <ListItem
                                  key={stu.mail}
                                  button
                                  onClick={() => {
                                    if (dialogSelected.includes(stu.mail)) {
                                      setDialogSelected(prev => prev.filter(e => e !== stu.mail))
                                    } else {
                                      setDialogSelected(prev => [...prev, stu.mail])
                                    }
                                  }}
                                >
                                  <ListItemIcon>
                                    <Checkbox checked={dialogSelected.includes(stu.mail)} />
                                  </ListItemIcon>
                                  <ListItemText primary={stu.userName} secondary={stu.mail} />
                                </ListItem>
                              ))}
                            </List>
                          )}
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
                          <Button
                            variant='contained'
                            onClick={() => {
                              field.onChange(dialogSelected)
                              setDialogOpen(false)
                            }}
                          >
                            Xác nhận
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='subject'
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    size='small'
                    label='Tiêu đề'
                    error={!!errors.subject}
                    helperText={errors.subject?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 1 }}>Nội dung</Typography>
                <Controller
                  name='content'
                  control={control}
                  render={({ field }) => (
                    <JoditEditor
                      value={field.value}
                      config={joditConfig}
                      onChange={(newContent: string) => field.onChange(newContent)}
                    />
                  )}
                />
                {errors.content && <FormHelperText error>{errors.content.message}</FormHelperText>}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}></Box>
        </CardContent>
        <CardActions>
          <Grid container spacing={2} direction='row' justifyContent='flex-end'>
            <Grid item>
              <Button
                variant='outlined'
                color='primary'
                onClick={() => {
                  setSelectedClass(null)
                  reset()
                }}
              >
                Nhập lại
              </Button>
            </Grid>
            <Grid item>
              <LoadingButton type='submit' variant='contained' color='primary' disabled={!isValid} loading={isLoading}>
                Gửi thông báo
              </LoadingButton>
            </Grid>
          </Grid>
        </CardActions>
      </form>
    </Card>
  )
}
