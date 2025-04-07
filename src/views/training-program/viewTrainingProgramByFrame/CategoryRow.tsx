'use client'

import { useCallback, useState } from 'react'

import * as v from 'valibot'
import type { InferInput } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { IconButton, TableCell, TableRow, TextField } from '@mui/material'

import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

import { Controller, useForm } from 'react-hook-form'

import type { KeyedMutator } from 'swr'

import { toast } from 'react-toastify'

import type { Categories } from '@/types/management/trainningProgramType'
import { useSettings } from '@/@core/hooks/useSettings'
import trainingProgramService from '@/services/trainingprogram.service'

const schema = v.object({
  titleN: v.pipe(v.string(), v.trim(), v.nonEmpty('Số TT danh mục không được để trống')),
  titleV: v.pipe(v.string(), v.trim(), v.nonEmpty('Tên danh mục không được để trống')),
  credits: v.pipe(v.number(), v.minValue(1, 'Số tín chỉ không được nhỏ hơn 0'))
})

type CategoryForm = InferInput<typeof schema>

interface CategoryRowProps {
  category: Categories
  level: number
  isEditing?: boolean
  onSave?: () => void
  onCancel?: () => void
  mutate: KeyedMutator<any>
  idCate1: string
  idCate2?: string
}

const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  level,
  isEditing,
  onCancel,
  mutate,
  idCate1,
  idCate2
}) => {
  const { settings } = useSettings()
  const [loading, setLoading] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    setError,
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
      const toastID = toast.loading('Đang thêm danh mục...')

      if (level === 2) {
        await trainingProgramService.addCategory2(
          idCate1,
          data,
          () => {
            toast.update(toastID, {
              render: 'Thêm danh mục thành công',
              type: 'success',
              isLoading: false,
              autoClose: 2000
            })
            onCancel?.()
            mutate()
            setLoading(false)
          },
          err => {
            toast.update(toastID, {
              render: err?.message || 'Có lỗi xảy ra',
              type: 'error',
              isLoading: false,
              autoClose: 2000
            })

            if (err?.message === Array(0)) {
              toast.update(toastID, {
                render: 'Sai định dạng số TT',
                type: 'error',
                isLoading: false,
                autoClose: 2000
              })

              setError('titleN', {
                type: 'custom',
                message: 'Số TT không đúng định dạng ví dụ: 1.1.'
              })
            }

            setLoading(false)
          }
        )
      }

      if (level === 3) {
        await trainingProgramService.addCategory3(
          idCate1,
          idCate2 || '',
          data,
          () => {
            toast.update(toastID, {
              render: 'Thêm danh mục thành công',
              type: 'success',
              isLoading: false,
              autoClose: 2000
            })
            onCancel?.()
            mutate()
            setLoading(false)
          },
          err => {
            toast.update(toastID, {
              render: err?.message || 'Có lỗi xảy ra',
              type: 'error',
              isLoading: false,
              autoClose: 2000
            })

            if (err?.message === Array(0)) {
              toast.update(toastID, {
                render: 'Sai định dạng số TT',
                type: 'error',
                isLoading: false,
                autoClose: 2000
              })
              setError('titleN', {
                type: 'custom',
                message: 'Số TT không đúng định dạng ví dụ: 1.1.1.'
              })
            }

            setLoading(false)
          }
        )
      }
    },
    [mutate, onCancel, level, idCate1, idCate2, setError]
  )

  const onUpdateCategory = handleSubmit(onSubmit)

  if (isEditing) {
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
              <TextField
                {...field}
                size='small'
                error={!!errors.titleN}
                helperText={errors.titleN?.message}
                placeholder='Số TT danh mục'
              />
            )}
          />
          <Controller
            name='titleV'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size='small'
                error={!!errors.titleV}
                helperText={errors.titleV?.message}
                placeholder='Tên danh mục'
              />
            )}
          />
        </TableCell>
        <TableCell
          align='right'
          sx={{
            backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a'
          }}
        >
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
                placeholder='Số tín chỉ'
                onChange={e => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                onFocus={e => e.target.select()}
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
          <IconButton size='small' onClick={onUpdateCategory} disabled={loading}>
            <SaveIcon fontSize='small' />
          </IconButton>
          <IconButton size='small' onClick={onCancel} disabled={loading}>
            <CancelIcon fontSize='small' />
          </IconButton>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow>
      <TableCell
        sx={{
          paddingLeft: `${level * 9}px`,
          backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a'
        }}
      >
        {category.titleN} {category.titleV}
      </TableCell>
      <TableCell
        align='right'
        sx={{
          backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a'
        }}
      >
        {category.credits}
      </TableCell>
    </TableRow>
  )
}

export default CategoryRow
