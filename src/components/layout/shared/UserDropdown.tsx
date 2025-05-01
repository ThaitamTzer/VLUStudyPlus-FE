'use client'

// React Imports
import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { Stack } from '@mui/material'

// Hook Imports

import { useSettings } from '@core/hooks/useSettings'
import { useAuth } from '@/hooks/useAuth'
import useHidden from '@/libs/hidden'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks
  const { setUser, user } = useAuth()
  const router = useRouter()
  const hidden = useHidden()

  // const { data: session } = useSession()
  const { settings } = useSettings()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(url)
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {
    router.push('/login')
    localStorage.removeItem('accessToken')
    setUser(null)
  }

  return (
    <>
      {!hidden ? (
        <Stack justifyContent='end' alignItems='end' ml={2}>
          <Typography variant='h6' color='text.primary'>
            {user?.userId + ' -' || ''} {user?.userName} {user?.classCode ? '- ' + user?.classCode : ''}
          </Typography>
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <p>{user?.role.name}</p> - {user?.mail}
          </Typography>
        </Stack>
      ) : (
        <Stack justifyContent='end' alignItems='end' ml={2}>
          <Typography
            sx={{
              fontSize: {
                xs: '0.75rem',
                sm: '1rem',
                md: '1.25rem'
              }
            }}
            color='text.primary'
          >
            {user?.userName}
          </Typography>
          <Typography
            sx={{
              fontSize: {
                xs: '0.6rem',
                sm: '0.875rem',
                md: '1rem'
              }
            }}
            color='text.secondary'
          >
            {user?.mail}
          </Typography>
        </Stack>
      )}
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >
        <Avatar
          ref={anchorRef}
          alt={user?.userName || ''}
          src={user?.avatar || ''}
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px] border border-primary'
        />
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
                    <Avatar alt={user?.userName} src={user?.avatar} />
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {user?.userName}
                      </Typography>
                      <Typography variant='caption'>{user?.role.name}</Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/user-profile')}>
                    <i className='tabler-user' />
                    <Typography color='text.primary'>Hồ sơ của tôi</Typography>
                  </MenuItem>
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/pages/account-settings')}>
                    <i className='tabler-settings' />
                    <Typography color='text.primary'>Cài đặt</Typography>
                  </MenuItem>
                  <div className='flex items-center plb-2 pli-3'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='tabler-logout' />}
                      onClick={handleUserLogout}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      Đăng xuất
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown
