'use client'
import { useCallback, useState } from 'react'

import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableSortLabel,
  Badge,
  IconButton,
  Tooltip
} from '@mui/material'

import type { KeyedMutator } from 'swr'

import { toast } from 'react-toastify'

import { pdf } from '@react-pdf/renderer'

import { useAuth } from '@/hooks/useAuth'

import StyledTableRow from '@/components/table/StyledTableRow'
import TableLoading from '@/components/table/TableLoading'
import TableNoData from '@/components/table/TableNotFound'
import type { CommitmentFormType } from '@/types/management/comimentFormType'
import Iconify from '@/components/iconify'
import commitmentFormService from '@/services/commitmentForm.service'
import { useCommitmentStore } from '@/stores/commitment.store'
import { CommitmentFormPDF } from './commitmentPDF'

const renderStatus = (status: string) => {
  switch (status) {
    case 'approve':
      return (
        <Badge
          sx={{
            backgroundColor: 'success.main',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px'
          }}
        >
          Đã duyệt
        </Badge>
      )
    case 'pending':
      return (
        <Badge
          sx={{
            backgroundColor: 'warning.main',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px'
          }}
        >
          Chờ duyệt
        </Badge>
      )
    case 'reject':
      return (
        <Badge
          sx={{
            backgroundColor: 'error.main',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px'
          }}
        >
          Từ chối
        </Badge>
      )
    default:
      return ''
  }
}

type TableViewCommitmentFormProps = {
  tableData: CommitmentFormType[]
  isLoading: boolean
  page: number
  limit: number
  sortField: string
  sortOrder: 'asc' | 'desc'
  handleSort: (field: string) => void
  mutate: KeyedMutator<any>
}

export default function TableViewCommitmentForm(props: TableViewCommitmentFormProps) {
  const { tableData, isLoading, page, limit, sortField, sortOrder, handleSort, mutate } = props
  const [loading, setLoading] = useState(false)
  const { setCommitmentForms, toogleViewDetailCommitmentForm } = useCommitmentStore()
  const { user } = useAuth()

  const handleViewDetailCommitmentForm = useCallback(
    (row: CommitmentFormType) => {
      setCommitmentForms(row)
      toogleViewDetailCommitmentForm()
    },
    [setCommitmentForms, toogleViewDetailCommitmentForm]
  )

  const handleApprove = async (id: string, status: string) => {
    const toastId = toast.loading('Đang cập nhật trạng thái')

    setLoading(true)

    await commitmentFormService.updateStatus(
      id,
      { approveStatus: status },
      () => {
        toast.update(toastId, {
          render: 'Cập nhật trạng thái thành công',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
        setLoading(false)
        mutate()
      },
      err => {
        toast.update(toastId, {
          render: err.message,
          type: 'error',
          isLoading: false,
          autoClose: 2000
        })
        setLoading(false)
      }
    )
  }

  const handleExportPDF = async (id: string) => {
    const toastId = toast.loading('Đang tải đơn cam kết')

    await commitmentFormService
      .getDetail(id)
      .then(async data => {
        const blob = await pdf(<CommitmentFormPDF data={data.commitmentForm} />).toBlob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')

        a.href = url
        a.download = `Đơn cam kết học tập ${data.commitmentForm.name}.pdf`
        a.click()
        URL.revokeObjectURL(url)
        toast.update(toastId, {
          render: 'Tải đơn cam kết thành công',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
      })
      .catch(() => {
        toast.update(toastId, {
          render: 'Không thể tải đơn vui lòng thử lại sau',
          type: 'error',
          isLoading: false,
          autoClose: 2000
        })
      })
  }

  return (
    <TableContainer sx={{ position: 'relative', overflowX: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <StyledTableRow sx={{ textTransform: 'uppercase' }}>
            <TableCell>STT</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'idOfStudent'}
                direction={sortField === 'idOfStudent' ? sortOrder : 'asc'}
                onClick={() => handleSort('idOfStudent')}
              >
                Mã sinh viên
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'name'}
                direction={sortField === 'name' ? sortOrder : 'asc'}
                onClick={() => handleSort('name')}
              >
                Tên sinh viên
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'classId'}
                direction={sortField === 'classId' ? sortOrder : 'asc'}
                onClick={() => handleSort('classId')}
              >
                Lớp niên chế
              </TableSortLabel>
            </TableCell>
            <TableCell colSpan={2}>
              <TableSortLabel
                active={sortField === 'approveStatus'}
                direction={sortField === 'approveStatus' ? sortOrder : 'asc'}
                onClick={() => handleSort('approveStatus')}
              >
                Trạng thái duyệt
              </TableSortLabel>
            </TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => {
            const stt = (page - 1) * limit + index + 1

            return (
              <StyledTableRow key={row._id}>
                <TableCell>{stt}</TableCell>
                <TableCell>{row.idOfStudent}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.classId.classId}</TableCell>
                <TableCell>{renderStatus(row.approveStatus)}</TableCell>
                <TableCell>
                  <Tooltip title='Xem chi tiết đơn cam kết'>
                    <IconButton sx={{ color: 'primary.main' }} onClick={() => handleViewDetailCommitmentForm(row)}>
                      <Iconify icon='eva:eye-outline' />
                    </IconButton>
                  </Tooltip>
                  {row.approveStatus === 'pending' && user?.role.name === 'CVHT' && (
                    <>
                      <Tooltip title='Duyệt đơn cam kết'>
                        <IconButton
                          sx={{ color: 'success.main' }}
                          onClick={() => handleApprove(row._id, 'approve')}
                          disabled={loading}
                        >
                          <Iconify icon='eva:checkmark-outline' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Từ chối đơn cam kết'>
                        <IconButton
                          sx={{ color: 'error.main' }}
                          onClick={() => handleApprove(row._id, 'reject')}
                          disabled={loading}
                        >
                          <Iconify icon='eva:close-outline' />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  {row.approveStatus === 'approve' && (
                    <Tooltip title='Tải đơn cam kết'>
                      <IconButton sx={{ color: 'info.main' }} onClick={() => handleExportPDF(row._id)}>
                        <Iconify icon='eva:download-outline' />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </StyledTableRow>
            )
          })}
          {isLoading ? (
            <TableLoading colSpan={20} />
          ) : (
            <TableNoData notFound={tableData?.length === 0} title={'Không tìm dữ liệu nào'} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
