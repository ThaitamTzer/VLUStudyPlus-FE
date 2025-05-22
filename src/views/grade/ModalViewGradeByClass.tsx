'use client'

import { useCallback } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import useSWR from 'swr'

import { Button } from '@mui/material'

import { useGradeStore } from '@/stores/grade/grade.store'
import { CustomDialog } from '@/components/CustomDialog'
import gradeService from '@/services/grade.service'
import GradeList from './listGrade'

export default function ModalViewGradeByClass() {
  const { openViewGrade, idClass, toogleViewGrade, setIdClass } = useGradeStore()
  const router = useRouter()

  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10
  const filterField = searchParams.get('filterField') || ''
  const filterValue = searchParams.get('filterValue') || ''
  const sortField = searchParams.get('sortField') || ''
  const sortOrder = searchParams.get('sortOrder') || ''
  const searchKey = searchParams.get('searchKey') || ''

  const handleSort = useCallback(
    (field: string) => {
      const isAsc = sortField === field && sortOrder === 'asc'
      const newSortOrder = isAsc ? 'desc' : 'asc'

      const params = new URLSearchParams()

      params.set('classCode', idClass)
      params.set('page', page.toString())
      params.set('limit', limit.toString())
      params.set('sortField', field)
      params.set('sortOrder', newSortOrder)

      if (searchKey) {
        params.set('searchKey', searchKey)
      }

      router.push(`?${params.toString()}`, {
        scroll: false
      })
    },
    [idClass, page, limit, sortField, sortOrder, searchKey, router]
  )

  const fetchGrade = [
    `/api/grade/view-grade-GV/${idClass}`,
    idClass,
    page,
    limit,
    filterField,
    filterValue,
    sortField,
    sortOrder,
    searchKey
  ]

  const { data, isLoading } = useSWR(fetchGrade, () =>
    gradeService.getGradeByClassCode(idClass, page, limit, filterField, filterValue, sortField, sortOrder, searchKey)
  )

  const handleClose = useCallback(() => {
    toogleViewGrade()
    setIdClass('')
  }, [setIdClass, toogleViewGrade])

  return (
    <CustomDialog
      open={openViewGrade}
      title='Danh sách điểm'
      onClose={handleClose}
      maxWidth='lg'
      actions={
        <Button variant='contained' color='primary' onClick={handleClose}>
          Đóng
        </Button>
      }
    >
      <GradeList
        data={data?.data || []}
        loading={isLoading}
        page={page}
        limit={limit}
        sortField={sortField}
        sortOrder={sortOrder}
        handleSort={handleSort}
        searchKey={searchKey}
        classCode={idClass}
        total={data?.pagination.totalItems || 0}
      />
    </CustomDialog>
  )
}
