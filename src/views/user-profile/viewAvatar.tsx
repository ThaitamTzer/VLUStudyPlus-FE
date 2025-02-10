'use client'

import { Dialog, DialogTitle, DialogContent, IconButton, Box } from '@mui/material'

import { useStudentStore } from '@/stores/student/student'
import Iconify from '@/components/iconify'

export default function ViewAvatar({ user }: { user: any }) {
  const { openViewAvatar, toogleViewAvatar } = useStudentStore()

  return (
    <Dialog open={openViewAvatar} onClose={toogleViewAvatar} fullWidth maxWidth='sm'>
      <DialogTitle>
        <IconButton
          onClick={toogleViewAvatar}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8
          }}
        >
          <Iconify icon='tabler:x' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <img src={user?.avatar} alt='Avatar' className='w-full rounded max-w-[522px] max-h-[522px]'/>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
