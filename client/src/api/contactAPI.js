import api from './axiosInstance'

export const sendContactMessage = async (data) => {
  const response = await api.post('/contact', data, {
    skipGlobalErrorHandler: true,
  })

  return response.data
}
