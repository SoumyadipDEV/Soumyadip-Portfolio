import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'
import Loader from './Loader'

/** Blocks admin routes until a Supabase session has been resolved. */
function ProtectedRoute({ children }) {
  const { loading, session } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loader label="Checking session" />
  }

  if (!session) {
    return <Navigate replace state={{ from: location }} to="/admin/login" />
  }

  return children
}

export default ProtectedRoute
