import api from './axiosInstance'

export const getResume = async () => {
  const response = await api.get('/resume', {
    skipGlobalErrorHandler: true,
  })

  return response.data?.url ?? null
}
