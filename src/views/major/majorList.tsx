import { IconButton, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { fDate } from '@/utils/format-time'
import type { Major } from '@/types/management/majorType'
import TableNoData from '@/components/table/TableNotFound'
import RowAction from '@/components/rowAction'
import Iconify from '@/components/iconify'

import { useMajorStore } from '@/stores/major/major'

type MajorListProps = {
  page: number
  limit: number
  majors: Major[]
  total: number
}

export default function MajorList({ page, limit, majors, total }: MajorListProps) {
  const { setMajor, toogleUpdateMajor, toogleDeleteMajor, toogleViewMajor } = useMajorStore()

  return (
    <TableContainer
      sx={{
        position: 'relative',
        overflow: 'auto',
        maxHeight: 'calc(100vh - 300px)'
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow
            sx={{
              textTransform: 'uppercase'
            }}
          >
            <TableCell>STT</TableCell>
            <TableCell>Mã chuyên ngành</TableCell>
            <TableCell>Tên chuyên ngành</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell colSpan={2}>Ngày cập nhật</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {majors.map((major, index) => {
            const stt = (page - 1) * limit + index + 1

            return (
              <TableRow key={major._id}>
                <TableCell size='small'>{stt}</TableCell>
                <TableCell size='small'>{major.majorId}</TableCell>
                <TableCell size='small'>{major.majorName}</TableCell>
                <TableCell size='small'>{fDate(major.createdAt, 'dd/MM/yyy')}</TableCell>
                <TableCell size='small'>{fDate(major.updatedAt, 'dd/MM/yyyy')}</TableCell>
                <TableCell size='small' align='right'>
                  <IconButton
                    onClick={() => {
                      setMajor(major)
                      toogleViewMajor()
                    }}
                  >
                    <Iconify icon='solar:eye-bold-duotone' />
                  </IconButton>
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
              </TableRow>
            )
          })}
          <TableNoData notFound={total === 0} title='Không tìm thấy chuyên ngành nào' />
        </TableBody>
      </Table>
    </TableContainer>
  )
}
