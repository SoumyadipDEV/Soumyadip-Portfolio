import api from './axiosInstance'

export const getCertificates = async () => {
  const response = await api.get('/certificates', {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? []
}

export const createCertificate = async (data) => {
  const response = await api.post('/certificates', data, {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? null
}

export const updateCertificate = async (id, data) => {
  const response = await api.put(`/certificates/${id}`, data, {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? null
}

export const deleteCertificate = async (id) => {
  const response = await api.delete(`/certificates/${id}`, {
    skipGlobalErrorHandler: true,
  })

  return response.data
}
