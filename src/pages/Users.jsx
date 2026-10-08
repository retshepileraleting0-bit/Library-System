import React, { useState } from 'react'
import { useLibrary } from '../context/LibraryContext.jsx'

export default function Users() {
  const { users, session, addUser, updateUser, deleteUser } = useLibrary()

  const isAdmin = session && session.role == 'admin'

  const [name, setName] = useState('')
  const [membershipId, setMembershipId] = useState('')
  const [role, setRole] = useState('member')

  const [errors, setErrors] = useState({})
  const [sucessMessage, setSucessMessage] = useState('')
  const [listError, setListError] = useState('')

  const [ editingUserId, setEditingUserId ] = useState(null)
  const [editName, setEditName] = useState('')
  const [editMembershipId, setEditMembershipId] = useState('')
  const [editRole, setEditRole] = useState('member')
  const [editError, setEditError] = useState('')

  const validateNewUser = () => {
    const err = {}

    if (!name || name.trim() === '') {
        err.name = 'Full name is required.'
    }

    if (!membershipId || membershipId.trim() === '') {
      err.membershipId = 'Membership ID is required.'
    } else if (membershipId.trim().length < 3) {
        err.membershipId = 'Membership ID must be at least 3 characters.'
    }

    if (!['admin', 'librarian', 'member'].includes(role)) {
      err.role = 'Please select a valid role.'
    }

    return err
  }

  const handleAddUserSubmit = (e) => {
    e.preventDefault()
    setSucessMessage('')
    setListError('')

    const validationErrors = validateNewUser()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
        return
    }

    const result = addUser({
      name: name.trim(),
      membershipId: membershipId.trim().toUpperCase(),
      role: role,
    })

    if (!result.ok) {
      setErrors({ membershipId: result.error })
      return
    }

    setName('')
    setMembershipId('')
    setRole('member')
    setErrors({})
    setSucessMessage('User account sucessfully created!')
  }

  const handleStartEdit = (user) => {
      setEditingUserId(user.id)
      setEditName(user.name)
      setEditMembershipId(user.membershipId)
      setEditRole(user.role)
      setEditError('')
      setListError('')
  }

  const handleCancelEdit = () => {
    setEditingUserId(null)
    setEditError('')
  }

  const handleSaveEditSubmit = (e) => {
    e.preventDefault()
    setEditError('')

    if (!editName.trim()) {
        setEditError('Name is required.')
        return
    }
    if (!editMembershipId.trim()) {
      setEditError('Membership ID is required.')
      return
    }

    const result = updateUser(editingUserId, {
      name: editName.trim(),
      membershipId: editMembershipId.trim().toUpperCase(),
      role: editRole,
    })

    if (!result.ok) {
        setEditError(result.error)
        return
    }

    setEditingUserId(null)
  }

  const handleDeleteUser = (user) => {
    setListError('')

    if (session && session.id == user.id) {
        setListError('You cannot delete the account you are currently logged in with.')
        return
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete user account for ${user.name}?`
    )
    if (confirmDelete) {
      const result = deleteUser(user.id)
      if (!result.ok) {
          setListError(result.error)
      }
    }
  }

  return (
    <section className="users-page">
      <div className="page-header">
        <div className="page-header-info">
          <h2>User Account Management</h2>
          <p className="page-subtitle">
            {isAdmin
              ? 'Administrator privileges active: you can create, modify, and delete user profiles.'
              : 'Standard account active: only administrators can manage user accounts.'}
          </p>
        </div>
      </div>

      {!isAdmin ? (
        <div className="panel-box non-admin-panel">
          <div className="non-admin-header">
            <h3 className="panel-title">Current Signed-In Profile</h3>
            <span className="status-badge badge-warning">Restricted Access</span>
          </div>

          <div className="profile-details-card">
            <p>
              <strong>Full Name:</strong> {session?.name}
            </p>
            <p>
              <strong>Membership ID:</strong>{' '}
              <code className="isbn-code">{session?.membershipId}</code>
            </p>
            <p>
              <strong>Assigned Role:</strong> {session?.role}
            </p>
          </div>

          <div className="alert-box alert-info">
            <span>
              <strong>Note:</strong> You are currently signed in as a{' '}
              <em>{session?.role}</em>. To test user creation, editing, or
              deletion, please log out and sign in using an Administrator
              account (such as <code>ADMIN001</code>).
            </span>
          </div>
        </div>
      ) : (
        <div className="layout-split">
          <div className="form-panel">
            <h3 className="panel-title">Create User Account</h3>
            <p className="panel-sub">Add a staff member or patron</p>

            {sucessMessage ? (
              <div className="alert-box alert-success">
                <span>{sucessMessage}</span>
              </div>
            ) : null}

            <form onSubmit={handleAddUserSubmit} className="stacked-form">
              <div className="form-group">
                  <label className="field-label" htmlFor="userNameInput">
                    Full Name *
                  </label>
                  <input
                    id="userNameInput"
                    className="text-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lerato Mokhethi"
                  />
                  {errors.name && (
                    <span className="field-error">{errors.name}</span>
                  )}
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="membershipIdInput">
                  Membership ID *
                </label>
                <input
                  id="membershipIdInput"
                  className="text-input"
                  type="text"
                  value={membershipId}
                  onChange={(e) => setMembershipId(e.target.value)}
                  placeholder="e.g. MEM004"
                />
                {errors.membershipId && (
                  <span className="field-error">{errors.membershipId}</span>
                )}
              </div>

              <div className="form-group">
                  <label className="field-label" htmlFor="userRoleSelect">
                    User Role *
                  </label>
                  <select
                    id="userRoleSelect"
                    className="select-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="admin">Admin (Full permissions)</option>
                    <option value="librarian">Librarian (Books &amp; stock)</option>
                    <option value="member">Member (Patron)</option>
                  </select>
                  {errors.role && (
                    <span className="field-error">{errors.role}</span>
                  )}
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Create User
              </button>
            </form>
          </div>

          <div className="table-panel">
            <div className="panel-top">
              <div>
                <h3 className="panel-title">Registered Accounts</h3>
                <p className="panel-sub">
                  Total users in system: {users.length}
                </p>
              </div>
            </div>

            {listError ? (
              <div className="alert-box alert-error" style={{ marginBottom: 16 }}>
                <span>{listError}</span>
              </div>
            ) : null}

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Membership ID</th>
                    <th>Role</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isEditing = editingUserId == user.id

                    if (isEditing) {
                      return (
                        <tr key={user.id} className="row-editing">
                          <td colSpan="4">
                            <form
                              onSubmit={handleSaveEditSubmit}
                              className="inline-edit-form"
                            >
                              <div className="edit-grid user-edit-grid">
                                <div className="form-group">
                                    <label className="mini-label">Name</label>
                                    <input
                                      className="text-input"
                                      value={editName}
                                      onChange={(e) => setEditName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                  <label className="mini-label">
                                    Membership ID
                                  </label>
                                  <input
                                    className="text-input"
                                    value={editMembershipId}
                                    onChange={(e) =>
                                      setEditMembershipId(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="form-group">
                                    <label className="mini-label">Role</label>
                                    <select
                                      className="select-input"
                                      value={editRole}
                                      onChange={(e) => setEditRole(e.target.value)}
                                    >
                                      <option value="admin">Admin</option>
                                      <option value="librarian">Librarian</option>
                                      <option value="member">Member</option>
                                    </select>
                                </div>
                              </div>

                              {editError ? (
                                <p className="field-error inline-error">
                                  {editError}
                                </p>
                              ) : null}

                              <div className="edit-buttons">
                                <button
                                  type="submit"
                                  className="btn btn-primary btn-sm"
                                >
                                  Save User
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  onClick={handleCancelEdit}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </td>
                        </tr>
                      )
                    }

                    return (
                      <tr key={user.id}>
                        <td data-label="Full Name" className="fw-semibold">
                          {user.name}
                          {session && session.id == user.id ? (
                            <span className="current-user-tag"> (You)</span>
                          ) : null}
                        </td>
                        <td data-label="Membership ID">
                          <code className="isbn-code">{user.membershipId}</code>
                        </td>
                        <td data-label="Role">
                          <span
                            className={
                              user.role == 'admin'
                                ? 'status-badge badge-admin'
                                : user.role == 'librarian'
                                ? 'status-badge badge-librarian'
                                : 'status-badge badge-member'
                            }
                          >
                            {user.role}
                          </span>
                        </td>
                        <td data-label="Actions" style={{ textAlign: 'right' }}>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() => handleStartEdit(user)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteUser(user)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
