import { Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableSortLabel } from '@mui/material'

import { flexRender, type Table } from '@tanstack/react-table'

import StyledTableRow from '@/components/table/StyledTableRow'
import TableLoading from '@/components/table/TableLoading'
import TableNoData from '@/components/table/TableNotFound'

export default function TableTypeProcess({
  table,
  loading,
  title
}: {
  table: Table<any>
  loading: boolean
  title?: string
}) {
  return (
    <TableContainer sx={{ position: 'relative', overflowX: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
      <MuiTable stickyHeader sx={{ minWidth: 800 }}>
        <TableHead>
          <StyledTableRow sx={{ textTransform: 'uppercase' }}>
            {table.getHeaderGroups().map(headerGroup =>
              headerGroup.headers.map(header => (
                <TableCell key={header.id}>
                  {header.column.getCanSort() ? (
                    <TableSortLabel
                      active={!!header.column.getIsSorted()}
                      direction={header.column.getIsSorted() === 'desc' ? 'desc' : 'asc'}
                      onClick={() => header.column.toggleSorting()}
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
                    align={(cell.column.columnDef.meta as any)?.algin}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </StyledTableRow>
            )
          })}
          {loading && table.getRowModel().rows.length === 0 ? (
            <TableLoading colSpan={12} />
          ) : (
            <TableNoData
              notFound={table.getRowModel().rows.length === 0}
              title={title || 'Không tìm thấy loại xử lý nào'}
            />
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  )
}
