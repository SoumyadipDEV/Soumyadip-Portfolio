import api from './axiosInstance'

export const getHobbies = async () => {
  const response = await api.get('/hobbies', {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? []
}

export const createHobby = async (data) => {
  const response = await api.post('/hobbies', data, {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? null
}

export const updateHobby = async (id, data) => {
  const response = await api.put(`/hobbies/${id}`, data, {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? null
}

export const deleteHobby = async (id) => {
  const response = await api.delete(`/hobbies/${id}`, {
    skipGlobalErrorHandler: true,
  })

  return response.data
}
