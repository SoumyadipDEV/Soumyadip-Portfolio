const ensureMetaTag = (selector, attributes) => {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('meta')
    Object.entries(attributes.identity).forEach(([key, value]) => {
      element.setAttribute(key, value)
    })
    document.head.appendChild(element)
  }

  element.setAttribute('content', attributes.content)
}

export const setPortfolioMeta = (personalInfo) => {
  const fullName = personalInfo?.full_name || 'Personal Portfolio'
  const tagline = personalInfo?.tagline || 'Software Developer & Technical Support Engineer'
  const description =
    personalInfo?.bio ||
    'Professional portfolio featuring projects, experience, certificates, skills, resume, and contact details.'
  const title = `${fullName} | Portfolio`

  document.title = title
  ensureMetaTag('meta[name="description"]', {
    identity: { name: 'description' },
    content: description,
  })
  ensureMetaTag('meta[property="og:title"]', {
    identity: { property: 'og:title' },
    content: title,
  })
  ensureMetaTag('meta[property="og:description"]', {
    identity: { property: 'og:description' },
    content: `${tagline}. ${description}`,
  })
  ensureMetaTag('meta[property="og:image"]', {
    identity: { property: 'og:image' },
    content: personalInfo?.profile_image_url || '/og-image.svg',
  })
}
