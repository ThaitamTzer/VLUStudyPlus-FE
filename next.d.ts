import type { NextComponentType } from 'next'

import type { ACLObj } from '@/configs/acl'

declare module 'next' {
  export declare type NextPage<P = {}, IP = P> = NextComponentType<NextPageContext, IP, P> & {
    acl?: ACLObj
    getLayout?: (page: React.ReactNode) => React.ReactNode
  }
}
