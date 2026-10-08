import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useLibrary } from '../context/LibraryContext.jsx'

export default function Layout() {
  const { session, logout } = useLibrary()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-tag">Community Library</span>
          <h1 className="brand-title">Retshepile</h1>
        </div>

        <div className="session-card">
          <div className="user-details">
            <span className="user-label">Logged in:</span>
            <strong className="user-name">{session?.name}</strong>
            <span className="user-role">({session?.role})</span>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-logout"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </header>

      <nav className="navbar">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/books"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          Books
        </NavLink>
        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          Transactions
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          Users
        </NavLink>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>
          Retshepile Community Library · Built with React &amp; LocalStorage
        </p>
      </footer>
    </div>
  )
}
