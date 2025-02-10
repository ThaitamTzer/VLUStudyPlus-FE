'use client'

import { useState } from 'react'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Button,
  List,
  ListItem,
  Stack
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'

import { toast } from 'react-toastify'

import { useAuth } from '@/hooks/useAuth'

import { useStudentStore } from '@/stores/student/student'
import Iconify from '@/components/iconify'
import CustomAvatar from '@/@core/components/mui/Avatar'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'
import studentService from '@/services/student.service'

// Define schema using valibot
const schema = v.object({
  file: v.pipe(
    v.array(v.file(), 'Cần phải có hình ảnh mới có thể cập nhật'),
    v.minLength(1, 'Cần phải có hình ảnh mới có thể cập nhật')
  )
})

type UpdateAvatarForm = {
  file: File[]
}

export default function UpdateAvatar() {
  const { openUpdateAvatar, toogleUpdateAvatar } = useStudentStore()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { getProfile } = useAuth()

  const {
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<UpdateAvatarForm>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      file: []
    }
  })

  const handleClose = () => {
    toogleUpdateAvatar()
    setFile(null)
    setValue('file', [])
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0]

      setFile(selectedFile)
      setValue('file', [selectedFile])
    },
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 20971520
  })

  const renderFilePreview = (file: File) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file)} />
    } else {
      return <i className='tabler-file-description' />
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setValue('file', [])
  }

  const onSubmit = handleSubmit(async data => {
    setLoading(true)
    const formData = new FormData()

    formData.append('avatar', data.file[0])

    await studentService.updateAvatar(
      formData,
      () => {
        getProfile()
        setLoading(false)
        handleClose()
        toast.success('Cập nhật ảnh đại diện thành công')
      },
      () => {
        setLoading(false)
        toast.error('Đã xảy ra lỗi, vui lòng thử lại sau')
      }
    )

    // Handle form submission
  })

  return (
    <Dialog open={openUpdateAvatar} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Typography variant='h4'>Cập nhật ảnh đại diện</Typography>
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
          onClick={handleClose}
        >
          <Iconify icon='tabler:x' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <AppReactDropzone>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className='flex items-center flex-col gap-2 text-center'>
              <CustomAvatar variant='rounded' skin='light' color='secondary'>
                <Iconify icon='tabler:upload' />
              </CustomAvatar>
              <Typography variant='h4'>Kéo và thả ảnh của bạn vào đây.</Typography>
              <Typography color='text.disabled'>hoặc</Typography>
              <Button variant='tonal' size='small'>
                Chọn ảnh
              </Button>
            </div>
          </div>
        </AppReactDropzone>
        {errors.file?.message && (
          <Typography color='error' variant='body2'>
            {errors.file.message}
          </Typography>
        )}
        {file && (
          <>
            <List>
              <ListItem className='pis-4 plb-3'>
                <div className='file-details'>
                  <div className='file-preview'>{renderFilePreview(file)}</div>
                  <div>
                    <Typography className='file-name font-medium' color='text.primary'>
                      {file.name}
                    </Typography>
                    <Typography className='file-size' variant='body2'>
                      {Math.round(file.size / 100) / 10 > 1000
                        ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                        : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
                    </Typography>
                  </div>
                </div>
                <IconButton onClick={handleRemoveFile}>
                  <Iconify icon='tabler:x' />
                </IconButton>
              </ListItem>
            </List>
            <Stack direction='row' spacing={2} justifyContent='flex-start'>
              <Button color='error' variant='tonal' onClick={handleRemoveFile}>
                Xóa
              </Button>
            </Stack>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant='outlined'>
          Hủy
        </Button>
        <LoadingButton loading={loading} onClick={onSubmit} variant='contained' color='primary' disableElevation>
          Lưu
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
