'use client'

import { useCallback, useState } from 'react'

import { Grid, Box, Button, CircularProgress, Typography, Chip, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import type { KeyedMutator } from 'swr'
import useSWR from 'swr'

import * as v from 'valibot'
import type { InferInput } from 'valibot'

import { valibotResolver } from '@hookform/resolvers/valibot'

import { useForm, Controller } from 'react-hook-form'

import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import { useAuth } from '@/hooks/useAuth'

import { CustomDialog } from '@/components/CustomDialog'
import { useGradeStore } from '@/stores/grade/grade.store'
import CustomTextField from '@/@core/components/mui/TextField'
import termService from '@/services/term.service'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import trainingProgramService from '@/services/trainingprogram.service'
import type { TrainingProgramByFrame } from '@/types/management/trainningProgramType'
import gradeService from '@/services/grade.service'

const gradeSchema = v.object({
  termGrades: v.pipe(
    v.array(
      v.object({
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
    ),
    v.minLength(1, 'Không được để trống học kỳ và môn học')
  )
})

type GradeSchema = InferInput<typeof gradeSchema>

export default function ImportGradeModal({ mutate }: { mutate: KeyedMutator<any> }) {
  const { openImportGradeStudent, toogleImportGradeStudent } = useGradeStore()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTrainingProgram, setSearchTrainingProgram] = useState('')
  const [idTrainingProgram, setIdTrainingProgram] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [subjects, setSubjects] = useState<any[]>([])
  const { user } = useAuth()

  const [pageTrainingProgram, setPageTrainingProgram] = useState(1)
  const [totalTrainingProgram, setTotalTrainingProgram] = useState(0)

  const { data: terms, isLoading: isLoadingTerms } = useSWR(
    ['terms', page, 10, '', '', '', searchTerm],
    () => termService.getAll(page, 10, '', '', '', '', '', searchTerm),
    {
      onSuccess: data => {
        setTotal(data.pagination.totalItems)
      },
      revalidateOnMount: true
    }
  )

  const { data: trainingPrograms, isLoading: isLoadingTrainingPrograms } = useSWR(
    ['trainingProgramsStudentData', pageTrainingProgram, 10, '', '', searchTrainingProgram],
    () => trainingProgramService.getAll(pageTrainingProgram, 10, '', '', searchTrainingProgram),
    {
      onSuccess: data => {
        setTotalTrainingProgram(data.pagination.totalItems)
      },
      revalidateOnMount: true
    }
  )

  const { isLoading: isLoadingTrainingProgram } = useSWR(
    idTrainingProgram ? ['trainingProgramStudentData', idTrainingProgram] : null,
    () => trainingProgramService.getTrainingProgramByFrame(idTrainingProgram),
    {
      onSuccess: data => {
        const processedSubjects = processSubjects(data)

        setSubjects(processedSubjects)
      },
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
    resolver: valibotResolver(gradeSchema),
    defaultValues: {
      termGrades: []
    }
  })

  const termGrades = watch('termGrades')

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

  const handleClose = useCallback(() => {
    toogleImportGradeStudent()
    setSearchTerm('')
    setSearchTrainingProgram('')
    setPage(1)
    setPageTrainingProgram(1)
    setIdTrainingProgram('')
    reset()
  }, [toogleImportGradeStudent, reset])

  const addNewTerm = () => {
    const currentTermGrades = watch('termGrades')
    const newTermGrades = [...currentTermGrades, { term: '', gradeOfSubject: [] }]

    setValue('termGrades', newTermGrades)
  }

  const addSubjectToTerm = (termIndex: number) => {
    const currentTermGrades = watch('termGrades')
    const updatedTermGrades = [...currentTermGrades]

    updatedTermGrades[termIndex].gradeOfSubject.push({ subjectId: '', grade: 0 })
    setValue('termGrades', updatedTermGrades)
  }

  const removeSubjectFromTerm = (termIndex: number, subjectIndex: number) => {
    const currentTermGrades = watch('termGrades')
    const updatedTermGrades = [...currentTermGrades]

    updatedTermGrades[termIndex].gradeOfSubject.splice(subjectIndex, 1)
    setValue('termGrades', updatedTermGrades)
  }

  const removeTerm = (termIndex: number) => {
    const currentTermGrades = watch('termGrades')
    const updatedTermGrades = [...currentTermGrades]

    updatedTermGrades.splice(termIndex, 1)
    setValue('termGrades', updatedTermGrades)
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

  const handleScrollTrainingProgram = (event: React.SyntheticEvent) => {
    const listboxNode = event.currentTarget

    if (
      listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 1 &&
      !isLoadingTrainingPrograms &&
      trainingPrograms?.data.length &&
      trainingPrograms?.data.length < totalTrainingProgram
    ) {
      setPageTrainingProgram(prev => prev + 1)
    }
  }

  const handleChangeTrainingProgram = (event: React.SyntheticEvent, value: string) => {
    setIdTrainingProgram(value)
    reset()
    setPage(1)
    setPageTrainingProgram(1)
    setSearchTerm('')
    setSearchTrainingProgram('')
  }

  const handleTrainingProgramSearch = useCallback((event: React.SyntheticEvent, value: string) => {
    setSearchTrainingProgram(value)
    setPageTrainingProgram(1)
  }, [])

  const onSubmit = handleSubmit(data => {
    const toastId = toast.loading('Đang cập nhật điểm...')

    setIsLoading(true)

    gradeService.importGradeStudent(
      data,
      () => {
        setIsLoading(false)
        mutate()
        handleClose()
        toast.update(toastId, {
          render: 'Nhập điểm thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
      },
      err => {
        setIsLoading(false)
        toast.update(toastId, {
          render: err?.message || 'Nhập điểm thất bại',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
      }
    )
  })

  return (
    <CustomDialog
      open={openImportGradeStudent}
      onClose={handleClose}
      title={`Nhập điểm `}
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
        <Grid item xs={12}>
          <CustomAutocomplete
            options={trainingPrograms?.data || []}
            getOptionLabel={option => {
              if (option.cohortId.cohortId === user?.cohortId) {
                return `${option.title} - (Sinh viên thuộc ctdt này)`
              }

              return option.title
            }}
            onChange={(_, value) => handleChangeTrainingProgram(_, value?._id || '')}
            inputValue={searchTrainingProgram}
            noOptionsText='Không tìm thấy chương trình đào tạo'
            onInputChange={handleTrainingProgramSearch}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            ListboxProps={{
              onScroll: handleScrollTrainingProgram
            }}
            renderOption={(props, option) => (
              <li {...props}>
                {option.title} {option.cohortId.cohortId === user?.cohortId ? ' - Khuyến nghị' : ''}
              </li>
            )}
            loading={isLoadingTrainingPrograms}
            renderInput={params => (
              <CustomTextField
                placeholder='Chọn chương trình đào tạo sau đó tiến hành cập nhật'
                {...params}
                label='Chương trình đào tạo'
              />
            )}
          />
        </Grid>
        {isLoadingTrainingProgram && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant='h6'>Đang tải dữ liệu...</Typography>
              <CircularProgress />
            </Box>
          </Grid>
        )}
        {idTrainingProgram && !isLoadingTrainingProgram && (
          <>
            {termGrades.map((termGrade, termIndex) => (
              <Grid item xs={12} key={termIndex}>
                <Box sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        control={control}
                        name={`termGrades.${termIndex}.term`}
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
                                {...(errors.termGrades?.[termIndex]?.term && {
                                  error: true,
                                  helperText: errors.termGrades?.[termIndex]?.term.message?.toString()
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

                    {termGrade.gradeOfSubject.map((subject, subjectIndex) => (
                      <Grid item xs={12} key={subjectIndex}>
                        <Grid container spacing={2} alignItems='end'>
                          <Grid item xs={12} md={6}>
                            <Controller
                              control={control}
                              name={`termGrades.${termIndex}.gradeOfSubject.${subjectIndex}.subjectId`}
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
                              name={`termGrades.${termIndex}.gradeOfSubject.${subjectIndex}.grade`}
                              render={({ field }) => (
                                <CustomTextField
                                  {...field}
                                  {...(errors.termGrades?.[termIndex]?.gradeOfSubject?.[subjectIndex]?.grade && {
                                    error: true,
                                    helperText:
                                      errors.termGrades?.[termIndex]?.gradeOfSubject?.[
                                        subjectIndex
                                      ]?.grade.message?.toString()
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
                            <IconButton
                              color='error'
                              onClick={() => removeSubjectFromTerm(termIndex, subjectIndex)}
                              sx={{ mt: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant='outlined' onClick={() => addSubjectToTerm(termIndex)} startIcon={<AddIcon />}>
                          Thêm môn học
                        </Button>
                        <Button
                          variant='outlined'
                          color='error'
                          onClick={() => removeTerm(termIndex)}
                          startIcon={<DeleteIcon />}
                        >
                          Xóa học kỳ
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button variant='contained' onClick={addNewTerm} startIcon={<AddIcon />}>
                Thêm học kỳ mới
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </CustomDialog>
  )
}
