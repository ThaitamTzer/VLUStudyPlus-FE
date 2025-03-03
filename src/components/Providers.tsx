// Type Imports

import { Flip } from 'react-toastify'

import type { Direction } from '@core/types'

// Context Imports
// import { NextAuthProvider } from '@/contexts/nextAuthProvider'
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'
import ReduxProvider from '@/redux-store/ReduxProvider'

// Styled Component Imports
import AppReactToastify from '@/libs/styles/AppReactToastify'

// Util Imports
import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'

type Props = {
  direction: Direction
  children: React.ReactNode
}

const Providers = (props: Props) => {
  // Props
  const { children, direction } = props

  // const aclAbilities = Component?.acl ?? defaultACLObj

  // Vars
  const mode = getMode()
  const settingsCookie = getSettingsFromCookie()
  const systemMode = getSystemMode()

  return (
    <VerticalNavProvider>
      <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
        <ThemeProvider direction={direction} systemMode={systemMode}>
          <AppReactToastify direction={direction} position='top-center' limit={4} transition={Flip} />
          <ReduxProvider>{children}</ReduxProvider>
        </ThemeProvider>
      </SettingsProvider>
    </VerticalNavProvider>
  )
}

export default Providers
