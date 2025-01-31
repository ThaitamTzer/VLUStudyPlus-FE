import { Pagination, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

type TablePaginationProps = {
  data: any[]
  page: number
  limit: number
  total: number
  searchKey: string
}

export default function TablePaginationCustom({ data, page, limit, total, searchKey }: TablePaginationProps) {
  const router = useRouter()
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
          const params = new URLSearchParams()
          params.set('page', page.toString())
          params.set('limit', String(limit))
          if (searchKey) {
            params.set('searchKey', searchKey)
          }
          router.push(`?${params.toString()}`)
        }}
        showFirstButton
        showLastButton
      />
    </div>
  )
}
