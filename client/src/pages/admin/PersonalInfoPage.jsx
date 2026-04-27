import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { getPersonalInfo, updatePersonalInfo } from '../../api/personalInfoAPI'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import EmptyState from '../../components/common/EmptyState'
import SkeletonCard from '../../components/common/SkeletonCard'
import { uploadPublicFile } from '../../utils/storageUpload'
import {
  errorClassName,
  inputClassName,
  labelClassName,
  requiredError,
  TextField,
  toNullableString,
} from './adminFormUtils'

const emptyForm = {
  full_name: '',
  tagline: '',
  bio: '',
  email: '',
  phone: '',
  location: '',
  github_url: '',
  linkedin_url: '',
  twitter_url: '',
  website_url: '',
  profile_image_url: '',
}

function PersonalInfoPage() {
  const [formData, setFormData] = useState(emptyForm)
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    let isMounted = true

    getPersonalInfo()
      .then((data) => {
        if (isMounted && data) {
          setFormData({ ...emptyForm, ...data })
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

  const setField = (name, value) => {
    setFormData((current) => ({ ...current, [name]: value }))
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }))
    }
  }

  const validate = () => {
    const nextErrors = {
      full_name: requiredError(formData.full_name, 'Full name is required'),
    }

    return Object.fromEntries(Object.entries(nextErrors).filter(([, value]) => value))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      toast.error('Fix the highlighted fields.')
      return
    }

    setSaving(true)

    try {
      let profileImageUrl = formData.profile_image_url

      if (profileImageFile) {
        profileImageUrl = await uploadPublicFile('profile-images', profileImageFile, 'profile')
      }

      await updatePersonalInfo({
        full_name: formData.full_name.trim(),
        tagline: toNullableString(formData.tagline),
        bio: toNullableString(formData.bio),
        email: toNullableString(formData.email),
        phone: toNullableString(formData.phone),
        location: toNullableString(formData.location),
        github_url: toNullableString(formData.github_url),
        linkedin_url: toNullableString(formData.linkedin_url),
        twitter_url: toNullableString(formData.twitter_url),
        website_url: toNullableString(formData.website_url),
        profile_image_url: toNullableString(profileImageUrl),
      })

      setFormData((current) => ({ ...current, profile_image_url: profileImageUrl }))
      setProfileImageFile(null)
      toast.success('Personal info saved.')
    } catch (saveError) {
      toast.error(saveError.response?.data?.message || saveError.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const previewUrl = profileImageFile
    ? URL.createObjectURL(profileImageFile)
    : formData.profile_image_url

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Personal Info</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage the profile details shown on the public portfolio.
        </p>
      </div>

      {loading ? (
        <SkeletonCard className="min-h-96" />
      ) : error ? (
        <EmptyState
          message="Check your API server, Supabase credentials, and admin session."
          title="Unable to load personal info"
        />
      ) : (
        <Card>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
              <div>
                <div className="aspect-square overflow-hidden rounded-full border-4 border-gold bg-navy">
                  {previewUrl ? (
                    <img alt="Profile preview" className="h-full w-full object-cover" src={previewUrl} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-gold">
                      IMG
                    </div>
                  )}
                </div>
                <label className={`${labelClassName} mt-4`}>
                  Profile Image
                  <input
                    accept="image/*"
                    className={inputClassName}
                    onChange={(event) => setProfileImageFile(event.target.files?.[0] || null)}
                    type="file"
                  />
                </label>
              </div>

              <div className="grid gap-4">
                <TextField
                  error={errors.full_name}
                  label="Full Name"
                  name="full_name"
                  onChange={setField}
                  value={formData.full_name}
                />
                <TextField
                  label="Tagline"
                  name="tagline"
                  onChange={setField}
                  value={formData.tagline || ''}
                />
                <TextField
                  as="textarea"
                  label="Bio"
                  name="bio"
                  onChange={setField}
                  rows="5"
                  value={formData.bio || ''}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField label="Email" name="email" onChange={setField} type="email" value={formData.email || ''} />
                  <TextField label="Phone" name="phone" onChange={setField} value={formData.phone || ''} />
                  <TextField label="Location" name="location" onChange={setField} value={formData.location || ''} />
                  <TextField label="Website URL" name="website_url" onChange={setField} type="url" value={formData.website_url || ''} />
                  <TextField label="GitHub URL" name="github_url" onChange={setField} type="url" value={formData.github_url || ''} />
                  <TextField label="LinkedIn URL" name="linkedin_url" onChange={setField} type="url" value={formData.linkedin_url || ''} />
                  <TextField label="Twitter URL" name="twitter_url" onChange={setField} type="url" value={formData.twitter_url || ''} />
                </div>
              </div>
            </div>

            {errors.full_name ? <span className={errorClassName}>{errors.full_name}</span> : null}

            <div className="flex justify-end">
              <Button disabled={saving} type="submit">
                {saving ? 'Saving' : 'Save'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}

export default PersonalInfoPage
