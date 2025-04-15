import { useCallback, useState } from 'react'

import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableSortLabel,
  Stack,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material'

import StyledTableRow from '@/components/table/StyledTableRow'
import TableLoading from '@/components/table/TableLoading'
import TableNoData from '@/components/table/TableNotFound'
import type { ListProcessingType, ProcessingType } from '@/types/management/learnProcessType'
import Iconify from '@/components/iconify'
import CustomIconButton from '@/@core/components/mui/IconButton'
import formInstanceService from '@/services/formInstance.service'
import FormInstancePDF from './FormInstancePDF'
import type { FormInstanceType } from '@/types/management/formInstanceType'

type TableAcedemicProcessProps = {
  data: ListProcessingType | undefined
  isLoading: boolean
  page: number
  limit: number
  sortField: string
  sortOrder: string
  handleSort: (field: string) => void
  toogleEditViewAcedemicProcess: () => void
  toogleDeleteViewAcedemicProcess: () => void
  setProcessing: (processing: ProcessingType) => void
  toogleViewDetailAcedemicProcess: () => void
  toogleOpenUpdateAcedemicProcessStatus: () => void
}

export default function TableAcedemicProcess(props: TableAcedemicProcessProps) {
  const {
    data,
    isLoading,
    page,
    limit,
    sortField,
    sortOrder,
    handleSort,
    toogleDeleteViewAcedemicProcess,
    setProcessing,
    toogleOpenUpdateAcedemicProcessStatus
  } = props

  const [openFormViewer, setOpenFormViewer] = useState(false)
  const [formInstance, setFormInstance] = useState<FormInstanceType | null>(null)
  const [nameOfForm, setNameOfForm] = useState<string>('')

  const renderStudent = (student: ProcessingType) => {
    return (
      <Stack key={student._id} direction='column'>
        <Stack spacing={2}>
          <p>
            {student.studentId} - {student.lastName} {student.firstName}
          </p>
        </Stack>
        <p>
          Lớp: {student.classId} - {student.cohortName}
        </p>
      </Stack>
    )
  }

  const renderStatusOfProcessing = (student: ProcessingType) => {
    const status = student.statusOfProcessing

    switch (status) {
      case 'Hoàn thành':
        return (
          <Badge sx={{ backgroundColor: 'success.main', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>
            Hoàn thành
          </Badge>
        )

      case 'Cần làm đơn':
        return (
          <Badge sx={{ backgroundColor: 'error.main', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>
            Cần làm đơn
          </Badge>
        )
      case 'Đã làm đơn':
        return (
          <>
            <Badge sx={{ backgroundColor: 'success.main', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>
              Đã làm đơn
            </Badge>
            <Tooltip title='Xem đơn' arrow>
              <CustomIconButton
                size='small'
                color='info'
                variant='contained'
                sx={{ ml: 1 }}
                onClick={() => handleViewDetailForm(student._id, student.lastName + ' ' + student.firstName)}
              >
                <Iconify icon='mdi:file-document-outline' />
              </CustomIconButton>
            </Tooltip>
          </>
        )
      default:
        return (
          <Badge sx={{ backgroundColor: 'warning.main', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>
            Vừa tạo
          </Badge>
        )
    }
  }

  const handleViewDetailForm = useCallback(async (id: string, nameOfForm: string) => {
    try {
      // Lấy chi tiết form instance từ API
      const formDetail = await formInstanceService.getFormDetail_BCNK(id)

      setFormInstance(formDetail)
      setNameOfForm(nameOfForm)
      setOpenFormViewer(true)
    } catch (error) {
      console.error('Error loading form instance:', error)
    }
  }, [])

  const handleCloseFormViewer = useCallback(() => {
    setOpenFormViewer(false)
  }, [])

  return (
    <>
      <TableContainer sx={{ position: 'relative', overflowX: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
        <Table stickyHeader sx={{ minWidth: 3500 }}>
          <TableHead>
            <StyledTableRow
              sx={{
                textTransform: 'uppercase'
              }}
            >
              <TableCell
                width={1}
                sx={{
                  position: {
                    xs: 'none',
                    sm: 'sticky'
                  },
                  zIndex: {
                    xs: 0,
                    sm: 20
                  },
                  left: 0,
                  overflow: 'hidden',
                  backgroundColor: {
                    xs: 'action.hover.light'
                  }
                }}
              >
                Stt
              </TableCell>
              <TableCell
                width={300}
                sx={{
                  position: {
                    xs: 'none',
                    sm: 'sticky'
                  },
                  zIndex: {
                    xs: 0,
                    sm: 20
                  },
                  left: 55,
                  overflow: 'hidden',
                  borderRight: {
                    xs: 'none',
                    sm: '1px solid rgba(224, 224, 224, 1)'
                  },
                  backgroundColor: {
                    xs: 'action.hover.light'
                  }
                }}
              >
                <TableSortLabel
                  active={sortField === 'firstName'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('firstName')}
                >
                  Sinh viên
                </TableSortLabel>
              </TableCell>
              <TableCell width={200}>
                <TableSortLabel
                  active={sortField === 'CVHTHandle.processingResultName'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('CVHTHandle.processingResultName')}
                >
                  Trạng thái xử lý
                </TableSortLabel>
              </TableCell>
              <TableCell width={200}>
                <TableSortLabel
                  active={sortField === 'CVHTHandle.processingResultName'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('CVHTHandle.processingResultName')}
                >
                  CVHT ghi nhận tình trạng xử lý
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'CVHTNote'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('CVHTNote')}
                >
                  CVHT ghi chú cụ thể khác
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'handlerName'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('handlerName')}
                >
                  Người xử lý
                </TableSortLabel>
              </TableCell>
              <TableCell width={200}>
                <TableSortLabel
                  active={sortField === 'processingHandle'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('processingHandle')}
                >
                  XLHT {data?.data[0]?.processingHandle?.note} (UIS - XLHT theo quy chế)
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'reasonHandling'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('reasonHandling')}
                >
                  Lý do XLHT {data?.data[0]?.reasonHandling?.note}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'statusOn'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('statusOn')}
                >
                  Tình trạng
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'courseRegistration'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('courseRegistration')}
                >
                  Đăng ký môn học
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'DTBC'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('DTBC')}
                >
                  ĐTBC
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'DTBCTL'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('DTBCTL')}
                >
                  ĐTBCTL
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'TCTL'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('TCTL')}
                >
                  TCTL
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'TCCN'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('TCCN')}
                >
                  TCCN
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'TONGTCCTDT'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('TONGTCCTDT')}
                >
                  Tổng TC
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'percentTL'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('percentTL')}
                >
                  % TL
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'DTB10'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('DTB10')}
                >
                  ĐTB10
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'DTBCTL10'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('DTBCTL10')}
                >
                  ĐTBCTL10
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'academicWarningsCount'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('academicWarningsCount')}
                >
                  Số lần cảnh báo
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'admissionYear'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('admissionYear')}
                >
                  Năm nhập học
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'RQS'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('RQS')}
                >
                  RQS
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'list'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('list')}
                >
                  Danh sách
                </TableSortLabel>
              </TableCell>
              <TableCell width={300}>
                <TableSortLabel
                  active={sortField === 'resultHandlingBefore'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('resultHandlingBefore')}
                >
                  Kết quả xử lý trước
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'yearLevel'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('yearLevel')}
                >
                  Năm thứ
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'faculty'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('faculty')}
                >
                  Khoa
                </TableSortLabel>
              </TableCell>
              <TableCell
                align='right'
                width={120}
                sx={{
                  position: {
                    xs: 'none',
                    sm: 'sticky'
                  },
                  zIndex: {
                    xs: 0,
                    sm: 9
                  },
                  right: 0,
                  overflow: 'hidden',
                  backgroundColor: {
                    xs: 'action.hover.light'
                  },
                  borderLeft: {
                    xs: 'none',
                    sm: '1px solid rgba(224, 224, 224, 1)'
                  }
                }}
              >
                Thao tác
              </TableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((d, index) => {
              const stt = (page - 1) * limit + index + 1

              return (
                <StyledTableRow key={d._id}>
                  <TableCell
                    sx={{
                      position: {
                        xs: 'none',
                        sm: 'sticky'
                      },
                      left: 0,
                      zIndex: {
                        xs: 0,
                        sm: 9
                      },
                      overflow: 'hidden',
                      backgroundColor: { xs: 'action.hover.light', sm: 'background.paper' }
                    }}
                  >
                    {stt}
                  </TableCell>
                  <TableCell
                    sx={{
                      position: {
                        xs: 'none',
                        sm: 'sticky'
                      },
                      left: 55,
                      zIndex: {
                        xs: 0,
                        sm: 9
                      },
                      overflow: 'hidden',
                      backgroundColor: { xs: 'action.hover.light', sm: 'background.paper' },
                      borderRight: { xs: 'none', sm: '1px solid rgba(224, 224, 224, 1)' }
                    }}
                  >
                    {renderStudent(d)}
                  </TableCell>
                  <TableCell width={200}>{renderStatusOfProcessing(d)}</TableCell>
                  <TableCell width={200}>{d.CVHTHandle?.processingResultName || '-'}</TableCell>
                  <TableCell width={200}>{d.CVHTNote || '-'}</TableCell>
                  <TableCell width={10}>{d.handlerName || '-'}</TableCell>
                  <TableCell>{d.processingHandle?.statusProcess || '-'}</TableCell>
                  <TableCell width={200}>{d.reasonHandling?.reason || '-'}</TableCell>
                  <TableCell>
                    {d.statusOn?.status ? (
                      <Badge
                        sx={{
                          backgroundColor: 'success.main',
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '5px'
                        }}
                      >
                        {d.statusOn.status}
                      </Badge>
                    ) : (
                      <Badge
                        sx={{
                          backgroundColor: 'error.main',
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '5px'
                        }}
                      >
                        Chưa xử lý
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {d.courseRegistration?.isRegister ? (
                      <Badge
                        sx={{
                          backgroundColor: 'success.main',
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '5px'
                        }}
                      >
                        Đã đăng ký
                      </Badge>
                    ) : (
                      <Badge
                        sx={{
                          backgroundColor: 'error.main',
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '5px'
                        }}
                      >
                        Chưa đăng ký
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell width={10}>{d.DTBC}</TableCell>
                  <TableCell width={10}>{d.DTBCTL}</TableCell>
                  <TableCell width={10}>{d.TCTL}</TableCell>
                  <TableCell width={10}>{d.TCCN}</TableCell>
                  <TableCell width={10}>{d.TONGTCCTDT}</TableCell>
                  <TableCell width={10}>{d.percentTL?.toFixed(2) || '-'}</TableCell>
                  <TableCell width={10}>{d.DTB10}</TableCell>
                  <TableCell width={10}>{d.DTBCTL10}</TableCell>
                  <TableCell width={10}>{d.countWarning?.academicWarningsCount || '-'}</TableCell>
                  <TableCell width={10}>{d.admissionYear || '-'}</TableCell>
                  <TableCell width={10}>{d.RQS || '-'}</TableCell>
                  <TableCell width={10}>{d.list || '-'}</TableCell>
                  <TableCell>{d.resultHandlingBefore || '-'}</TableCell>
                  <TableCell>{d.yearLevel || '-'}</TableCell>
                  <TableCell>{d.faculty}</TableCell>
                  <TableCell
                    align='right'
                    sx={{
                      position: {
                        xs: 'none',
                        sm: 'sticky'
                      },
                      right: 0,
                      overflow: 'hidden',
                      backgroundColor: { xs: 'action.hover.light', sm: 'background.paper' },
                      borderLeft: { xs: 'none', sm: '1px solid rgba(224, 224, 224, 1)' }
                    }}
                  >
                    <Tooltip title='Cập nhật kết quả xử lý' arrow>
                      <IconButton
                        size='small'
                        color='warning'
                        onClick={() => {
                          setProcessing(d)
                          toogleOpenUpdateAcedemicProcessStatus()
                        }}
                      >
                        <Iconify icon='fluent:edit-32-regular' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Xóa XLHV' arrow>
                      <IconButton
                        size='small'
                        color='error'
                        onClick={() => {
                          setProcessing(d)
                          toogleDeleteViewAcedemicProcess()
                        }}
                      >
                        <Iconify icon='solar:trash-bin-2-linear' />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </StyledTableRow>
              )
            })}
            {isLoading ? (
              <TableLoading colSpan={20} />
            ) : (
              <TableNoData notFound={data?.data.length === 0} title={'Không tìm dữ liệu nào'} />
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog để xem đơn đã điền */}
      {formInstance && (
        <FormInstancePDF
          instance={formInstance}
          open={openFormViewer}
          onClose={handleCloseFormViewer}
          nameOfForm={nameOfForm}
        />
      )}
    </>
  )
}
