import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import type { Theme, SxProps } from '@mui/material/styles'

import EmptyContent from '../emptycontent'

// ----------------------------------------------------------------------

type Props = {
  notFound: boolean
  title?: string
  sx?: SxProps<Theme>
}

export default function TableNoData({ notFound, sx, title }: Props) {
  return (
    <TableRow>
      {notFound ? (
        <TableCell colSpan={20}>
          <EmptyContent
            filled
            title={title || 'Không tìm thấy dữ liệu'}
            sx={{
              py: 10,
              ...sx
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={20} sx={{ p: 0 }} />
      )}
    </TableRow>
  )
}
