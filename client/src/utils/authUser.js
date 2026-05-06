const getTextValue = (value) => (typeof value === 'string' ? value.trim() : '')

export const getAuthDisplayName = (user) =>
  getTextValue(user?.user_metadata?.display_name) ||
  getTextValue(user?.user_metadata?.full_name) ||
  getTextValue(user?.email) ||
  'Admin'
