'use client'

import type { AppProps } from 'next/app'

import type { NextPage } from 'next'

import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

// Component Imports
import Navigation from '@components/layout/vertical/Navigation'
import Header from '@components/layout/horizontal/Header'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalFooter from '@components/layout/horizontal/Footer'
import ProgressProvider from '@/contexts/procesWrapper'

type LayoutContentProps = AppProps & {
  Component: NextPage
}

export default function LayoutContent(props: LayoutContentProps): JSX.Element {
  const { Component, pageProps } = props

  const getLayout =
    Component?.getLayout ??
    (page => (
      <LayoutWrapper
        systemMode='light'
        verticalLayout={
          <VerticalLayout
            navigation={<Navigation mode='light' systemMode='dark' />}
            navbar={<Navbar />}
            footer={<VerticalFooter />}
          >
            <ProgressProvider />
            {page}
          </VerticalLayout>
        }
        horizontalLayout={
          <HorizontalLayout header={<Header />} footer={<HorizontalFooter />}>
            {page}
          </HorizontalLayout>
        }
      />
    ))

  return <>{getLayout(<Component {...pageProps} />)}</>
}
