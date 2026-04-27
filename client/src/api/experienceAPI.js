import api from './axiosInstance'

export const getExperience = async () => {
  const response = await api.get('/experience', {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? []
}

export const createExperience = async (data) => {
  const response = await api.post('/experience', data, {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? null
}

export const updateExperience = async (id, data) => {
  const response = await api.put(`/experience/${id}`, data, {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? null
}

export const deleteExperience = async (id) => {
  const response = await api.delete(`/experience/${id}`, {
    skipGlobalErrorHandler: true,
  })

  return response.data
}
