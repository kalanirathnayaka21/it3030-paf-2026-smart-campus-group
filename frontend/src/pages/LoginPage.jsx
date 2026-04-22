import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setLoading(true)
    try {
      await login(credentialResponse.credential)
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Login failed:', err)
      setError(err.response?.data?.error || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError('Google Sign-In was cancelled or failed. Please try again.')
  }

  return (
    <div className="login-page">
      {/* Background gradient blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="login-card">
        {/* Logo / Brand */}
        <div className="login-brand">
          <div className="login-logo">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
              <rect width="40" height="40" rx="12" fill="url(#grad)" />
              <path d="M12 28V16l8-6 8 6v12H24v-7h-4v7H12z" fill="white" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="login-title">Smart Campus</h1>
          <p className="login-subtitle">Resource & Facility Management</p>
        </div>

        {/* Divider */}
        <div className="login-divider">
          <span>Sign in to continue</span>
        </div>

        {/* Google Sign-In */}
        <div className="login-google-btn">
          {loading ? (
            <div className="login-loading">
              <div className="spinner" />
              <span>Authenticating…</span>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              shape="pill"
              size="large"
              text="signin_with"
              theme="filled_black"
            />
          )}
        </div>

        {/* Error message */}
        {error && <div className="login-error">{error}</div>}

        {/* Footer note */}
        <p className="login-footer">
          Use your institutional Google account to access the campus portal.
        </p>
      </div>
    </div>
  )
}
