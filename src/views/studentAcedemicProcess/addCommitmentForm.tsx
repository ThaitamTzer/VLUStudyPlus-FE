'use client'

import { Grid, Button, FormControlLabel, Checkbox, Stack } from '@mui/material'
import type { Control, UseFormGetValues } from 'react-hook-form'
import { Controller, useFieldArray } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'

export default function AddCommitmentForm({
  control,
  errors,
  onSubmit,
  getValues
}: {
  control: Control<
    {
      debt: {
        term: string
        subjects: string[]
      }[]
      title: string
      processing: {
        term: string
        typeProcessing: string
      }[]
      phoneNumber: string
      phoneNumberParent: string
      averageScore: number
      credit: number
      numberOfViolations: number
      reason: string
      aspiration: string
      commitment: boolean
    },
    any
  >
  errors: any
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  getValues: UseFormGetValues<any>
}) {
  const {
    fields: processingFields,
    prepend: addProcessing,
    remove: removeProcessing
  } = useFieldArray({ control, name: 'processing' })

  const {
    fields: debtFields,
    append: addDebt,
    remove: removeDebt,
    update: updateDebt
  } = useFieldArray({ control, name: 'debt' })

  const handleAddDebt = () => {
    addDebt({ term: '', subjects: [''] })
  }

  const handleAddSubject = (index: number) => {
    // Lấy giá trị hiện tại của `term` và `subjects` từ form
    const currentTerm = getValues(`debt.${index}.term`)
    const currentSubjects = getValues(`debt.${index}.subjects`)

    // Thêm một môn học mới vào mảng subjects
    const newSubjects = [...currentSubjects, '']

    // Cập nhật lại debt với giá trị mới
    updateDebt(index, { term: currentTerm, subjects: newSubjects })
  }

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name='title'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Tiêu đề'
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name='phoneNumber'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Số điện thoại'
                fullWidth
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name='phoneNumberParent'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Số điện thoại phụ huynh'
                fullWidth
                error={!!errors.phoneNumberParent}
                helperText={errors.phoneNumberParent?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name='averageScore'
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <CustomTextField
                {...field}
                label='Điểm trung bình'
                type='number'
                fullWidth
                onChange={e => {
                  const newValue = e.target.value

                  onChange(newValue === '' ? 0 : Number(newValue))
                }}
                onFocus={e => e.target.select()}
                error={!!errors.averageScore}
                helperText={errors.averageScore?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name='credit'
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <CustomTextField
                {...field}
                label='Số tín chỉ'
                type='number'
                onChange={e => {
                  const newValue = e.target.value

                  onChange(newValue === '' ? 0 : Number(newValue))
                }}
                onFocus={e => e.target.select()}
                fullWidth
                error={!!errors.credit}
                helperText={errors.credit?.message}
              />
            )}
          />
        </Grid>
        {processingFields.map((item, index) => (
          <Grid container item xs={12} spacing={2} key={item.id}>
            <Grid item xs={3}>
              <Controller
                name={`processing.${index}.term`}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label='Học kỳ'
                    fullWidth
                    {...(errors.processing?.[index]?.term && {
                      error: true,
                      helperText: errors.processing?.[index]?.term.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={7}>
              <Controller
                name={`processing.${index}.typeProcessing`}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label='Loại xử lý'
                    fullWidth
                    {...(errors.processing?.[index]?.typeProcessing && {
                      error: true,
                      helperText: errors.processing?.[index]?.typeProcessing.message
                    })}
                  />
                )}
              />
            </Grid>
            {processingFields.length > 1 && (
              <Grid item xs={2}>
                <Button onClick={() => removeProcessing(index)} color='error'>
                  Xóa
                </Button>
              </Grid>
            )}
          </Grid>
        ))}
        <Button onClick={() => addProcessing({ term: '', typeProcessing: '' })}>Thêm trạng thái xử lý</Button>
        <Grid item xs={12}>
          <Controller
            name='numberOfViolations'
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <CustomTextField
                {...field}
                label='Số lần vi phạm'
                type='number'
                fullWidth
                onChange={e => {
                  const newValue = e.target.value

                  onChange(newValue === '' ? 0 : Number(newValue))
                }}
                onFocus={e => e.target.select()}
                error={!!errors.numberOfViolations}
                helperText={errors.numberOfViolations?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='reason'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Lý do học tập sa sút và bị xử lý học vụ'
                fullWidth
                multiline
                rows={3}
                error={!!errors.reason}
                helperText={errors.reason?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='aspiration'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label='Nguyện vọng và hướng khắc phục khó khăn của bản thân:'
                fullWidth
                multiline
                rows={3}
                error={!!errors.aspiration}
                helperText={errors.aspiration?.message}
              />
            )}
          />
        </Grid>
        <Grid item>Danh sách các học phần đang nợ và dự kiến kế hoạch trả nợ:</Grid>
        {debtFields.map((item, index) => (
          <Grid container item xs={12} spacing={2} key={item.id}>
            {/* Trường học kỳ */}
            <Grid item xs={3}>
              <Controller
                name={`debt.${index}.term`}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label='Học kỳ'
                    fullWidth
                    value={field.value || ''}
                    error={!!errors.debt?.[index]?.term}
                    helperText={errors.debt?.[index]?.term?.message}
                  />
                )}
              />
            </Grid>

            {/* Các trường môn học */}
            <Grid item xs={5}>
              {item.subjects.map((_, subjectIndex) => (
                <Stack key={subjectIndex} spacing={2} direction='row' alignItems='flex-start'>
                  <Controller
                    name={`debt.${index}.subjects.${subjectIndex}`}
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        label={`Môn học ${subjectIndex + 1}`}
                        fullWidth
                        value={field.value || ''} // Đảm bảo giá trị không bị undefined
                        error={!!errors.debt?.[index]?.subjects?.[subjectIndex]}
                        helperText={errors.debt?.[index]?.subjects?.[subjectIndex]?.message}
                      />
                    )}
                  />
                  {item.subjects.length > 1 && (
                    <Button
                      variant='outlined'
                      color='error'
                      sx={{ marginTop: '18px !important' }}
                      onClick={() => {
                        const currentSubjects = getValues(`debt.${index}.subjects`)
                        const newSubjects = currentSubjects.filter((_: any, i: any) => i !== subjectIndex)

                        updateDebt(index, { ...item, subjects: newSubjects })
                      }}
                    >
                      Xóa
                    </Button>
                  )}
                </Stack>
              ))}
              <Button onClick={() => handleAddSubject(index)}>Thêm môn học</Button>
            </Grid>

            {/* Nút xóa kỳ */}
            {debtFields.length > 1 && (
              <Grid item xs={1.5} alignSelf='flex-start' sx={{ marginTop: '18px !important' }}>
                <Button variant='outlined' onClick={() => removeDebt(index)} color='error'>
                  Xóa kỳ
                </Button>
              </Grid>
            )}
          </Grid>
        ))}
        <Button onClick={handleAddDebt}>Thêm học kỳ nợ</Button>
        <Grid item xs={12}>
          <Controller
            name='commitment'
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label={
                  <>
                    Cam kết cải thiện (
                    <strong className='text-primary'>
                      với việc cam kết cải thiện tình hình học tập và học vụ sinh viên hứa sẽ thực hiện đúng những điều
                      đã cam kết
                    </strong>
                    )
                  </>
                }
              />
            )}
          />
        </Grid>
      </Grid>
    </form>
  )
}
