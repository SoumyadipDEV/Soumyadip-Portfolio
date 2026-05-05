import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FiDownload, FiEye, FiFileText, FiInfo, FiUploadCloud } from 'react-icons/fi'

import { getResumeUrl, uploadResume } from '../../api/adminAPI'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import EmptyState from '../../components/common/EmptyState'
import SkeletonCard from '../../components/common/SkeletonCard'

const maxResumeSize = 5 * 1024 * 1024

const formatFileSize = (bytes) => {
  if (!bytes) {
    return '0 KB'
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const getResumeFileName = (url) => {
  if (!url) {
    return 'Current Resume'
  }

  try {
    const pathname = new URL(url).pathname
    const fileName = decodeURIComponent(pathname.split('/').filter(Boolean).pop() || '')
    return fileName || 'Current Resume'
  } catch {
    const fileName = decodeURIComponent(url.split('/').filter(Boolean).pop() || '')
    return fileName || 'Current Resume'
  }
}

const getResumeUploadDate = (url) => {
  const timestamp = url?.match(/resume_(\d{10,})\.pdf/i)?.[1]

  if (!timestamp) {
    return 'Upload date unavailable'
  }

  const numericTimestamp = Number(timestamp)
  const date = new Date(numericTimestamp < 1000000000000 ? numericTimestamp * 1000 : numericTimestamp)

  if (Number.isNaN(date.getTime())) {
    return 'Upload date unavailable'
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

/** Admin resume manager with preview, validation, and multipart upload flow. */
function ResumePage() {
  const fileInputRef = useRef(null)
  const [resumeUrl, setResumeUrl] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    let isMounted = true

    getResumeUrl()
      .then((url) => {
        if (isMounted) {
          setResumeUrl(url)
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError)
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const validateFile = (file) => {
    if (!file) {
      return false
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

    if (!isPdf) {
      toast.error('Only PDF files are allowed.')
      return false
    }

    if (file.size > maxResumeSize) {
      toast.error('Resume must be 5 MB or smaller.')
      return false
    }

    return true
  }

  const selectFile = (file) => {
    if (validateFile(file)) {
      setSelectedFile(file)
      setUploadProgress(0)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragActive(false)
    selectFile(event.dataTransfer.files?.[0])
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Select a PDF resume first.')
      return
    }

    const formData = new FormData()
    formData.append('resume', selectedFile)

    setUploading(true)
    setUploadProgress(0)

    try {
      const result = await uploadResume(formData, {
        onUploadProgress(progressEvent) {
          if (!progressEvent.total) {
            return
          }

          setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
        },
      })

      setResumeUrl(result.url)
      setSelectedFile(null)
      setUploadProgress(100)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      toast.success('Resume uploaded.')
    } catch (uploadError) {
      toast.error(uploadError.response?.data?.message || uploadError.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = () => {
    if (!resumeUrl) {
      return
    }

    const link = document.createElement('a')
    link.href = resumeUrl
    link.download = getResumeFileName(resumeUrl)
    link.target = '_blank'
    link.rel = 'noreferrer'
    link.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Resume</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload and manage the public PDF resume download.
        </p>
      </div>

      {loading ? (
        <SkeletonCard className="min-h-80" />
      ) : error ? (
        <EmptyState
          message="Check your API server, Supabase credentials, and admin session."
          title="Unable to load resume"
        />
      ) : (
        <>
          <Card>
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <FiFileText aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Current Resume
                  </h3>
                  {resumeUrl ? (
                    <>
                      <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-100">
                        {getResumeFileName(resumeUrl)}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {getResumeUploadDate(resumeUrl)}
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FiInfo aria-hidden="true" />
                      No resume uploaded yet.
                    </p>
                  )}
                </div>
              </div>

              {resumeUrl ? (
                <div className="flex flex-wrap gap-3">
                  <Button as="a" href={resumeUrl} rel="noreferrer" target="_blank" variant="outline">
                    <FiEye aria-hidden="true" />
                    Preview
                  </Button>
                  <Button onClick={handleDownload} variant="outline">
                    <FiDownload aria-hidden="true" />
                    Download
                  </Button>
                </div>
              ) : null}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Upload New Resume
            </h3>
            <div
              aria-label="Resume upload drop zone"
              className={[
                'mt-5 rounded-lg border-2 border-dashed p-8 text-center transition',
                dragActive
                  ? 'border-gold bg-gold/10'
                  : 'border-gray-300 bg-gray-50 dark:border-navy-lighter dark:bg-navy',
              ].join(' ')}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={(event) => {
                event.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={(event) => {
                event.preventDefault()
                setDragActive(false)
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  fileInputRef.current?.click()
                }
              }}
              role="button"
              tabIndex={0}
            >
              <FiUploadCloud aria-hidden="true" className="mx-auto h-10 w-10 text-gold" />
              <p className="mt-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
                Drag and drop a PDF resume here
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                PDF only, max {formatFileSize(maxResumeSize)}
              </p>
              <Button
                className="mt-5"
                onClick={() => fileInputRef.current?.click()}
                type="button"
                variant="outline"
              >
                Browse File
              </Button>
              <input
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(event) => selectFile(event.target.files?.[0])}
                ref={fileInputRef}
                type="file"
              />
            </div>

            {selectedFile ? (
              <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4 dark:border-navy-lighter dark:bg-navy">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {selectedFile.name}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            ) : null}

            {uploading || uploadProgress > 0 ? (
              <div className="mt-5">
                <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-navy">
                  <span
                    className="block h-full rounded-full bg-gold transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {uploading ? `Uploading ${uploadProgress}%` : 'Upload complete'}
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex justify-end">
              <Button disabled={!selectedFile || uploading} onClick={handleUpload}>
                {uploading ? 'Uploading' : 'Upload Resume'}
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

export default ResumePage
