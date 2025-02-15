import { IconButton, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, Tooltip } from '@mui/material'

import type { Major } from '@/types/management/majorType'
import TableNoData from '@/components/table/TableNotFound'
import RowAction from '@/components/rowAction'
import Iconify from '@/components/iconify'

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
  const { setMajor, toogleUpdateMajor, toogleDeleteMajor, toogleViewMajor } = useMajorStore()

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
            <TableCell>STT</TableCell>
            <TableCell>Mã ngành</TableCell>
            <TableCell colSpan={2}>Tên ngành</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {majors.map((major, index) => {
            const stt = (page - 1) * limit + index + 1

            return (
              <StyledTableRow key={major._id}>
                <TableCell width={1} size='small'>
                  {stt}
                </TableCell>
                <TableCell size='small'>{major.majorId}</TableCell>
                <TableCell size='small'>{major.majorName}</TableCell>
                <TableCell size='small' align='right'>
                  <Tooltip title='Xem chi tiết'>
                    <IconButton
                      onClick={() => {
                        setMajor(major)
                        toogleViewMajor()
                      }}
                    >
                      <Iconify icon='solar:eye-bold-duotone' />
                    </IconButton>
                  </Tooltip>
                  <RowAction>
                    <MenuItem
                      onClick={() => {
                        setMajor(major)
                        toogleUpdateMajor()
                      }}
                    >
                      <Iconify icon='solar:pen-2-linear' />
                      Sửa
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setMajor(major)
                        toogleDeleteMajor()
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
          {loading && total === 0 ? (
            <TableLoading colSpan={12} />
          ) : (
            <TableNoData notFound={total === 0} title='Không tìm thấy sinh viên nào' />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
