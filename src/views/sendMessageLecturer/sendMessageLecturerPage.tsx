'use client'

import type { SyntheticEvent } from 'react'
import { useState } from 'react'

import dynamic from 'next/dynamic'

import { Tab } from '@mui/material'

import { TabContext, TabPanel } from '@mui/lab'

import PageHeader from '@/components/page-header'
import CustomTabList from '@/@core/components/mui/TabList'
import { useAuth } from '@/hooks/useAuth'
import MessageHistory from './MessageHistory'

const SendMessageToStudent = dynamic(() => import('@/views/sendMessageLecturer/SendMessageToStudent'), {
  ssr: false
})

const MessageHistoryForLecture = dynamic(() => import('@/views/sendMessageLecturer/MessageHistoryForLecture'), {
  ssr: false
})

const SendMessage = dynamic(() => import('@/views/sendMessageLecturer/SendMessage'), {
  ssr: false
})

export default function SendMessageByLecturerPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<string>(user?.role.name === 'CVHT' ? '1' : '2')

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <>
      <PageHeader title='Thông báo ' />
      <TabContext value={activeTab}>
        <CustomTabList onChange={handleChange} variant='scrollable' scrollButtons='auto'>
          {user?.role.name === 'CVHT' && <Tab value='1' label='Gửi thông báo sinh viên' />}
          {user?.role.name === 'BCN Khoa' && <Tab value='2' label='Gửi thông báo sinh viên' />}
          {user?.role.name === 'CVHT' && <Tab value='3' label='Lịch sử gửi thông báo' />}
          {user?.role.name === 'BCN Khoa' && <Tab value='4' label='Lịch sử nhận thông báo' />}
        </CustomTabList>
        <TabPanel value='1'>
          <SendMessageToStudent />
        </TabPanel>
        <TabPanel value='2'>
          <SendMessage />
        </TabPanel>
        <TabPanel value='3'>
          <MessageHistoryForLecture />
        </TabPanel>
        <TabPanel value='4'>
          <MessageHistory />
        </TabPanel>
      </TabContext>
    </>
  )
}
