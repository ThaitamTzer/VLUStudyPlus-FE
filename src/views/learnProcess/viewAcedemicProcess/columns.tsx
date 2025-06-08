import { useCallback, useMemo } from 'react'

import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { IconButton, Tooltip } from '@mui/material'

import type { LearnProcessType } from '@/types/management/learnProcessType'
import Iconify from '@/components/iconify'
import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import { useAuth } from '@/hooks/useAuth'

type AcedemicProcessWithAction = LearnProcessType & {
  stt?: number
  action?: string
}

const columnHelper = createColumnHelper<AcedemicProcessWithAction>()

export const useColumns = () => {
  const {
    setAcedemicProcess,
    toogleUpdateAcedemicProcess,
    toogleDeleteAcedemicProcess,
    toogleImportModal,
    toogleViewByCategory,
    setSession,
    toogleViewByCategoryCVHT,
    setSessionCVHT
  } = useAcedemicProcessStore()

  const { user } = useAuth()

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

  const handleOpenViewByCategoryCVHT = useCallback(
    (sessionCVHT: LearnProcessType) => {
      setSessionCVHT(sessionCVHT)
      toogleViewByCategoryCVHT()
    },
    [setSessionCVHT, toogleViewByCategoryCVHT]
  )

  const isCVHT = user?.role?.name === 'CVHT'

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
      columnHelper.accessor('termId.abbreviatName', {
        header: 'Học kỳ',
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
            {!isCVHT ? (
              <Tooltip title='Xem danh sách xử lý học tập' arrow>
                <IconButton
                  onClick={() => {
                    handleOpenViewByCategory(infor.row.original)
                  }}
                >
                  <Iconify icon='mingcute:information-fill' color='#2092ec' />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title='Xem danh sách xử lý học tập' arrow>
                <IconButton
                  onClick={() => {
                    handleOpenViewByCategoryCVHT(infor.row.original)
                  }}
                >
                  <Iconify icon='mingcute:information-fill' color='#2092ec' />
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
      handleOpenViewByCategory,
      handleOpenImport,
      setAcedemicProcess,
      toogleUpdateAcedemicProcess,
      toogleDeleteAcedemicProcess,
      isCVHT,
      handleOpenViewByCategoryCVHT
    ]
  )
}
