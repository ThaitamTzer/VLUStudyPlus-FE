'use client'

import { useCallback } from 'react'

import { IconButton, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, Tooltip } from '@mui/material'

import StyledTableRow from '@/components/table/StyledTableRow'
import type { TrainingProgramType } from '@/types/management/trainningProgramType'
import { useTrainingProgramStore } from '@/stores/trainingProgram.store'
import RowAction from '@/components/rowAction'
import Iconify from '@/components/iconify'
import TableLoading from '@/components/table/TableLoading'
import TableNoData from '@/components/table/TableNotFound'

type TableTrainingProgramProps = {
  data: TrainingProgramType[]
  page: number
  limit: number
  loading: boolean
  total: number
}

export default function TableTrainingProgram(props: TableTrainingProgramProps) {
  const { data, limit, loading, page, total } = props

  const {
    toogleViewTrainingProgramByFrame,
    toogleDeleteTrainingProgram,
    toogleImportTrainingProgramSession,
    toogleUpdateTrainingProgram,
    setTrainingProgram
  } = useTrainingProgramStore()

  const handleOpenUpdateTrainingProgram = useCallback(
    (trainingProgram: TrainingProgramType) => {
      toogleUpdateTrainingProgram()
      setTrainingProgram(trainingProgram)
    },
    [setTrainingProgram, toogleUpdateTrainingProgram]
  )

  const handleOpenDeleteTrainingProgram = useCallback(
    (trainingProgram: TrainingProgramType) => {
      toogleDeleteTrainingProgram()
      setTrainingProgram(trainingProgram)
    },
    [setTrainingProgram, toogleDeleteTrainingProgram]
  )

  const handleOpenImportTrainingProgram = useCallback(
    (trainingProgram: TrainingProgramType) => {
      toogleImportTrainingProgramSession()
      setTrainingProgram(trainingProgram)
    },
    [setTrainingProgram, toogleImportTrainingProgramSession]
  )

  return (
    <TableContainer
      sx={{
        position: 'relative',
        overflow: 'auto',
        maxHeight: 'calc(100vh - 200px)'
      }}
    >
      <Table
        stickyHeader
        sx={{
          minWidth: 1100
        }}
      >
        <TableHead>
          <StyledTableRow sx={{ textTransform: 'uppercase' }}>
            <TableCell width='1px'>STT</TableCell>
            <TableCell>Tên khung chương trình</TableCell>
            <TableCell>Tổng số tính chỉ</TableCell>
            <TableCell colSpan={2}>Niên khóa</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {data?.map((item, index) => {
            const stt = (page - 1) * limit + index + 1

            return (
              <StyledTableRow key={item._id}>
                <TableCell width='1px'>{stt}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.credit}</TableCell>
                <TableCell>{item.cohortId.cohortId}</TableCell>
                <TableCell align='right' size='small'>
                  <Tooltip arrow title='Xem chương trình đào tạo'>
                    <IconButton
                      onClick={() => {
                        toogleViewTrainingProgramByFrame()
                        setTrainingProgram(item)
                      }}
                    >
                      <Iconify icon='hugeicons:property-view' color='#6f42c1' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Nhập chương trình đào tạo' arrow>
                    <IconButton
                      onClick={() => {
                        handleOpenImportTrainingProgram(item)
                      }}
                    >
                      <Iconify icon='clarity:import-line' color='#198754' />
                    </IconButton>
                  </Tooltip>
                  <RowAction>
                    <MenuItem
                      onClick={() => {
                        handleOpenUpdateTrainingProgram(item)
                      }}
                      sx={{
                        color: 'warning.main'
                      }}
                    >
                      <Iconify icon='carbon:edit' />
                      Cập nhật khung chương trình
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleOpenDeleteTrainingProgram(item)
                      }}
                      sx={{
                        color: 'error.main'
                      }}
                    >
                      <Iconify icon='iconamoon:trash-light' />
                      Xóa khung chương trình
                    </MenuItem>
                  </RowAction>
                </TableCell>
              </StyledTableRow>
            )
          })}
          {loading && total === 0 ? (
            <TableLoading colSpan={12} />
          ) : (
            <TableNoData notFound={total === 0} title='Không tìm thấy khung ctđt nào' />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
