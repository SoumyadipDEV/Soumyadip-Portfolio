import api from './axiosInstance'

export const getPersonalInfo = async () => {
  const response = await api.get('/personal-info', {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? null
}

export const updatePersonalInfo = async (data) => {
  const response = await api.put('/personal-info', data, {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? null
}
