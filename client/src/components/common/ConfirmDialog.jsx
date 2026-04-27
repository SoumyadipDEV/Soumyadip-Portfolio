import Button from './Button'
import Modal from './Modal'

function ConfirmDialog({
  confirmLabel = 'Delete',
  isOpen,
  loading = false,
  message,
  onCancel,
  onConfirm,
  title = 'Confirm action',
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="space-y-5">
        <p className="text-sm leading-7 text-gray-500 dark:text-gray-400">{message}</p>
        <div className="flex flex-wrap justify-end gap-3">
          <Button disabled={loading} onClick={onCancel} variant="ghost">
            Cancel
          </Button>
          <Button
            className="border-red-600 bg-red-600 text-white hover:bg-red-700"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? 'Deleting' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
