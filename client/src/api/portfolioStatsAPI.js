import api from './axiosInstance'
import { getExperience } from './experienceAPI'

const getCollectionCount = async (path) => {
  const response = await api.get(path, {
    skipGlobalErrorHandler: true,
  })

  return response.data?.data?.length ?? 0
}

const calculateYearsOfExperience = (experienceEntries) => {
  const startDates = experienceEntries
    .map((entry) => entry.start_date)
    .filter(Boolean)
    .map((date) => new Date(date))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => a.getTime() - b.getTime())

  if (!startDates.length) {
    return 0
  }

  const firstStartDate = startDates[0]
  const today = new Date()
  let years = today.getFullYear() - firstStartDate.getFullYear()
  const hasNotReachedAnniversary =
    today.getMonth() < firstStartDate.getMonth() ||
    (today.getMonth() === firstStartDate.getMonth() &&
      today.getDate() < firstStartDate.getDate())

  if (hasNotReachedAnniversary) {
    years -= 1
  }

  return Math.max(years, 0)
}

export const getPortfolioStats = async () => {
  const [experience, projectCount, certificateCount] = await Promise.all([
    getExperience(),
    getCollectionCount('/projects'),
    getCollectionCount('/certificates'),
  ])

  return {
    yearsOfExperience: calculateYearsOfExperience(experience),
    projectCount,
    certificateCount,
  }
}
