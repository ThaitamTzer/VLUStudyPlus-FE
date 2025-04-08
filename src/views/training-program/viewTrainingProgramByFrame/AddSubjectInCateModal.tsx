'use client'

import { useEffect, useState, useRef, useCallback } from 'react' // Import useCallback

import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'
import type { InferInput } from 'valibot'
import useSWR from 'swr'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
  Autocomplete,
  TextField
} from '@mui/material'

import { toast } from 'react-toastify'
import { LoadingButton } from '@mui/lab'

import trainingProgramService from '@/services/trainingprogram.service'
import subjectServices from '@/services/subject.service'
import Iconify from '@/components/iconify'

// Định nghĩa kiểu dữ liệu cho môn học
interface Subject {
  _id: string
  courseCode: string
  courseName: string
}

// Định nghĩa schema validation
const schema = v.object({
  subjectId: v.pipe(v.string(), v.nonEmpty('Vui lòng chọn môn học'))
})

// Props cho component
interface AddSubjectInCateModalProps {
  open: boolean
  onClose: () => void
  programId: string
  categoryId1?: string
  categoryId2?: string
  categoryId3?: string
  categoryLevel: 1 | 2 | 3
  onSuccess?: () => void
}

// Kiểu dữ liệu cho form
type FormAddSubjectInCate = InferInput<typeof schema>

export default function AddSubjectInCateModal({
  open,
  onClose,
  programId,
  categoryId1,
  categoryId2,
  categoryId3,
  categoryLevel,
  onSuccess
}: AddSubjectInCateModalProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [searchKey, setSearchKey] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [allSubjects, setAllSubjects] = useState<Subject[]>([])
  const [hasMore, setHasMore] = useState<boolean>(true)

  // useRef to track the Listbox element
  const listboxRef = useRef<HTMLUListElement>(null)

  // Sử dụng useSWR để lấy danh sách môn học
  const { data: subjectList, isLoading: loadingSubjects } = useSWR(
    open ? `/api/subject/view-list-subject?page=${page}&limit=${limit}&searchKey=${searchKey}` : null,
    () => subjectServices.getAllSubject(page, limit, undefined, undefined, undefined, undefined, searchKey)
  )

  // Cập nhật danh sách môn học khi có dữ liệu mới
  useEffect(() => {
    if (subjectList?.data) {
      if (page === 1) {
        setAllSubjects(subjectList.data)
      } else {
        setAllSubjects(prev => [...prev, ...subjectList.data])
      }

      // Kiểm tra xem còn dữ liệu để tải không
      setHasMore(subjectList.data.length === limit)
    }
  }, [subjectList, page, limit])

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormAddSubjectInCate>({
    resolver: valibotResolver(schema),
    mode: 'all',
    defaultValues: {
      subjectId: ''
    }
  })

  // Hàm xử lý khi cuộn xuống để tải thêm dữ liệu
  const handleScroll = useCallback(
    (event: React.SyntheticEvent) => {
      const target = event.target as HTMLDivElement

      // Check if the user has scrolled to the bottom
      if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
        // Add a threshold
        if (hasMore && !loadingSubjects) {
          setPage(prev => prev + 1)
        }
      }
    },
    [hasMore, loadingSubjects]
  )

  // Hàm xử lý khi tìm kiếm
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setSearchKey(value)
    setPage(1)
    setAllSubjects([])
  }

  // Hàm xử lý khi chọn môn học
  const handleSubjectChange = (event: React.SyntheticEvent, newValue: Subject | null) => {
    setSelectedSubject(newValue)

    if (newValue) {
      setValue('subjectId', newValue._id)
    } else {
      setValue('subjectId', '')
    }
  }

  // Hàm xử lý khi submit form
  const onSubmit = handleSubmit(async data => {
    if (!programId) return toast.error('Đã có lỗi xảy ra vui lòng thử lại sau')
    if (!selectedSubject) return toast.error('Vui lòng chọn môn học')

    const toastId = toast.loading('Đang thêm môn học')

    setLoading(true)

    try {
      // Gọi API tương ứng với cấp độ danh mục
      if (categoryLevel === 1 && categoryId1) {
        await trainingProgramService.addSubjectInFrameInCate1(
          categoryId1,
          { subjectId: data.subjectId },
          () => {
            toast.update(toastId, {
              render: 'Thêm môn học vào danh mục 1 thành công',
              autoClose: 2000,
              isLoading: false,
              type: 'success'
            })
            onSuccess && onSuccess()
            onClose()
          },
          err => {
            toast.update(toastId, {
              render: err.message || 'Có lỗi xảy ra khi thêm môn học',
              autoClose: 2000,
              type: 'error',
              isLoading: false
            })
          }
        )
      } else if (categoryLevel === 2 && categoryId1 && categoryId2) {
        await trainingProgramService.addSubjectInFrameInCate2(
          categoryId1,
          categoryId2,
          { subjectId: data.subjectId },
          () => {
            toast.update(toastId, {
              render: 'Thêm môn học vào danh mục 2 thành công',
              autoClose: 2000,
              isLoading: false,
              type: 'success'
            })
            onSuccess && onSuccess()
            onClose()
          },
          err => {
            toast.update(toastId, {
              render: err.message || 'Có lỗi xảy ra khi thêm môn học',
              autoClose: 2000,
              type: 'error',
              isLoading: false
            })
          }
        )
      } else if (categoryLevel === 3 && categoryId1 && categoryId2 && categoryId3) {
        await trainingProgramService.addSubjectInFrameInCate3(
          categoryId1,
          categoryId2,
          categoryId3,
          { subjectId: data.subjectId },
          () => {
            toast.update(toastId, {
              render: 'Thêm môn học vào danh mục 3 thành công',
              autoClose: 2000,
              isLoading: false,
              type: 'success'
            })
            onSuccess && onSuccess()
            onClose()
          },
          err => {
            toast.update(toastId, {
              render: err.message || 'Có lỗi xảy ra khi thêm môn học',
              autoClose: 2000,
              type: 'error',
              isLoading: false
            })
          }
        )
      } else {
        toast.update(toastId, {
          render: 'Thiếu thông tin danh mục',
          autoClose: 2000,
          type: 'error',
          isLoading: false
        })
      }
    } catch (error) {
      toast.update(toastId, {
        render: 'Có lỗi xảy ra khi thêm môn học',
        autoClose: 2000,
        type: 'error',
        isLoading: false
      })
    } finally {
      setLoading(false)
    }
  })

  // Reset form khi đóng modal
  useEffect(() => {
    if (!open) {
      reset()
      setSelectedSubject(null)
      setPage(1)
      setSearchKey('')
      setAllSubjects([])
      setHasMore(true)
    }
  }, [open, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8
          }}
        >
          <Iconify icon='mdi:close' />
        </IconButton>
        <Typography variant='h6'>Thêm môn học vào danh mục {categoryLevel}</Typography>
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='subjectId'
                render={() => (
                  <Autocomplete
                    options={allSubjects}
                    getOptionLabel={option => `${option.courseCode} - ${option.courseName}`}
                    value={selectedSubject}
                    onChange={handleSubjectChange}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Chọn môn học'
                        error={!!errors.subjectId}
                        helperText={errors.subjectId?.message}
                        onChange={handleSearch}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingSubjects && <CircularProgress color='inherit' size={20} />}
                              {params.InputProps.endAdornment}
                            </>
                          )
                        }}
                      />
                    )}
                    ListboxProps={{
                      onScroll: handleScroll,
                      ref: listboxRef // Attach the ref to the Listbox
                    }}
                    loading={loadingSubjects}
                    loadingText='Đang tải...'
                    noOptionsText='Không tìm thấy môn học'
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <LoadingButton loading={loading} type='submit' variant='contained' disabled={isSubmitting}>
            Thêm môn học
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
