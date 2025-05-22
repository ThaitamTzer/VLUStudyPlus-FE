import { Chip } from '@mui/material'

export default function IsBlock({ isBlock }: { isBlock: boolean }) {
  const handleIsBlock = (isBlock: boolean) => {
    switch (isBlock) {
      case true:
        return <Chip label='Đã khóa' color='error' size='small' />
      case false:
        return <Chip label='Hoạt động' color='success' size='small' />
    }
  }

  return <>{handleIsBlock(isBlock)}</>
}
