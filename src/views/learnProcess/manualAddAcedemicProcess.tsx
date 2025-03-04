'use client'
import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  Grid,
  Popover,
  Stack,
  Switch,
  FormControlLabel,
  MenuItem
} from '@mui/material'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { LoadingButton } from '@mui/lab'

import type { InferInput } from 'valibot'

import { toast } from 'react-toastify'

import type { KeyedMutator } from 'swr'

import { useShare } from '@/hooks/useShare'
import Iconify from '@/components/iconify'
import { addAcedemicProcessSchema } from '@/schema/addAcedemicProcessSchema'
import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import CustomTextField from '@/@core/components/mui/TextField'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import { getAcademicYear } from '../term/helper'

import learnProcessService from '@/services/learnProcess.service'

type FormData = InferInput<typeof addAcedemicProcessSchema>

export default function ManualAddAcedemicProcess({
  mutate,
  open,
  onClose
}: {
  mutate: KeyedMutator<any>
  open: boolean
  onClose: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [anchorElCourse, setAnchorElCourse] = useState<null | HTMLElement>(null)

  const { studentOptions, termOptions, typeProcess } = useShare()
  const { acedemicProcess } = useAcedemicProcessStore()

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'all',
    resolver: valibotResolver(addAcedemicProcessSchema),
    defaultValues: {
      student: '',
      processing: [],
      handlingStatusByAAO: '',
      courseRegistration: [],
      DTBC: 0,
      STC: 0,
      DTBCTL: 0,
      STCTL: 0,
      reasonHandling: '',
      yearLevel: '',
      faculty: '',
      year: '',
      termName: '',
      note: ''
    }
  })

  const processingValues = watch('processing') // Theo dõi giá trị của processing
  const courseRegistrationValues = watch('courseRegistration')

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: 'processing'
  })

  const {
    fields: courseFields,
    prepend: prependCourse,
    remove: removeCourse
  } = useFieldArray({ control, name: 'courseRegistration' })

  const handleClose = () => {
    onClose()
    reset({
      student: '',
      processing: [],
      courseRegistration: [],
      handlingStatusByAAO: '',
      DTBC: 0,
      STC: 0,
      DTBCTL: 0,
      STCTL: 0,
      reasonHandling: '',
      yearLevel: '',
      faculty: '',
      year: '',
      termName: '',
      note: ''
    })
  }

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
  }

  const handleOpenPopoverCourse = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCourse(event.currentTarget)
  }

  const handleClosePopoverCourse = () => {
    setAnchorElCourse(null)
  }

  const onSubmit = handleSubmit(async data => {
    if (!acedemicProcess) return toast.error('Không tìm thấy thông tin xử lý học tập')

    const toastId = toast.loading('Đang thêm xử lý học tập...')
    const nameArray = data.student.userName.split(' ')
    const lastName = nameArray[nameArray.length - 1]
    const firstName = nameArray.slice(0, -1).join(' ')

    const { student, ...dataWithoutStudent } = data

    const newData = {
      ...dataWithoutStudent,
      academicCategory: acedemicProcess._id,
      studentId: student.userId,
      classId: student.classCode,
      cohortName: student.cohortId,
      lastName,
      firstName
    }

    console.log(newData)

    setLoading(true)
    await learnProcessService.addProcess(
      newData,
      () => {
        toast.update(toastId, {
          render: 'Thêm xử lý học tập thành công!',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
        mutate()
        setLoading(false)
      },
      err => {
        toast.update(toastId, {
          render: err.message,
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })

        if (err.message === 'Sinh viên đã bị xử lý học vụ trong đợt xử lý học vụ này') {
          setError('student', {
            type: 'manual',
            message: 'Sinh viên đã bị xử lý học vụ trong đợt xử lý học vụ này'
          })
        }

        setLoading(false)
      }
    )
  })

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <form onSubmit={onSubmit} autoComplete='off'>
        <DialogTitle>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Iconify icon='mdi:close' />
          </IconButton>
          <Typography
            variant='h4'
            sx={{
              textTransform: 'capitalize'
            }}
          >
            Thêm sinh viên vào {acedemicProcess?.title?.toLowerCase()}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Chọn Sinh Viên */}
            <Grid item xs={12} sm={4}>
              <Controller
                control={control}
                name='student'
                render={({ field: { onChange, value, ...field } }) => (
                  <CustomAutocomplete
                    {...field}
                    id='student'
                    options={studentOptions}
                    value={studentOptions.find(student => student._id === value?._id) || null}
                    onChange={(_, newValue) => onChange(newValue || {})}
                    getOptionLabel={option => option.userName}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        fullWidth
                        label='Sinh viên'
                        {...(errors.student && { error: true, helperText: errors.student.message?.toString() })}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                control={control}
                name='termName'
                render={({ field: { onChange, value, ...field } }) => (
                  <CustomAutocomplete
                    {...field}
                    id='termName'
                    fullWidth
                    options={termOptions}
                    value={termOptions.find(term => term.abbreviatName === value) || null}
                    onChange={(_, newValue) => onChange(newValue ? newValue.abbreviatName : '')}
                    getOptionLabel={option => option.abbreviatName}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        fullWidth
                        label='Học kỳ'
                        placeholder='VD: HK252'
                        {...(errors.termName && {
                          error: true,
                          helperText: errors.termName.message?.toString()
                        })}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                control={control}
                name='processing'
                render={() => (
                  <CustomTextField
                    fullWidth
                    label='Trạng thái xử lý và học kỳ'
                    value={
                      processingValues?.length
                        ? processingValues.map(f => `${f.statusHandling} - ${f.termName}`).join(', ')
                        : ''
                    }
                    onClick={handleOpenPopover}
                    InputProps={{
                      readOnly: true,
                      endAdornment: <Iconify icon='mdi:plus' />
                    }}
                    {...(errors.processing && { error: true, helperText: errors.processing.message?.toString() })}
                  />
                )}
              />

              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
              >
                <DialogContent
                  sx={{
                    minWidth: {
                      xs: 300,
                      sm: 590
                    },
                    padding: 2
                  }}
                >
                  {fields.map((item, index) => (
                    <Stack spacing={2} key={item.id} direction='row' alignItems='center'>
                      <Controller
                        control={control}
                        name={`processing.${index}.statusHandling`}
                        render={({ field: { value, onChange, ...field } }) => (
                          <CustomAutocomplete
                            {...field}
                            fullWidth
                            id='statusHandling'
                            options={typeProcess}
                            value={typeProcess.find(type => type.typeProcessingName === value) || null}
                            onChange={(_, newValue) => onChange(newValue ? newValue.typeProcessingName : '')}
                            getOptionLabel={option => option.typeProcessingName}
                            renderInput={params => (
                              <CustomTextField
                                {...params}
                                fullWidth
                                label='Trạng thái xử lý'
                                {...(errors.processing?.[index]?.statusHandling && {
                                  error: true,
                                  helperText: errors.processing?.[index]?.statusHandling?.message?.toString()
                                })}
                              />
                            )}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`processing.${index}.termName`}
                        render={({ field: { onChange, value, ...field } }) => (
                          <CustomAutocomplete
                            {...field}
                            id='termName'
                            fullWidth
                            options={termOptions}
                            value={termOptions.find(term => term.abbreviatName === value) || null}
                            onChange={(_, newValue) => onChange(newValue ? newValue.abbreviatName : '')}
                            getOptionLabel={option => option.abbreviatName}
                            renderInput={params => (
                              <CustomTextField
                                {...params}
                                fullWidth
                                label='Học kỳ'
                                {...(errors.processing?.[index]?.termName && {
                                  error: true,
                                  helperText: errors.processing?.[index]?.termName.message?.toString()
                                })}
                              />
                            )}
                          />
                        )}
                      />
                      <IconButton onClick={() => remove(index)} color='error'>
                        <Iconify icon='mdi:trash-can-outline' />
                      </IconButton>
                    </Stack>
                  ))}

                  <Button
                    fullWidth
                    variant='contained'
                    color='primary'
                    sx={{ mt: 2 }}
                    onClick={() => prepend({ statusHandling: '', termName: '' })}
                  >
                    Thêm trạng thái
                  </Button>
                </DialogContent>
              </Popover>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                control={control}
                name='courseRegistration'
                render={() => (
                  <CustomTextField
                    fullWidth
                    label='Đăng ký môn học'
                    value={courseRegistrationValues?.map(f => `${f.termName} - ${f.note}`).join(', ')}
                    onClick={handleOpenPopoverCourse}
                    InputProps={{ readOnly: true, endAdornment: <Iconify icon='mdi:plus' /> }}
                    {...(errors.courseRegistration && {
                      error: true,
                      helperText: errors.courseRegistration.message?.toString()
                    })}
                  />
                )}
              />
              <Popover
                open={Boolean(anchorElCourse)}
                anchorEl={anchorElCourse}
                onClose={handleClosePopoverCourse}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
              >
                <DialogContent
                  sx={{
                    minWidth: {
                      xs: 300,
                      sm: 600
                    },
                    padding: 2
                  }}
                >
                  {courseFields.map((item, index) => (
                    <Stack key={item.id} direction='row' spacing={2} alignItems='flex-start' mt={2}>
                      <Stack alignItems='center' sx={{ width: 1 }}>
                        <Controller
                          control={control}
                          name={`courseRegistration.${index}.isRegister`}
                          render={({ field }) => (
                            <FormControlLabel
                              label='Đã đăng ký'
                              labelPlacement='top'
                              control={
                                <Switch
                                  {...field}
                                  checked={field.value}
                                  onChange={e => field.onChange(e.target.checked)}
                                  {...(errors.courseRegistration?.[index]?.isRegister && {
                                    error: true,
                                    helperText: errors.courseRegistration?.[index]?.isRegister.message?.toString()
                                  })}
                                />
                              }
                            />
                          )}
                        />
                      </Stack>
                      <Controller
                        control={control}
                        name={`courseRegistration.${index}.termName`}
                        render={({ field }) => (
                          <CustomAutocomplete
                            {...field}
                            id='termName'
                            fullWidth
                            options={termOptions}
                            value={termOptions.find(term => term.abbreviatName === field.value) || null}
                            onChange={(_, newValue) => field.onChange(newValue ? newValue.abbreviatName : '')}
                            getOptionLabel={option => option.abbreviatName}
                            renderInput={params => (
                              <CustomTextField
                                {...params}
                                fullWidth
                                label='Học kỳ'
                                {...(errors.courseRegistration?.[index]?.termName && {
                                  error: true,
                                  helperText: errors.courseRegistration?.[index]?.termName.message?.toString()
                                })}
                              />
                            )}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`courseRegistration.${index}.note`}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='Lưu ý'
                            multiline
                            maxRows={5}
                            rows={5}
                            {...(errors.courseRegistration?.[index]?.note && {
                              error: true,
                              helperText: errors.courseRegistration?.[index]?.note.message?.toString()
                            })}
                          />
                        )}
                      />
                      <IconButton onClick={() => removeCourse(index)} color='error'>
                        <Iconify icon='mdi:trash-can-outline' />
                      </IconButton>
                    </Stack>
                  ))}
                  <Button
                    fullWidth
                    variant='contained'
                    color='primary'
                    sx={{ mt: 2 }}
                    onClick={() => prependCourse({ isRegister: false, termName: '', note: '' })}
                  >
                    Thêm lưu ý
                  </Button>
                </DialogContent>
              </Popover>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                control={control}
                name='handlingStatusByAAO'
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Diện XLHV (PĐT đề nghị)'
                    {...(errors.handlingStatusByAAO && {
                      error: true,
                      helperText: errors.handlingStatusByAAO.message?.toString()
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                control={control}
                name='DTBC'
                render={({ field: { onChange, value, ...field } }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    value={value === 0 ? '' : value}
                    onChange={e => {
                      const numericValue = e.target.value === '' ? 0 : Number(e.target.value)

                      onChange(numericValue)
                    }}
                    label='Điểm trung bình chung'
                    type='number'
                    {...(errors.DTBC && { error: true, helperText: errors.DTBC.message?.toString() })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                control={control}
                name='STC'
                render={({ field: { onChange, value, ...field } }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    value={value === 0 ? '' : value}
                    onChange={e => {
                      const numericValue = e.target.value === '' ? 0 : Number(e.target.value)

                      onChange(numericValue)
                    }}
                    label='Số tín chỉ'
                    type='number'
                    {...(errors.STC && { error: true, helperText: errors.STC.message?.toString() })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                control={control}
                name='DTBCTL'
                render={({ field: { onChange, value, ...field } }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    value={value === 0 ? '' : value}
                    onChange={e => {
                      const numericValue = e.target.value === '' ? 0 : Number(e.target.value)

                      onChange(numericValue)
                    }}
                    label='Điểm trung bình chung tích lũy'
                    type='number'
                    {...(errors.DTBCTL && { error: true, helperText: errors.DTBCTL.message?.toString() })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                control={control}
                name='STCTL'
                render={({ field: { onChange, value, ...field } }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    value={value === 0 ? '' : value}
                    onChange={e => {
                      const numericValue = e.target.value === '' ? 0 : Number(e.target.value)

                      onChange(numericValue)
                    }}
                    label='Số tín chỉ tích lũy'
                    type='number'
                    {...(errors.STCTL && { error: true, helperText: errors.STCTL.message?.toString() })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                control={control}
                name='yearLevel'
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Khóa'
                    placeholder='VD: Sinh viên năm 3'
                    {...(errors.yearLevel && {
                      error: true,
                      helperText: errors.yearLevel.message?.toString()
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                control={control}
                name='faculty'
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Khoa'
                    placeholder='VD: Khoa Công nghệ thông tin'
                    {...(errors.faculty && { error: true, helperText: errors.faculty.message?.toString() })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                control={control}
                name='year'
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    select
                    label='Năm học'
                    {...(errors.year && { error: true, helperText: errors.year.message?.toString() })}
                    SelectProps={{
                      displayEmpty: true,
                      MenuProps: {
                        sx: {
                          maxHeight: 300
                        }
                      }
                    }}
                  >
                    <MenuItem value='' disabled>
                      Chọn năm học
                    </MenuItem>
                    {getAcademicYear().map(year => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='reasonHandling'
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Lý do xử lý'
                    multiline
                    maxRows={3}
                    rows={3}
                    {...(errors.reasonHandling && {
                      error: true,
                      helperText: errors.reasonHandling.message?.toString()
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='note'
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Ghi chú'
                    multiline
                    maxRows={3}
                    rows={3}
                    {...(errors.note && { error: true, helperText: errors.note.message?.toString() })}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <LoadingButton loading={loading} type='submit' variant='contained'>
            Lưu
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
