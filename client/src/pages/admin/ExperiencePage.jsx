import {
  createExperience,
  deleteExperience,
  getExperience,
  updateExperience,
} from '../../api/experienceAPI'
import TagInput from '../../components/common/TagInput'
import AdminCrudPage from './AdminCrudPage'
import {
  inputClassName,
  labelClassName,
  requiredError,
  TextField,
  toNullableString,
  toNumberOrZero,
} from './adminFormUtils'

const emptyExperience = {
  company_name: '',
  job_title: '',
  employment_type: '',
  location: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
  tech_stack: [],
  display_order: 0,
}

const employmentTypes = ['', 'Full-time', 'Part-time', 'Contract', 'Freelance']

const formatDuration = (item) => {
  const start = item.start_date || '-'
  const end = item.is_current ? 'Present' : item.end_date || '-'
  return `${start} – ${end}`
}

function ExperiencePage() {
  return (
    <AdminCrudPage
      columns={[
        { header: 'Company', render: (item) => item.company_name },
        { header: 'Job Title', render: (item) => item.job_title },
        { header: 'Type', render: (item) => item.employment_type || '-' },
        { header: 'Duration', render: formatDuration },
        { header: 'Current', render: (item) => (item.is_current ? 'Yes' : 'No') },
      ]}
      createItem={createExperience}
      deleteItem={deleteExperience}
      emptyItem={emptyExperience}
      emptyMessage="Experience records added here will appear in the public timeline."
      fetchItems={getExperience}
      formTitle="Experience"
      getDeleteLabel={(item) => item?.company_name || 'this experience record'}
      normalizeItems={(items) =>
        [...items].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      }
      renderForm={({ errors, formData, setFormData }) => {
        const setField = (name, value) => setFormData((current) => ({ ...current, [name]: value }))

        return (
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField error={errors.company_name} label="Company Name" name="company_name" onChange={setField} value={formData.company_name || ''} />
              <TextField error={errors.job_title} label="Job Title" name="job_title" onChange={setField} value={formData.job_title || ''} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClassName}>
                Employment Type
                <select
                  className={inputClassName}
                  onChange={(event) => setField('employment_type', event.target.value)}
                  value={formData.employment_type || ''}
                >
                  {employmentTypes.map((type) => (
                    <option key={type || 'empty'} value={type}>
                      {type || 'Select type'}
                    </option>
                  ))}
                </select>
              </label>
              <TextField label="Location" name="location" onChange={setField} value={formData.location || ''} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Start Date" name="start_date" onChange={setField} type="date" value={formData.start_date || ''} />
              <TextField disabled={formData.is_current} label="End Date" name="end_date" onChange={setField} type="date" value={formData.is_current ? '' : formData.end_date || ''} />
            </div>
            <label className="flex items-center gap-3 text-sm font-semibold text-gray-800 dark:text-gray-100">
              <input
                checked={Boolean(formData.is_current)}
                className="h-4 w-4 accent-gold"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    end_date: event.target.checked ? '' : current.end_date,
                    is_current: event.target.checked,
                  }))
                }
                type="checkbox"
              />
              Is Current
            </label>
            <TextField as="textarea" label="Description" name="description" onChange={setField} rows="5" value={formData.description || ''} />
            <TagInput
              label="Tech Stack"
              onChange={(tags) => setField('tech_stack', tags)}
              value={Array.isArray(formData.tech_stack) ? formData.tech_stack : []}
            />
            <TextField label="Display Order" name="display_order" onChange={setField} type="number" value={formData.display_order ?? 0} />
          </div>
        )
      }}
      title="Experience"
      toPayload={(data) => ({
        company_name: data.company_name.trim(),
        job_title: data.job_title.trim(),
        employment_type: toNullableString(data.employment_type),
        location: toNullableString(data.location),
        start_date: toNullableString(data.start_date),
        end_date: data.is_current ? null : toNullableString(data.end_date),
        is_current: Boolean(data.is_current),
        description: toNullableString(data.description),
        tech_stack: Array.isArray(data.tech_stack) ? data.tech_stack : [],
        display_order: toNumberOrZero(data.display_order),
      })}
      updateItem={updateExperience}
      validate={(data) =>
        Object.fromEntries(
          Object.entries({
            company_name: requiredError(data.company_name, 'Company name is required'),
            job_title: requiredError(data.job_title, 'Job title is required'),
          }).filter(([, value]) => value),
        )
      }
    />
  )
}

export default ExperiencePage
