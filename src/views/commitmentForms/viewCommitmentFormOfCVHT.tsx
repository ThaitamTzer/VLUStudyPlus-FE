'use client'

import { useMemo, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  TablePagination,
  Card,
  Grid,
  MenuItem,
  CardContent
} from '@mui/material'
import useSWR from 'swr'

import { useCommitmentStore } from '@/stores/commitment.store'
import commitmentFormService from '@/services/commitmentForm.service'
import Iconify from '@/components/iconify'
import TablePaginationCustomNoURL from '@/components/table/TablePaginationNoURL'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '@/components/debouncedInput'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import TableViewCommitmentForm from './tableViewCommitmentForm'
import ViewDetailCommitmentForm from './viewDetailCommitmentForm'

const approveStatus = [
  { label: 'Tất cả', value: '' },
  { label: 'Đã duyệt', value: 'approve' },
  { label: 'Chờ duyệt', value: 'pending' },
  { label: 'Từ chối', value: 'reject' }
]

export default function ViewCommitmentFormsOfCVHT() {
  const { openViewByCategoryOfCVHT, acedemicProcess, setAcedemicProcess, toogleViewByCategoryOfCVHT } =
    useCommitmentStore()

  const id = acedemicProcess?._id

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filterField, setFilterField] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [searchKey, setSearchKey] = useState('')

  const fetcher = [
    id ? `/commitment-forms-of-CVHT/${id}` : null,
    page,
    limit,
    filterField,
    filterValue,
    sortField,
    sortOrder,
    searchKey
  ]

  const { data, isLoading, mutate } = useSWR(fetcher, () =>
    commitmentFormService.getByCategoryOfCVHT(
      id,
      page,
      limit,
      filterField,
      filterValue,
      sortField,
      sortOrder,
      searchKey
    )
  )

  const tableData = useMemo(() => data?.data || [], [data])

  const onClose = () => {
    toogleViewByCategoryOfCVHT()
    setAcedemicProcess({} as any)
  }

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  return (
    <>
      {openViewByCategoryOfCVHT && (
        <Dialog open onClose={onClose} maxWidth='xl' fullWidth>
          <DialogTitle>
            <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={onClose}>
              <Iconify icon='eva:close-outline' />
            </IconButton>
            <Typography variant='h4'>Danh sách đơn cam kết - {acedemicProcess?.title}</Typography>
          </DialogTitle>
          <DialogContent>
            <Card>
              <CardContent>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomAutocomplete
                      options={approveStatus}
                      defaultValue={approveStatus[0]}
                      getOptionLabel={option => option.label}
                      onChange={(_, value) => {
                        setFilterField('approveStatus')
                        setFilterValue(value?.value || '')
                        setPage(1)
                      }}
                      renderInput={params => <CustomTextField {...params} label='Lọc theo trạng thái' />}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
                <CustomTextField
                  select
                  className='max-sm:is-full sm:is-[80px]'
                  value={limit}
                  onChange={e => {
                    setLimit(Number(e.target.value))
                    setPage(1)
                  }}
                >
                  <MenuItem value='10'>10</MenuItem>
                  <MenuItem value='25'>25</MenuItem>
                  <MenuItem value='50'>50</MenuItem>
                </CustomTextField>
                <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
                  <DebouncedInput
                    value={searchKey}
                    onChange={value => {
                      setSearchKey(value as string)
                      setPage(1)
                    }}
                    placeholder='Tìm kiếm'
                    className='max-sm:is-full sm:is-[300px]'
                  />
                </div>
              </div>
              <TableViewCommitmentForm
                handleSort={handleSort}
                isLoading={isLoading}
                limit={limit}
                page={page}
                sortField={sortField}
                sortOrder={sortOrder}
                tableData={tableData}
                mutate={mutate}
              />
              <TablePagination
                component={() => (
                  <TablePaginationCustomNoURL
                    data={data?.data || []}
                    page={page}
                    limit={limit}
                    total={data?.pagination.totalItems || 0}
                    setPage={setPage}
                  />
                )}
                count={data?.pagination.totalItems || 0}
                page={page - 1}
                rowsPerPage={limit}
                rowsPerPageOptions={[10, 25, 50]}
                onPageChange={(_, newPage) => {
                  setPage(newPage + 1)
                }}
              />
            </Card>
          </DialogContent>
        </Dialog>
      )}
      <ViewDetailCommitmentForm />
    </>
  )
}
