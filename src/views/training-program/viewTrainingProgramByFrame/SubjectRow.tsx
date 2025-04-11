'use client'
import { useCallback, useEffect, useState } from 'react'

import { FormControl, IconButton, MenuItem, Select, Stack, TableCell, TextField, Tooltip } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import * as v from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { toast } from 'react-toastify'

import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

// import Iconify from '@/components/iconify'
import type { KeyedMutator } from 'swr'

import type { Subjects } from '@/types/management/trainningProgramType'
import Iconify from '@/components/iconify'
import subjectServices from '@/services/subject.service'
import { useTrainingProgramStore } from '@/stores/trainingProgram.store'
import AnimatedTableRow from './AnimatedTableRow'

// Tách schema validation ra riêng
const subjectSchema = v.object({
  courseCode: v.pipe(
    v.string(),
    v.nonEmpty('Mã môn học không được để trống'),
    v.maxLength(20, 'Mã môn học không được quá 20 ký tự')
  ),
  courseName: v.pipe(
    v.string(),
    v.nonEmpty('Tên môn học không được để trống'),
    v.maxLength(100, 'Tên môn học không được quá 100 ký tự')
  ),
  credits: v.pipe(
    v.number(),
    v.minValue(0, 'Số tín chỉ phải lớn hơn hoặc bằng 0'),
    v.maxValue(10, 'Số tín chỉ không được quá 10')
  ),
  LT: v.pipe(
    v.number(),
    v.minValue(0, 'Số giờ lý thuyết phải lớn hơn hoặc bằng 0'),
    v.maxValue(150, 'Số giờ lý thuyết không được quá 150')
  ),
  TH: v.pipe(
    v.number(),
    v.minValue(0, 'Số giờ thực hành phải lớn hơn hoặc bằng 0'),
    v.maxValue(150, 'Số giờ thực hành không được quá 150')
  ),
  TT: v.pipe(
    v.number(),
    v.minValue(0, 'Số giờ tự học phải lớn hơn hoặc bằng 0'),
    v.maxValue(150, 'Số giờ tự học không được quá 150')
  ),
  isRequire: v.any(),
  prerequisites: v.pipe(
    v.string(),
    v.nonEmpty('Điều kiện tiên quyết không được để trống'),
    v.maxLength(100, 'Điều kiện tiên quyết không được quá 100 ký tự')
  ),
  preConditions: v.pipe(
    v.string(),
    v.nonEmpty('Điều kiện tiên quyết không được để trống'),
    v.maxLength(255, 'Điều kiện tiên quyết không được quá 255 ký tự')
  ),
  implementationSemester: v.pipe(
    v.number(),
    v.minValue(1, 'Học kỳ thực hiện phải lớn hơn hoặc bằng 1'),
    v.maxValue(10, 'Học kỳ thực hiện không được quá 10')
  )
})

type SubjectForm = v.InferInput<typeof subjectSchema>

interface FormFieldProps {
  name: keyof SubjectForm
  control: any
  errors: any
  type?: 'text' | 'number'
  [key: string]: any
}

interface FormSelectProps {
  name: keyof SubjectForm
  control: any
  errors: any
  options: Array<{
    value: string
    label: string
  }>
}

// Tách component form field
const FormField: React.FC<FormFieldProps> = ({ name, control, errors, type = 'text', ...props }) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, ...field } }) => (
      <TextField
        {...field}
        {...props}
        size='small'
        type={type}
        error={!!errors[name]}
        helperText={errors[name]?.message}
        fullWidth
        onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      />
    )}
  />
)

// Tách component form select
const FormSelect: React.FC<FormSelectProps> = ({ name, control, errors, options }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormControl fullWidth size='small'>
        <Select {...field} error={!!errors[name]}>
          {options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )}
  />
)

interface SubjectRowProps {
  subject: Subjects
  level: number
  isEditing?: boolean
  onChange?: (field: keyof Subjects, value: any) => void
  onSave?: (data: any) => void
  onCancel?: () => void
  programId?: string
  categoryId?: string
  categoryLevel?: number
  idCate1: string
  idCate2: string
  idCate3: string
  mutate?: KeyedMutator<any>
}

// Hàm helper để so sánh và chỉ lấy dữ liệu đã thay đổi
const getChangedFields = (originalData: any, newData: any) => {
  const changedFields: Record<string, any> = {}

  Object.keys(newData).forEach(key => {
    // Kiểm tra nếu giá trị đã thay đổi
    if (JSON.stringify(originalData[key]) !== JSON.stringify(newData[key])) {
      changedFields[key] = newData[key]
    }
  })

  return changedFields
}

const SubjectRow: React.FC<SubjectRowProps> = ({
  subject,
  level,
  isEditing,
  onSave,
  onCancel,
  programId,
  categoryId,
  categoryLevel,
  idCate1,
  idCate2,
  idCate3,
  mutate
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SubjectForm>({
    resolver: valibotResolver(subjectSchema),
    mode: 'all',
    defaultValues: {
      courseCode: subject.courseCode,
      courseName: subject.courseName,
      credits: subject.credits,
      LT: subject.LT,
      TH: subject.TH,
      TT: subject.TT,
      isRequire: subject.isRequire,
      prerequisites: subject.prerequisites,
      preConditions: subject.preConditions,
      implementationSemester: Number(subject.implementationSemester)
    }
  })

  const { toogleOpenDeleteSubject, setSubject } = useTrainingProgramStore()

  const [isUpdating, setIsUpdating] = useState(false)

  // Giữ lại dữ liệu ban đầu của môn học để so sánh sau này
  const originalSubjectData = {
    courseCode: subject.courseCode,
    courseName: subject.courseName,
    credits: subject.credits,
    LT: subject.LT,
    TH: subject.TH,
    TT: subject.TT,
    isRequire: subject.isRequire,
    prerequisites: subject.prerequisites,
    preConditions: subject.preConditions,
    implementationSemester: Number(subject.implementationSemester)
  }

  useEffect(() => {
    reset({
      courseCode: subject.courseCode,
      courseName: subject.courseName,
      credits: subject.credits,
      LT: subject.LT,
      TH: subject.TH,
      TT: subject.TT,
      isRequire: subject.isRequire,
      prerequisites: subject.prerequisites,
      preConditions: subject.preConditions,
      implementationSemester: Number(subject.implementationSemester)
    })
  }, [subject, reset])

  const handleUpdate = () => setIsUpdating(true)
  const handleCancelUpdate = () => setIsUpdating(false)

  const handleApiCall = async (data: SubjectForm, isUpdate = false) => {
    const toastId = toast.loading(isUpdate ? 'Đang cập nhật môn học...' : 'Đang thêm môn học...')

    try {
      if (isUpdate) {
        if (!subject._id) {
          toast.error('Không tìm thấy ID môn học')

          return
        }

        await subjectServices.updateSubject(
          subject._id,
          data,
          () => {
            toast.update(toastId, {
              render: 'Cập nhật môn học thành công',
              type: 'success',
              isLoading: false,
              autoClose: 2000
            })
            setIsUpdating(false)
            onSave?.(data)
            mutate?.()
          },
          err => {
            toast.update(toastId, {
              render: err?.message || 'Có lỗi xảy ra khi cập nhật môn học',
              type: 'error',
              isLoading: false,
              autoClose: 2000
            })
          }
        )
      } else {
        if (!programId || !categoryId) {
          toast.error('Thiếu thông tin cần thiết')

          return
        }

        const categoryIdMap: Record<number, string> = {
          1: idCate1,
          2: idCate2,
          3: idCate3
        }

        const targetCategoryId = categoryIdMap[categoryLevel || 1]

        if (!targetCategoryId) {
          toast.error('Không xác định được cấp độ danh mục')

          return
        }

        await subjectServices.createSubject(
          programId,
          targetCategoryId,
          data,
          () => {
            toast.update(toastId, {
              render: 'Thêm môn học thành công',
              type: 'success',
              isLoading: false,
              autoClose: 2000
            })
            onSave?.(data)
            mutate?.()
          },
          err => {
            toast.update(toastId, {
              render: err?.message || 'Có lỗi xảy ra khi thêm môn học',
              type: 'error',
              isLoading: false,
              autoClose: 2000
            })
          }
        )
      }
    } catch (error) {
      toast.update(toastId, {
        render: `Có lỗi xảy ra khi ${isUpdate ? 'cập nhật' : 'thêm'} môn học`,
        type: 'error',
        isLoading: false,
        autoClose: 2000
      })
    }
  }

  const onSubmit = handleSubmit(data => handleApiCall(data))

  const handleUpdateSubmit = handleSubmit(async data => {
    if (!subject._id) {
      toast.error('Không tìm thấy ID môn học')

      return
    }

    // Lọc ra chỉ các trường đã thay đổi
    const changedFields = getChangedFields(originalSubjectData, data)

    // Kiểm tra nếu không có trường nào được thay đổi
    if (Object.keys(changedFields).length === 0) {
      toast.info('Không có thông tin nào được thay đổi')
      setIsUpdating(false)

      return
    }

    const toastId = toast.loading('Đang cập nhật môn học...')

    try {
      await subjectServices.updateSubject(
        subject._id,
        changedFields, // Chỉ gửi các trường đã thay đổi
        () => {
          toast.update(toastId, {
            render: 'Cập nhật môn học thành công',
            type: 'success',
            isLoading: false,
            autoClose: 2000
          })
          setIsUpdating(false)
          onSave?.(data)
          mutate?.()
        },
        err => {
          toast.update(toastId, {
            render: err?.message || 'Có lỗi xảy ra khi cập nhật môn học',
            type: 'error',
            isLoading: false,
            autoClose: 2000
          })
        }
      )
    } catch (error) {
      toast.update(toastId, {
        render: 'Có lỗi xảy ra khi cập nhật môn học',
        type: 'error',
        isLoading: false,
        autoClose: 2000
      })
    }
  })

  const handleDelete = useCallback(
    (subject: Subjects) => {
      setSubject(subject)
      toogleOpenDeleteSubject()
    },
    [toogleOpenDeleteSubject, setSubject]
  )

  const renderFormFields = () => (
    <>
      <TableCell sx={{ paddingLeft: `${level * 9}px` }}>
        <Stack direction='column' spacing={1}>
          <FormField name='courseCode' control={control} errors={errors} placeholder='Mã môn học' sx={{ mb: 1 }} />
          <FormField name='courseName' control={control} errors={errors} placeholder='Tên môn học' />
        </Stack>
      </TableCell>
      <TableCell align='right'>
        <FormField name='credits' control={control} errors={errors} type='number' />
      </TableCell>
      <TableCell align='right'>
        <FormField name='LT' control={control} errors={errors} type='number' />
      </TableCell>
      <TableCell align='right'>
        <FormField name='TH' control={control} errors={errors} type='number' />
      </TableCell>
      <TableCell align='right'>
        <FormField name='TT' control={control} errors={errors} type='number' />
      </TableCell>
      <TableCell>
        <FormSelect
          name='isRequire'
          control={control}
          errors={errors}
          options={[
            { value: 'true', label: 'Bắt buộc' },
            { value: 'false', label: 'Tự chọn' }
          ]}
        />
      </TableCell>
      <TableCell width={150}>
        <FormField name='prerequisites' control={control} errors={errors} />
      </TableCell>
      <TableCell>
        <FormField name='preConditions' control={control} errors={errors} multiline rows={2} />
      </TableCell>
      <TableCell>
        <FormField name='implementationSemester' control={control} errors={errors} type='number' />
      </TableCell>
    </>
  )

  const renderActionButtons = (onSubmit: (() => void) | undefined, onCancel: (() => void) | undefined) => (
    <TableCell>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
        <IconButton size='small' onClick={() => onSubmit?.()} color='primary'>
          <SaveIcon fontSize='small' />
        </IconButton>
        <IconButton size='small' onClick={() => onCancel?.()} color='error'>
          <CancelIcon fontSize='small' />
        </IconButton>
      </div>
    </TableCell>
  )

  if (isEditing) {
    return (
      <AnimatedTableRow isEditing>
        {renderFormFields()}
        {renderActionButtons(onSubmit, onCancel)}
      </AnimatedTableRow>
    )
  }

  if (isUpdating) {
    return (
      <AnimatedTableRow isEditing>
        {renderFormFields()}
        {renderActionButtons(handleUpdateSubmit, handleCancelUpdate)}
      </AnimatedTableRow>
    )
  }

  return (
    <AnimatedTableRow>
      <TableCell sx={{ paddingLeft: `${level * 9}px` }}>
        <Stack direction='row' spacing={1} alignItems='center'>
          <span>
            {subject.courseCode} - {subject.courseName}
          </span>
        </Stack>
      </TableCell>
      <TableCell align='right'>{subject.credits}</TableCell>
      <TableCell align='right'>{subject.LT}</TableCell>
      <TableCell align='right'>{subject.TH}</TableCell>
      <TableCell align='right'>{subject.TT}</TableCell>
      <TableCell>{subject.isRequire ? 'Bắt buộc' : 'Tự chọn'}</TableCell>
      <TableCell>{subject.prerequisites}</TableCell>
      <TableCell>{subject.preConditions}</TableCell>
      <TableCell>{subject.implementationSemester}</TableCell>
      <TableCell>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title='Cập nhật môn học' arrow>
            <IconButton size='small' color='primary' onClick={handleUpdate}>
              <Iconify icon='eva:edit-fill' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Xóa môn học' arrow>
            <IconButton size='small' color='error' onClick={() => handleDelete(subject)}>
              <Iconify icon='eva:trash-2-outline' />
            </IconButton>
          </Tooltip>
        </div>
      </TableCell>
    </AnimatedTableRow>
  )
}

export default SubjectRow
