import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useLibrary } from '../context/LibraryContext.jsx'

export default function Login() {
  const { session, login, users } = useLibrary()
  const [membershipId, setMembershipId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  if (session) {
      return <Navigate to="/" replace />
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()

    if (!membershipId || membershipId.trim() === '') {
      setErrorMessage('Please enter your Membership ID to sign in.')
      return
    }

    const result = login(membershipId)
    if (!result.ok) {
        setErrorMessage(result.error)
    }
  }

  const handleQuickFill = (id) => {
    setMembershipId(id)
    setErrorMessage('')
  }

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-header">
          <span className="brand-tag">Retshepile Community Library</span>
          <h1 className="login-title">Staff &amp; Member Sign In</h1>
          <p className="login-desc">
            Welcom to the library portal. Please enter your registered
            membership ID below.
          </p>
        </div>

        {errorMessage ? (
          <div className="alert-box alert-error">
            <span>{errorMessage}</span>
          </div>
        ) : null}

        <form onSubmit={handleLoginSubmit} className="login-form">
          <div className="form-group">
            <label className="field-label" htmlFor="membershipIdInput">
              Membership ID
            </label>
            <input
              id="membershipIdInput"
              className="text-input"
              type="text"
              value={membershipId}
              onChange={(e) => {
                setMembershipId(e.target.value)
                setErrorMessage('')
              }}
              placeholder="e.g. ADMIN001"
              autoComplete="username"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Sign In
          </button>
        </form>

        <div className="demo-accounts-box">
          <h4 className="demo-title">Demo Acounts:</h4>
          <div className="demo-list">
            {users.map((u) => (
              <div
                key={u.id}
                className="demo-item"
                onClick={() => handleQuickFill(u.membershipId)}
              >
                <code className="demo-code">{u.membershipId}</code>
                <span className="demo-user">
                  {u.name} — <em>{u.role}</em>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
