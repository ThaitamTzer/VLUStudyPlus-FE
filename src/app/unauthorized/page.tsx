// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

// Util Imports
import { getServerMode, getSystemMode } from '@core/utils/serverHelpers'
import NotAuthorized from '@/views/NotAuthorized'

const NotFoundPage = () => {
  // Vars
  const direction = 'ltr'
  const mode = getServerMode()
  const systemMode = getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <NotAuthorized mode={mode} />
      </BlankLayout>
    </Providers>
  )
}

export default NotFoundPage
