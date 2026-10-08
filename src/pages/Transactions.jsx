import React, { useState, useEffect } from 'react'
import { useLibrary } from '../context/LibraryContext.jsx'

export default function Transactions() {
  const { books, transactions, changeStock } = useLibrary()

  const [selectedBookId, setSelectedBookId] = useState('')
  const [transactionType, setTransactionType] = useState('in')
  const [quantity, setQuantity] = useState('1')
  const [note, setNote] = useState('')

  const [errorMessage, setErrorMessage] = useState('')
  const [sucessMessage, setSucessMessage] = useState('')

  useEffect(() => {
    if (books.length > 0 && !selectedBookId) {
        setSelectedBookId(books[0].id)
    }
  }, [books, selectedBookId])

  const handleSubmitTransaction = (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSucessMessage('')

    if (!selectedBookId) {
        setErrorMessage('Please select a book from the list.')
        return
    }

    const qtyNum = parseInt(quantity, 10)
    if (isNaN(qtyNum) || qtyNum < 1) {
      setErrorMessage('Quantity must be a positive whole number (at least 1).')
      return
    }

    const targetBook = books.find((b) => b.id == selectedBookId)
    if (!targetBook) {
      setErrorMessage('Book not found.')
      return
    }

    if (transactionType == 'out' && qtyNum > targetBook.quantity) {
        setErrorMessage(
          `Cannot borrow ${qtyNum} copies! Only ${targetBook.quantity} copies in stock.`
        )
        return
    }

    const result = changeStock({
      bookId: selectedBookId,
      type: transactionType,
      quantity: qtyNum,
      note: note,
    })

    if (!result.ok) {
        setErrorMessage(result.error)
        return
    }

    setQuantity('1')
    setNote('')

    if (transactionType == 'in') {
      setSucessMessage(`Stock recieved sucessfully! Added ${qtyNum} copies.`)
    } else {
        setSucessMessage(
          `Borrow recorded! ${qtyNum} copy/copies deducted from stock.`
        )
    }
  }

  const formatDateTime = (isoString) => {
    try {
      const d = new Date(isoString)
      return (
        d.toLocaleDateString() +
        ' at ' +
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      )
    } catch {
        return isoString
    }
  }

  return (
    <section className="transactions-page">
      <div className="page-header">
        <div className="page-header-info">
          <h2>Stock &amp; Borrow Transactions</h2>
          <p className="page-subtitle">Record new stock deliveries or member borrowings. All transactions are preserved in the history log.</p>
        </div>
      </div>

      <div className="layout-split">
        <div className="form-panel">
          <h3 className="panel-title">Record Movement</h3>
          <p className="panel-sub">Select a book and transaction type</p>

          {errorMessage ? (
            <div className="alert-box alert-error">
              <span>{errorMessage}</span>
            </div>
          ) : null}

          {sucessMessage ? (
            <div className="alert-box alert-success">
              <span>{sucessMessage}</span>
            </div>
          ) : null}

          <form onSubmit={handleSubmitTransaction} className="stacked-form">
            <div className="form-group">
                <label className="field-label" htmlFor="bookSelect">
                  Select Book *
                </label>
                <select
                  id="bookSelect"
                  className="select-input"
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                >
                  {books.length === 0 ? (
                    <option value="">No books in catalogue</option>
                  ) : null}
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.quantity} copies available)
                    </option>
                  ))}
                </select>
            </div>

            <div className="form-group">
              <label className="field-label" htmlFor="typeSelect">
                Transaction Type *
              </label>
              <select
                id="typeSelect"
                className="select-input"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <option value="in">Add Stock (Suplier arrival)</option>
                <option value="out">Deduct Stock (Book borrowed)</option>
              </select>
            </div>

            <div className="form-group">
                <label className="field-label" htmlFor="quantityInput">
                  Quantity *
                </label>
                <input
                  id="quantityInput"
                  className="text-input"
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
            </div>

            <div className="form-group">
              <label className="field-label" htmlFor="noteInput">
                Note / Description (Optional)
              </label>
              <input
                id="noteInput"
                className="text-input"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Suplier delivery, member name, condition"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              {transactionType == 'in' ? 'Recieve Stock' : 'Record Borrowing'}
            </button>
          </form>
        </div>

        <div className="table-panel">
          <div className="panel-top">
            <div>
              <h3 className="panel-title">Transaction History</h3>
              <p className="panel-sub">
                Total transactions recorded: {transactions.length}
              </p>
            </div>
          </div>

          {transactions.length === 0 ? (
            <p className="empty-message">No stock movements recorded yet.</p>
          ) : (
            <div className="tx-history-list">
              {transactions.map((tx) => (
                <div key={tx.id} className="tx-card">
                  <div className="tx-badge-wrapper">
                    <span
                      className={
                        tx.type == 'in'
                          ? 'status-badge badge-success'
                          : 'status-badge badge-warning'
                      }
                    >
                      {tx.type == 'in' ? '+ Stock In' : '- Borrowed'}
                    </span>
                  </div>

                  <div className="tx-details">
                    <div className="tx-title-row">
                      <strong className="tx-title">
                        {tx.quantity} &times; &ldquo;{tx.bookTitle}&rdquo;
                      </strong>
                    </div>
                    <div className="tx-meta-info">
                      <span>Reason: {tx.note}</span>
                      <span> &bull; Handled by: {tx.actorName}</span>
                      <span> &bull; {formatDateTime(tx.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
