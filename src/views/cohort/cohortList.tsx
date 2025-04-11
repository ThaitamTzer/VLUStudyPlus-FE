import { Table as MuiTable, TableContainer, TableHead, TableBody, TableCell, TableSortLabel } from '@mui/material'

import { flexRender, type Table } from '@tanstack/react-table'

import StyledTableRow from '@/components/table/StyledTableRow'
import TableNoData from '@/components/table/TableNotFound'

type CohortListProps = {
  table: Table<any>
}

export default function CohortList({ table }: CohortListProps) {
  return (
    <TableContainer sx={{ position: 'relative', overflowX: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
      <MuiTable stickyHeader sx={{ minWidth: 800 }}>
        <TableHead>
          <StyledTableRow
            sx={{
              textTransform: 'uppercase'
            }}
          >
            {table.getHeaderGroups().map(headerGroup =>
              headerGroup.headers.map(header => (
                <TableCell key={header.id}>
                  {header.column.getCanSort() ? (
                    <TableSortLabel
                      active={!!header.column.getIsSorted()}
                      direction={header.column.getIsSorted() === 'desc' ? 'desc' : 'asc'}
                      onClick={() => header.column.toggleSorting()}
                      sx={{}}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableSortLabel>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </TableCell>
              ))
            )}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map(row => {
            return (
              <StyledTableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell
                    width={(cell.column.columnDef.meta as any)?.width}
                    size='small'
                    align={(cell.column.columnDef.meta as any)?.align}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </StyledTableRow>
            )
          })}
        </TableBody>
        <TableNoData notFound={table.getRowModel().rows.length === 0} title='Không tìm thấy niên khóa nào' />
      </MuiTable>
    </TableContainer>
  )
}
