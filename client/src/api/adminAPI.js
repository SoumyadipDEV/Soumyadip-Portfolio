import api from './axiosInstance'
import { uploadPublicFile } from '../utils/storageUpload'

const getFileFromFormData = (formData, fieldNames) => {
  for (const fieldName of fieldNames) {
    const value = formData.get(fieldName)

    if (value && typeof value === 'object' && 'name' in value) {
      return value
    }
  }

  for (const value of formData.values()) {
    if (value && typeof value === 'object' && 'name' in value) {
      return value
    }
  }

  throw new Error('No file found in form data')
}

export const getContactMessages = async () => {
  const response = await api.get('/contact/messages', {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data ?? []
}

export const markMessageAsRead = async (id) => {
  const response = await api.put(
    `/contact/messages/${id}/read`,
    {},
    {
      skipGlobalErrorHandler: true,
    },
  )

  return response.data?.data ?? null
}

export const deleteMessage = async (id) => {
  const response = await api.delete(`/contact/messages/${id}`, {
    skipGlobalErrorHandler: true,
  })

  return response.data
}

export const uploadResume = async (formData, config = {}) => {
  const response = await api.post('/resume/upload', formData, {
    ...config,
    headers: {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    },
    skipGlobalErrorHandler: true,
  })

  return response.data
}

export const getResumeUrl = async () => {
  const response = await api.get('/resume', {
    skipGlobalErrorHandler: true,
  })

  return response.data?.url ?? null
}

export const uploadProfileImage = async (formData) => {
  const file = getFileFromFormData(formData, ['profile_image', 'profileImage', 'file'])
  const url = await uploadPublicFile('profile-images', file, 'profile')

  return { success: true, url }
}

export const uploadThumbnail = async (formData) => {
  const file = getFileFromFormData(formData, ['thumbnail', 'thumbnail_file', 'file'])
  const url = await uploadPublicFile('thumbnails', file, 'thumbnail')

  return { success: true, url }
}
