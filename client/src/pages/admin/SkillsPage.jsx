import { createSkill, deleteSkill, getSkills, updateSkill } from '../../api/skillsAPI'
import AdminCrudPage from './AdminCrudPage'
import {
  inputClassName,
  labelClassName,
  normalizeSkillGroups,
  requiredError,
  TextField,
  toNullableString,
  toNumberOrZero,
} from './adminFormUtils'

const emptySkill = {
  name: '',
  category: '',
  proficiency: 0,
  icon_url: '',
  display_order: 0,
}

const skillCategories = ['Programming', 'Frameworks', 'Tools', 'Soft Skills']

function SkillsPage() {
  return (
    <AdminCrudPage
      columns={[
        { header: 'Name', render: (item) => item.name },
        { header: 'Category', render: (item) => item.category || '-' },
        { header: 'Proficiency (%)', render: (item) => `${item.proficiency ?? 0}%` },
      ]}
      createItem={createSkill}
      deleteItem={deleteSkill}
      emptyItem={emptySkill}
      emptyMessage="Skills added here will appear grouped by category on the public page."
      fetchItems={getSkills}
      formTitle="Skill"
      getDeleteLabel={(item) => item?.name || 'this skill'}
      normalizeItems={(data) =>
        normalizeSkillGroups(data).sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      }
      renderForm={({ errors, formData, setFormData }) => {
        const setField = (name, value) => setFormData((current) => ({ ...current, [name]: value }))

        return (
          <div className="grid gap-4">
            <TextField error={errors.name} label="Name" name="name" onChange={setField} value={formData.name || ''} />
            <label className={labelClassName}>
              Category
              <input
                className={inputClassName}
                list="skill-category-suggestions"
                onChange={(event) => setField('category', event.target.value)}
                value={formData.category || ''}
              />
              <datalist id="skill-category-suggestions">
                {skillCategories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </label>
            <label className={labelClassName}>
              Proficiency: {formData.proficiency ?? 0}%
              <input
                className="accent-gold"
                max="100"
                min="0"
                onChange={(event) => setField('proficiency', event.target.value)}
                type="range"
                value={formData.proficiency ?? 0}
              />
              {errors.proficiency ? (
                <span className="text-xs font-medium text-red-500">{errors.proficiency}</span>
              ) : null}
            </label>
            <TextField label="Icon URL" name="icon_url" onChange={setField} type="url" value={formData.icon_url || ''} />
            <TextField label="Display Order" name="display_order" onChange={setField} type="number" value={formData.display_order ?? 0} />
          </div>
        )
      }}
      title="Skills"
      toPayload={(data) => ({
        name: data.name.trim(),
        category: toNullableString(data.category),
        proficiency: toNumberOrZero(data.proficiency),
        icon_url: toNullableString(data.icon_url),
        display_order: toNumberOrZero(data.display_order),
      })}
      updateItem={updateSkill}
      validate={(data) => {
        const proficiency = Number(data.proficiency)

        return Object.fromEntries(
          Object.entries({
            name: requiredError(data.name, 'Name is required'),
            proficiency:
              Number.isNaN(proficiency) || proficiency < 0 || proficiency > 100
                ? 'Proficiency must be between 0 and 100'
                : '',
          }).filter(([, value]) => value),
        )
      }}
    />
  )
}

export default SkillsPage
