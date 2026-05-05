import { Component } from 'react'

import Button from './Button'

/**
 * Catches unexpected React render errors and presents a recoverable fallback screen.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-navy px-4 py-10 text-center">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Application Error
            </p>
            <h1 className="mt-4 text-4xl font-bold text-gray-100 sm:text-5xl">
              Something broke in the UI
            </h1>
            <p className="mt-4 text-sm leading-7 text-gray-400 sm:text-base">
              Reload the page. If the problem persists, check the latest deployment and runtime
              configuration.
            </p>
            <div className="mt-8 flex justify-center">
              <Button onClick={this.handleReload}>Reload App</Button>
            </div>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
