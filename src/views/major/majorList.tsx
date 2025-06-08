import { useState } from 'react'

import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Tooltip,
  Collapse,
  Box,
  Typography,
  Chip,
  CircularProgress
} from '@mui/material'
import useSWR from 'swr'

import type { Major } from '@/types/management/majorType'
import TableNoData from '@/components/table/TableNotFound'
import Iconify from '@/components/iconify'
import majorService from '@/services/major.service'

import { useMajorStore } from '@/stores/major/major'
import TableLoading from '@/components/table/TableLoading'
import StyledTableRow from '@/components/table/StyledTableRow'

type MajorListProps = {
  page: number
  limit: number
  majors: Major[]
  total: number
  loading: boolean
}

export default function MajorList({ page, limit, majors, total, loading }: MajorListProps) {
  const { setMajor, toogleUpdateMajor, toogleDeleteMajor, toogleViewMajor, toogleAddConcentration } = useMajorStore()
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleExpanded = (majorId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [majorId]: !prev[majorId]
    }))
  }

  const ConcentrationRow = ({ major }: { major: Major }) => {
    const { data: concentrations, isLoading } = useSWR(
      expandedRows[major._id] ? `/api/major/view-list-concentration/${major._id}` : null,
      () => majorService.getConcerntrationByMajor(major._id)
    )

    return (
      <StyledTableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={expandedRows[major._id]} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography
                variant='subtitle2'
                gutterBottom
                component='div'
                sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
              >
                <Iconify icon='material-symbols:category' style={{ marginRight: 8, fontSize: 20, color: '#0065F8' }} />
                Danh sách chuyên ngành
              </Typography>

              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                  <CircularProgress size={20} sx={{ mr: 2 }} />
                  <Typography variant='body2' color='text.secondary'>
                    Đang tải danh sách chuyên ngành...
                  </Typography>
                </Box>
              ) : concentrations && concentrations.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {concentrations.map((concentration, index: number) => (
                    <Chip
                      key={concentration._id || index}
                      label={`${concentration.concentrationName}`}
                      variant='outlined'
                      size='small'
                      color='primary'
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant='body2' color='text.secondary' sx={{ fontStyle: 'italic' }}>
                  Chưa có chuyên ngành nào được thiết lập
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </StyledTableRow>
    )
  }

  return (
    <TableContainer
      sx={{
        position: 'relative',
        overflow: 'auto',
        maxHeight: 'calc(100vh - 300px)'
      }}
    >
      <Table stickyHeader sx={{ minWidth: 900 }}>
        <TableHead>
          <StyledTableRow
            sx={{
              textTransform: 'uppercase'
            }}
          >
            <TableCell width={50}></TableCell>
            <TableCell>STT</TableCell>
            <TableCell>Mã ngành</TableCell>
            <TableCell>Tên ngành</TableCell>
            <TableCell>Chương trình</TableCell>
            <TableCell align='right'>Thao tác</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {majors.map((major, index) => {
            const stt = (page - 1) * limit + index + 1

            return (
              <>
                <StyledTableRow key={major._id}>
                  <TableCell width={50}>
                    <IconButton
                      size='small'
                      onClick={() => toggleExpanded(major._id)}
                      sx={{
                        transform: expandedRows[major._id] ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }}
                    >
                      <Iconify icon='solar:alt-arrow-right-linear' />
                    </IconButton>
                  </TableCell>
                  <TableCell width={1} size='small'>
                    {stt}
                  </TableCell>
                  <TableCell size='small'>{major.majorId}</TableCell>
                  <TableCell size='small'>{major.majorName}</TableCell>
                  <TableCell size='small'>{major.typeMajor}</TableCell>
                  <TableCell size='small' align='right'>
                    <Tooltip title='Xem chi tiết'>
                      <IconButton
                        sx={{
                          color: 'primary.main'
                        }}
                        onClick={() => {
                          setMajor(major)
                          toogleViewMajor()
                        }}
                      >
                        <Iconify icon='solar:info-circle-bold' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Thêm chuyên ngành'>
                      <IconButton
                        onClick={() => {
                          setMajor(major)
                          toogleAddConcentration()
                        }}
                        sx={{
                          color: 'success.main'
                        }}
                      >
                        <Iconify icon='solar:add-circle-linear' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Cập nhật'>
                      <IconButton
                        sx={{
                          color: 'warning.main'
                        }}
                        onClick={() => {
                          setMajor(major)
                          toogleUpdateMajor()
                        }}
                      >
                        <Iconify icon='solar:pen-2-linear' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Xóa'>
                      <IconButton
                        sx={{
                          color: 'error.main'
                        }}
                        onClick={() => {
                          setMajor(major)
                          toogleDeleteMajor()
                        }}
                      >
                        <Iconify icon='solar:trash-bin-2-linear' />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </StyledTableRow>
                <ConcentrationRow major={major} />
              </>
            )
          })}
          {loading && total === 0 ? (
            <TableLoading colSpan={12} />
          ) : (
            <TableNoData notFound={total === 0} title='Không tìm thấy ngành nào' />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
