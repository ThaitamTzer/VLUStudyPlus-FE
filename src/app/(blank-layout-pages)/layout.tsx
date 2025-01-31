// Type Imports

import type { ChildrenType } from '@core/types'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'
import ProgressProvider from '@/contexts/procesWrapper'

type Props = ChildrenType

const Layout = ({ children }: Props) => {
  // Vars
  const direction = 'ltr'
  const systemMode = getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <ProgressProvider>{children}</ProgressProvider>
      </BlankLayout>
    </Providers>
  )
}

export default Layout
