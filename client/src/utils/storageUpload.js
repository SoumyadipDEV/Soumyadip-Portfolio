import supabase from './supabaseClient'

const getFileExtension = (file) => {
  const fromName = file.name?.split('.').pop()

  if (fromName) {
    return fromName.toLowerCase()
  }

  return file.type?.split('/').pop() || 'bin'
}

const sanitizeName = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const uploadPublicFile = async (bucket, file, prefix = 'upload') => {
  const extension = getFileExtension(file)
  const safePrefix = sanitizeName(prefix) || 'upload'
  const filePath = `${safePrefix}_${Date.now()}.${extension}`

  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: false,
  })

  if (error) {
    throw error
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath)

  return publicUrl
}
