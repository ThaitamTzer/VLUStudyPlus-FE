import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { fDate } from '@/utils/format-time'
import type { Major } from '@/types/management/majorType'
import TableNoData from '@/components/table/TableNotFound'

type MajorListProps = {
  page: number
  limit: number
  majors: Major[]
  total: number
}

export default function MajorList({ page, limit, majors, total }: MajorListProps) {
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
            <TableCell>Ngày cập nhật</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {majors.map((major, index) => {
            const stt = (page - 1) * limit + index + 1

            return (
              <TableRow key={major._id}>
                <TableCell>{stt}</TableCell>
                <TableCell>{major.majorId}</TableCell>
                <TableCell>{major.majorName}</TableCell>
                <TableCell>{fDate(major.createdAt, 'dd/MM/yyy')}</TableCell>
                <TableCell>{fDate(major.updatedAt, 'dd/MM/yyyy')}</TableCell>
              </TableRow>
            )
          })}
          <TableNoData notFound={total === 0} title='Không tìm thấy chuyên ngành nào' />
        </TableBody>
      </Table>
    </TableContainer>
  )
}
