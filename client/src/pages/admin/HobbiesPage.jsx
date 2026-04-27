import { createHobby, deleteHobby, getHobbies, updateHobby } from '../../api/hobbiesAPI'
import AdminCrudPage from './AdminCrudPage'
import {
  requiredError,
  TextField,
  toNullableString,
  toNumberOrZero,
} from './adminFormUtils'

const emptyHobby = {
  name: '',
  description: '',
  icon: '',
  display_order: 0,
}

function HobbiesPage() {
  return (
    <AdminCrudPage
      columns={[
        { header: 'Icon', render: (item) => item.icon || '-' },
        { header: 'Name', render: (item) => item.name },
        { header: 'Description', render: (item) => item.description || '-' },
      ]}
      createItem={createHobby}
      deleteItem={deleteHobby}
      emptyItem={emptyHobby}
      emptyMessage="Hobbies added here will appear in the public hobbies grid."
      fetchItems={getHobbies}
      formTitle="Hobby"
      getDeleteLabel={(item) => item?.name || 'this hobby'}
      normalizeItems={(items) =>
        [...items].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      }
      renderForm={({ errors, formData, setFormData }) => {
        const setField = (name, value) => setFormData((current) => ({ ...current, [name]: value }))

        return (
          <div className="grid gap-4">
            <TextField error={errors.name} label="Name" name="name" onChange={setField} value={formData.name || ''} />
            <TextField as="textarea" label="Description" name="description" onChange={setField} rows="4" value={formData.description || ''} />
            <TextField label="Icon" name="icon" onChange={setField} placeholder="Emoji or icon name" value={formData.icon || ''} />
            <TextField label="Display Order" name="display_order" onChange={setField} type="number" value={formData.display_order ?? 0} />
          </div>
        )
      }}
      title="Hobbies"
      toPayload={(data) => ({
        name: data.name.trim(),
        description: toNullableString(data.description),
        icon: toNullableString(data.icon),
        display_order: toNumberOrZero(data.display_order),
      })}
      updateItem={updateHobby}
      validate={(data) =>
        Object.fromEntries(
          Object.entries({
            name: requiredError(data.name, 'Name is required'),
          }).filter(([, value]) => value),
        )
      }
    />
  )
}

export default HobbiesPage
