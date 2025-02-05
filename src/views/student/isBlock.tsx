import { Typography } from '@mui/material'

export default function IsBlock({ isBlock }: { isBlock: boolean }) {
  const handleIsBlock = (isBlock: boolean) => {
    switch (isBlock) {
      case true:
        return (
          <Typography
            sx={{
              color: 'white',
              whiteSpace: 'pre-line',
              backgroundColor: 'error.light',
              padding: '4px 8px',
              borderRadius: '5px',
              fontSize: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Đã khóa
          </Typography>
        )
      case false:
        return (
          <Typography
            sx={{
              color: 'white',
              whiteSpace: 'pre-line',
              backgroundColor: 'success.light',
              padding: '4px 8px',
              borderRadius: '5px',
              fontSize: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Hoạt động
          </Typography>
        )
    }
  }

  return <>{handleIsBlock(isBlock)}</>
}
