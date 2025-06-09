'use client'
import { useCallback, useMemo, useState } from 'react'

import dynamic from 'next/dynamic'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Card,
  MenuItem,
  TablePagination,
  Button
} from '@mui/material'
import useSWR, { mutate as fetching } from 'swr'

import { toast } from 'react-toastify'

import * as XLSX from 'xlsx-js-style'

import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import learnProcessService from '@/services/learnProcess.service'
import Iconify from '@/components/iconify'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '@/components/debouncedInput'
import TablePaginationCustomNoURL from '@/components/table/TablePaginationNoURL'
import { useShare } from '@/hooks/useShare'
import { NotificantionAction } from './notificationAction'

const TableFilter = dynamic(() => import('./tableFilter'), { ssr: false })
const TableAcedemicProcess = dynamic(() => import('./tableAcedemicProcess'), { ssr: false })
const AlertDelete = dynamic(() => import('@/components/alertModal'), { ssr: false })
const ManualAddAcedemicProcess = dynamic(() => import('../manualAddAcedemicProcess'), { ssr: false })

// const ViewDetailAcedecmicProcess = dynamic(() => import('./viewDetailAcedemicProcess'), { ssr: false })

const UpdateAcedemicProcessStatus = dynamic(() => import('../updateAcedemicProcessStatus'), { ssr: false })

// const SendMailModal = dynamic(() => import('./sendMailModal'), { ssr: false })
const SendMailModalRemind = dynamic(() => import('./sendMailModalRemind'), { ssr: false })

export default function ViewAcedemicProcessCVHT() {
  const {
    toogleManualAddFromViewByCate,
    openManualAddFromViewByCate,
    toogleEditViewAcedemicProcess,
    setProcessing,
    toogleDeleteViewAcedemicProcess,
    openDeleteViewAcedemicProcess,
    processing,
    toogleViewDetailAcademicProcess,
    toogleUpdateAcedemicProcessStatus,
    toogleSendEmailRemind,
    toogleViewByCategoryCVHT,
    sessionCVHT,
    setSessionCVHT,
    openViewByCategoryCVHT,
    toogleSendEmailRemindCommitment
  } = useAcedemicProcessStore()

  const { cohorOptions } = useShare()

  const id = useMemo(() => sessionCVHT?._id, [sessionCVHT])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filterField, setFilterField] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [searchKey, setSearchKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)

  const fetcher = [
    `/api/acedemicProcessCVHT/${id}`,
    page,
    limit,
    filterField,
    filterValue,
    sortField,
    sortOrder,
    searchKey
  ]

  const { data, isLoading, mutate } = useSWR(
    id ? fetcher : null,
    () =>
      learnProcessService.viewProcessByCategoryCVHT(
        id as string,
        page,
        limit,
        filterField,
        filterValue,
        sortField,
        sortOrder,
        searchKey
      ),
    {
      onSuccess: data => {
        setTotalItems(data?.pagination.totalItems || 0)
      }
    }
  )

  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortOrder === 'asc'
    const newSortOrder = isAsc ? 'desc' : 'asc'

    setSortField(field)
    setSortOrder(newSortOrder)
    setPage(1)
  }

  const onDelete = useCallback(async () => {
    if (!processing) return toast.error('Không có dữ liệu để xóa')
    const toastId = toast.loading('Đang xóa dữ liệu')

    setLoading(true)
    await learnProcessService.deleteProcess(
      processing._id,
      () => {
        setLoading(false)
        mutate()
        fetching(`/api/notification/get-number-notification/${id}`)
        toogleDeleteViewAcedemicProcess()
        toast.update(toastId, {
          render: 'Xóa dữ liệu thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
      },
      err => {
        setLoading(false)
        toast.update(toastId, {
          render: err.message,
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
      }
    )
  }, [processing, mutate, toogleDeleteViewAcedemicProcess, id])

  const handleExportExcel = useCallback(async () => {
    if (totalItems === 0) {
      alert('Không có dữ liệu để xuất')

      return
    }

    try {
      // Lấy toàn bộ dữ liệu
      const allData = await learnProcessService.viewProcessByCategoryCVHT(
        id as string,
        1, // page = 1
        totalItems, // limit = totalItems để lấy tất cả
        filterField,
        filterValue,
        sortField,
        sortOrder,
        searchKey
      )

      if (!allData?.data || allData.data.length === 0) {
        alert('Không có dữ liệu để xuất')

        return
      }

      // Tạo dữ liệu cho Excel theo đúng thứ tự cột yêu cầu
      const excelData = allData.data.map((item, index) => {
        const stt = index + 1

        return {
          TT: stt,
          MSSV: item.studentId || '',
          Họ: item.lastName || '',
          Tên: item.firstName || '',
          Khóa: item.cohortName || '',
          'Mã Lớp SV': item.classId || '',
          'Cố vấn học tập': item.handlerName || '',
          'CVHT ghi nhận tình trạng xử lý': item.CVHTHandle?.processingResultName || '',
          'CVHT ghi chú cụ thể khác': item.CVHTNote || '',
          'Phân loại đối tượng theo hướng dẫn': item.groupedByInstruction || '',
          'Số điện thoại SV': item.sdtsv || '',
          'Số điện thoại liên hệ': item.sdtlh || '',
          'Số điện thoại HKTT': item.sdthktt || '',
          'Số điện thoại cha': item.sdtcha || '',
          'Số điện thoại mẹ': item.sdtme || '',
          Ngành: item.major || '',
          'Điểm TBC': item.DTBC || 0,
          'Điểm TBCTL': item.DTBCTL || 0,
          ĐTB10: item.DTB10 || 0,
          'ĐTBCTL 10': item.DTBCTL10 || 0,
          'Số TCTL': item.TCTL || 0,
          'Số TC còn nợ': item.TCCN || 0,
          'Tổng TC CTĐT': item.TONGTCCTDT || 0,
          '% tích lũy': item.percentTL ? parseFloat(item.percentTL.toFixed(2)) : 0,
          'XLHT HK241 (UIS - XLHT theo quy chế)': item.processingHandle?.statusProcess || '',
          'Đếm số lần bị XLHT qua 10 học kỳ (Từ HK201 đến HK241)': item.countWarning?.academicWarningsCount || 0,
          'Tình trạng ĐKMH HK242 (17/3/2025)': item.courseRegistration?.isRegister ? 'Có ĐK' : 'Không ĐK',
          'Năm SV tuyển sinh': item.admissionYear || '',
          RQS: item.RQS || '',
          Khoa: item.faculty || '',
          'Danh sách': item.list || '',
          'Tình trạng (12/3/25)': item.statusOn?.status || '',
          'SV năm thứ (xếp theo STC trung bình toàn trường)': item.yearLevel || '',
          'Lý do XLHT HK241': item.reasonHandling?.reason || '',
          'Kết quả XLHT các HK trước': item.resultHandlingBefore || ''
        }
      })

      // Tạo worksheet
      const ws = XLSX.utils.json_to_sheet(excelData)

      // Tự động điều chỉnh độ rộng cột
      const colWidths = [
        { wch: 5 }, // TT
        { wch: 15 }, // MSSV
        { wch: 15 }, // Họ
        { wch: 10 }, // Tên
        { wch: 8 }, // Khóa
        { wch: 15 }, // Mã Lớp SV
        { wch: 20 }, // Cố vấn học tập
        { wch: 25 }, // CVHT ghi nhận
        { wch: 25 }, // CVHT ghi chú
        { wch: 20 }, // Phân loại đối tượng
        { wch: 15 }, // SĐT SV
        { wch: 15 }, // SĐT liên hệ
        { wch: 15 }, // SĐT HKTT
        { wch: 15 }, // SĐT cha
        { wch: 15 }, // SĐT mẹ
        { wch: 25 }, // Ngành
        { wch: 10 }, // Điểm TBC
        { wch: 12 }, // Điểm TBCTL
        { wch: 10 }, // ĐTB10
        { wch: 12 }, // ĐTBCTL 10
        { wch: 10 }, // Số TCTL
        { wch: 12 }, // Số TC còn nợ
        { wch: 12 }, // Tổng TC CTĐT
        { wch: 10 }, // % tích lũy
        { wch: 30 }, // XLHT HK241
        { wch: 15 }, // Đếm số lần XLHT
        { wch: 25 }, // Tình trạng ĐKMH
        { wch: 12 }, // Năm SV tuyển sinh
        { wch: 8 }, // RQS
        { wch: 30 }, // Khoa
        { wch: 10 }, // Danh sách
        { wch: 15 }, // Tình trạng
        { wch: 30 }, // SV năm thứ
        { wch: 40 }, // Lý do XLHT
        { wch: 30 } // Kết quả XLHT trước
      ]

      ws['!cols'] = colWidths

      // Tăng độ cao của dòng tiêu đề
      ws['!rows'] = [{ hpt: 70 }] // 70 points height cho dòng đầu tiên (header)

      ws['A1'].s = {
        font: { bold: true, sz: 20, color: { rgb: 'FFFFFF' } },
        alignment: { vertical: 'center', wrapText: true },
        fill: { fgColor: { rgb: '4472C4' } }
      }

      const headerStyle = {
        font: { bold: true, color: { rgb: '000000' } },
        alignment: { vertical: 'center', wrapText: true },
        fill: { fgColor: { rgb: 'D9E1F2' } },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } }
        }
      }

      const getheaders = () => {
        const headersArray: string[] = []

        if (ws['!ref']) {
          const range = XLSX.utils.decode_range(ws['!ref'])

          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })

            headersArray.push(cellAddress)
          }
        }

        return headersArray
      }

      const headers = getheaders()

      headers.forEach(cell => {
        ws[cell].s = headerStyle
      })

      // Style cho nội dung border
      const dataRange = XLSX.utils.decode_range(ws['!ref'] || '')

      for (let R = 1; R <= dataRange.e.r; ++R) {
        for (let C = 0; C <= dataRange.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })

          if (!ws[cellAddress]) continue
          ws[cellAddress].s = {
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } }
            }
          }
        }
      }

      // Tạo workbook
      const wb = XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách xử lý học vụ')

      // Tạo tên file với thời gian hiện tại
      const fileName = `DS_XuLyHocVu_${new Date().toISOString().slice(0, 10)}.xlsx`

      // Xuất file
      XLSX.writeFile(wb, fileName)
    } catch (error) {
      console.error('Lỗi khi xuất Excel:', error)
      alert('Có lỗi xảy ra khi xuất Excel. Vui lòng thử lại!')
    }
  }, [totalItems, id, filterField, filterValue, sortField, sortOrder, searchKey])

  const handleClose = () => {
    toogleViewByCategoryCVHT()
    setPage(1)
    setLimit(10)
    setFilterField('')
    setFilterValue('')
    setSortField('')
    setSortOrder('asc')
    setSearchKey('')
    setSessionCVHT(null)
  }

  return (
    <>
      <Dialog open={openViewByCategoryCVHT} maxWidth='xl' onClose={handleClose} fullScreen>
        <DialogTitle>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <Iconify icon='mdi:close' color='black' />
          </IconButton>
          <Typography
            variant='h4'
            sx={{
              textTransform: 'uppercase'
            }}
          >
            Danh sách {sessionCVHT?.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Card>
            <TableFilter
              cohorOptions={cohorOptions}
              setPage={setPage}
              setFilterField={setFilterField}
              setFilterValue={setFilterValue}
            />
            <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
              <CustomTextField
                select
                className='max-sm:is-full sm:is-[80px]'
                value={limit}
                onChange={e => {
                  setLimit(Number(e.target.value))
                  setPage(1)
                }}
              >
                <MenuItem value='10'>10</MenuItem>
                <MenuItem value='25'>25</MenuItem>
                <MenuItem value='50'>50</MenuItem>
              </CustomTextField>
              <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
                <DebouncedInput
                  value={searchKey}
                  fullWidth
                  onChange={value => {
                    setSearchKey(value as string)
                    setPage(1)
                  }}
                  placeholder='Tìm kiếm'
                  className='max-sm:is-full sm:is-[300px]'
                />
                <NotificantionAction
                  acedemicProcess={sessionCVHT}
                  data={data}
                  toogleSendEmailRemind={toogleSendEmailRemind}
                  toogleManualAddFromViewByCate={toogleManualAddFromViewByCate}
                  toogleSendEmailRemindCommitment={toogleSendEmailRemindCommitment}
                />
                <Button
                  variant='contained'
                  color='success'
                  startIcon={<Iconify icon='mdi:file-excel' />}
                  onClick={handleExportExcel}
                  disabled={totalItems === 0 || isLoading}
                >
                  Xuất Excel ({totalItems} bản ghi)
                </Button>
              </div>
            </div>
            <TableAcedemicProcess
              data={data}
              isLoading={isLoading}
              page={page}
              limit={limit}
              sortField={sortField}
              sortOrder={sortOrder}
              handleSort={handleSort}
              setProcessing={setProcessing}
              toogleEditViewAcedemicProcess={toogleEditViewAcedemicProcess}
              toogleDeleteViewAcedemicProcess={toogleDeleteViewAcedemicProcess}
              toogleViewDetailAcedemicProcess={toogleViewDetailAcademicProcess}
              toogleOpenUpdateAcedemicProcessStatus={toogleUpdateAcedemicProcessStatus}
              mutateListAcedemicProcessCVHT={mutate}
            />
            <TablePagination
              component={() => (
                <TablePaginationCustomNoURL
                  data={data?.data || []}
                  page={page}
                  limit={limit}
                  total={data?.pagination.totalItems || 0}
                  setPage={setPage}
                />
              )}
              count={data?.pagination.totalItems || 0}
              page={page - 1}
              rowsPerPage={limit}
              rowsPerPageOptions={[10, 25, 50]}
              onPageChange={(_, newPage) => {
                setPage(newPage + 1)
              }}
            />
          </Card>
        </DialogContent>
      </Dialog>
      {/* <ViewDetailAcedecmicProcess id={processing?._id || ''} /> */}
      <UpdateAcedemicProcessStatus mutate={mutate} />

      <ManualAddAcedemicProcess
        mutate={mutate}
        onClose={toogleManualAddFromViewByCate}
        open={openManualAddFromViewByCate}
      />
      {/* <SendMailModal id={sessionCVHT?._id || ''} mutate={mutate} /> */}
      <SendMailModalRemind id={sessionCVHT?._id || ''} />
      <AlertDelete
        open={openDeleteViewAcedemicProcess}
        onClose={toogleDeleteViewAcedemicProcess}
        content={`Bạn có chắc chắn muốn xóa xữ lý học tập của sinh viên ${processing?.firstName} ${processing?.lastName} không?`}
        onSubmit={onDelete}
        title='Xóa xữ lý học tập'
        submitColor='error'
        loading={loading}
      />
    </>
  )
}
