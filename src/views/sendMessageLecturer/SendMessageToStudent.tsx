'use client'

import React, { useState } from 'react'

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
  Checkbox,
  FormControlLabel
} from '@mui/material'

import JoditEditor from 'jodit-react'
import { toast } from 'react-toastify'

import * as v from 'valibot'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { useForm, Controller } from 'react-hook-form'

import { LoadingButton } from '@mui/lab'

import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import CustomTextField from '@/@core/components/mui/TextField'
import classLecturerService from '@/services/classLecturer.service'
import classStudentService from '@/services/classStudent.service'
import Iconify from '@/components/iconify'
import sendNotificateService from '@/services/sendNotificate.service'

const schema = v.object({
  email: v.pipe(v.string(), v.minLength(1, 'Vui lòng nhập email người nhận')),
  cc: v.optional(v.array(v.string())),
  subject: v.pipe(v.string(), v.minLength(1, 'Vui lòng nhập tiêu đề'))
})

type FormData = v.InferOutput<typeof schema>

export default function SendMessageToStudent() {
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [dialogSelected, setDialogSelected] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [enableCC, setEnableCC] = useState<boolean>(false)
  const [content, setContent] = useState<string>('')

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: { email: '', cc: [], subject: '' }
  })

  // Cấu hình cho Jodit Editor
  const joditConfig = { readonly: false, height: 300, placeholder: 'Nhập nội dung thông báo...' }

  // Lấy danh sách lớp của giảng viên
  const { data: classes = [], isValidating: classesLoading } = useSWR(
    'classLecturer',
    () => classLecturerService.getList(),
    { revalidateOnFocus: false }
  )

  // Khi chọn lớp, lấy danh sách sinh viên trong lớp
  const {
    data: students,
    isLoading: studentsLoading,
    isValidating: studentsValidating
  } = useSWR(
    selectedClass ? ['students', selectedClass.classId] : null,
    () => classStudentService.getListByClassCode(selectedClass.classId, 1, 100),
    { revalidateOnFocus: false }
  )

  const onSubmit = handleSubmit(async data => {
    if (!selectedClass) {
      toast.error('Vui lòng chọn lớp')

      return
    }

    // Chuyển đổi chuỗi email thành mảng
    const emailArray = data.email
      .split(',')
      .map(email => email.trim())
      .filter(email => email)

    const dataSend = {
      ...data,
      email: emailArray,
      cc: enableCC ? data.cc : [],
      content: content
    }

    const toastId = toast.loading('Đang gửi thông báo...')

    await sendNotificateService.sendMailForStudent(
      dataSend,
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
        setDialogSelected('')
        setContent('')
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
                options={classes}
                getOptionLabel={option => option.classId}
                loading={classesLoading}
                fullWidth
                size='small'
                value={selectedClass}
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
                  return (
                    <>
                      <CustomTextField
                        fullWidth
                        multiline
                        rows={2}
                        size='small'
                        label='Email người nhận (cách nhau bằng dấu phẩy)'
                        placeholder='Nhập email người nhận'
                        value={field.value}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        onChange={e => {
                          field.onChange(e.target.value)
                        }}
                        InputProps={{
                          endAdornment: (
                            <Tooltip title='Lấy danh sách sinh viên'>
                              <IconButton
                                size='large'
                                onClick={() => {
                                  if (selectedClass) {
                                    setDialogSelected(field.value || '')
                                    setDialogOpen(true)
                                  } else {
                                    toast.error('Vui lòng chọn lớp để lấy danh sách sinh viên', {
                                      autoClose: 3000
                                    })
                                  }
                                }}
                              >
                                <Iconify
                                  icon='mdi:list-box-outline'
                                  style={{ color: selectedClass ? '#00CAFF' : 'gray' }}
                                />
                              </IconButton>
                            </Tooltip>
                          )
                        }}
                      />
                      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth='sm'>
                        <DialogTitle>Danh sách sinh viên lớp {selectedClass?.classId}</DialogTitle>
                        <DialogContent dividers sx={{ maxHeight: '500px', overflowY: 'auto', p: 0 }}>
                          {studentsLoading || studentsValidating ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                              <CircularProgress />
                            </Box>
                          ) : (
                            <List>
                              {students?.students?.length && students?.students?.length > 0 ? (
                                <>
                                  {students?.students?.map(stu => {
                                    const selectedEmails = dialogSelected
                                      .split(',')
                                      .map(email => email.trim())
                                      .filter(email => email)

                                    const isSelected = selectedEmails.includes(stu.mail)

                                    return (
                                      <ListItem
                                        key={stu.mail}
                                        button
                                        onClick={() => {
                                          const currentEmails = dialogSelected
                                            .split(',')
                                            .map(email => email.trim())
                                            .filter(email => email)

                                          if (isSelected) {
                                            const newEmails = currentEmails.filter(email => email !== stu.mail)

                                            setDialogSelected(newEmails.join(', '))
                                          } else {
                                            const newEmails = [...currentEmails, stu.mail]

                                            setDialogSelected(newEmails.join(', '))
                                          }
                                        }}
                                      >
                                        <ListItemIcon>
                                          <Checkbox checked={isSelected} />
                                        </ListItemIcon>
                                        <ListItemText primary={stu.userName} secondary={stu.mail} />
                                      </ListItem>
                                    )
                                  })}
                                </>
                              ) : (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                  <Typography>Không có sinh viên trong lớp</Typography>
                                </Box>
                              )}
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
              <FormControlLabel
                control={<Checkbox checked={enableCC} onChange={() => setEnableCC(!enableCC)} />}
                label='Gửi bản sao cho người nhận'
              />
            </Grid>
            {enableCC && (
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name='cc'
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      size='small'
                      label='CC'
                      placeholder='Nhập email người nhận'
                      multiline
                      rows={2}
                    />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Controller
                control={control}
                name='subject'
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    value={field.value}
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
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
                <JoditEditor
                  value={content}
                  config={joditConfig}
                  onBlur={newContent => {
                    setContent(newContent)
                  }}
                />
                {(!content || content === '<p><br></p>') && (
                  <FormHelperText error>Vui lòng nhập nội dung</FormHelperText>
                )}
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
                  setDialogSelected('')
                  setContent('')
                }}
              >
                Nhập lại
              </Button>
            </Grid>
            <Grid item>
              <LoadingButton
                type='submit'
                variant='contained'
                color='primary'
                disabled={!isValid || !content || content === '<p><br></p>'}
                loading={isLoading}
              >
                Gửi thông báo
              </LoadingButton>
            </Grid>
          </Grid>
        </CardActions>
      </form>
    </Card>
  )
}
