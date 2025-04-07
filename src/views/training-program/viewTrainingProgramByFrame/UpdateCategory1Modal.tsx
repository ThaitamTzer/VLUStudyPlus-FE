import { useCallback, useState } from 'react'

import * as v from 'valibot'
import type { InferInput } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Controller, useForm } from 'react-hook-form'
import type { KeyedMutator } from 'swr'
import { toast } from 'react-toastify'

import type { Categories } from '@/types/management/trainningProgramType'
import trainingProgramService from '@/services/trainingprogram.service'
import CustomTextField from '@/@core/components/mui/TextField'

const schema = v.object({
  titleN: v.pipe(v.string(), v.trim(), v.nonEmpty('Số TT danh mục không được để trống')),
  titleV: v.pipe(v.string(), v.trim(), v.nonEmpty('Tên danh mục không được để trống')),
  credits: v.pipe(v.number(), v.minValue(1, 'Số tín chỉ không được nhỏ hơn 0'))
})

type CategoryForm = InferInput<typeof schema>

interface UpdateCategory1ModalProps {
  open: boolean
  onClose: () => void
  mutate: KeyedMutator<any>
  programId: string
  category: Categories
}

const UpdateCategory1Modal = ({ open, onClose, mutate, programId, category }: UpdateCategory1ModalProps) => {
  const [loading, setLoading] = useState<boolean>(false)

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
    async (data: CategoryForm) => {
      setLoading(true)
      const toastID = toast.loading('Đang cập nhật danh mục...')

      await trainingProgramService.updateCategory1(
        programId,
        data,
        () => {
          toast.update(toastID, {
            render: 'Cập nhật danh mục thành công',
            type: 'success',
            isLoading: false,
            autoClose: 2000
          })
          mutate()
          onClose()
          setLoading(false)
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
    },
    [mutate, onClose, programId]
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        Cập nhật danh mục cấp 1
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Controller
            name='titleN'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Số TT danh mục'
                error={!!errors.titleN}
                helperText={errors.titleN?.message}
              />
            )}
          />

          <Controller
            name='titleV'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Tên danh mục'
                error={!!errors.titleV}
                helperText={errors.titleV?.message}
              />
            )}
          />

          <Controller
            name='credits'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                type='number'
                label='Số tín chỉ'
                error={!!errors.credits}
                helperText={errors.credits?.message}
              />
            )}
          />

          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={loading}
              className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700'
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateCategory1Modal
