'use client'

import { createContext, useEffect, useState } from 'react'

// import { usePathname } from 'next/navigation'

import type { KeyedMutator } from 'swr'
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
import majorService from '@/services/major.service'
import type { Major, MajorRes } from '@/types/management/majorType'
import CacheManager, { CACHE_KEYS } from '@/utils/cache'

type ShareContextType = {
  cohorOptions: Cohort[]
  classOptions: Class[]
  termOptions: Term[]
  studentOptions: Student[]
  typeProcess: TypeProcessType[]
  classCVHT: ClassLecturer[]
  resultProcess: ProcessResultType[]
  majorOptions: Major[]
  setMajorOptions: (options: Major[]) => void
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
  pageMajor: number
  setPageMajor: (page: number) => void

  mutateMajor: KeyedMutator<MajorRes>

  // Thêm functions để quản lý cache
  clearCache: () => void
  refreshCache: () => Promise<void>
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
  setProcessResult: () => null,
  majorOptions: [],
  setMajorOptions: () => null,
  pageMajor: 100,
  setPageMajor: () => null,
  mutateMajor: () => Promise.resolve(undefined),
  clearCache: () => null,
  refreshCache: () => Promise.resolve()
}

const ShareContext = createContext(defaultProvider)

type Props = {
  children: React.ReactNode
}

const ShareProvider = ({ children }: Props) => {
  const { user } = useAuth()

  // const pathName = usePathname()

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
  const [majorOptions, setMajorOptions] = useState<Major[]>([])
  const [pageMajor, setPageMajor] = useState(100)

  const fetcherTerm = ['/term', pageTerm, limitTerm]
  const fetcherClass = ['/class', page, limit]
  const fetcherStudent = ['/students', pageStudent, limitStudent]

  // Load dữ liệu từ cache khi component mount
  useEffect(() => {
    if (!user) return

    // Load từ cache nếu có
    const cachedCohort = CacheManager.get<Cohort[]>(CACHE_KEYS.COHORT_OPTIONS)
    const cachedClass = CacheManager.get<Class[]>(CACHE_KEYS.CLASS_OPTIONS)
    const cachedTerm = CacheManager.get<Term[]>(CACHE_KEYS.TERM_OPTIONS)
    const cachedStudent = CacheManager.get<Student[]>(CACHE_KEYS.STUDENT_OPTIONS)
    const cachedTypeProcess = CacheManager.get<TypeProcessType[]>(CACHE_KEYS.TYPE_PROCESS)
    const cachedClassCVHT = CacheManager.get<ClassLecturer[]>(CACHE_KEYS.CLASS_CVHT)
    const cachedResultProcess = CacheManager.get<ProcessResultType[]>(CACHE_KEYS.RESULT_PROCESS)
    const cachedMajor = CacheManager.get<Major[]>(CACHE_KEYS.MAJOR_OPTIONS)

    if (cachedCohort) setCohortOptions(cachedCohort)
    if (cachedClass) setClassOptions(cachedClass)
    if (cachedTerm) setTermOptions(cachedTerm)
    if (cachedStudent) setStudentOptions(cachedStudent)
    if (cachedTypeProcess) setProcessType(cachedTypeProcess)
    if (cachedClassCVHT) setClassCVHT(cachedClassCVHT)
    if (cachedResultProcess) setProcessResult(cachedResultProcess)
    if (cachedMajor) setMajorOptions(cachedMajor)
  }, [user])

  useSWR(user ? '/cohort' : null, cohortService.getAll, {
    onSuccess: data => {
      setCohortOptions(data)
      CacheManager.set(CACHE_KEYS.COHORT_OPTIONS, data, 10 * 60 * 1000) // Cache 10 phút
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  useSWR(user ? fetcherClass : null, () => classService.getAll(page, limit), {
    onSuccess: data => {
      setClassOptions(data.data)
      CacheManager.set(CACHE_KEYS.CLASS_OPTIONS, data.data, 10 * 60 * 1000)
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  useSWR(user ? fetcherTerm : null, () => termService.getAll(pageTerm, limitTerm), {
    onSuccess: data => {
      setTermOptions(data.terms)
      CacheManager.set(CACHE_KEYS.TERM_OPTIONS, data.terms, 10 * 60 * 1000)
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  useSWR(user ? fetcherStudent : null, () => studentService.getList(pageStudent, limitStudent), {
    onSuccess: data => {
      setStudentOptions(data.students)
      CacheManager.set(CACHE_KEYS.STUDENT_OPTIONS, data.students, 10 * 60 * 1000)
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  useSWR(user ? '/type-process' : null, typeProcessService.getAll, {
    onSuccess: data => {
      setProcessType(data)
      CacheManager.set(CACHE_KEYS.TYPE_PROCESS, data, 15 * 60 * 1000) // Cache 15 phút cho dữ liệu ít thay đổi
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  useSWR(user ? '/classCVHT' : null, classLecturerService.getList, {
    onSuccess: data => {
      setClassCVHT(data)
      CacheManager.set(CACHE_KEYS.CLASS_CVHT, data, 10 * 60 * 1000)
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  useSWR(user ? '/api/processing-result' : null, resultProcessService.getAll, {
    onSuccess: data => {
      setProcessResult(data)
      CacheManager.set(CACHE_KEYS.RESULT_PROCESS, data, 5 * 60 * 1000) // Cache 5 phút cho dữ liệu thay đổi thường xuyên
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  const { mutate: mutateMajor } = useSWR(user ? '/major' : null, () => majorService.getAll(pageMajor, 100), {
    onSuccess: data => {
      setMajorOptions(data.majors)
      CacheManager.set(CACHE_KEYS.MAJOR_OPTIONS, data.majors, 15 * 60 * 1000)
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  // Functions để quản lý cache
  const clearCache = () => {
    CacheManager.clear()
    console.log('Đã xóa tất cả cache')
  }

  const refreshCache = async () => {
    if (!user) return

    try {
      // Xóa cache cũ
      Object.values(CACHE_KEYS).forEach(key => {
        CacheManager.remove(key)
      })

      // Fetch lại dữ liệu mới (SWR sẽ tự động gọi lại các API)
      // Có thể trigger manual refresh nếu cần
      console.log('Đã refresh cache')
    } catch (error) {
      console.error('Lỗi khi refresh cache:', error)
    }
  }

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
    setProcessResult,
    majorOptions,
    setMajorOptions,
    pageMajor,
    setPageMajor,
    mutateMajor: mutateMajor,
    clearCache,
    refreshCache
  }

  return (
    <ShareContext.Provider value={value}>
      {children}
      {/* {pathName ? (
        <script defer src='https://app.fastbots.ai/embed.js' data-bot-id='cm8pwtq9w09x3n8luvnk4dfe9'></script>
      ) : null} */}
    </ShareContext.Provider>
  )
}

export { ShareContext, ShareProvider }
