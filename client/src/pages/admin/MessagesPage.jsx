import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FiEye, FiSend, FiTrash2 } from 'react-icons/fi'

import {
  deleteMessage,
  getContactMessages,
  getMessageReplies,
  markMessageAsRead,
} from '../../api/adminAPI'
import ReplyModal from '../../components/admin/ReplyModal'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import Modal from '../../components/common/Modal'
import SkeletonCard from '../../components/common/SkeletonCard'

const filters = ['All', 'Unread', 'Read']

const formatDateTime = (value) => {
  if (!value) {
    return 'Unknown'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const getMessagePreview = (message = '') =>
  message.length > 100 ? `${message.slice(0, 100)}...` : message

/** Admin contact message inbox with read-state handling and deletion. */
function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [selectedMessageReplies, setSelectedMessageReplies] = useState([])
  const [repliesLoading, setRepliesLoading] = useState(false)
  const [replyModalOpen, setReplyModalOpen] = useState(false)
  const [selectedMessageForReply, setSelectedMessageForReply] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadMessages = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getContactMessages()
      setMessages(
        [...data].sort(
          (a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime(),
        ),
      )
    } catch (requestError) {
      setError(requestError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(loadMessages, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    if (!selectedMessage?.id) {
      return undefined
    }

    let ignore = false

    const loadReplies = async () => {
      setRepliesLoading(true)

      try {
        const replies = await getMessageReplies(selectedMessage.id)

        if (!ignore) {
          setSelectedMessageReplies(replies)
        }
      } catch (replyError) {
        if (!ignore) {
          setSelectedMessageReplies([])
          toast.error(
            replyError.response?.data?.message || replyError.message || 'Unable to load replies',
          )
        }
      } finally {
        if (!ignore) {
          setRepliesLoading(false)
        }
      }
    }

    loadReplies()

    return () => {
      ignore = true
    }
  }, [selectedMessage?.id])

  const unreadCount = useMemo(
    () => messages.filter((message) => !message.is_read && !message.is_replied).length,
    [messages],
  )

  const visibleMessages = useMemo(() => {
    if (activeFilter === 'Unread') {
      return messages.filter((message) => !message.is_read && !message.is_replied)
    }

    if (activeFilter === 'Read') {
      return messages.filter((message) => message.is_read || message.is_replied)
    }

    return messages
  }, [activeFilter, messages])

  const handleView = async (message) => {
    setSelectedMessageReplies([])
    setRepliesLoading(true)
    setSelectedMessage(message)

    if (message.is_read) {
      return
    }

    try {
      const updatedMessage = await markMessageAsRead(message.id)
      setMessages((current) =>
        current.map((item) =>
          item.id === message.id ? { ...item, ...(updatedMessage || {}), is_read: true } : item,
        ),
      )
      setSelectedMessage((current) =>
        current?.id === message.id ? { ...current, ...(updatedMessage || {}), is_read: true } : current,
      )
    } catch (readError) {
      toast.error(readError.response?.data?.message || readError.message || 'Unable to mark read')
    }
  }

  const openReplyModal = (message) => {
    setSelectedMessageForReply(message)
    setReplyModalOpen(true)
  }

  const closeReplyModal = () => {
    setReplyModalOpen(false)
    setSelectedMessageForReply(null)
  }

  const closeViewModal = () => {
    setSelectedMessage(null)
    setSelectedMessageReplies([])
    setRepliesLoading(false)
  }

  const handleReplySent = (messageId) => {
    const repliedAt = new Date().toISOString()

    setMessages((current) =>
      current.map((message) =>
        message.id === messageId
          ? { ...message, is_replied: true, replied_at: repliedAt, is_read: true }
          : message,
      ),
    )
    setSelectedMessage((current) =>
      current?.id === messageId
        ? { ...current, is_replied: true, replied_at: repliedAt, is_read: true }
        : current,
    )
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    setDeleting(true)

    try {
      await deleteMessage(deleteTarget.id)
      setMessages((current) => current.filter((message) => message.id !== deleteTarget.id))
      if (selectedMessage?.id === deleteTarget.id) {
        closeViewModal()
      }
      if (selectedMessageForReply?.id === deleteTarget.id) {
        setSelectedMessageForReply(null)
        setReplyModalOpen(false)
      }
      setDeleteTarget(null)
      toast.success('Message deleted.')
    } catch (deleteError) {
      toast.error(deleteError.response?.data?.message || deleteError.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Messages</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review and manage contact form submissions.
        </p>
      </div>

      {loading ? (
        <SkeletonCard className="min-h-80" />
      ) : error ? (
        <EmptyState
          message="Check your API server, Supabase credentials, and admin session."
          title="Unable to load messages"
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-navy p-5">
              <p className="text-sm font-medium text-gray-300">Total Messages</p>
              <p className="mt-3 text-4xl font-bold text-gold">{messages.length}</p>
            </div>
            <div className="rounded-lg bg-navy p-5">
              <p className="text-sm font-medium text-gray-300">Unread Count</p>
              <p className="mt-3 text-4xl font-bold text-gold">{unreadCount}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                className={[
                  'rounded-full border px-4 py-2 text-sm font-semibold transition',
                  activeFilter === filter
                    ? 'border-gold bg-gold text-navy'
                    : 'border-gray-300 bg-white text-gray-800 hover:border-gold hover:text-gold dark:border-navy-lighter dark:bg-navy-light dark:text-gray-100',
                ].join(' ')}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>

          {visibleMessages.length ? (
            <div className="grid gap-4">
              {visibleMessages.map((message) => (
                <Card className={`relative ${message.is_replied ? 'pt-10' : ''}`} key={message.id}>
                  {message.is_replied ? (
                    <span className="absolute left-4 top-4 rounded-full bg-[#1a472a] px-2 py-0.5 text-[11px] font-semibold text-white">
                      ✓ Replied
                    </span>
                  ) : !message.is_read ? (
                    <span
                      aria-label="Unread"
                      className="absolute right-4 top-4 h-3 w-3 rounded-full bg-gold"
                    />
                  ) : null}
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                          {message.sender_name}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {message.sender_email}
                        </span>
                      </div>
                      <p className="mt-3 text-base font-semibold text-gray-800 dark:text-gray-100">
                        {message.subject || 'No subject'}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-gray-500 dark:text-gray-400">
                        {getMessagePreview(message.message)}
                      </p>
                      <p className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                        {formatDateTime(message.received_at)}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Button onClick={() => handleView(message)} size="sm" variant="outline">
                        <FiEye aria-hidden="true" />
                        View
                      </Button>
                      <Button onClick={() => openReplyModal(message)} size="sm" variant="outline">
                        <FiSend aria-hidden="true" />
                        Reply
                      </Button>
                      <Button
                        className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        onClick={() => setDeleteTarget(message)}
                        size="sm"
                        variant="outline"
                      >
                        <FiTrash2 aria-hidden="true" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              message="Messages matching this filter will appear here."
              title="No messages found"
            />
          )}
        </>
      )}

      <Modal
        isOpen={Boolean(selectedMessage)}
        onClose={closeViewModal}
        title={selectedMessage?.subject || 'Contact Message'}
      >
        {selectedMessage ? (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {selectedMessage.sender_name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedMessage.sender_email}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {formatDateTime(selectedMessage.received_at)}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-navy-lighter dark:bg-navy">
              <p className="whitespace-pre-wrap text-sm leading-7 text-gray-800 dark:text-gray-100">
                {selectedMessage.message}
              </p>
            </div>
            {repliesLoading ? (
              <p className="border-t border-gray-200 pt-4 text-sm text-gray-500 dark:border-navy-lighter dark:text-gray-400">
                Loading replies...
              </p>
            ) : selectedMessageReplies.length ? (
              <div className="border-t border-gray-200 pt-4 dark:border-navy-lighter">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Replies</h3>
                <div className="mt-3 space-y-3">
                  {selectedMessageReplies.map((reply) => (
                    <div
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-navy-lighter dark:bg-navy"
                      key={reply.id}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                        You replied:
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-800 dark:text-gray-100">
                        {reply.reply_body}
                      </p>
                      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        {formatDateTime(reply.sent_at)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>

      <ReplyModal
        isOpen={replyModalOpen}
        key={selectedMessageForReply?.id || 'reply-modal'}
        message={selectedMessageForReply}
        onClose={closeReplyModal}
        onReplySent={handleReplySent}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        loading={deleting}
        message={`Delete message from ${deleteTarget?.sender_name || 'this sender'}? This cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export default MessagesPage
