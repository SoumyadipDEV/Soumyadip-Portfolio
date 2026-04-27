import api from './axiosInstance'

export const getProjects = async () => {
  const response = await api.get('/projects', {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? []
}

export const getFeaturedProjects = async () => {
  const response = await api.get('/projects/featured', {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? []
}

export const createProject = async (data) => {
  const response = await api.post('/projects', data, {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? null
}

export const updateProject = async (id, data) => {
  const response = await api.put(`/projects/${id}`, data, {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? null
}

export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`, {
    skipGlobalErrorHandler: true,
  })

  return response.data
}
