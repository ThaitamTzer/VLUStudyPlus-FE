import axios from 'axios'

// ----------------------------------------------------------------------

const axiosUpload = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL })

axiosUpload.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      config.headers['Content-Type'] = 'multipart/form-data'
    }

    return config
  },
  error => Promise.reject(error)
)

axiosUpload.interceptors.response.use(
  res => res,
  error => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname

      localStorage.clear()

      // Store current path and redirect to login
      if (currentPath !== '/login') {
        window.location.href = `/login?returnTo=${encodeURIComponent(currentPath)}`
      } else {
        window.location.href = '/login'
      }
    }

    return Promise.reject((error.response && error.response.data) || 'Something went wrong')
  }
)

export default axiosUpload
