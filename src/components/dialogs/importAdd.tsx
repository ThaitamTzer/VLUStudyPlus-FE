'use client'

import { useDropzone } from 'react-dropzone'
import {
  Box,
  Button,
  List,
  ListItem,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid
} from '@mui/material'

import { LoadingButton } from '@mui/lab'

import Iconify from '@/components/iconify'

type ImportAddProps = {
  title: string
  onSubmit: () => void
  onClose: () => void
  onOpen: boolean
  pathToFile: string
  loading: boolean
  children?: React.ReactNode
  setValue: any
  reset: any
  errors: any
  files: File[]
  setFiles: (files: File[]) => void
  checkFile?: boolean
  handleCheckFile?: () => void
  note?: string
}

export default function ImportAdd(props: ImportAddProps) {
  const {
    title,
    onSubmit,
    onClose,
    onOpen,
    pathToFile,
    loading,
    children,
    reset,
    setValue,
    errors,
    files,
    setFiles,
    checkFile,
    handleCheckFile,
    note
  } = props

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

  const handleClose = () => {
    setValue('file', [])
    setFiles([])
    onClose()
    reset()
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

  return (
    <Dialog open={onOpen} onClose={handleClose} fullWidth maxWidth='sm'>
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
        <Typography variant='h4'>{title}</Typography>
      </DialogTitle>
      <DialogContent>
        <div className='flex flex-col items-center gap-2'>
          <Typography variant='body2'>Tải file mẫu tại đây</Typography>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => {
              window.open(pathToFile)
            }}
          >
            Tải file mẫu
          </Button>
          <Typography variant='body2'>Chỉ hỗ trợ tệp Excel (.xls, .xlsx)</Typography>
        </div>
        <Grid container spacing={4}>
          {children && children}
          <Grid item xs={12}>
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
          </Grid>
        </Grid>
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
              <Button variant='outlined' color='error' onClick={handleClose}>
                Hủy
              </Button>
              <LoadingButton loading={loading} variant='contained' color='success' onClick={onSubmit}>
                Import
              </LoadingButton>
              {checkFile && (
                <Button variant='outlined' color='info' onClick={handleCheckFile}>
                  So sánh CTĐT
                </Button>
              )}
            </Box>
            {note && (
              <Typography variant='body2' mt={2}>
                {note}
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
