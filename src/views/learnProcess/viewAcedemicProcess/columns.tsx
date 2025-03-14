import { useMemo } from 'react'

import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { IconButton, MenuItem, Tooltip } from '@mui/material'

import type { LearnProcessType } from '@/types/management/learnProcessType'
import RowAction from '@/components/rowAction'
import Iconify from '@/components/iconify'
import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import { useCommitmentStore } from '@/stores/commitment.store'
import { useAuth } from '@/hooks/useAuth'

type AcedemicProcessWithAction = LearnProcessType & {
  stt?: number
  action?: string
}

const columnHelper = createColumnHelper<AcedemicProcessWithAction>()

export const useColumns = () => {
  const { user } = useAuth()

  const {
    setAcedemicProcess,
    toogleUpdateAcedemicProcess,
    toogleDeleteAcedemicProcess,
    toogleImportModal,
    toogleViewByCategory
  } = useAcedemicProcessStore()

  const { toogleViewCommnitmentByCategory, setAcedemicProcessCommiment, toogleViewCommnitmentByCategoryOfCVHT } =
    useCommitmentStore()

  return useMemo<ColumnDef<AcedemicProcessWithAction, any>[]>(
    () => [
      columnHelper.accessor('stt', {
        header: 'STT',
        cell: infor => infor.row.index + 1,
        meta: {
          width: 1
        },
        enableSorting: false
      }),
      columnHelper.accessor('title', {
        header: 'Tiêu đề',
        cell: infor => infor.getValue(),
        sortingFn: 'alphanumeric'
      }),
      columnHelper.accessor('action', {
        header: '',
        meta: {
          algin: 'right'
        },
        cell: infor => (
          <>
            <Tooltip title='Xem danh sách xử lý học tập' arrow>
              <IconButton
                onClick={() => {
                  toogleViewByCategory()
                  setAcedemicProcess(infor.row.original)
                }}
              >
                <Iconify icon='gg:list' color='#2092ec' />
              </IconButton>
            </Tooltip>
            {user?.role.name === 'CVHT' ? (
              <Tooltip title='Xem danh sách đơn cam kết' arrow>
                <IconButton
                  onClick={() => {
                    toogleViewCommnitmentByCategoryOfCVHT()
                    setAcedemicProcessCommiment(infor.row.original)
                  }}
                >
                  <Iconify icon='hugeicons:files-01' color='#2092ec' />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title='Xem danh sách đơn cam kết' arrow>
                <IconButton
                  onClick={() => {
                    toogleViewCommnitmentByCategory()
                    setAcedemicProcessCommiment(infor.row.original)
                  }}
                >
                  <Iconify icon='hugeicons:files-01' color='#2092ec' />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title='Import danh sách xử lý học tập' arrow>
              <IconButton
                onClick={() => {
                  toogleImportModal()
                  setAcedemicProcess(infor.row.original)
                }}
              >
                <Iconify icon='bx:import' color='green' />
              </IconButton>
            </Tooltip>
            <RowAction>
              <MenuItem
                sx={{ color: 'warning.main' }}
                onClick={() => {
                  setAcedemicProcess(infor.row.original)
                  toogleUpdateAcedemicProcess()
                }}
              >
                <Iconify icon='solar:pen-2-linear' />
                Cập nhật kỳ xử lý
              </MenuItem>
              <MenuItem
                sx={{ color: 'error.main' }}
                onClick={() => {
                  setAcedemicProcess(infor.row.original)
                  toogleDeleteAcedemicProcess()
                }}
              >
                <Iconify icon='solar:trash-bin-2-linear' />
                Xóa kỳ xử lý
              </MenuItem>
            </RowAction>
          </>
        ),
        enableSorting: false
      })
    ],
    [
      setAcedemicProcess,
      toogleUpdateAcedemicProcess,
      toogleDeleteAcedemicProcess,
      toogleImportModal,
      toogleViewByCategory,
      toogleViewCommnitmentByCategory,
      setAcedemicProcessCommiment,
      toogleViewCommnitmentByCategoryOfCVHT,
      user?.role.name
    ]
  )
}
