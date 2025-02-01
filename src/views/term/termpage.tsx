'use client'

import React, { useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import { vi } from 'date-fns/locale'
import { registerLocale } from 'react-datepicker'
import {
  Button,
  Card,
  MenuItem,
  TablePagination,
  Popover,
  IconButton,
  Badge,
  TextField,
  Box,
  Typography,
  Stack
} from '@mui/material'
import useSWR from 'swr'

import PageHeader from '@/components/page-header'
import termService from '@/services/term.service'
import { useTermStore } from '@/stores/term/term'
import TablePaginationCustom from '@/components/table/TablePagination'
import TermList from './termlist'
import CustomTextField from '@/@core/components/mui/TextField'

import Iconify from '@/components/iconify'
import TermFilter from './termfilter'
import AddTerm from './addterm'

const getTermYears = () => {
  const currentYear = new Date().getFullYear()

  const termYears = [
    `${currentYear - 2}-${currentYear - 1}`,
    `${currentYear - 1}-${currentYear}`,
    `${currentYear}-${currentYear + 1}`,
    `${currentYear + 1}-${currentYear + 2}`
  ]

  return termYears
}

registerLocale('vi', vi)

const columnNames = [
  {
    name: 'Mã học kỳ',
    value: 'termId'
  },
  {
    name: 'Tên học kỳ',
    value: 'termName'
  }
]

export default function TermPage() {
  const { setTerms, setTotal, total, terms, toogleAddTerm } = useTermStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10
  const filterField = searchParams.get('filterField') || ''
  const filterValue = searchParams.get('filterValue') || ''
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''
  const academicYear = searchParams.get('academicYear') || getTermYears()[1]

  const fetcher = ['api/term', page, limit, filterField, filterValue, startDate, endDate, academicYear]

  const { mutate } = useSWR(
    fetcher,
    () => termService.getAll(page, limit, filterField, filterValue, startDate, endDate, academicYear),
    {
      revalidateOnFocus: true,
      onSuccess: data => {
        setTerms(data.terms)
        setTotal(data.pagination.totalPages)
      }
    }
  )

  const onChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    const params = new URLSearchParams()

    params.set('page', page.toString())
    params.set('limit', limit.toString())
    params.set('filterField', filterField)
    params.set('filterValue', filterValue)
    params.set('startDate', startDate)
    params.set('endDate', endDate)
    params.set('academicYear', academicYear)
    router.push(`?${params.toString()}`)
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [tempFilterField, setTempFilterField] = useState(filterField)
  const [tempFilterValue, setTempFilterValue] = useState(filterValue)

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setAnchorEl(null)
  }

  const handleApplyFilter = () => {
    const params = new URLSearchParams()

    params.set('page', '1')
    params.set('limit', limit.toString())
    params.set('filterField', tempFilterField)
    params.set('filterValue', tempFilterValue)
    params.set('startDate', startDate)
    params.set('endDate', endDate)
    params.set('academicYear', academicYear)
    router.push(`?${params.toString()}`)
    handleFilterClose()
  }

  const handleClearFilter = () => {
    const params = new URLSearchParams()

    setTempFilterField('')
    setTempFilterValue('')

    params.set('page', '1')
    params.set('limit', limit.toString())
    params.set('filterField', '')
    params.set('filterValue', '')
    params.set('startDate', startDate)
    params.set('endDate', endDate)
    params.set('academicYear', academicYear)
    router.push(`?${params.toString()}`)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'filter-popover' : undefined

  return (
    <>
      <PageHeader title='Danh sách học kỳ' />
      <Card sx={{ mt: 4 }}>
        <TermFilter
          academicYear={academicYear}
          startDate={startDate}
          endDate={endDate}
          limit={limit}
          filterField={filterField}
          filterValue={filterValue}
          getTermYears={getTermYears}
        />
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            sx={{ width: 120 }}
            value={limit}
            onChange={e => {
              const params = new URLSearchParams()

              params.set('page', '1')
              params.set('limit', e.target.value)
              params.set('filterField', filterField)
              params.set('filterValue', filterValue)
              params.set('startDate', startDate)
              params.set('endDate', endDate)
              params.set('academicYear', academicYear)
              router.push(`?${params.toString()}`)
            }}
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
            <Button onClick={toogleAddTerm} variant='contained' className='max-sm:is-full' sx={{ minWidth: 120 }}>
              Thêm học kỳ
            </Button>
            <Badge color='error' variant={filterField && filterValue ? 'dot' : 'standard'}>
              <IconButton aria-describedby={id} onClick={handleFilterClick}>
                <Iconify icon='eva:funnel-fill' />
              </IconButton>
            </Badge>
          </div>
        </div>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          sx={{
            '& .MuiPopover-paper': {
              p: 3,
              borderRadius: 2,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <Stack spacing={3} sx={{ width: 300 }}>
            <Typography variant='h6'>Bộ lọc</Typography>
            <TextField
              size='small'
              select
              label='Chọn trường cần lọc'
              value={tempFilterField}
              onChange={e => setTempFilterField(e.target.value)}
              fullWidth
            >
              {columnNames.map(column => (
                <MenuItem key={column.value} value={column.value}>
                  {column.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              disabled={!tempFilterField}
              size='small'
              label='Gía trị cần lọc'
              value={tempFilterValue}
              onChange={e => setTempFilterValue(e.target.value)}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button variant='outlined' onClick={handleClearFilter} fullWidth>
                Xóa bộ lọc
              </Button>
              <Button
                disabled={!tempFilterField || !tempFilterValue}
                variant='contained'
                onClick={handleApplyFilter}
                fullWidth
              >
                Lọc
              </Button>
            </Box>
          </Stack>
        </Popover>
        <TermList terms={terms} total={total} />
        <TablePagination
          component={() => <TablePaginationCustom page={page} limit={limit} total={total} data={terms} />}
          count={total}
          page={page - 1}
          rowsPerPage={limit}
          rowsPerPageOptions={[10, 25, 50]}
          onPageChange={onChangePage}
        />
      </Card>
      <AddTerm mutate={mutate} />
    </>
  )
}
