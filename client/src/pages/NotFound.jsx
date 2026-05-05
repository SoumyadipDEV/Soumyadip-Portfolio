import { Link } from 'react-router-dom'

import Button from '../components/common/Button'

/** Fallback page for unknown routes. */
function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4 py-10 text-center">
      <div className="max-w-xl">
        <p className="text-7xl font-bold text-gold sm:text-8xl">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-gray-100">Page not found</h1>
        <p className="mt-3 text-sm leading-7 text-gray-400">
          The page you requested does not exist or has moved.
        </p>
        <div className="mt-8">
          <Button as={Link} to="/">
            Go Home
          </Button>
        </div>
      </div>
    </main>
  )
}

export default NotFound
