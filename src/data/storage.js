const STORAGE_KEYS = {
  books: 'rcl_books',
  users: 'rcl_users',
  transactions: 'rcl_transactions',
  session: 'rcl_session'
}

function getItemFromStorage(key, fallbackValue) {
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        return JSON.parse(saved)
      }
      return fallbackValue
    } catch (err) {
        console.error('error reading ' + key, err)
        return fallbackValue
    }
}

function saveItemToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
      console.error('failed to save', err)
  }
}

export function uid(prefix) {
    const randomPart = Math.floor(Math.random() * 10000)
  return `${prefix}_${Date.now()}_${randomPart}`
}

function seedInitialData() {
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    const defaultUsers = [
      {
        id: 'user_admin',
        name: 'Mpho Takalimane',
        membershipId: 'ADMIN001',
        role: 'admin'
      },
      {
        id: 'user_lib',
        name: 'Tsepo Mofolo',
        membershipId: 'LIB001',
        role: 'librarian'
      },
      {
        id: 'user_mem',
        name: 'Thabo Molefe',
        membershipId: 'MEM001',
        role: 'member'
      }
    ]
    saveItemToStorage(STORAGE_KEYS.users, defaultUsers)
  }

  const defaultBooks = [
    {
      id: 'book_1',
      title: 'The Whispering Basalt of Maloti',
      author: 'Kgotso Phalatsane',
      genre: 'Mythic Fantasy',
      isbn: '978-0-91823-412-1',
      quantity: 5
    },
    {
      id: 'book_2',
      title: 'Clockwork Crows Over Morija',
      author: 'Nthabiseng Qoqolosi',
      genre: 'Steampunk',
      isbn: '978-1-84729-019-3',
      quantity: 1
    },
    {
      id: 'book_3',
      title: 'A Treatise on Wandering Clouds',
      author: 'Barnaby Finch-Holloway',
      genre: 'Speculative Philosophy',
      isbn: '978-0-72149-551-8',
      quantity: 4
    },
    {
      id: 'book_4',
      title: 'Echoes of the Copper Flute',
      author: 'Sefako Makoanyane',
      genre: 'Historical Fiction',
      isbn: '978-0-62018-884-2',
      quantity: 0
    },
    {
      id: 'book_5',
      title: 'The Midnight Archivist of Quthing',
      author: 'Vespera Thorne',
      genre: 'Surrealist Mystery',
      isbn: '978-1-93284-770-5',
      quantity: 3
    }
  ]

  const defaultTransactions = [
    {
      id: 'tx_seed_1',
      bookId: 'book_2',
      bookTitle: 'Clockwork Crows Over Morija',
      type: 'out',
      quantity: 1,
      note: 'Borrowed by a patron',
      actorName: 'Tsepo Mofolo',
      createdAt: new Date().toISOString()
    }
  ]

  const savedBooksRaw = localStorage.getItem(STORAGE_KEYS.books)
  if (!savedBooksRaw || savedBooksRaw.includes('Things Fall Apart')) {
      saveItemToStorage(STORAGE_KEYS.books, defaultBooks)
      saveItemToStorage(STORAGE_KEYS.transactions, defaultTransactions)
  }
}

export function loadStore() {
  seedInitialData()

  return {
    books: getItemFromStorage(STORAGE_KEYS.books, []),
    users: getItemFromStorage(STORAGE_KEYS.users, []),
    transactions: getItemFromStorage(STORAGE_KEYS.transactions, []),
    session: getItemFromStorage(STORAGE_KEYS.session, null)
  }
}

export function saveBooks(books) {
    saveItemToStorage(STORAGE_KEYS.books, books)
}

export function saveUsers(users) {
  saveItemToStorage(STORAGE_KEYS.users, users)
}

export function saveTransactions(transactions) {
    saveItemToStorage(STORAGE_KEYS.transactions, transactions)
}

export function saveSession(session) {
  if (session) {
      saveItemToStorage(STORAGE_KEYS.session, session)
  } else {
    localStorage.removeItem(STORAGE_KEYS.session)
  }
}
