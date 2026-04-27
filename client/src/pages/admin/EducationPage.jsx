import {
  createEducation,
  deleteEducation,
  getEducation,
  updateEducation,
} from '../../api/educationAPI'
import AdminCrudPage from './AdminCrudPage'
import {
  requiredError,
  TextField,
  toNullableNumber,
  toNullableString,
  toNumberOrZero,
} from './adminFormUtils'

const emptyEducation = {
  institution: '',
  degree: '',
  field_of_study: '',
  start_year: '',
  end_year: '',
  grade: '',
  description: '',
  display_order: 0,
}

const formatYears = (item) => {
  if (item.start_year && item.end_year) return `${item.start_year} – ${item.end_year}`
  if (item.start_year) return `${item.start_year} – Present`
  if (item.end_year) return `${item.end_year}`
  return '-'
}

function EducationPage() {
  return (
    <AdminCrudPage
      columns={[
        { header: 'Institution', render: (item) => item.institution },
        { header: 'Degree', render: (item) => item.degree },
        { header: 'Field', render: (item) => item.field_of_study || '-' },
        { header: 'Years', render: formatYears },
        { header: 'Grade', render: (item) => item.grade || '-' },
      ]}
      createItem={createEducation}
      deleteItem={deleteEducation}
      emptyItem={emptyEducation}
      emptyMessage="Education records added here will appear in the public timeline."
      fetchItems={getEducation}
      formTitle="Education"
      getDeleteLabel={(item) => item?.institution || 'this education record'}
      normalizeItems={(items) =>
        [...items].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      }
      renderForm={({ errors, formData, setFormData }) => {
        const setField = (name, value) => setFormData((current) => ({ ...current, [name]: value }))

        return (
          <div className="grid gap-4">
            <TextField error={errors.institution} label="Institution" name="institution" onChange={setField} value={formData.institution || ''} />
            <TextField error={errors.degree} label="Degree" name="degree" onChange={setField} value={formData.degree || ''} />
            <TextField label="Field of Study" name="field_of_study" onChange={setField} value={formData.field_of_study || ''} />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Start Year" name="start_year" onChange={setField} type="number" value={formData.start_year || ''} />
              <TextField label="End Year" name="end_year" onChange={setField} type="number" value={formData.end_year || ''} />
            </div>
            <TextField label="Grade" name="grade" onChange={setField} value={formData.grade || ''} />
            <TextField as="textarea" label="Description" name="description" onChange={setField} rows="4" value={formData.description || ''} />
            <TextField label="Display Order" name="display_order" onChange={setField} type="number" value={formData.display_order ?? 0} />
          </div>
        )
      }}
      title="Education"
      toPayload={(data) => ({
        institution: data.institution.trim(),
        degree: data.degree.trim(),
        field_of_study: toNullableString(data.field_of_study),
        start_year: toNullableNumber(data.start_year),
        end_year: toNullableNumber(data.end_year),
        grade: toNullableString(data.grade),
        description: toNullableString(data.description),
        display_order: toNumberOrZero(data.display_order),
      })}
      updateItem={updateEducation}
      validate={(data) =>
        Object.fromEntries(
          Object.entries({
            institution: requiredError(data.institution, 'Institution is required'),
            degree: requiredError(data.degree, 'Degree is required'),
          }).filter(([, value]) => value),
        )
      }
    />
  )
}

export default EducationPage
