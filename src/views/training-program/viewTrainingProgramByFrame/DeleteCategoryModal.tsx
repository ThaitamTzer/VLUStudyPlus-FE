'use client'

import { useCallback, useState } from 'react'

import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { KeyedMutator } from 'swr'
import { toast } from 'react-toastify'

import trainingProgramService from '@/services/trainingprogram.service'

interface DeleteCategoryModalProps {
  open: boolean
  onClose: () => void
  mutate: KeyedMutator<any>
  programId: string
  categoryId: string
  level: number
  parentId?: string
}

const DeleteCategoryModal = ({
  open,
  onClose,
  mutate,
  programId,
  categoryId,
  level,
  parentId
}: DeleteCategoryModalProps) => {
  const [loading, setLoading] = useState<boolean>(false)

  const handleDelete = useCallback(async () => {
    setLoading(true)
    const toastID = toast.loading('Đang xóa danh mục...')

    try {
      if (level === 1) {
        await trainingProgramService.deleteCate1(
          programId,
          () => {
            toast.update(toastID, {
              render: 'Xóa danh mục thành công',
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
      } else if (level === 2) {
        await trainingProgramService.deleteCate2(
          programId,
          categoryId,
          () => {
            toast.update(toastID, {
              render: 'Xóa danh mục thành công',
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
      } else if (level === 3 && parentId) {
        await trainingProgramService.deleteCate3(
          programId,
          parentId,
          categoryId,
          () => {
            toast.update(toastID, {
              render: 'Xóa danh mục thành công',
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
      }
    } catch (error) {
      setLoading(false)
    }
  }, [categoryId, level, mutate, onClose, parentId, programId])

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        Xóa danh mục
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
        <div className='space-y-4'>
          <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
            >
              Hủy
            </button>
            <button
              type='button'
              onClick={handleDelete}
              disabled={loading}
              className='px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700'
            >
              {loading ? 'Đang xóa...' : 'Xóa'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteCategoryModal
