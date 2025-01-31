import { Typography } from '@mui/material'

import type { Role } from '@/types/management/roleType'

import { useSettings } from '@/@core/hooks/useSettings'

import permissions from '@/libs/permission.json'

interface Permission {
  id: number
  namePermission: string
  color: {
    action_color: string
  }
}

export const TagPermissionNames = ({ data }: { data: Role }) => {
  const settings = useSettings()

  const filteredPermissions: Permission[] = permissions.filter(
    item => data.permissionID.includes(item.id) && item.id !== 45
  )

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px'
      }}
    >
      {filteredPermissions.map(item => (
        <Typography
          key={item.id}
          sx={{
            color: settings.settings.mode === 'light' ? `${item.color.action_color}` : `${item.color.action_color}`,
            whiteSpace: 'pre-line',
            backgroundColor:
              settings.settings.mode === 'light' ? `${item.color.action_color}3D` : `${item.color.action_color}2D`,
            padding: '4px 8px',
            borderRadius: '5px',
            fontSize: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {item.namePermission.toUpperCase()}
        </Typography>
      ))}
    </div>
  )
}
