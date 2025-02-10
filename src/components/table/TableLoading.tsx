import { Box, CircularProgress, TableCell, TableRow } from '@mui/material'

const TableLoading = ({ colSpan }: { colSpan: number }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align='center'>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 200
          }}
        >
          <CircularProgress />
        </Box>
      </TableCell>
    </TableRow>
  )
}

export default TableLoading
