import {
  createCertificate,
  deleteCertificate,
  getCertificates,
  updateCertificate,
} from '../../api/certificatesAPI'
import { uploadPublicFile } from '../../utils/storageUpload'
import AdminCrudPage from './AdminCrudPage'
import {
  inputClassName,
  labelClassName,
  requiredError,
  TextField,
  toNullableString,
  toNumberOrZero,
} from './adminFormUtils'

const emptyCertificate = {
  title: '',
  issuing_organization: '',
  issue_date: '',
  expiry_date: '',
  no_expiry: true,
  credential_id: '',
  credential_url: '',
  thumbnail_url: '',
  thumbnail_file: null,
  display_order: 0,
}

function CertificatesPage() {
  return (
    <AdminCrudPage
      columns={[
        { header: 'Title', render: (item) => item.title },
        { header: 'Organization', render: (item) => item.issuing_organization || '-' },
        { header: 'Issue Date', render: (item) => item.issue_date || '-' },
        { header: 'Expiry', render: (item) => item.expiry_date || 'No Expiry' },
      ]}
      createItem={createCertificate}
      deleteItem={deleteCertificate}
      emptyItem={emptyCertificate}
      emptyMessage="Certificates added here will appear in the public credential section."
      fetchItems={getCertificates}
      formTitle="Certificate"
      getDeleteLabel={(item) => item?.title || 'this certificate'}
      normalizeItems={(items) =>
        [...items].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      }
      renderForm={({ errors, formData, setFormData }) => {
        const setField = (name, value) => setFormData((current) => ({ ...current, [name]: value }))
        const previewUrl = formData.thumbnail_file
          ? URL.createObjectURL(formData.thumbnail_file)
          : formData.thumbnail_url

        return (
          <div className="grid gap-4">
            <TextField error={errors.title} label="Title" name="title" onChange={setField} value={formData.title || ''} />
            <TextField label="Issuing Organization" name="issuing_organization" onChange={setField} value={formData.issuing_organization || ''} />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Issue Date" name="issue_date" onChange={setField} type="date" value={formData.issue_date || ''} />
              <TextField disabled={formData.no_expiry} label="Expiry Date" name="expiry_date" onChange={setField} type="date" value={formData.no_expiry ? '' : formData.expiry_date || ''} />
            </div>
            <label className="flex items-center gap-3 text-sm font-semibold text-gray-800 dark:text-gray-100">
              <input
                checked={Boolean(formData.no_expiry)}
                className="h-4 w-4 accent-gold"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    expiry_date: event.target.checked ? '' : current.expiry_date,
                    no_expiry: event.target.checked,
                  }))
                }
                type="checkbox"
              />
              No Expiry
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Credential ID" name="credential_id" onChange={setField} value={formData.credential_id || ''} />
              <TextField label="Credential URL" name="credential_url" onChange={setField} type="url" value={formData.credential_url || ''} />
            </div>
            <div className="grid gap-4 md:grid-cols-[140px_1fr] md:items-end">
              <div className="aspect-[16/10] overflow-hidden rounded-md bg-navy">
                {previewUrl ? (
                  <img alt="Certificate thumbnail preview" className="h-full w-full object-cover" src={previewUrl} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-gold">
                    Thumbnail
                  </div>
                )}
              </div>
              <label className={labelClassName}>
                Thumbnail Upload
                <input
                  accept="image/*"
                  className={inputClassName}
                  onChange={(event) => setField('thumbnail_file', event.target.files?.[0] || null)}
                  type="file"
                />
              </label>
            </div>
            <TextField label="Display Order" name="display_order" onChange={setField} type="number" value={formData.display_order ?? 0} />
          </div>
        )
      }}
      title="Certificates"
      toFormData={(item) => ({
        ...item,
        no_expiry: !item.expiry_date,
      })}
      toPayload={async (data) => {
        let thumbnailUrl = data.thumbnail_url

        if (data.thumbnail_file) {
          thumbnailUrl = await uploadPublicFile('thumbnails', data.thumbnail_file, 'certificate')
        }

        return {
          title: data.title.trim(),
          issuing_organization: toNullableString(data.issuing_organization),
          issue_date: toNullableString(data.issue_date),
          expiry_date: data.no_expiry ? null : toNullableString(data.expiry_date),
          credential_id: toNullableString(data.credential_id),
          credential_url: toNullableString(data.credential_url),
          thumbnail_url: toNullableString(thumbnailUrl),
          display_order: toNumberOrZero(data.display_order),
        }
      }}
      updateItem={updateCertificate}
      validate={(data) =>
        Object.fromEntries(
          Object.entries({
            title: requiredError(data.title, 'Title is required'),
          }).filter(([, value]) => value),
        )
      }
    />
  )
}

export default CertificatesPage
