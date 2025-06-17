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
  TablePagination
} from '@mui/material'
import useSWR, { mutate as fetching } from 'swr'
import ExcelJS from 'exceljs'
import { toast } from 'react-toastify'

import { LoadingButton } from '@mui/lab'

import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import learnProcessService from '@/services/learnProcess.service'
import Iconify from '@/components/iconify'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '@/components/debouncedInput'
import TablePaginationCustomNoURL from '@/components/table/TablePaginationNoURL'
import { useShare } from '@/hooks/useShare'
import { NotificantionAction } from './notificationAction'
import SendMailModalRemindCommitment from './sendMailModalRemindCommitment'

const TableFilter = dynamic(() => import('./tableFilter'), { ssr: false })
const TableAcedemicProcess = dynamic(() => import('./tableAcedemicProcess'), { ssr: false })
const AlertDelete = dynamic(() => import('@/components/alertModal'), { ssr: false })
const ManualAddAcedemicProcess = dynamic(() => import('../manualAddAcedemicProcess'), { ssr: false })

// const ViewDetailAcedecmicProcess = dynamic(() => import('./viewDetailAcedemicProcess'), { ssr: false })

const UpdateAcedemicProcessStatus = dynamic(() => import('../updateAcedemicProcessStatus'), { ssr: false })
const SendMailModal = dynamic(() => import('./sendMailModal'), { ssr: false })
const SendMailModalRemind = dynamic(() => import('./sendMailModalRemind'), { ssr: false })

export default function ViewAcedemicProcess() {
  const {
    openViewByCategory,
    toogleViewByCategory,
    session,
    setSession,
    toogleManualAddFromViewByCate,
    openManualAddFromViewByCate,
    toogleEditViewAcedemicProcess,
    setProcessing,
    toogleDeleteViewAcedemicProcess,
    openDeleteViewAcedemicProcess,
    processing,
    toogleViewDetailAcademicProcess,
    toogleUpdateAcedemicProcessStatus,
    tooogleSendEmail,
    toogleSendEmailRemind,
    toogleSendEmailRemindCommitment,
    sessionCVHT,
    setSessionCVHT,
    limit,
    setLimit,
    openUpdateAcedemicProcessStatus
  } = useAcedemicProcessStore()

  const { cohorOptions, termOptions } = useShare()

  const today = new Date()

  const currentTerm = termOptions.find(term => {
    const startDate = new Date(term.startDate)
    const endDate = new Date(term.endDate)

    return today >= startDate && today <= endDate
  })

  const id = useMemo(() => session?._id || sessionCVHT?._id, [session, sessionCVHT])

  const [page, setPage] = useState(1)
  const [filterField, setFilterField] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [searchKey, setSearchKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [isExport, setIsExport] = useState(false)

  const fetcher = [`/api/acedemicProcess/${id}`, page, limit, filterField, filterValue, sortField, sortOrder, searchKey]

  const {
    data: dataListAcedemicProcess,
    isLoading,
    mutate
  } = useSWR(
    id ? fetcher : null,
    () =>
      learnProcessService.viewProcessByCategory(
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

  const onDelete = async () => {
    if (!processing) return toast.error('Không có dữ liệu để xóa')
    const toastId = toast.loading('Đang xóa dữ liệu')

    setLoading(true)
    await learnProcessService.deleteProcess(
      processing._id,
      () => {
        mutate()
        fetching([`/api/acedemicProcess/${id}`, page, limit, filterField, filterValue, sortField, sortOrder, searchKey])
        setLoading(false)
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
          render: err?.message || 'Có lỗi xảy ra',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
      }
    )
  }

  const handleClose = () => {
    toogleViewByCategory()
    setPage(1)
    setLimit(10)
    setFilterField('')
    setFilterValue('')
    setSortField('')
    setSortOrder('asc')
    setSearchKey('')
    setSession(null)
    setSessionCVHT(null)
  }

  const handleExportExcel = useCallback(async () => {
    if (totalItems === 0) {
      alert('Không có dữ liệu để xuất')

      return
    }

    setIsExport(true)

    try {
      // Lấy toàn bộ dữ liệu
      const allData = await learnProcessService.viewProcessByCategory(
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

      // Tạo workbook mới
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Danh sách xử lý học vụ')

      // Thêm logo nếu có file
      try {
        const logoResponse = await fetch('/images/logo-van-lang.png')

        if (logoResponse.ok) {
          const logoBuffer = await logoResponse.arrayBuffer()

          const logoImageId = workbook.addImage({
            buffer: logoBuffer,
            extension: 'png'
          })

          worksheet.addImage(logoImageId, {
            tl: { col: 1, row: 1 },
            ext: { width: 100, height: 100 }
          })
        }
      } catch (error) {
        console.log('Không thể load logo:', error)

        // Tiếp tục tạo Excel mà không có logo
      }

      // Thêm dòng trống để tạo khoảng cách cho logo
      worksheet.addRow([])
      worksheet.addRow([])
      worksheet.addRow([])
      worksheet.addRow([])

      // Thêm header trường và khoa
      const headerRow1 = worksheet.addRow(['TRƯỜNG ĐẠI HỌC VĂN LANG'])
      const headerRow2 = worksheet.addRow(['KHOA CÔNG NGHỆ THÔNG TIN'])

      worksheet.addRow([]) // Dòng trống

      // Merge cells cho header
      worksheet.mergeCells('A7:AH7') // Merge toàn bộ dòng 1
      worksheet.mergeCells('A8:AH8') // Merge toàn bộ dòng 2

      // Style cho header trường
      headerRow1.getCell(1).font = { bold: true, size: 16 }
      headerRow1.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' }
      headerRow1.height = 30

      // Style cho header khoa
      headerRow2.getCell(1).font = { bold: true, size: 14 }
      headerRow2.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' }
      headerRow2.height = 25

      // Thêm header cột
      const headers = [
        'TT',
        'MSSV',
        'Họ',
        'Tên',
        'Khóa',
        'Mã Lớp SV',
        'Cố vấn học tập',
        'CVHT ghi nhận tình trạng xử lý',
        'CVHT ghi chú cụ thể khác',
        'Phân loại đối tượng theo hướng dẫn',
        'Số điện thoại SV',
        'Số điện thoại liên hệ',
        'Số điện thoại HKTT',
        'Số điện thoại cha',
        'Số điện thoại mẹ',
        'Ngành',
        'Điểm TBC',
        'Điểm TBCTL',
        'ĐTB10',
        'ĐTBCTL 10',
        'Số TCTL',
        'Số TC còn nợ',
        'Tổng TC CTĐT',
        '% tích lũy',
        'XLHT HK241 (UIS - XLHT theo quy chế)',
        `Đếm số lần bị XLHT qua các học kỳ đến ${currentTerm?.abbreviatName || ''})`,
        'Tình trạng ĐKMH HK242 (17/3/2025)',
        'Năm SV tuyển sinh',
        'RQS',
        'Khoa',
        'Danh sách',
        'Tình trạng (12/3/25)',
        'SV năm thứ (xếp theo STC trung bình toàn trường)',
        'Lý do XLHT HK241',
        'Kết quả XLHT các HK trước'
      ]

      const headerRow = worksheet.addRow(headers)

      // Style cho header
      headerRow.eachCell((cell: any) => {
        cell.font = { bold: true }
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      })
      headerRow.height = 70

      // Thêm dữ liệu
      allData.data.forEach((item, index) => {
        const rowData = [
          index + 1,
          item.studentId || '',
          item.lastName || '',
          item.firstName || '',
          item.cohortName || '',
          item.classId || '',
          item.handlerName || '',
          item.CVHTHandle?.processingResultName || '',
          item.CVHTNote || '',
          item.groupedByInstruction || '',
          item.sdtsv || '',
          item.sdtlh || '',
          item.sdthktt || '',
          item.sdtcha || '',
          item.sdtme || '',
          item.major || '',
          item.DTBC || 0,
          item.DTBCTL || 0,
          item.DTB10 || 0,
          item.DTBCTL10 || 0,
          item.TCTL || 0,
          item.TCCN || 0,
          item.TONGTCCTDT || 0,
          item.percentTL ? parseFloat(item.percentTL.toFixed(2)) : 0,
          item.processingHandle?.statusProcess || '',
          item.countWarning?.academicWarningsCount || 0,
          item.courseRegistration?.isRegister ? 'Có ĐK' : 'Không ĐK',
          item.admissionYear || '',
          item.RQS || '',
          item.faculty || '',
          item.list || '',
          item.statusOn?.status || '',
          item.yearLevel || '',
          item.reasonHandling?.reason || '',
          item.resultHandlingBefore || ''
        ]

        const row = worksheet.addRow(rowData)

        // Style cho data rows
        row.eachCell((cell: any) => {
          cell.alignment = { vertical: 'middle', wrapText: true }
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        })
      })

      // Tự động điều chỉnh độ rộng cột
      const colWidths = [
        5, 15, 15, 10, 8, 15, 20, 25, 25, 20, 15, 15, 15, 15, 15, 25, 10, 12, 10, 12, 10, 12, 12, 10, 30, 15, 25, 12, 8,
        30, 10, 15, 30, 40, 30
      ]

      worksheet.columns.forEach((column: any, index: number) => {
        if (colWidths[index]) {
          column.width = colWidths[index]
        }
      })

      // Thêm phần ký tên ở cuối
      const currentDate = new Date()
      const dateString = `TP.HCM, ngày   tháng   năm ${currentDate.getFullYear()}`

      // Thêm 2 dòng trống
      worksheet.addRow([])
      worksheet.addRow([])

      // Thêm dòng ngày tháng và merge với toàn bộ số cột
      const totalColumns = headers.length
      const dateRow = worksheet.addRow([dateString])

      dateRow.getCell(1).alignment = { horizontal: 'right' }
      dateRow.getCell(1).font = { italic: true }

      // Merge dòng ngày tháng từ cột A đến cột cuối
      worksheet.mergeCells(dateRow.number, 1, dateRow.number, totalColumns)

      // Thêm dòng "Người lập danh sách" và merge với toàn bộ số cột
      const signerRow = worksheet.addRow(['Người lập danh sách              '])

      signerRow.getCell(1).alignment = { horizontal: 'right' }
      signerRow.getCell(1).font = { bold: true }

      // Merge dòng người ký từ cột A đến cột cuối
      worksheet.mergeCells(signerRow.number, 1, signerRow.number, totalColumns)

      // Thêm 3 dòng trống cho chữ ký
      worksheet.addRow([])
      worksheet.addRow([])
      worksheet.addRow([])

      // Tạo tên file với thời gian hiện tại
      const fileName = `DS_XuLyHocVu_${new Date().toISOString().slice(0, 10)}.xlsx`

      // Xuất file
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')

      a.href = url
      a.download = fileName
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Lỗi khi xuất Excel:', error)
      alert('Có lỗi xảy ra khi xuất Excel. Vui lòng thử lại!')
    } finally {
      setIsExport(false)
    }
  }, [totalItems, id, filterField, filterValue, sortField, sortOrder, searchKey, currentTerm])

  return (
    <>
      <Dialog open={openViewByCategory} maxWidth='xl' onClose={handleClose} fullScreen>
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
            Danh sách {session?.title}
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
                  acedemicProcess={session}
                  data={dataListAcedemicProcess}
                  tooogleSendEmail={tooogleSendEmail}
                  toogleSendEmailRemind={toogleSendEmailRemind}
                  toogleManualAddFromViewByCate={toogleManualAddFromViewByCate}
                  toogleSendEmailRemindCommitment={toogleSendEmailRemindCommitment}
                />
                <LoadingButton
                  variant='contained'
                  color='success'
                  startIcon={<Iconify icon='mdi:file-excel' />}
                  onClick={handleExportExcel}
                  disabled={totalItems === 0 || isLoading}
                  loading={isExport}
                >
                  Xuất Excel ({totalItems} bản ghi)
                </LoadingButton>
              </div>
            </div>
            <TableAcedemicProcess
              data={dataListAcedemicProcess}
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
              mutateListAcedemicProcessBCNK={mutate}
            />
            <TablePagination
              component={() => (
                <TablePaginationCustomNoURL
                  data={dataListAcedemicProcess?.data || []}
                  page={page}
                  limit={limit}
                  total={dataListAcedemicProcess?.pagination.totalItems || 0}
                  setPage={setPage}
                />
              )}
              count={dataListAcedemicProcess?.pagination.totalItems || 0}
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
      <UpdateAcedemicProcessStatus
        mutate={mutate}
        open={openUpdateAcedemicProcessStatus}
        onClose={toogleUpdateAcedemicProcessStatus}
      />

      <ManualAddAcedemicProcess
        mutate={mutate}
        onClose={toogleManualAddFromViewByCate}
        open={openManualAddFromViewByCate}
      />
      <SendMailModal id={session?._id || ''} mutate={mutate} />
      <SendMailModalRemind id={session?._id || ''} />
      <SendMailModalRemindCommitment id={session?._id || sessionCVHT?._id || ''} />
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
