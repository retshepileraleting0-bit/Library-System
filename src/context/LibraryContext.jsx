import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  loadStore,
  saveBooks,
  saveSession,
  saveTransactions,
  saveUsers,
  uid
} from '../data/storage'

const LibraryContext = createContext(null)

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState( [] )
  const [users, setUsers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const store = loadStore()
    setBooks(store.books)
    setUsers(store.users)
    setTransactions(store.transactions)
    setSession(store.session)
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) {
        saveBooks(books)
    }
  }, [books, ready])

  useEffect(() => {
    if (ready) {
      saveUsers(users)
    }
  }, [users, ready])

  useEffect(() => {
    if (ready) {
        saveTransactions(transactions)
    }
  }, [transactions, ready])

  useEffect(() => {
    if (ready) {
      saveSession(session)
    }
  }, [session, ready])

  const login = (membershipId) => {
    if (!membershipId) {
        return { ok: false, error: 'Please enter a membership ID.' }
    }
    const cleanId = membershipId.trim().toUpperCase()
    const found = users.find(
      (user) => user.membershipId.trim().toUpperCase() == cleanId
    )
    if (!found) {
      return { ok: false, error: 'Membership ID not found.' }
    }
    setSession({
      id: found.id,
      name: found.name,
      membershipId: found.membershipId,
      role: found.role
    })
    return { ok: true }
  }

  const logout = () => {
    setSession(null)
  }

  const addBook = (payload) => {
    const isbnTaken = books.some(
      (b) => b.isbn.trim() == payload.isbn.trim()
    )
    if (isbnTaken) {
        return { ok: false, error: 'ISBN already exists in the catalogue.' }
    }

    const newBookItem = {
      id: uid('book'),
      title: payload.title,
      author: payload.author,
      genre: payload.genre,
      isbn: payload.isbn,
      quantity: Number(payload.quantity)
    }

    setBooks([newBookItem, ...books])
    return { ok: true }
  }

  const updateBook = (id, payload) => {
    const isbnTaken = books.some(
      (b) => b.isbn.trim() == payload.isbn.trim() && b.id != id
    )
    if (isbnTaken) {
      return { ok: false, error: 'ISBN already exists.' }
    }

    const updated = books.map((b) => {
      if (b.id == id) {
          return { ...b, ...payload }
      }
      return b
    })
    setBooks(updated)
    return { ok: true }
  }

  const deleteBook = (id) => {
    const remaining = books.filter((b) => b.id != id)
    setBooks(remaining)
  }

  const changeStock = ({ bookId, type, quantity, note }) => {
    const book = books.find((item) => item.id == bookId)
    if (!book) {
        return { ok: false, error: 'Book not found in catalogue.' }
    }

    const qty = Number(quantity)
    if (qty < 1 || isNaN(qty)) {
      return { ok: false, error: 'Quantity must be at least 1.' }
    }

    let nextQty = book.quantity
    if (type == 'in') {
      nextQty = book.quantity + qty
    } else {
        nextQty = book.quantity - qty
    }

    if (nextQty < 0) {
      return { ok: false, error: 'Not enough copies in stock to borrow.' }
    }

    const updatedBooks = books.map((item) => {
        if (item.id == bookId) {
          return { ...item, quantity: nextQty }
        }
        return item
    })
    setBooks(updatedBooks)

    const newTx = {
      id: uid('tx'),
      bookId: bookId,
      bookTitle: book.title,
      type: type,
      quantity: qty,
      note: note && note.trim() !== '' ? note.trim() : (type == 'in' ? 'Stock received' : 'Book borrowed'),
      actorName: session ? session.name : 'Staff',
      createdAt: new Date().toISOString()
    }

    setTransactions([newTx, ...transactions])
    return { ok: true }
  }

  const addUser = (payload) => {
    const cleanId = payload.membershipId.trim().toUpperCase()
    const taken = users.some(
      (u) => u.membershipId.trim().toUpperCase() == cleanId
    )
    if (taken) {
      return { ok: false, error: 'Membership ID already exists.' }
    }

    const newUser = {
      id: uid('user'),
      name: payload.name,
      membershipId: cleanId,
      role: payload.role
    }

    setUsers([newUser, ...users])
    return { ok: true }
  }

  const updateUser = (id, payload) => {
    const cleanId = payload.membershipId.trim().toUpperCase()
    const taken = users.some(
      (u) => u.membershipId.trim().toUpperCase() == cleanId && u.id != id
    )
    if (taken) {
        return { ok: false, error: 'Membership ID already exists.' }
    }

    const updatedUsers = users.map((u) => {
      if (u.id == id) {
        return { ...u, ...payload, membershipId: cleanId }
      }
      return u
    })
    setUsers(updatedUsers)

    if (session && session.id == id) {
      setSession((prev) => ({ ...prev, ...payload, membershipId: cleanId }))
    }
    return { ok: true }
  }

  const deleteUser = (id) => {
    if (session && session.id == id) {
        return { ok: false, error: 'You cannot delete the account you are using.' }
    }
    const remaining = users.filter((u) => u.id != id)
    setUsers(remaining)
    return { ok: true }
  }

  const contextValue = {
    books,
    users,
    transactions,
    session,
    ready,
    login,
    logout,
    addBook,
    updateBook,
    deleteBook,
    changeStock,
    addUser,
    updateUser,
    deleteUser
  }

  return (
    <LibraryContext.Provider value={contextValue}>
      {children}
    </LibraryContext.Provider>
  )
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) {
    throw new Error('useLibrary must be used inside LibraryProvider')
  }
  return context
}
