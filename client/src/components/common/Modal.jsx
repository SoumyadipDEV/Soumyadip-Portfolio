import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'

function Modal({ children, isOpen, onClose, title }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
      <button
        aria-label="Close modal"
        className="absolute inset-0 h-full w-full bg-navy/70"
        onClick={onClose}
        type="button"
      />
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-navy-lighter dark:bg-navy-light">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-navy-lighter">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
          <button
            aria-label="Close modal"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gold dark:text-gray-400 dark:hover:bg-navy"
            onClick={onClose}
            type="button"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[calc(90vh-73px)] overflow-y-auto p-5">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export default Modal
