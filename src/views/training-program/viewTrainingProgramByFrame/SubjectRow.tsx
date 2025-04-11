'use client'
import { FormControl, IconButton, MenuItem, Select, Stack, TableCell, TextField, Tooltip } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import * as v from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { toast } from 'react-toastify'

import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

// import Iconify from '@/components/iconify'
import type { Subjects } from '@/types/management/trainningProgramType'
import StyledTableRow from '@/components/table/StyledTableRow'
import Iconify from '@/components/iconify'
import subjectServices from '@/services/subject.service'

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
}

const schema = v.object({
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
  isRequire: v.string(),
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

type SubjectForm = v.InferInput<typeof schema>

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
  idCate3
}) => {
  console.log('idCate1', idCate1)
  console.log('idCate2', idCate2)
  console.log('idCate3', idCate3)
  console.log('programId', programId)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<SubjectForm>({
    resolver: valibotResolver(schema),
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

  const onSubmit = handleSubmit(async data => {
    if (!programId) {
      toast.error('Không tìm thấy ID khung chương trình đào tạo')

      return
    }

    if (!categoryId) {
      toast.error('Không tìm thấy ID danh mục')

      return
    }

    const toastId = toast.loading('Đang thêm môn học...')

    try {
      // Xác định cấp độ danh mục và gọi API tương ứng
      if (categoryLevel === 1) {
        await subjectServices.createSubject(
          programId,
          idCate1,
          data,
          () => {
            toast.update(toastId, {
              render: 'Thêm môn học thành công',
              type: 'success',
              isLoading: false,
              autoClose: 2000
            })
            onSave?.(data)
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
      } else if (categoryLevel === 2) {
        await subjectServices.createSubject(
          programId,
          idCate2,
          data,
          () => {
            toast.update(toastId, {
              render: 'Thêm môn học thành công',
              type: 'success',
              isLoading: false,
              autoClose: 2000
            })
            onSave?.(data)
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
      } else if (categoryLevel === 3) {
        await subjectServices.createSubject(
          programId,
          idCate3,
          data,
          () => {
            toast.update(toastId, {
              render: 'Thêm môn học thành công',
              type: 'success',
              isLoading: false,
              autoClose: 2000
            })
            onSave?.(data)
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
      } else {
        toast.update(toastId, {
          render: 'Không xác định được cấp độ danh mục',
          type: 'error',
          isLoading: false,
          autoClose: 2000
        })
      }
    } catch (error) {
      toast.update(toastId, {
        render: 'Có lỗi xảy ra khi thêm môn học',
        type: 'error',
        isLoading: false,
        autoClose: 2000
      })
    }
  })

  if (isEditing) {
    return (
      <StyledTableRow>
        <TableCell sx={{ paddingLeft: `${level * 9}px` }}>
          <Stack direction='column' spacing={1}>
            <Controller
              name='courseCode'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  size='small'
                  placeholder='Mã môn học'
                  error={!!errors.courseCode}
                  helperText={errors.courseCode?.message}
                  sx={{ mb: 1 }}
                />
              )}
            />
            <Controller
              name='courseName'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  size='small'
                  placeholder='Tên môn học'
                  error={!!errors.courseName}
                  helperText={errors.courseName?.message}
                />
              )}
            />
          </Stack>
        </TableCell>
        <TableCell align='right'>
          <Controller
            name='credits'
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <TextField
                {...field}
                size='small'
                type='number'
                error={!!errors.credits}
                helperText={errors.credits?.message}
                fullWidth
                onChange={e => onChange(Number(e.target.value))}
              />
            )}
          />
        </TableCell>
        <TableCell align='right'>
          <Controller
            name='LT'
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <TextField
                {...field}
                size='small'
                type='number'
                error={!!errors.LT}
                helperText={errors.LT?.message}
                fullWidth
                onChange={e => onChange(Number(e.target.value))}
              />
            )}
          />
        </TableCell>
        <TableCell align='right'>
          <Controller
            name='TH'
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <TextField
                {...field}
                size='small'
                type='number'
                error={!!errors.TH}
                helperText={errors.TH?.message}
                fullWidth
                onChange={e => onChange(Number(e.target.value))}
              />
            )}
          />
        </TableCell>
        <TableCell align='right'>
          <Controller
            name='TT'
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <TextField
                {...field}
                size='small'
                type='number'
                error={!!errors.TT}
                helperText={errors.TT?.message}
                fullWidth
                onChange={e => onChange(Number(e.target.value))}
              />
            )}
          />
        </TableCell>
        <TableCell>
          <Controller
            name='isRequire'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size='small'>
                <Select {...field} error={!!errors.isRequire}>
                  <MenuItem value='true'>Bắt buộc</MenuItem>
                  <MenuItem value='false'>Tự chọn</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </TableCell>
        <TableCell width={150}>
          <Controller
            name='prerequisites'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size='small'
                error={!!errors.prerequisites}
                helperText={errors.prerequisites?.message}
                fullWidth
              />
            )}
          />
        </TableCell>
        <TableCell>
          <Controller
            name='preConditions'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size='small'
                error={!!errors.preConditions}
                helperText={errors.preConditions?.message}
                fullWidth
              />
            )}
          />
        </TableCell>
        <TableCell>
          <Controller
            name='implementationSemester'
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <TextField
                {...field}
                size='small'
                type='number'
                error={!!errors.implementationSemester}
                helperText={errors.implementationSemester?.message}
                fullWidth
                onChange={e => onChange(Number(e.target.value))}
              />
            )}
          />
        </TableCell>
        <TableCell>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <IconButton size='small' onClick={onSubmit} color='primary'>
              <SaveIcon fontSize='small' />
            </IconButton>
            <IconButton size='small' onClick={onCancel} color='error'>
              <CancelIcon fontSize='small' />
            </IconButton>
          </div>
        </TableCell>
      </StyledTableRow>
    )
  }

  return (
    <StyledTableRow>
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
            <IconButton size='small' color='primary'>
              <Iconify icon='eva:edit-fill' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Xóa môn học' arrow>
            <IconButton size='small' color='error'>
              <Iconify icon='eva:trash-2-outline' />
            </IconButton>
          </Tooltip>
        </div>
      </TableCell>
    </StyledTableRow>
  )
}

export default SubjectRow
