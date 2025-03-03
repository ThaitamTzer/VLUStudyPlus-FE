// MUI Imports
import type { AppProps } from 'next/app'

import Button from '@mui/material/Button'

// Type Imports
import type { NextPage } from 'next'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

// Component Imports
import Providers from '@components/Providers'
import Navigation from '@components/layout/vertical/Navigation'
import Header from '@components/layout/horizontal/Header'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalFooter from '@components/layout/horizontal/Footer'
import Customizer from '@core/components/customizer'
import ScrollToTop from '@core/components/scroll-to-top'
import AuthGuard from '@/hocs/AuthGuard'

// Util Imports
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import { AuthProvider } from '@/contexts/AuthContext'
import ProgressProvider from '@/contexts/procesWrapper'
import { ShareProvider } from '@/contexts/ShareContext'

type ExtendedChildrenType = AppProps & {
  Component: NextPage
  children: React.ReactNode
}

const Layout = async (props: ExtendedChildrenType) => {
  const { Component, pageProps, children } = props

  // Vars
  const direction = 'ltr'

  const mode = getMode()
  const systemMode = getSystemMode()

  return (
    <AuthProvider>
      <ShareProvider>
        <AuthGuard>
          <Providers direction={direction} Component={Component} {...pageProps}>
            <LayoutWrapper
              systemMode={systemMode}
              verticalLayout={
                <VerticalLayout
                  navigation={<Navigation mode={mode} systemMode={systemMode} />}
                  navbar={<Navbar />}
                  footer={<VerticalFooter />}
                >
                  <ProgressProvider />
                  {children}
                </VerticalLayout>
              }
              horizontalLayout={
                <HorizontalLayout header={<Header />} footer={<HorizontalFooter />}>
                  {children}
                </HorizontalLayout>
              }
            />
            <ScrollToTop className='mui-fixed'>
              <Button
                variant='contained'
                className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
              >
                <i className='tabler-arrow-up' />
              </Button>
            </ScrollToTop>
            <Customizer dir={direction} disableDirection />
          </Providers>
        </AuthGuard>
      </ShareProvider>
    </AuthProvider>
  )
}

export default Layout
