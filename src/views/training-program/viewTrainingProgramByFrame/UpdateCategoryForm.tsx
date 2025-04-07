import { useCallback, useState } from 'react'

import * as v from 'valibot'
import type { InferInput } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { IconButton, TableCell, TableRow } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import { Controller, useForm } from 'react-hook-form'
import type { KeyedMutator } from 'swr'
import { toast } from 'react-toastify'

import type { Categories } from '@/types/management/trainningProgramType'
import { useSettings } from '@/@core/hooks/useSettings'
import trainingProgramService from '@/services/trainingprogram.service'
import CustomTextField from '@/@core/components/mui/TextField'

const schema = v.object({
  titleN: v.pipe(v.string(), v.trim(), v.nonEmpty('Số TT danh mục không được để trống')),
  titleV: v.pipe(v.string(), v.trim(), v.nonEmpty('Tên danh mục không được để trống')),
  credits: v.pipe(v.number(), v.minValue(1, 'Số tín chỉ không được nhỏ hơn 0'))
})

type CategoryForm = InferInput<typeof schema>

interface UpdateCategoryFormProps {
  category: Categories
  level: number
  onCancel: () => void
  mutate: KeyedMutator<any>
  idCate1: string
  idCate2?: string
  idCate3?: string
}

const UpdateCategoryForm: React.FC<UpdateCategoryFormProps> = ({
  category,
  level,
  onCancel,
  mutate,
  idCate1,
  idCate2,
  idCate3
}) => {
  const { settings } = useSettings()
  const [loading, setLoading] = useState<boolean>(false)

  console.log(idCate1, idCate2, idCate3)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CategoryForm>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      titleN: category.titleN,
      titleV: category.titleV,
      credits: category.credits
    }
  })

  const onSubmit = useCallback(
    async (data: any) => {
      if (!idCate1) return toast.error('Không tìm thấy id khung chương trình')

      setLoading(true)
      const toastID = toast.loading('Đang cập nhật danh mục...')

      try {
        if (level === 1) {
          await trainingProgramService.updateCategory1(
            idCate1,
            data,
            () => {
              toast.update(toastID, {
                render: 'Cập nhật danh mục thành công',
                type: 'success',
                isLoading: false,
                autoClose: 2000
              })
              onCancel()
              mutate()
            },
            err => {
              toast.update(toastID, {
                render: err?.message || 'Có lỗi xảy ra',
                type: 'error',
                isLoading: false,
                autoClose: 2000
              })
              setLoading(false)
            }
          )
        } else if (level === 2 && idCate2) {
          await trainingProgramService.updateCategory2(
            idCate1,
            idCate2,
            data,
            () => {
              toast.update(toastID, {
                render: 'Cập nhật danh mục thành công',
                type: 'success',
                isLoading: false,
                autoClose: 2000
              })
              onCancel()
              mutate()
            },
            err => {
              toast.update(toastID, {
                render: err?.message || 'Có lỗi xảy ra',
                type: 'error',
                isLoading: false,
                autoClose: 2000
              })
              setLoading(false)
            }
          )
        } else if (level === 3 && idCate2) {
          await trainingProgramService.updateCategory3(
            idCate1,
            idCate2,
            idCate3 || '',
            data,
            () => {
              toast.update(toastID, {
                render: 'Cập nhật danh mục thành công',
                type: 'success',
                isLoading: false,
                autoClose: 2000
              })
              onCancel()
              mutate()
            },
            err => {
              toast.update(toastID, {
                render: err?.message || 'Có lỗi xảy ra',
                type: 'error',
                isLoading: false,
                autoClose: 2000
              })
              setLoading(false)
            }
          )
        }
      } catch (error) {
        setLoading(false)
      }
    },
    [category._id, idCate1, idCate2, level, mutate, onCancel]
  )

  return (
    <TableRow>
      <TableCell
        sx={{
          paddingLeft: `${level * 9}px`,
          backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a'
        }}
      >
        <Controller
          name='titleN'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              label='Số TT'
              error={!!errors.titleN}
              helperText={errors.titleN?.message}
              size='small'
              disabled={loading}
            />
          )}
        />
        <Controller
          name='titleV'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              label='Tên danh mục'
              error={!!errors.titleV}
              helperText={errors.titleV?.message}
              size='small'
              disabled={loading}
            />
          )}
        />
      </TableCell>
      <TableCell
        sx={{
          backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a'
        }}
      >
        <Controller
          name='credits'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              type='number'
              label='Số tín chỉ'
              error={!!errors.credits}
              helperText={errors.credits?.message}
              size='small'
              disabled={loading}
            />
          )}
        />
      </TableCell>
      <TableCell
        colSpan={8}
        align='right'
        sx={{
          backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a'
        }}
      >
        <IconButton onClick={handleSubmit(onSubmit)} disabled={loading}>
          <SaveIcon />
        </IconButton>
        <IconButton onClick={onCancel} disabled={loading}>
          <CancelIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

export default UpdateCategoryForm
