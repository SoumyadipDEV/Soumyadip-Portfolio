import axios from 'axios'
import toast from 'react-hot-toast'

import supabase from '../utils/supabaseClient'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Request failed'

    if (!error.config?.skipGlobalErrorHandler) {
      toast.error(message)
    }

    error.apiMessage = message
    return Promise.reject(error)
  },
)

export default api
