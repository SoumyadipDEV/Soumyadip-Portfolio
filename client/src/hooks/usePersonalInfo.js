import { useEffect, useState } from 'react'

import { fetchPersonalInfo } from '../api/publicApi'

export const usePersonalInfo = () => {
  const [personalInfo, setPersonalInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    fetchPersonalInfo()
      .then((data) => {
        if (isMounted) {
          setPersonalInfo(data)
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError)
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { error, loading, personalInfo }
}
