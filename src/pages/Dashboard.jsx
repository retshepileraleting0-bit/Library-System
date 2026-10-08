import React from 'react'
import { Link } from 'react-router-dom'
import { useLibrary } from '../context/LibraryContext.jsx'

export default function Dashboard() {
  const { books, transactions, users } = useLibrary()

  const totalTitles = books.length

  let totalCopiesInStock = 0
  for (let i = 0; i < books.length; i++) {
      totalCopiesInStock = totalCopiesInStock + books[i].quantity
  }

  const lowOrOutStockCount = books.filter((b) => b.quantity < 2).length
  const totalUsersCount = users.length

  const recentTransactions = transactions.slice(0, 5)

  const renderStockBadge = (quantity) => {
    if (quantity == 0) {
        return <span className="status-badge badge-danger">Out of stock</span>
    } else if (quantity < 2) {
      return <span className="status-badge badge-warning">Low stock</span>
    } else {
        return <span className="status-badge badge-success">In stock</span>
    }
  }

  const formatTxDate = (isoString) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString() + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
        return isoString
    }
  }

  return (
    <section className="dashboard-container">
      <div className="page-header">
        <div className="page-header-info">
          <h2>Dashboard</h2>
          <p className="page-subtitle">Live catalogue inventory and stock overview. Titles with fewer than 2 copies are highlighted.</p>
        </div>
      </div>

      <div className="stat-cards-grid">
        <div className="stat-card">
            <span className="stat-label">Total Titles</span>
            <strong className="stat-number">{totalTitles}</strong>
        </div>

        <div className="stat-card">
          <span className="stat-label">Copies in Stock</span>
          <strong className="stat-number">{totalCopiesInStock}</strong>
        </div>

        <div className="stat-card">
            <span className="stat-label">Low / Out of Stock (&lt; 2)</span>
            <strong className="stat-number stat-alert">{lowOrOutStockCount}</strong>
        </div>

        <div className="stat-card">
          <span className="stat-label">Registered Users</span>
          <strong className="stat-number">{totalUsersCount}</strong>
        </div>
      </div>

      <div className="panel-box">
        <div className="panel-top">
          <div>
            <h3 className="panel-title">Book Avilability</h3>
            <p className="panel-sub">
              Rows in honey-gold have less than 2 copys remaining.
            </p>
          </div>
          <Link to="/books" className="btn btn-outline">
            Manage Books &rarr;
          </Link>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                    <td colSpan="6" className="table-empty">
                      No books in the library catalogue.
                    </td>
                </tr>
              ) : (
                books.map((book) => {
                  const isLow = book.quantity < 2
                  return (
                    <tr
                      key={book.id}
                      className={isLow ? 'row-alert-warning' : ''}
                    >
                      <td data-label="Title" className="fw-semibold">
                        {book.title}
                      </td>
                      <td data-label="Author">{book.author}</td>
                      <td data-label="Genre">{book.genre}</td>
                      <td data-label="ISBN">
                          <code className="isbn-code">{book.isbn}</code>
                      </td>
                      <td data-label="Qty">
                        <strong>{book.quantity}</strong>
                      </td>
                      <td data-label="Status">{renderStockBadge(book.quantity)}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel-box">
        <div className="panel-top">
          <div>
            <h3 className="panel-title">Recent Transactions</h3>
            <p className="panel-sub">Latest stock additions and borrowings</p>
          </div>
          <Link to="/transactions" className="btn btn-outline">
            Record Stock &rarr;
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <p className="empty-message">No stock movements recorded yet.</p>
        ) : (
          <div className="recent-tx-list">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="recent-tx-row">
                <span
                  className={
                    tx.type == 'in'
                      ? 'status-badge badge-success'
                      : 'status-badge badge-warning'
                  }
                >
                  {tx.type == 'in' ? 'Stock In' : 'Borrowed'}
                </span>
                <div className="recent-tx-info">
                  <strong>
                    {tx.quantity} {tx.quantity === 1 ? 'copy' : 'copies'} of &ldquo;{tx.bookTitle}&rdquo;
                  </strong>
                  <div className="recent-tx-meta">
                    <span>Note: {tx.note}</span>
                    <span> &bull; Handled by: {tx.actorName}</span>
                    <span> &bull; {formatTxDate(tx.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
