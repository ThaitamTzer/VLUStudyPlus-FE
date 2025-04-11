import { useCallback, useMemo } from 'react'

import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { IconButton, Tooltip } from '@mui/material'

import type { LearnProcessType } from '@/types/management/learnProcessType'
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
    toogleViewByCategory,
    setSession
  } = useAcedemicProcessStore()

  const {
    toogleViewCommnitmentByCategory,
    setAcedemicProcessCommiment,
    toogleViewCommnitmentByCategoryOfCVHT,
    setAcedemicProcessCommimentOfCVHT
  } = useCommitmentStore()

  const handleOpenImport = useCallback(
    (acedemicProcess: LearnProcessType) => {
      setAcedemicProcess(acedemicProcess)
      toogleImportModal()
    },
    [toogleImportModal, setAcedemicProcess]
  )

  const handleOpenViewByCategory = useCallback(
    (session: LearnProcessType) => {
      setSession(session)
      toogleViewByCategory()
    },
    [setSession, toogleViewByCategory]
  )

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
          align: 'right'
        },
        cell: infor => (
          <>
            <Tooltip title='Xem danh sách xử lý học tập' arrow>
              <IconButton
                onClick={() => {
                  handleOpenViewByCategory(infor.row.original)
                }}
              >
                <Iconify icon='mingcute:information-fill' color='#2092ec' />
              </IconButton>
            </Tooltip>
            {user?.role.name === 'CVHT' ? (
              <Tooltip title='Xem danh sách đơn cam kết' arrow>
                <IconButton
                  onClick={() => {
                    toogleViewCommnitmentByCategoryOfCVHT()
                    setAcedemicProcessCommimentOfCVHT(infor.row.original)
                  }}
                >
                  <Iconify icon='hugeicons:files-01' color='#8e44ad' />
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
                  <Iconify icon='hugeicons:files-01' color='#8e44ad' />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title='Import danh sách xử lý học tập' arrow>
              <IconButton
                onClick={() => {
                  handleOpenImport(infor.row.original)
                }}
              >
                <Iconify icon='tabler:file-import' className='text-success' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Cập nhật kỳ xử lý' arrow>
              <IconButton
                onClick={() => {
                  setAcedemicProcess(infor.row.original)
                  toogleUpdateAcedemicProcess()
                }}
              >
                <Iconify icon='solar:pen-2-linear' color='#f1c40f' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Xóa kỳ xử lý' arrow>
              <IconButton
                onClick={() => {
                  setAcedemicProcess(infor.row.original)
                  toogleDeleteAcedemicProcess()
                }}
              >
                <Iconify icon='solar:trash-bin-2-linear' color='#e74c3c' />
              </IconButton>
            </Tooltip>
          </>
        ),
        enableSorting: false
      })
    ],
    [
      user?.role.name,
      handleOpenViewByCategory,
      toogleViewCommnitmentByCategoryOfCVHT,
      setAcedemicProcessCommimentOfCVHT,
      toogleViewCommnitmentByCategory,
      setAcedemicProcessCommiment,
      handleOpenImport,
      setAcedemicProcess,
      toogleUpdateAcedemicProcess,
      toogleDeleteAcedemicProcess
    ]
  )
}
