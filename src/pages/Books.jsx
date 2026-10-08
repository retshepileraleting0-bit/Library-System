import React, { useState } from 'react'
import { useLibrary } from '../context/LibraryContext.jsx'

export default function Books() {
  const { books, addBook, updateBook, deleteBook } = useLibrary()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [isbn, setIsbn] = useState('')
  const [quantity, setQuantity] = useState('1')

  const [errors, setErrors] = useState({})
  const [sucessMessage, setSucessMessage] = useState('')

  const [ editingBookId, setEditingBookId ] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editAuthor, setEditAuthor] = useState('')
  const [editGenre, setEditGenre] = useState('')
  const [editIsbn, setEditIsbn] = useState('')
  const [editError, setEditError] = useState('')

  const validateNewBook = () => {
    const err = {}

    if (!title || title.trim() === '') {
        err.title = 'Title is required.'
    }
    if (!author || author.trim() === '') {
        err.author = 'Author is required.'
    }
    if (!genre || genre.trim() === '') {
      err.genre = 'Genre is required.'
    }
    if (!isbn || isbn.trim() === '') {
      err.isbn = 'ISBN is required.'
    } else {
        const cleanIsbn = isbn.replace(/-/g, '').trim()
        if (cleanIsbn.length < 10 || cleanIsbn.length > 13) {
          err.isbn = 'ISBN should be between 10 and 13 digits.'
        }
    }

    const parsedQty = parseInt(quantity, 10)
    if (isNaN(parsedQty) || parsedQty < 0) {
        err.quantity = 'Initial quantity must be 0 or a positive whole number.'
    }

    return err
  }

  const handleAddBookSubmit = (e) => {
    e.preventDefault()
    setSucessMessage('')

    const validationErrors = validateNewBook()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
        return
    }

    const result = addBook({
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      isbn: isbn.trim(),
      quantity: parseInt(quantity, 10),
    })

    if (!result.ok) {
      setErrors({ isbn: result.error })
      return
    }

    setTitle('')
    setAuthor('')
    setGenre('')
    setIsbn('')
    setQuantity('1')
    setErrors({})
    setSucessMessage('Book added to catelogue sucessfully!')
  }

  const handleStartEdit = (book) => {
      setEditingBookId(book.id)
      setEditTitle(book.title)
      setEditAuthor(book.author)
      setEditGenre(book.genre)
      setEditIsbn(book.isbn)
      setEditError('')
  }

  const handleCancelEdit = () => {
    setEditingBookId(null)
    setEditError('')
  }

  const handleSaveEditSubmit = (e) => {
    e.preventDefault()
    setEditError('')

    if (!editTitle.trim()) {
        setEditError('Title cannot be empty.')
        return
    }
    if (!editAuthor.trim()) {
      setEditError('Author cannot be empty.')
      return
    }
    if (!editGenre.trim()) {
        setEditError('Genre cannot be empty.')
        return
    }
    if (!editIsbn.trim()) {
      setEditError('ISBN cannot be empty.')
      return
    }

    const result = updateBook(editingBookId, {
      title: editTitle.trim(),
      author: editAuthor.trim(),
      genre: editGenre.trim(),
      isbn: editIsbn.trim(),
    })

    if (!result.ok) {
        setEditError(result.error)
        return
    }

    setEditingBookId(null)
  }

  const handleDeleteBook = (id, bookTitle) => {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${bookTitle}" from the library?`
      )
      if (confirmed) {
        deleteBook(id)
      }
  }

  return (
    <section className="books-page">
      <div className="page-header">
        <div className="page-header-info">
          <h2>Book Management</h2>
          <p className="page-subtitle">Add new catalogue entries, edit metadata, or remove books no longer in collection.</p>
        </div>
      </div>

      <div className="layout-split">
        <div className="form-panel">
          <h3 className="panel-title">Add New Book</h3>
          <p className="panel-sub">Fill out the book details below</p>

          {sucessMessage ? (
            <div className="alert-box alert-success">
              <span>{sucessMessage}</span>
            </div>
          ) : null}

          <form onSubmit={handleAddBookSubmit} className="stacked-form">
            <div className="form-group">
                <label className="field-label" htmlFor="titleInput">
                  Title *
                </label>
                <input
                  id="titleInput"
                  className="text-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Animal Farm"
                />
                {errors.title && (
                  <span className="field-error">{errors.title}</span>
                )}
            </div>

            <div className="form-group">
              <label className="field-label" htmlFor="authorInput">
                Author *
              </label>
              <input
                id="authorInput"
                className="text-input"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. George Orwell"
              />
              {errors.author && (
                <span className="field-error">{errors.author}</span>
              )}
            </div>

            <div className="form-group">
                <label className="field-label" htmlFor="genreInput">
                  Genre *
                </label>
                <input
                  id="genreInput"
                  className="text-input"
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="e.g. Classic, Sci-Fi, History"
                />
                {errors.genre && (
                  <span className="field-error">{errors.genre}</span>
                )}
            </div>

            <div className="form-group">
              <label className="field-label" htmlFor="isbnInput">
                ISBN *
              </label>
              <input
                id="isbnInput"
                className="text-input"
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="e.g. 9780451524935"
              />
              {errors.isbn && <span className="field-error">{errors.isbn}</span>}
            </div>

            <div className="form-group">
                <label className="field-label" htmlFor="quantityInput">
                  Initial Copies (Stock) *
                </label>
                <input
                  id="quantityInput"
                  className="text-input"
                  type="number"
                  min="0"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                {errors.quantity && (
                  <span className="field-error">{errors.quantity}</span>
                )}
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Add Book to Catalogue
            </button>
          </form>
        </div>

        <div className="table-panel">
          <div className="panel-top">
            <div>
              <h3 className="panel-title">Library Catalogue</h3>
              <p className="panel-sub">
                Total books: {books.length}
              </p>
            </div>
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
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="table-empty">
                      No books found in catalogue.
                    </td>
                  </tr>
                ) : (
                  books.map((book) => {
                    const isEditing = editingBookId == book.id

                    if (isEditing) {
                      return (
                        <tr key={book.id} className="row-editing">
                          <td colSpan="6">
                            <form
                              onSubmit={handleSaveEditSubmit}
                              className="inline-edit-form"
                            >
                              <div className="edit-grid">
                                <div className="form-group">
                                    <label className="mini-label">Title</label>
                                    <input
                                      className="text-input"
                                      value={editTitle}
                                      onChange={(e) => setEditTitle(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                  <label className="mini-label">Author</label>
                                  <input
                                    className="text-input"
                                    value={editAuthor}
                                    onChange={(e) => setEditAuthor(e.target.value)}
                                  />
                                </div>
                                <div className="form-group">
                                    <label className="mini-label">Genre</label>
                                    <input
                                      className="text-input"
                                      value={editGenre}
                                      onChange={(e) => setEditGenre(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                  <label className="mini-label">ISBN</label>
                                  <input
                                    className="text-input"
                                    value={editIsbn}
                                    onChange={(e) => setEditIsbn(e.target.value)}
                                  />
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
                                  Save Changes
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
                      <tr
                        key={book.id}
                        className={book.quantity < 2 ? 'row-alert-warning' : ''}
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
                        <td data-label="Actions" style={{ textAlign: 'right' }}>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() => handleStartEdit(book)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteBook(book.id, book.title)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
