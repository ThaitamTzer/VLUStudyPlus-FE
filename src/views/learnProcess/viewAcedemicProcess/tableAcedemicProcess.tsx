import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableSortLabel,
  Stack,
  MenuItem,
  IconButton
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
    setProcessing
  } = props

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

  // const renderprocessing = (data: processing[]) => {
  //   return data.map(p => `${p.statusHandling} (${p.termName})`).join('; ')
  // }

  // const rendercourseRegistration = (data: courseRegistration[]) => {
  //   return data.map(p => `${p.isRegister ? 'Có' : 'Không'} => (${p.termName})`).join(', ')
  // }

  return (
    <TableContainer sx={{ position: 'relative', overflowX: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
      <Table stickyHeader sx={{ minWidth: 2800 }}>
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
                  sm: 9
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
                  sm: 9
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
            {/* <TableCell>
              <TableSortLabel
                active={sortField === 'processing'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('processing')}
              >
                XLHV
              </TableSortLabel>
            </TableCell> */}
            <TableCell>
              <TableSortLabel
                active={sortField === 'handlingStatusByAAO'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('handlingStatusByAAO')}
              >
                Diện XLHV (PĐT đề nghị)
              </TableSortLabel>
            </TableCell>
            {/* <TableCell> */}
            {/* <TableSortLabel
                active={sortField === 'courseRegistration'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('courseRegistration')}
              >
                ĐKMH
              </TableSortLabel> */}
            {/* </TableCell> */}
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
                    overflow: 'hidden',
                    backgroundColor: { xs: 'action.hover.light', sm: 'background.paper' },
                    borderRight: { xs: 'none', sm: '1px solid rgba(224, 224, 224, 1)' }
                  }}
                >
                  {renderStudent(d)}
                </TableCell>
                {/* <TableCell>{renderprocessing(d.processing)}</TableCell> */}
                {termNames.map(term => {
                  const processingData = d.processing.find(p => p.termName === term)

                  return (
                    <TableCell key={term}>
                      {processingData && processingData.statusHandling ? processingData.statusHandling : '-'}
                    </TableCell>
                  )
                })}
                <TableCell>{d.handlingStatusByAAO}</TableCell>
                {/* <TableCell>{rendercourseRegistration(d.courseRegistration)}</TableCell> */}
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
                <TableCell>{d.DTBC}</TableCell>
                <TableCell>{d.STC}</TableCell>
                <TableCell>{d.DTBCTL}</TableCell>
                <TableCell>{d.STCTL}</TableCell>
                <TableCell>{d.reasonHandling}</TableCell>
                <TableCell>{d.yearLevel}</TableCell>
                <TableCell>{d.faculty}</TableCell>
                <TableCell>{d.year}</TableCell>
                <TableCell>{d.termName}</TableCell>
                <TableCell
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
                  <IconButton size='small' onClick={() => {}}>
                    <Iconify icon='bi:eye' />
                  </IconButton>
                  <RowAction size='small'>
                    <MenuItem
                      onClick={() => {
                        setProcessing(d)
                        toogleEditViewAcedemicProcess()
                      }}
                    >
                      <Iconify icon='solar:pen-2-linear' />
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
