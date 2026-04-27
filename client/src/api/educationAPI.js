import api from './axiosInstance'

export const getEducation = async () => {
  const response = await api.get('/education', {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? []
}

export const createEducation = async (data) => {
  const response = await api.post('/education', data, {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? null
}

export const updateEducation = async (id, data) => {
  const response = await api.put(`/education/${id}`, data, {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? null
}

export const deleteEducation = async (id) => {
  const response = await api.delete(`/education/${id}`, {
    skipGlobalErrorHandler: true,
  })

  return response.data
}
