import { styled, TableRow } from '@mui/material'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover
  },

  textTransform: 'uppercase',

  // hide last border
  '&:last-child td, &:last-child th': {
    borderBottom: 0
  }
}))

export default StyledTableRow
