import api from './axiosInstance'

export const getTypewriterRoles = async () => {
  const response = await api.get('/typewriter-roles', {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? []
}

export const createTypewriterRole = async (data) => {
  const response = await api.post('/typewriter-roles', data, {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? null
}

export const updateTypewriterRole = async (id, data) => {
  const response = await api.put(`/typewriter-roles/${id}`, data, {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? null
}

export const deleteTypewriterRole = async (id) => {
  const response = await api.delete(`/typewriter-roles/${id}`, {
    skipGlobalErrorHandler: true,
  })

  return response.data
}
