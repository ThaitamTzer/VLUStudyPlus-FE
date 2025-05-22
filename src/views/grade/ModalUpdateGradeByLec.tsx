'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { Grid, Box, Button, CircularProgress, Typography, Chip, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import useSWR, { mutate } from 'swr'

import * as v from 'valibot'
import type { InferInput } from 'valibot'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { useForm, Controller } from 'react-hook-form'

import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import { CustomDialog } from '@/components/CustomDialog'
import { useGradeStore } from '@/stores/grade/grade.store'
import CustomTextField from '@/@core/components/mui/TextField'
import termService from '@/services/term.service'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import trainingProgramService from '@/services/trainingprogram.service'
import type { TrainingProgramByFrame } from '@/types/management/trainningProgramType'
import gradeService from '@/services/grade.service'

const termGradesSchema = v.object({
  term: v.pipe(v.string(), v.nonEmpty('Mã học kỳ không được để trống')),
  gradeOfSubject: v.pipe(
    v.array(
      v.object({
        subjectId: v.pipe(v.string(), v.nonEmpty('Mã môn học không được để trống')),
        grade: v.pipe(
          v.number('Điểm phải là số'),
          v.minValue(0, 'Điểm không được âm'),
          v.maxValue(10, 'Điểm không được lớn hơn 10')
        )
      })
    ),
    v.minLength(1, 'Không được để trống môn học và điểm')
  )
})

type GradeSchema = InferInput<typeof termGradesSchema>

export default function ModalUpdateGradeByLec() {
  const { openUpdateGradeDetail, toogleUpdateGradeDetail, termGrade, gradeDetail } = useGradeStore()

  const saveTermGrade = useMemo(() => {
    return termGrade
  }, [termGrade])

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [idTrainingProgram, setIdTrainingProgram] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [subjects, setSubjects] = useState<any[]>([])

  const [pageTrainingProgram, setPageTrainingProgram] = useState(1)

  const { data: trainingPrograms, isLoading: isLoadingTrainingPrograms } = useSWR(
    ['trainingPrograms', pageTrainingProgram, 10, '', '', ''],
    () => trainingProgramService.getAll(pageTrainingProgram, 10, '', '', ''),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true
    }
  )

  const processSubjects = useCallback((data: TrainingProgramByFrame[]) => {
    if (!data) return []

    const allSubjects = data?.flatMap((item: TrainingProgramByFrame) =>
      item.categories.flatMap((category: any) => category.subjects)
    )

    const allSubjectsFromCategoriesC3 = data?.flatMap((item: TrainingProgramByFrame) =>
      item.categories.flatMap((category: any) => category.categoriesC3?.flatMap((c3: any) => c3.subjects))
    )

    const processedSubjects = allSubjects?.map((subject: any) => ({
      ...subject,
      categoryName: subject.categoryName || 'Không có danh mục'
    }))

    const processedSubjectsFromCategoriesC3 = allSubjectsFromCategoriesC3?.map((subject: any) => ({
      ...subject,
      categoryName: subject.categoryName || 'Không có danh mục'
    }))

    return [...(processedSubjects || []), ...(processedSubjectsFromCategoriesC3 || [])]
  }, [])

  const handleGetIdTrainingProgram = useCallback(() => {
    if (gradeDetail && trainingPrograms?.data) {
      const cohortId = gradeDetail?.studentId.cohortId

      const idTrainingProgram = trainingPrograms?.data.find((item: any) => item.cohortId.cohortId === cohortId)?._id

      if (idTrainingProgram) {
        setIdTrainingProgram(idTrainingProgram)
      }
    }
  }, [gradeDetail, trainingPrograms])

  useEffect(() => {
    handleGetIdTrainingProgram()
  }, [handleGetIdTrainingProgram])

  const { data: terms, isLoading: isLoadingTerms } = useSWR(
    ['terms', page, 10, '', '', '', searchTerm],
    () => termService.getAll(page, 10, '', '', '', '', '', searchTerm),
    {
      onSuccess: data => {
        setTotal(data.pagination.totalItems)
      },
      revalidateOnFocus: false,
      revalidateOnMount: true
    }
  )

  const { isLoading: isLoadingTrainingProgram } = useSWR(
    idTrainingProgram ? ['trainingProgram', idTrainingProgram] : null,
    () => trainingProgramService.getTrainingProgramByFrame(idTrainingProgram),
    {
      onSuccess: data => {
        const processedSubjects = processSubjects(data)

        setSubjects(processedSubjects)
      },
      revalidateOnFocus: false,
      revalidateOnMount: true
    }
  )

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid }
  } = useForm<GradeSchema>({
    mode: 'all',
    resolver: valibotResolver(termGradesSchema),
    defaultValues: {
      term: termGrade?.term._id || '',
      gradeOfSubject:
        termGrade?.gradeOfSubject.map((subject: any) => ({
          subjectId: subject.subjectId || '',
          grade: subject.grade || 0
        })) || []
    }
  })

  useEffect(() => {
    if (idTrainingProgram) {
      trainingProgramService.getTrainingProgramByFrame(idTrainingProgram).then(res => {
        const processedSubjects = processSubjects(res)

        setSubjects(processedSubjects)
      })
    }
  }, [idTrainingProgram, processSubjects])

  // Sau đó, chỉ reset form khi đã có termGrade và subjects đã load xong
  useEffect(() => {
    if (saveTermGrade && subjects.length > 0) {
      reset({
        term: saveTermGrade?.term?._id || '',
        gradeOfSubject:
          saveTermGrade?.gradeOfSubject.map(subject => ({
            subjectId: subject.subjectId._id || '',
            grade: subject.grade || 0
          })) || []
      })
    }
  }, [saveTermGrade, subjects, reset])

  const gradeOfSubject = watch('gradeOfSubject')

  const handleClose = useCallback(() => {
    toogleUpdateGradeDetail()
    setSearchTerm('')
    setPage(1)
    setPageTrainingProgram(1)
    reset()
  }, [toogleUpdateGradeDetail, reset])

  const addSubject = () => {
    const currentSubjects = watch('gradeOfSubject')

    setValue('gradeOfSubject', [...currentSubjects, { subjectId: '', grade: 0 }])
  }

  const removeSubject = (index: number) => {
    const currentSubjects = watch('gradeOfSubject')
    const updatedSubjects = [...currentSubjects]

    updatedSubjects.splice(index, 1)
    setValue('gradeOfSubject', updatedSubjects)
  }

  const handleScroll = (event: React.SyntheticEvent) => {
    const listboxNode = event.currentTarget

    if (
      listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 1 &&
      !isLoadingTerms &&
      terms?.terms.length &&
      terms?.terms.length < total
    ) {
      setPage(prev => prev + 1)
    }
  }

  const onSubmit = handleSubmit(data => {
    const dataFormat = {
      termGrades: [
        {
          term: data.term,
          gradeOfSubject: data.gradeOfSubject
        }
      ]
    }

    const toastId = toast.loading('Đang cập nhật điểm...')

    setIsLoading(true)

    gradeService.updateGrade(
      gradeDetail?._id || '',
      termGrade?._id || '',
      dataFormat,
      () => {
        setIsLoading(false)
        toast.update(toastId, {
          render: 'Cập nhật điểm thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })

        mutate(`/api/grade/view-grade-detail-by-lec/${gradeDetail?._id}`)

        handleClose()
      },
      err => {
        setIsLoading(false)
        toast.update(toastId, {
          render: err?.message || 'Cập nhật điểm thất bại',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
      }
    )
  })

  return (
    <CustomDialog
      open={openUpdateGradeDetail}
      onClose={handleClose}
      title={`Cập nhật điểm cho ${gradeDetail?.studentId.userName}`}
      maxWidth='md'
      fullWidth
      onSubmit={onSubmit}
      actions={
        <>
          <Button variant='outlined' color='primary' onClick={handleClose}>
            Đóng
          </Button>
          <LoadingButton disabled={!isValid} loading={isLoading} type='submit' variant='contained' color='primary'>
            Lưu
          </LoadingButton>
        </>
      }
    >
      <Grid container spacing={3}>
        {(isLoadingTrainingPrograms || isLoadingTrainingProgram) && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant='h6'>Đang tải dữ liệu môn học...</Typography>
              <CircularProgress sx={{ ml: 2 }} />
            </Box>
          </Grid>
        )}
        {!isLoadingTrainingProgram && !isLoadingTrainingPrograms && (
          <>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='term'
                render={({ field }) => (
                  <CustomAutocomplete
                    {...field}
                    options={terms?.terms || []}
                    getOptionLabel={option => option.termName || ''}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderOption={(props, option) => (
                      <li {...props}>
                        {option.termName} -{' '}
                        <Chip
                          label={option.status}
                          size='small'
                          color={option.status === 'Đã kết thúc' ? 'success' : 'default'}
                        />
                      </li>
                    )}
                    onChange={(_, value) => {
                      if (value) {
                        field.onChange(value._id)
                      } else {
                        field.onChange('')
                      }
                    }}
                    value={terms?.terms.find(term => term._id === field.value) || null}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        label='Học kỳ'
                        {...(errors.term && {
                          error: true,
                          helperText: errors.term.message?.toString()
                        })}
                      />
                    )}
                    ListboxProps={{
                      onScroll: handleScroll
                    }}
                    loading={isLoadingTerms}
                    noOptionsText='Không tìm thấy học kỳ'
                    filterOptions={(options, state) => {
                      const filtered = options?.filter(option =>
                        option.termName.toLowerCase().includes(state.inputValue.toLowerCase())
                      )

                      return filtered
                    }}
                  />
                )}
              />
            </Grid>

            {gradeOfSubject.map((subject, index) => (
              <Grid item xs={12} key={index}>
                <Grid container spacing={2} alignItems='end'>
                  <Grid item xs={12} md={6}>
                    <Controller
                      control={control}
                      name={`gradeOfSubject.${index}.subjectId`}
                      render={({ field }) => (
                        <CustomAutocomplete
                          {...field}
                          options={subjects || []}
                          getOptionLabel={option => `${option.courseCode} - ${option.courseName}`}
                          onChange={(_, value) => {
                            if (value) {
                              field.onChange(value?._id || '')
                            } else {
                              field.onChange('')
                            }
                          }}
                          value={subjects?.find(subject => subject?._id === field.value) || null}
                          renderInput={params => <CustomTextField {...params} label='Môn học' />}
                          noOptionsText='Không tìm thấy môn học'
                          filterOptions={(options, state) => {
                            const searchTerm = state.inputValue.toLowerCase()

                            return (
                              options?.filter(
                                option =>
                                  option?.courseCode?.toLowerCase().includes(searchTerm) ||
                                  option?.courseName?.toLowerCase().includes(searchTerm)
                              ) || []
                            )
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      control={control}
                      name={`gradeOfSubject.${index}.grade`}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          {...(errors.gradeOfSubject?.[index]?.grade && {
                            error: true,
                            helperText: errors.gradeOfSubject?.[index]?.grade.message?.toString()
                          })}
                          type='number'
                          onChange={e => {
                            const value = e.target.value === '' ? '' : parseFloat(e.target.value)

                            if (value === '' || !isNaN(value)) {
                              field.onChange(value)
                            }
                          }}
                          value={field.value}
                          label='Điểm'
                          fullWidth
                          inputProps={{ min: 0, max: 10, step: 0.1 }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <IconButton color='error' onClick={() => removeSubject(index)} sx={{ mt: 1 }}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button variant='contained' onClick={addSubject} startIcon={<AddIcon />}>
                Thêm môn học
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </CustomDialog>
  )
}
