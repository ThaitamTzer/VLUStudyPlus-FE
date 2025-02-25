'use client'

import { useState } from 'react'

import { useDropzone } from 'react-dropzone'
import { Box, Button, List, ListItem, Typography, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material'

import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'

import { LoadingButton } from '@mui/lab'

import { Flip, toast } from 'react-toastify'

import type { KeyedMutator } from 'swr'

import Iconify from '@/components/iconify'
import { useClassStudentStore } from '@/stores/classStudent/classStudent.store'
import type { ImportStudentResult } from '@/types/management/classStudentType'
import classStudentService from '@/services/classStudent.service'

const schema = v.object({
  file: v.pipe(
    v.array(v.file(), 'Cần phải có tệp mới có thể thực hiện'),
    v.minLength(1, 'Cần phải có tệp mới có thể thực hiện')
  )
})

type AutoAddForm = {
  file: File[]
}

export default function ImportStudent({ mutate, classCode }: { mutate: KeyedMutator<any>; classCode: string }) {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const {
    toogleImportStudent,
    setMissingInfoRows,
    setImportResult,
    setDuplicateRows,
    setUpdateResult,
    toogleImportResult,
    openImportStudent
  } = useClassStudentStore()

  const handleImportResult = (res: ImportStudentResult) => {
    setImportResult(res.data.students)
    setUpdateResult(res.data.updatedStudents)
    setMissingInfoRows(res.data.missingInfoRows)
    setDuplicateRows(res.data.duplicateRows)
  }

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
    toogleImportStudent()
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

    formData.append('classCode', classCode)
    formData.append('file', data.file[0])

    const toastId = toast.loading('Dữ liệu đang được xử lý, vui lòng chờ trong giây lát')

    handleClose()

    await classStudentService.import(
      formData,
      res => {
        handleImportResult(res)
        toast.update(toastId, {
          render: 'Thêm sinh viên thành công!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
          transition: Flip,
          closeButton: true
        })
        toogleImportResult()
        mutate()
      },
      err => {
        toast.update(toastId, {
          render: err.message,
          type: 'error',
          isLoading: false,
          autoClose: 3000,
          transition: Flip,
          closeButton: true
        })
      }
    )
  })

  return (
    <Dialog open={openImportStudent} onClose={handleClose} fullWidth maxWidth='sm'>
      {/* đưa file mẫu cho người dùng */}
      <DialogTitle>
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
          onClick={handleClose}
        >
          <Iconify icon='mdi:close' />
        </IconButton>
        <Typography variant='h4'>Import sinh viên vào lớp {classCode}</Typography>
      </DialogTitle>
      <DialogContent>
        <div className='flex flex-col items-center gap-2'>
          <Typography variant='body2'>Tải file mẫu tại đây</Typography>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => {
              window.open('/files/DSSV_CVHT.xlsx')
            }}
          >
            Tải file mẫu
          </Button>
          <Typography variant='body2'>Chỉ hỗ trợ tệp Excel (.xls, .xlsx)</Typography>
        </div>
        <section
          style={{
            border: '1px dashed #ccc',
            borderRadius: '4px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer'
          }}
        >
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
        </section>
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
      </DialogContent>
    </Dialog>
  )
}
