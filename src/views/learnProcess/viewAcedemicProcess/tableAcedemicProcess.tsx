import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableSortLabel,
  Stack,
  MenuItem,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material'

import StyledTableRow from '@/components/table/StyledTableRow'
import TableLoading from '@/components/table/TableLoading'
import TableNoData from '@/components/table/TableNotFound'
import type { ListProcessingType, ProcessingType } from '@/types/management/learnProcessType'
import RowAction from '@/components/rowAction'
import Iconify from '@/components/iconify'

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
    toogleEditViewAcedemicProcess,
    toogleDeleteViewAcedemicProcess,
    setProcessing,
    toogleViewDetailAcedemicProcess,
    toogleOpenUpdateAcedemicProcessStatus
  } = props

  console.log(data)

  const termNames = Array.from(new Set(data?.data.flatMap(d => d.processing.map(p => p.termName)) || []))

  const termNamesCouseRegistration = Array.from(
    new Set(data?.data.flatMap(d => d.courseRegistration.map(p => p.termName)) || [])
  )

  const renderStudent = (student: ProcessingType) => {
    return (
      <Stack key={student._id} direction='column'>
        <Stack spacing={2}>
          <p>
            {student.studentId} - {student.firstName} {student.lastName}
          </p>
        </Stack>
        <p>
          Lớp: {student.classId} - {student.cohortName}
        </p>
      </Stack>
    )
  }

  return (
    <TableContainer sx={{ position: 'relative', overflowX: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
      <Table stickyHeader sx={{ minWidth: 3100 }}>
        <TableHead>
          <StyledTableRow
            sx={{
              textTransform: 'uppercase'
            }}
          >
            <TableCell
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
            {termNames.map(term => (
              <TableCell key={term}>XLHV ({term})</TableCell>
            ))}

            <TableCell>
              <TableSortLabel
                active={sortField === 'handlingStatusByAAO'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('handlingStatusByAAO')}
              >
                Diện XLHV (PĐT đề nghị)
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'status'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('status')}
              >
                CVHT Xử lý
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'commitment'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('commitment')}
              >
                Đơn cam kết
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'processingResult'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('processingResult')}
              >
                Kết quả xử lý
              </TableSortLabel>
            </TableCell>
            <TableCell>Lưu ý</TableCell>
            {termNamesCouseRegistration.map(term => (
              <TableCell key={term}>ĐKMH ({term})</TableCell>
            ))}
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
                active={sortField === 'STC'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('STC')}
              >
                STC
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
                active={sortField === 'STCTL'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('STCTL')}
              >
                STCTL
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'reasonHandling'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('reasonHandling')}
              >
                Lý do XLHV (UIS)
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
            <TableCell>
              <TableSortLabel
                active={sortField === 'year'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('year')}
              >
                Năm học
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'termName'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('termName')}
              >
                Học kỳ
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
                {termNames.map(term => {
                  const processingData = d.processing.find(p => p.termName === term)

                  return (
                    <TableCell key={term}>
                      {processingData && processingData.statusHandling ? processingData.statusHandling : '-'}
                    </TableCell>
                  )
                })}
                <TableCell>{d.handlingStatusByAAO}</TableCell>
                <TableCell>
                  {d.status ? (
                    <Badge
                      sx={{
                        backgroundColor: 'success.main',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px'
                      }}
                    >
                      Đã xử lý
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
                  {d.commitment ? (
                    <Badge
                      sx={{
                        backgroundColor: 'success.main',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px'
                      }}
                    >
                      Đã làm đơn
                    </Badge>
                  ) : d?.processingResult?.commitment === undefined ? (
                    <Badge
                      sx={{
                        backgroundColor: 'info.main',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px'
                      }}
                    >
                      Chờ CVHT xử lý
                    </Badge>
                  ) : d?.processingResult?.commitment ? (
                    <Badge
                      sx={{
                        backgroundColor: 'warning.main',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px'
                      }}
                    >
                      Sinh viên chưa làm đơn
                    </Badge>
                  ) : (
                    <Badge
                      sx={{
                        backgroundColor: 'secondary.main',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px'
                      }}
                    >
                      Sinh viên không cần làm đơn
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{d.processingResult?.processingResultName || ''}</TableCell>
                <TableCell>{d.note || ''}</TableCell>
                {termNamesCouseRegistration.map(term => {
                  const courseRegistrationData = d.courseRegistration.find(p => p.termName === term)

                  return (
                    <TableCell key={term}>
                      {courseRegistrationData ? (courseRegistrationData.isRegister ? 'Có' : 'Không') : '-'}
                      {courseRegistrationData
                        ? courseRegistrationData.note
                          ? ` => ${courseRegistrationData.note}`
                          : ''
                        : ''}
                    </TableCell>
                  )
                })}
                <TableCell width={10}>{d.DTBC}</TableCell>
                <TableCell width={10}>{d.STC}</TableCell>
                <TableCell width={10}>{d.DTBCTL}</TableCell>
                <TableCell width={10}>{d.STCTL}</TableCell>
                <TableCell width={200}>{d.reasonHandling}</TableCell>
                <TableCell>{d.yearLevel || '-'}</TableCell>
                <TableCell>{d.faculty}</TableCell>
                <TableCell>{d.year}</TableCell>
                <TableCell>{d.termName}</TableCell>
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
                  <Tooltip arrow title='Xem chi tiết xử lý học tập'>
                    <IconButton
                      size='small'
                      color='info'
                      onClick={() => {
                        setProcessing(d)
                        toogleViewDetailAcedemicProcess()
                      }}
                    >
                      <Iconify icon='bi:eye' />
                    </IconButton>
                  </Tooltip>
                  <RowAction size='small'>
                    <MenuItem
                      onClick={() => {
                        setProcessing(d)
                        toogleOpenUpdateAcedemicProcessStatus()
                      }}
                    >
                      <Iconify icon='fluent:edit-32-regular' />
                      Cập nhật kết quả xử lý
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setProcessing(d)
                        toogleEditViewAcedemicProcess()
                      }}
                    >
                      <Iconify icon='fluent:edit-32-regular' />
                      Sửa
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setProcessing(d)
                        toogleDeleteViewAcedemicProcess()
                      }}
                    >
                      <Iconify icon='solar:trash-bin-2-linear' />
                      Xóa
                    </MenuItem>
                  </RowAction>
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
  )
}
