import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'
import { FiChevronDown, FiChevronUp, FiLoader, FiSend, FiX } from 'react-icons/fi'

import { sendReply } from '../../api/adminAPI'
import Button from '../common/Button'

function ReplyModal({ isOpen, message, onClose, onReplySent }) {
  const [replyBody, setReplyBody] = useState('')
  const [showOriginal, setShowOriginal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !submitting) {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, submitting])

  if (!isOpen || !message) {
    return null
  }

  const subject = message.subject?.trim() || 'Your message'
  const trimmedReply = replyBody.trim()

  const requestClose = () => {
    if (!submitting) {
      onClose()
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!trimmedReply) {
      setValidationError('Reply is required.')
      return
    }

    if (trimmedReply.length < 10) {
      setValidationError('Reply must be at least 10 characters.')
      return
    }

    setSubmitting(true)
    setValidationError('')

    try {
      await sendReply(message.id, trimmedReply)
      toast.success('Reply sent successfully! ✓')
      onReplySent(message.id)
      setReplyBody('')
      onClose()
    } catch {
      toast.error('Failed to send reply. Please try again.')
      setSubmitting(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-stretch justify-center sm:items-center sm:px-4 sm:py-8">
      <button
        aria-label="Close reply modal"
        className="absolute inset-0 h-full w-full bg-navy/70"
        onClick={requestClose}
        type="button"
      />
      <form
        aria-label={`Reply to ${message.sender_name}`}
        aria-modal="true"
        className="relative flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl dark:bg-navy-light sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-lg sm:border sm:border-gray-200 sm:dark:border-navy-lighter"
        noValidate
        onSubmit={handleSubmit}
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-navy-lighter">
          <h2 className="min-w-0 truncate text-lg font-semibold text-gray-800 dark:text-gray-100">
            Reply to {message.sender_name}
          </h2>
          <button
            aria-label="Close reply modal"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gold disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-400 dark:hover:bg-navy"
            disabled={submitting}
            onClick={requestClose}
            type="button"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm dark:border-navy-lighter dark:bg-navy">
            <div className="grid gap-2 sm:grid-cols-[72px_1fr]">
              <span className="font-semibold text-gray-700 dark:text-gray-200">To:</span>
              <span className="min-w-0 break-words text-gray-600 dark:text-gray-300">
                {message.sender_name} &lt;{message.sender_email}&gt;
              </span>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Subject:</span>
              <span className="min-w-0 break-words text-gray-600 dark:text-gray-300">
                Re: {subject}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-5 dark:border-navy-lighter">
            <button
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-light"
              onClick={() => setShowOriginal((current) => !current)}
              type="button"
            >
              Show original message
              {showOriginal ? <FiChevronUp aria-hidden="true" /> : <FiChevronDown aria-hidden="true" />}
            </button>

            {showOriginal ? (
              <div className="mt-3 max-h-[150px] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-navy-lighter dark:bg-navy">
                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700 dark:text-gray-200">
                  {message.message}
                </p>
              </div>
            ) : null}
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-100"
              htmlFor="reply-body"
            >
              Your Reply
            </label>
            <textarea
              className="min-h-[192px] w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/30 disabled:cursor-not-allowed disabled:opacity-70 dark:border-navy-lighter dark:bg-navy dark:text-gray-100"
              disabled={submitting}
              id="reply-body"
              minLength={10}
              onChange={(event) => {
                setReplyBody(event.target.value)
                if (validationError) {
                  setValidationError('')
                }
              }}
              placeholder="Write your reply here..."
              required
              rows={8}
              value={replyBody}
            />
            {validationError ? (
              <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                {validationError}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4 dark:border-navy-lighter">
          <Button disabled={submitting} onClick={requestClose} type="button" variant="ghost">
            Cancel
          </Button>
          <Button disabled={submitting} type="submit">
            {submitting ? (
              <FiLoader aria-hidden="true" className="animate-spin" />
            ) : (
              <FiSend aria-hidden="true" />
            )}
            Send Reply
          </Button>
        </div>
      </form>
    </div>,
    document.body,
  )
}

export default ReplyModal
