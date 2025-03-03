import type * as React from 'react'

declare module 'react' {
  interface ReactNode<P = {}> extends React.ReactNode<P> {
    acl?: {
      action: string
      subject: string
    }
  }
}
