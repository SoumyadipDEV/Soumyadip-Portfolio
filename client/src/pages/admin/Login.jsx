import { useState } from 'react'
import { FiLock, FiMail } from 'react-icons/fi'
import { Navigate, useNavigate } from 'react-router-dom'

import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import { useAuth } from '../../hooks/useAuth'

function Login() {
  const { loading, login, session } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy px-4 py-10">
        <Loader label="Checking session" />
      </main>
    )
  }

  if (session) {
    return <Navigate replace to="/admin/dashboard" />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSubmitting(true)

    try {
      await login(email, password)
      navigate('/admin/dashboard', { replace: true })
    } catch (error) {
      setErrorMessage(error.message || 'Invalid email or password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-gold/20 bg-white p-8 shadow-2xl shadow-black/30">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase text-gold">Portfolio Admin</p>
          <h1 className="mt-3 text-3xl font-bold text-navy">Sign In</h1>
          <p className="mt-2 text-sm text-gray-500">Manage portfolio content and messages.</p>
        </div>

        {errorMessage ? (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold text-navy">
            Email
            <span className="relative">
              <FiMail
                aria-hidden="true"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                autoComplete="email"
                className="h-12 w-full rounded-md border border-gray-300 bg-white pl-11 pr-4 text-sm text-navy outline-none transition focus:border-gold"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </span>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-navy">
            Password
            <span className="relative">
              <FiLock
                aria-hidden="true"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                autoComplete="current-password"
                className="h-12 w-full rounded-md border border-gray-300 bg-white pl-11 pr-4 text-sm text-navy outline-none transition focus:border-gold"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </span>
          </label>

          <Button className="mt-2 w-full" disabled={submitting} type="submit">
            {submitting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy border-t-transparent" />
            ) : null}
            {submitting ? 'Signing In' : 'Sign In'}
          </Button>
        </form>
      </div>
    </main>
  )
}

export default Login
