import { getResume } from '../api/resumeAPI'

const getResumeFileName = (url) => {
  try {
    const pathname = new URL(url).pathname
    return decodeURIComponent(pathname.split('/').filter(Boolean).pop() || 'resume.pdf')
  } catch {
    return 'resume.pdf'
  }
}

export const downloadLatestResume = async () => {
  const url = await getResume()

  if (!url) {
    throw new Error('Resume is not available yet')
  }

  const link = document.createElement('a')
  link.href = url
  link.download = getResumeFileName(url)
  link.rel = 'noreferrer'
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()

  return url
}
