'use client'

// React Imports
import { useRef, useState, useEffect } from 'react'
import type { MouseEvent, ReactNode } from 'react'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

// Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

import type { KeyedMutator } from 'swr'

import notificationService from '@/services/notification.service'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import type { NotificationType } from '@/types/management/notificationType'
import { fDate } from '@/utils/format-time'

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <div className='overflow-x-hidden bs-full'>{children}</div>
  } else {
    return (
      <PerfectScrollbar className='bs-full' options={{ wheelPropagation: false, suppressScrollX: true }}>
        {children}
      </PerfectScrollbar>
    )
  }
}

const NotificationDropdown = ({
  notifications,
  mutate
}: {
  notifications: NotificationType[] | undefined
  mutate: KeyedMutator<any>
}) => {
  // States
  const [open, setOpen] = useState(false)
  const [notificationsState, setNotificationsState] = useState(notifications)

  useEffect(() => {
    if (notifications) {
      setNotificationsState(notifications)
    }
  }, [notifications])

  // Vars
  const notificationCount = notificationsState?.filter(notification => !notification?.isViewed).length

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)
  const ref = useRef<HTMLDivElement | null>(null)

  // Hooks
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { settings } = useSettings()

  const handleClose = () => {
    setOpen(false)

    setTimeout(() => {
      mutate()
    }, 500)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleReadNotification = (event: MouseEvent<HTMLElement>, value: boolean, index: number) => {
    event.stopPropagation()
    const newNotifications = [...(notificationsState ?? [])]

    newNotifications[index].isViewed = value
    setNotificationsState(newNotifications)

    notificationService.update(newNotifications[index]._id)
  }

  useEffect(() => {
    const adjustPopoverHeight = () => {
      if (ref.current) {
        // Calculate available height, subtracting any fixed UI elements' height as necessary
        const availableHeight = window.innerHeight - 100

        ref.current.style.height = `${Math.min(availableHeight, 550)}px`
      }
    }

    window.addEventListener('resize', adjustPopoverHeight)
  }, [])

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle} className='text-textPrimary'>
        <Badge
          color='error'
          className='cursor-pointer'
          variant='dot'
          overlap='circular'
          invisible={notificationCount === 0}
          sx={{
            '& .MuiBadge-dot': { top: 6, right: 5, boxShadow: 'var(--mui-palette-background-paper) 0px 0px 0px 2px' }
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <i className='tabler-bell' />
        </Badge>
      </IconButton>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        ref={ref}
        anchorEl={anchorRef.current}
        {...(isSmallScreen
          ? {
              className: 'is-full !mbs-3 z-[1] max-bs-[570px] bs-[570px]',
              modifiers: [
                {
                  name: 'preventOverflow',
                  options: {
                    padding: themeConfig.layoutPadding
                  }
                }
              ]
            }
          : { className: 'is-96 !mbs-3 z-[1] max-bs-[570px] bs-[570px]' })}
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
            <Paper className={classnames('bs-full', settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg')}>
              <ClickAwayListener onClickAway={handleClose}>
                <div className='bs-full flex flex-col'>
                  <div className='flex items-center justify-between plb-3.5 pli-4 is-full gap-2'>
                    <Typography variant='h6' className='flex-auto'>
                      Thông báo
                    </Typography>
                    {(notificationCount ?? 0) > 0 && (
                      <Chip size='small' variant='tonal' color='primary' label={`${notificationCount ?? 0} Mới`} />
                    )}
                  </div>
                  <Divider />
                  <ScrollWrapper hidden={hidden}>
                    {notificationsState?.map((notification, index) => {
                      const { title, content, isViewed, createdAt } = notification
                      const isOdd = index % 2 !== 0

                      return (
                        <div
                          key={index}
                          className={classnames('flex plb-3 pli-4 gap-3 cursor-pointer hover:bg-actionHover group', {
                            'border-be': index !== notificationsState.length - 1,
                            'bg-gray-200': isOdd, // Thêm lớp cho hàng lẻ
                            'bg-white': !isOdd // Thêm lớp cho hàng chẵn
                          })}
                          onClick={e => handleReadNotification(e, true, index)}
                        >
                          <div className='flex flex-col flex-auto'>
                            <Typography variant='body2' className='font-medium mbe-1' color='text.primary'>
                              {title}
                            </Typography>
                            <Typography variant='caption' color='text.secondary' className='mbe-2'>
                              {content}
                            </Typography>
                            <Typography variant='caption' color='text.disabled'>
                              {fDate(createdAt)}
                            </Typography>
                          </div>
                          <div className='flex flex-col items-end gap-2'>
                            <Badge
                              variant='dot'
                              color={isViewed ? 'secondary' : 'primary'}
                              onClick={e => handleReadNotification(e, !isViewed, index)}
                              className={classnames('mbs-1 mie-1', {
                                'invisible ': isViewed
                              })}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </ScrollWrapper>
                  <Divider />
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default NotificationDropdown
