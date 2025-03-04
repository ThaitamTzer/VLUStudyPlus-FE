import { Pagination, Typography } from '@mui/material'

type TablePaginationProps = {
  data: any[]
  page: number
  limit: number
  total: number
  setPage: (page: number) => void
}

export default function TablePaginationCustomNoURL({ data, page, limit, total, setPage }: TablePaginationProps) {
  return (
    <div className='flex md:justify-between justify-center items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
      <Typography>
        {`Hiển thị ${
          data.length === 0 ? 0 : (page - 1) * limit + 1
        } đến ${Math.min(page * limit, total)} của ${total} bản ghi`}
      </Typography>
      <Pagination
        shape='rounded'
        color='primary'
        variant='tonal'
        count={Math.ceil(total / limit)}
        page={page}
        onChange={(_, page) => {
          setPage(page as number)
        }}
        showFirstButton
        showLastButton
      />
    </div>
  )
}
