import { useRouter } from 'next/navigation'

import { Pagination, Typography } from '@mui/material'

type TablePaginationProps = {
  data: any[]
  page: number
  limit: number
  total: number
  searchKey?: string
  filterField?: string
  filterValue?: string
  sortField?: string
  sortOrder?: string
  typeList?: string
}

export default function TablePaginationCustom({
  data,
  page,
  limit,
  total,
  searchKey,
  filterField,
  filterValue,
  sortField,
  sortOrder,
  typeList
}: TablePaginationProps) {
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

          if (filterField) {
            params.set('filterField', filterField)
          }

          if (filterValue) {
            params.set('filterValue', filterValue)
          }

          if (sortField) {
            params.set('sortField', sortField)
          }

          if (typeList) {
            params.set('typeList', typeList)
          }

          if (sortOrder) {
            params.set('sortOrder', sortOrder)
          }

          if (searchKey) {
            params.set('searchKey', searchKey)
          }

          router.push(`?${params.toString()}`, {
            scroll: false
          })
        }}
        showFirstButton
        showLastButton
      />
    </div>
  )
}
