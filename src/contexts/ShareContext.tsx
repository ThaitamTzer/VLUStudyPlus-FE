'use client'

import { createContext, useState } from 'react'

import { usePathname } from 'next/navigation'

import useSWR from 'swr'

import { useAuth } from '@/hooks/useAuth'

import type { Cohort } from '@/types/management/cohortType'
import type { Class } from '@/types/management/classType'
import type { Term } from '@/types/management/termType'
import typeProcessService from '@/services/typeprocess.service'
import studentService from '@/services/student.service'
import cohortService from '@/services/cohort.service'
import classService from '@/services/class.service'
import termService from '@/services/term.service'
import classLecturerService from '@/services/classLecturer.service'
import type { Student } from '@/types/management/studentType'
import type { TypeProcessType } from '@/types/management/typeProcessType'
import type { ClassLecturer } from '@/types/management/classLecturerType'
import type { ProcessResultType } from '@/types/management/processResultType'
import resultProcessService from '@/services/resultProcess.service'

type ShareContextType = {
  cohorOptions: Cohort[]
  classOptions: Class[]
  termOptions: Term[]
  studentOptions: Student[]
  typeProcess: TypeProcessType[]
  classCVHT: ClassLecturer[]
  resultProcess: ProcessResultType[]
  setCohortOptions: (options: Cohort[]) => void
  setClassOptions: (options: Class[]) => void
  setTermOptions: (options: Term[]) => void
  setStudentOptions: (options: Student[]) => void
  setProcessType: (options: TypeProcessType[]) => void
  setClassCVHT: (options: ClassLecturer[]) => void
  setProcessResult: (options: ProcessResultType[]) => void

  page: number
  setPage: (page: number) => void
  limit: number
  setLimit: (limit: number) => void
  pageTerm: number
  setPageTerm: (page: number) => void
  limitTerm: number
  setLimitTerm: (limit: number) => void
  pageStudent: number
  setPageStudent: (page: number) => void
  limitStudent: number
  setLimitStudent: (limit: number) => void
}

const defaultProvider: ShareContextType = {
  cohorOptions: [],
  classOptions: [],
  termOptions: [],
  setCohortOptions: () => null,
  setClassOptions: () => null,
  setTermOptions: () => null,
  page: 1,
  setPage: () => null,
  limit: 20,
  setLimit: () => null,
  pageTerm: 1,
  setPageTerm: () => null,
  limitTerm: 20,
  setLimitTerm: () => null,
  studentOptions: [],
  setStudentOptions: () => null,
  pageStudent: 1,
  setPageStudent: () => null,
  limitStudent: 20,
  setLimitStudent: () => null,
  typeProcess: [],
  setProcessType: () => null,
  classCVHT: [],
  setClassCVHT: () => null,
  resultProcess: [],
  setProcessResult: () => null
}

const ShareContext = createContext(defaultProvider)

type Props = {
  children: React.ReactNode
}

const ShareProvider = ({ children }: Props) => {
  const { user } = useAuth()
  const pathName = usePathname()

  const [typeProcess, setProcessType] = useState<TypeProcessType[]>([])
  const [studentOptions, setStudentOptions] = useState<Student[]>([])
  const [classCVHT, setClassCVHT] = useState<ClassLecturer[]>([])
  const [cohorOptions, setCohortOptions] = useState<Cohort[]>([])
  const [classOptions, setClassOptions] = useState<Class[]>([])
  const [termOptions, setTermOptions] = useState<Term[]>([])
  const [processResult, setProcessResult] = useState<ProcessResultType[]>([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(300)
  const [pageTerm, setPageTerm] = useState(1)
  const [limitTerm, setLimitTerm] = useState(300)
  const [pageStudent, setPageStudent] = useState(1)
  const [limitStudent, setLimitStudent] = useState(300)

  const fetcherTerm = ['/term', pageTerm, limitTerm]
  const fetcherClass = ['/class', page, limit]
  const fetcherStudent = ['/students', pageStudent, limitStudent]

  useSWR(user ? '/cohort' : null, cohortService.getAll, {
    onSuccess: data => {
      setCohortOptions(data)
    },
    revalidateOnFocus: false
  })

  useSWR(user ? fetcherClass : null, () => classService.getAll(page, limit), {
    onSuccess: data => {
      setClassOptions(data.data)
    },
    revalidateOnFocus: false
  })

  useSWR(user ? fetcherTerm : null, () => termService.getAll(pageTerm, limitTerm), {
    onSuccess: data => {
      setTermOptions(data.terms)
    },
    revalidateOnFocus: false
  })

  useSWR(user ? fetcherStudent : null, () => studentService.getList(pageStudent, limitStudent), {
    onSuccess: data => {
      setStudentOptions(data.students)
    },
    revalidateOnFocus: false
  })

  useSWR(user ? '/type-process' : null, typeProcessService.getAll, {
    onSuccess: data => {
      setProcessType(data)
    },
    revalidateOnFocus: false
  })

  useSWR(user ? '/classCVHT' : null, classLecturerService.getList, {
    onSuccess: data => {
      setClassCVHT(data)
    },
    revalidateOnFocus: false
  })

  useSWR(user ? '/api/processing-result' : null, resultProcessService.getAll, {
    onSuccess: data => {
      setProcessResult(data)
    },
    revalidateOnFocus: false
  })

  const value = {
    cohorOptions,
    classOptions,
    termOptions,
    setCohortOptions,
    setClassOptions,
    setTermOptions,
    page,
    setPage,
    limit,
    setLimit,
    pageTerm,
    setPageTerm,
    limitTerm,
    setLimitTerm,
    studentOptions,
    setStudentOptions,
    pageStudent,
    setPageStudent,
    limitStudent,
    setLimitStudent,
    typeProcess,
    setProcessType,
    classCVHT,
    setClassCVHT,
    resultProcess: processResult,
    setProcessResult
  }

  return (
    <ShareContext.Provider value={value}>
      {children}
      {pathName ? (
        <script defer src='https://app.fastbots.ai/embed.js' data-bot-id='cm8pwtq9w09x3n8luvnk4dfe9'></script>
      ) : null}
    </ShareContext.Provider>
  )
}

export { ShareContext, ShareProvider }
