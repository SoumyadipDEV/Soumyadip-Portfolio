import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'

import {
  createTypewriterRole,
  deleteTypewriterRole,
  getTypewriterRoles,
  updateTypewriterRole,
} from '../../api/typewriterAPI'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import Modal from '../../components/common/Modal'
import SkeletonCard from '../../components/common/SkeletonCard'
import { inputClassName, labelClassName, requiredError, TextField, toNumberOrZero } from './adminFormUtils'

const emptyRole = {
  role_text: '',
  display_order: 0,
}

function TypewriterRolesPage() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [formData, setFormData] = useState(emptyRole)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadRoles = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getTypewriterRoles()
      setRoles(data || [])
    } catch (requestError) {
      setError(requestError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(loadRoles, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  const openCreateModal = () => {
    setEditingRole(null)
    setFormData(emptyRole)
    setFormErrors({})
    setModalOpen(true)
  }

  const openEditModal = (role) => {
    setEditingRole(role)
    setFormData({ ...emptyRole, ...role })
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
      const payload = {
        role_text: formData.role_text.trim(),
        display_order: toNumberOrZero(formData.display_order),
      }

      if (editingRole) {
        await updateTypewriterRole(editingRole.id, payload)
        toast.success('Role updated.')
      } else {
        await createTypewriterRole(payload)
        toast.success('Role created.')
      }

      setModalOpen(false)
      await loadRoles()
    } catch (submitError) {
      toast.error(submitError.message || 'Operation failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteClick = (role) => {
    setDeleteTarget(role)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)

    try {
      await deleteTypewriterRole(deleteTarget.id)
      toast.success('Role deleted.')
      setDeleteTarget(null)
      await loadRoles()
    } catch (deleteError) {
      toast.error(deleteError.message || 'Delete failed.')
    } finally {
      setDeleting(false)
    }
  }

  const validate = (data) =>
    Object.fromEntries(
      Object.entries({
        role_text: requiredError(data.role_text, 'Role text is required'),
      }).filter(([, value]) => value),
    )

  const sortedRoles = [...roles].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Typewriter Roles</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            These roles cycle in the Hero section typewriter animation
          </p>
        </div>
        <Button onClick={openCreateModal} variant="primary">
          <FiPlus aria-hidden="true" />
          Add New Role
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-2">
          <SkeletonCard className="h-12" />
          <SkeletonCard className="h-12" />
          <SkeletonCard className="h-12" />
        </div>
      ) : error ? (
        <EmptyState
          message="Check that the API server is running and Supabase credentials are configured."
          title="Unable to load roles"
        />
      ) : sortedRoles.length === 0 ? (
        <EmptyState
          message="No roles have been created yet. Add one to customize the typewriter animation."
          title="No Typewriter Roles"
        />
      ) : (
        <div className="space-y-2 rounded-lg border border-gray-200 bg-white dark:border-navy-lighter dark:bg-navy-light">
          {sortedRoles.map((role, index) => (
            <div
              className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 last:border-b-0 dark:border-navy-lighter sm:gap-6"
              key={role.id}
            >
              {/* Left side: order and text */}
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10 text-sm font-semibold text-gold dark:bg-gold/20">
                  {index + 1}
                </span>
                <span className="min-w-0 truncate font-semibold text-gray-900 dark:text-white">
                  {role.role_text}
                </span>
              </div>

              {/* Right side: action buttons */}
              <div className="flex shrink-0 gap-2">
                <button
                  aria-label={`Edit role: ${role.role_text}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition hover:bg-gold/10 hover:text-gold dark:border-navy-lighter dark:text-gray-400 dark:hover:text-gold"
                  onClick={() => openEditModal(role)}
                  title="Edit"
                  type="button"
                >
                  <FiEdit2 aria-hidden="true" className="h-4 w-4" />
                </button>
                <button
                  aria-label={`Delete role: ${role.role_text}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-300 text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-800/30 dark:text-red-400 dark:hover:bg-red-950/20 dark:hover:text-red-300"
                  onClick={() => handleDeleteClick(role)}
                  title="Delete"
                  type="button"
                >
                  <FiTrash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create/Edit */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editingRole ? 'Edit Role' : 'Add New Role'}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextField
            error={formErrors.role_text}
            label="Role Text"
            name="role_text"
            onChange={(name, value) => setFormData((current) => ({ ...current, [name]: value }))}
            placeholder="e.g. Software Developer"
            value={formData.role_text || ''}
          />

          <label className={labelClassName}>
            Display Order
            <input
              className={inputClassName}
              max="9999"
              min="0"
              onChange={(event) => setFormData((current) => ({ ...current, display_order: event.target.value }))}
              type="number"
              value={formData.display_order ?? 0}
            />
          </label>

          <div className="flex gap-2 pt-4">
            <button
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-navy-lighter dark:bg-navy-light dark:text-gray-300 dark:hover:bg-navy-lighter"
              disabled={saving}
              onClick={closeModal}
              type="button"
            >
              Cancel
            </button>
            <button
              className="flex-1 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy transition hover:bg-gold/90 disabled:opacity-50"
              disabled={saving}
              type="submit"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      {deleteTarget ? (
        <ConfirmDialog
          action="Delete"
          description={`Are you sure you want to delete the role "${deleteTarget.role_text}"? This cannot be undone.`}
          isLoading={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Role"
        />
      ) : null}
    </div>
  )
}

export default TypewriterRolesPage
