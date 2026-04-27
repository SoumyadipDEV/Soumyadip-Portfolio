import api from './axiosInstance'

export const getSkills = async () => {
  const response = await api.get('/skills', {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? {}
}

export const createSkill = async (data) => {
  const response = await api.post('/skills', data, {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? null
}

export const updateSkill = async (id, data) => {
  const response = await api.put(`/skills/${id}`, data, {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? null
}

export const deleteSkill = async (id) => {
  const response = await api.delete(`/skills/${id}`, {
    skipGlobalErrorHandler: true,
  })

  return response.data
}
