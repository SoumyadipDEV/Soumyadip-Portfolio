import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from '../../api/projectsAPI'
import TagInput from '../../components/common/TagInput'
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

const emptyProject = {
  title: '',
  description: '',
  tech_stack: [],
  live_url: '',
  github_url: '',
  thumbnail_url: '',
  thumbnail_file: null,
  is_featured: false,
  display_order: 0,
}

const thumbnailPreview = (item) =>
  item.thumbnail_url ? (
    <img alt={item.title} className="h-12 w-16 rounded object-cover" src={item.thumbnail_url} />
  ) : (
    <span className="inline-flex h-12 w-16 items-center justify-center rounded bg-navy text-xs font-bold text-gold">
      IMG
    </span>
  )

function ProjectsPage() {
  return (
    <AdminCrudPage
      columns={[
        { header: 'Thumbnail', render: thumbnailPreview },
        { header: 'Title', render: (item) => item.title },
        { header: 'Featured', render: (item) => (item.is_featured ? 'Yes' : 'No') },
      ]}
      createItem={createProject}
      deleteItem={deleteProject}
      emptyItem={emptyProject}
      emptyMessage="Projects added here will appear in the public project grid."
      fetchItems={getProjects}
      formTitle="Project"
      getDeleteLabel={(item) => item?.title || 'this project'}
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
            <TextField as="textarea" label="Description" name="description" onChange={setField} rows="4" value={formData.description || ''} />
            <TagInput
              label="Tech Stack"
              onChange={(tags) => setField('tech_stack', tags)}
              value={Array.isArray(formData.tech_stack) ? formData.tech_stack : []}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Live URL" name="live_url" onChange={setField} type="url" value={formData.live_url || ''} />
              <TextField label="GitHub URL" name="github_url" onChange={setField} type="url" value={formData.github_url || ''} />
            </div>
            <div className="grid gap-4 md:grid-cols-[140px_1fr] md:items-end">
              <div className="aspect-[16/10] overflow-hidden rounded-md bg-navy">
                {previewUrl ? (
                  <img alt="Project thumbnail preview" className="h-full w-full object-cover" src={previewUrl} />
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
            <label className="flex items-center gap-3 text-sm font-semibold text-gray-800 dark:text-gray-100">
              <input
                checked={Boolean(formData.is_featured)}
                className="h-4 w-4 accent-gold"
                onChange={(event) => setField('is_featured', event.target.checked)}
                type="checkbox"
              />
              Is Featured
            </label>
            <TextField label="Display Order" name="display_order" onChange={setField} type="number" value={formData.display_order ?? 0} />
          </div>
        )
      }}
      title="Projects"
      toPayload={async (data) => {
        let thumbnailUrl = data.thumbnail_url

        if (data.thumbnail_file) {
          thumbnailUrl = await uploadPublicFile('thumbnails', data.thumbnail_file, 'project')
        }

        return {
          title: data.title.trim(),
          description: toNullableString(data.description),
          tech_stack: Array.isArray(data.tech_stack) ? data.tech_stack : [],
          live_url: toNullableString(data.live_url),
          github_url: toNullableString(data.github_url),
          thumbnail_url: toNullableString(thumbnailUrl),
          is_featured: Boolean(data.is_featured),
          display_order: toNumberOrZero(data.display_order),
        }
      }}
      updateItem={updateProject}
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

export default ProjectsPage
