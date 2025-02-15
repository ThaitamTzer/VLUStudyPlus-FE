'use client'

import { useState } from 'react'

import { useDropzone } from 'react-dropzone'
import { Box, Button, List, ListItem, Typography, IconButton } from '@mui/material'

import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'

import { LoadingButton } from '@mui/lab'

import { Flip, toast } from 'react-toastify'

import type { KeyedMutator } from 'swr'

import AppReactDropzone from '@/libs/styles/AppReactDropzone'
import Iconify from '@/components/iconify'
import lecturerService from '@/services/lecturer.service'
import { useLecturerStore } from '@/stores/lecturer/lecturer'

const schema = v.object({
  file: v.pipe(
    v.array(v.file(), 'Cần phải có tệp mới có thể thực hiện'),
    v.minLength(1, 'Cần phải có tệp mới có thể thực hiện')
  )
})

type AutoAddForm = {
  file: File[]
}

export default function AutoAdd({ mutate }: { mutate: KeyedMutator<any> }) {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const {
    toogleAddLecturer,
    setDuplicateRows,
    setLecturersResult,
    setMissingInfoRows,
    setUpdateLecturers,
    setOpenPreviewImport
  } = useLecturerStore()

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
      setValue('file', acceptedFiles)
    },
    multiple: false,
    accept: {
      'application/vnd.ms-excel': ['.xls', '.xlsx']
    }
  })

  const {
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<AutoAddForm>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      file: []
    }
  })

  const handleClose = () => {
    setValue('file', [])
    setFiles([])
    toogleAddLecturer()
  }

  const renderFilePreview = (file: File) => {
    if (file.type === 'application/vnd.ms-excel' || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
      return (
        <Box display='flex' alignItems='center'>
          <Iconify icon='mdi:file-excel' width={24} height={24} />
          <Typography variant='body2' ml={1}>
            {file.name}{' '}
          </Typography>
          <Typography className='file-size ml-1' variant='body2'>
            kích thước:
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </Box>
      )
    } else {
      return <Typography variant='body2'>{file.name}</Typography>
    }
  }

  const handleRemoveFile = (file: File) => {
    const filteredFiles = files.filter(f => f.name !== file.name)

    setFiles(filteredFiles)
  }

  const handleUpload = handleSubmit(async data => {
    setLoading(true)
    const formData = new FormData()

    formData.append('file', data.file[0])

    const toastId = toast.loading('Dữ liệu đang được xử lý, vui lòng chờ trong giây lát')

    handleClose()

    await lecturerService.import(
      formData,
      res => {
        console.log(res)
        toast.update(toastId, {
          render: res.data.message,
          type: 'success',
          isLoading: false,
          autoClose: 3000,
          transition: Flip,
          closeButton: true
        })
        setOpenPreviewImport(true)
        setDuplicateRows(res.data.duplicateRows)
        setLecturersResult(res.data.lecturers)
        setMissingInfoRows(res.data.missingInfoRows)
        setUpdateLecturers(res.data.updateLec)

        mutate()
      },
      err => {
        toast.update(toastId, {
          render: err.message,
          type: 'error',
          isLoading: false,
          autoClose: 5000,
          transition: Flip,
          closeButton: true
        })
      }
    )
  })

  return (
    <>
      {/* đưa file mẫu cho người dùng */}
      <div className='flex flex-col items-center gap-2'>
        <Typography variant='body2'>Tải file mẫu tại đây</Typography>
        <Button
          variant='outlined'
          color='primary'
          onClick={() => {
            window.open('/files/CVHT.xlsx')
          }}
        >
          Tải file mẫu
        </Button>
        <Typography variant='body2'>Chỉ hỗ trợ tệp Excel (.xls, .xlsx)</Typography>
      </div>
      <AppReactDropzone>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <div className='flex items-center flex-col gap-2 text-center'>
            <Typography variant='h5'>Kéo và thả files của bạn vào đây.</Typography>
            <Typography color='text.disabled'>hoặc</Typography>
            <Button variant='tonal' size='small'>
              Chọn file
            </Button>
          </div>
        </div>
      </AppReactDropzone>
      {errors.file?.message && (
        <Typography color='error' variant='body2'>
          {errors.file.message}
        </Typography>
      )}
      {files.length > 0 && (
        <Box mt={2}>
          <List>
            {files.map(file => (
              <ListItem key={file.name} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>{renderFilePreview(file)}</Box>
                <IconButton onClick={() => handleRemoveFile(file)}>
                  <Iconify icon='tabler:x' />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Box mt={2} display='flex' justifyContent='flex-end' gap={2}>
            <Button variant='outlined' color='primary' onClick={handleClose}>
              Hủy
            </Button>
            <LoadingButton loading={loading} variant='contained' color='primary' onClick={handleUpload}>
              Thêm
            </LoadingButton>
          </Box>
        </Box>
      )}
    </>
  )
}
