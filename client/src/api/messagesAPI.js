import api from './axiosInstance'

export const getContactMessages = async () => {
  const response = await api.get('/contact/messages', {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? []
}
