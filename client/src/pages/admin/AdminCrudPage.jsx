import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'

import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import Modal from '../../components/common/Modal'
import SkeletonCard from '../../components/common/SkeletonCard'

function AdminCrudPage({
  columns,
  createItem,
  deleteItem,
  emptyItem,
  emptyMessage,
  fetchItems,
  formTitle,
  getDeleteLabel = (item) => item?.name || item?.title || 'this entry',
  normalizeItems = (items) => items,
  renderForm,
  title,
  toFormData = (item) => item,
  toPayload = (item) => item,
  updateItem,
  validate,
}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState(emptyItem)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadItems = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchItems()
      setItems(normalizeItems(data))
    } catch (requestError) {
      setError(requestError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(loadItems, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData(emptyItem)
    setFormErrors({})
    setModalOpen(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setFormData({ ...emptyItem, ...toFormData(item) })
    setFormErrors({})
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setModalOpen(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validate(formData)
    setFormErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      toast.error('Fix the highlighted fields.')
      return
    }

    setSaving(true)

    try {
      const payload = await toPayload(formData, editingItem)

      if (editingItem) {
        await updateItem(editingItem.id, payload)
        toast.success('Entry updated.')
      } else {
        await createItem(payload)
        toast.success('Entry added.')
      }

      setModalOpen(false)
      await loadItems()
    } catch (saveError) {
      toast.error(saveError.response?.data?.message || saveError.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)

    try {
      await deleteItem(deleteTarget.id)
      toast.success('Entry deleted.')
      setDeleteTarget(null)
      await loadItems()
    } catch (deleteError) {
      toast.error(deleteError.response?.data?.message || deleteError.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add, edit, reorder, or remove portfolio records.
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <FiPlus aria-hidden="true" />
          Add New
        </Button>
      </div>

      {loading ? (
        <SkeletonCard className="min-h-72" />
      ) : error ? (
        <EmptyState
          message="Check your API server, Supabase credentials, and admin session."
          title={`Unable to load ${title.toLowerCase()}`}
        />
      ) : !items.length ? (
        <EmptyState message={emptyMessage} title={`No ${title.toLowerCase()} yet`} />
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-navy-lighter dark:bg-navy-light">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-navy-lighter">
              <thead className="bg-gray-50 dark:bg-navy">
                <tr>
                  {columns.map((column) => (
                    <th
                      className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400"
                      key={column.header}
                    >
                      {column.header}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-semibold text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-navy-lighter">
                {items.map((item) => (
                  <tr key={item.id}>
                    {columns.map((column) => (
                      <td
                        className="px-4 py-4 align-middle text-gray-800 dark:text-gray-100"
                        key={`${item.id}-${column.header}`}
                      >
                        {column.render(item)}
                      </td>
                    ))}
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          aria-label="Edit entry"
                          className="h-9 w-9 px-0"
                          onClick={() => openEditModal(item)}
                          size="sm"
                          variant="ghost"
                        >
                          <FiEdit2 aria-hidden="true" />
                        </Button>
                        <Button
                          aria-label="Delete entry"
                          className="h-9 w-9 px-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950"
                          onClick={() => setDeleteTarget(item)}
                          size="sm"
                          variant="ghost"
                        >
                          <FiTrash2 aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={`${editingItem ? 'Edit' : 'Add'} ${formTitle}`}
      >
        <form className="grid gap-4" onSubmit={handleSubmit}>
          {renderForm({
            errors: formErrors,
            formData,
            setFormData,
          })}
          <div className="flex justify-end gap-3 pt-2">
            <Button disabled={saving} onClick={closeModal} type="button" variant="ghost">
              Cancel
            </Button>
            <Button disabled={saving} type="submit">
              {saving ? 'Saving' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        loading={deleting}
        message={`Delete ${getDeleteLabel(deleteTarget)}? This cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export default AdminCrudPage
