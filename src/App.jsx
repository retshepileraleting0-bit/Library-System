import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { useLibrary } from './context/LibraryContext.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Books from './pages/Books.jsx'
import Transactions from './pages/Transactions.jsx'
import Users from './pages/Users.jsx'
import Login from './pages/Login.jsx'

function ProtectedRoute() {
  const { session } = useLibrary()
  if (!session) {
      return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export default function App() {
  const { ready } = useLibrary()

  if (!ready) {
      return <div className="boot">Loading...</div>
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/users" element={<Users />} />
          </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
