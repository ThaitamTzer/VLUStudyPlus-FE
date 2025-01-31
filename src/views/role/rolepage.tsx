'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button, Card, InputAdornment, MenuItem, Pagination, Stack, TablePagination, Typography } from '@mui/material'
import useSWR from 'swr'
import debounce from 'lodash/debounce'
import { useState, useCallback } from 'react'

import { useRoleStore } from '@/stores/role/role'
import RoleList from './roleList'
import roleService from '@/services/role.service'
import PageHeader from '@/components/page-header'
import CustomTextField from '@/@core/components/mui/TextField'
import Iconify from '@/components/iconify'
import TablePaginationCustom from '@/components/table/TablePagination'
import AddRole from './addRole'
import EditRole from './editRole'
import DeleteRole from './deleteRole'

export default function RolePage() {
  const { setRoles, setTotal, roles, total, toogleAddRoleModal } = useRoleStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10
  const searchKey = searchParams.get('searchKey') || ''

  const [searchValue, setSearchValue] = useState(searchKey)

  const updateQueryParams = useCallback(
    debounce(value => {
      const params = new URLSearchParams()
      if (value) {
        params.set('searchKey', value)
      } else {
        params.delete('searchKey')
      }
      params.set('page', '1') // Reset về page 1 khi tìm kiếm
      params.set('limit', limit.toString())
      router.push(`${pathname}?${params.toString()}`)
    }, 300),
    []
  )

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value)
    updateQueryParams(value)
  }

  const fetcher = ['/api/role', page, limit, searchKey]
  const { mutate } = useSWR(fetcher, () => roleService.getAll(page, limit, searchKey), {
    revalidateOnFocus: false,
    onSuccess: data => {
      setRoles(data.data.roles)
      setTotal(data.data.total)
    }
  })

  return (
    <>
      <PageHeader title='Danh sách vai trò' />
      <Card sx={{ mt: 3 }}>
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            className='max-sm:is-full sm:is-[80px]'
            value={limit}
            onChange={e => {
              const params = new URLSearchParams()
              params.set('page', '1')
              params.set('limit', e.target.value)
              if (searchKey) {
                params.set('searchKey', searchKey)
              }
              router.push(`?${params.toString()}`)
            }}
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
            <CustomTextField
              size='small'
              placeholder='Tìm kiếm'
              className='max-sm:is-full'
              value={searchValue}
              onChange={handleSearchChange}
              InputProps={{
                sx: { height: 40 },
                startAdornment: (
                  <InputAdornment position='start'>
                    <Iconify icon='eva:search-fill' color='text.disabled' width={20} height={20} />
                  </InputAdornment>
                )
              }}
            />
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={toogleAddRoleModal}
              className='max-sm:is-full'
            >
              Thêm vai trò
            </Button>
          </div>
        </div>
        <RoleList roles={roles} page={page} limit={limit} total={total} />
        <TablePagination
          component={() => (
            <TablePaginationCustom data={roles} page={page} limit={limit} total={total} searchKey={searchKey} />
          )}
          count={total}
          page={page - 1}
          rowsPerPage={limit}
          rowsPerPageOptions={[10, 25, 50]}
          onPageChange={(_, page) => {
            const params = new URLSearchParams()
            params.set('page', page.toString())
            params.set('limit', limit.toString())
            if (searchKey) {
              params.set('searchKey', searchKey)
            }
            router.push(`?${params.toString()}`)
          }}
        />
      </Card>
      <EditRole mutate={mutate} />
      <AddRole mutate={mutate} />
      <DeleteRole mutate={mutate} />
    </>
  )
}
