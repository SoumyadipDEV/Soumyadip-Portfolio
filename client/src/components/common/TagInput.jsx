import { useState } from 'react'
import { FiX } from 'react-icons/fi'

function TagInput({ label = 'Tags', onChange, placeholder = 'Type and press Enter', value = [] }) {
  const [inputValue, setInputValue] = useState('')

  const addTag = () => {
    const nextTag = inputValue.trim()

    if (!nextTag || value.includes(nextTag)) {
      setInputValue('')
      return
    }

    onChange([...value, nextTag])
    setInputValue('')
  }

  const removeTag = (tag) => {
    onChange(value.filter((item) => item !== tag))
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag()
    }
  }

  return (
    <label className="grid gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
      {label}
      <div className="rounded-md border border-gray-300 bg-white p-2 focus-within:border-gold dark:border-navy-lighter dark:bg-navy">
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              className="inline-flex items-center gap-2 rounded-full bg-navy px-3 py-1 text-xs font-medium text-gold"
              key={tag}
            >
              {tag}
              <button
                aria-label={`Remove ${tag}`}
                className="text-gold hover:text-white"
                onClick={() => removeTag(tag)}
                type="button"
              >
                <FiX aria-hidden="true" />
              </button>
            </span>
          ))}
          <input
            className="min-w-40 flex-1 bg-transparent px-2 py-1 text-sm text-gray-800 outline-none dark:text-gray-100"
            onBlur={addTag}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            type="text"
            value={inputValue}
          />
        </div>
      </div>
    </label>
  )
}

export default TagInput
