import { createError } from 'h3'
import {
  type Book,
  type CreateBookInput,
  type CreateLoanInput,
  type CreateMemberInput,
  type LibrarySnapshot,
  type Loan,
  type Member,
  type UpdateBookInput,
  type UpdateLoanInput,
  type UpdateMemberInput,
} from '~/types/library'

const getStorage = () => useStorage('library')

const BOOKS_KEY = 'books'
const MEMBERS_KEY = 'members'
const LOANS_KEY = 'loans'
const META_KEY = 'meta'

interface LibraryMeta {
  nextBookId: number
  nextMemberId: number
  nextLoanId: number
  seeded: boolean
}

const defaultMeta: LibraryMeta = {
  nextBookId: 1,
  nextMemberId: 1,
  nextLoanId: 1,
  seeded: false,
}

const readMeta = async (): Promise<LibraryMeta> => {
  const storage = await getStorage()
  return (await storage.getItem<LibraryMeta>(META_KEY)) ?? { ...defaultMeta }
}

const writeMeta = async (meta: LibraryMeta) => {
  const storage = await getStorage()
  await storage.setItem(META_KEY, meta)
}

const readBooks = async () => {
  const storage = await getStorage()
  return (await storage.getItem<Book[]>(BOOKS_KEY)) ?? []
}

const readMembers = async () => {
  const storage = await getStorage()
  return (await storage.getItem<Member[]>(MEMBERS_KEY)) ?? []
}

const readLoans = async () => {
  const storage = await getStorage()
  return (await storage.getItem<Loan[]>(LOANS_KEY)) ?? []
}

const writeBooks = async (books: Book[]) => {
  const storage = await getStorage()
  await storage.setItem(BOOKS_KEY, books)
}

const writeMembers = async (members: Member[]) => {
  const storage = await getStorage()
  await storage.setItem(MEMBERS_KEY, members)
}

const writeLoans = async (loans: Loan[]) => {
  const storage = await getStorage()
  await storage.setItem(LOANS_KEY, loans)
}

export const setSeedSnapshot = async (snapshot: LibrarySnapshot) => {
  await Promise.all([
    writeBooks(snapshot.books),
    writeMembers(snapshot.members),
    writeLoans(snapshot.loans),
  ])
  const meta = await readMeta()
  await writeMeta({
    ...meta,
    seeded: true,
    nextBookId: snapshot.books.length + 1,
    nextMemberId: snapshot.members.length + 1,
    nextLoanId: snapshot.loans.length + 1,
  })
}

export const getSnapshot = async (): Promise<LibrarySnapshot> => {
  const [books, members, loans] = await Promise.all([
    readBooks(),
    readMembers(),
    readLoans(),
  ])
  return { books, members, loans }
}

export const listBooks = readBooks

export const findBook = async (id: number) => {
  const books = await readBooks()
  return books.find((book) => book.id === id) ?? null
}

export const createBook = async (input: CreateBookInput) => {
  const books = await readBooks()
  const meta = await readMeta()

  const book: Book = {
    id: meta.nextBookId,
    ...input,
  }

  await writeBooks([...books, book])
  await writeMeta({ ...meta, nextBookId: meta.nextBookId + 1 })

  return book
}

export const updateBook = async (id: number, input: UpdateBookInput) => {
  const books = await readBooks()
  const index = books.findIndex((book) => book.id === id)

  if (index === -1) {
    throw createError({ statusCode: 404, message: 'Book not found' })
  }

  const updated: Book = {
    ...books[index],
    ...input,
  }

  books[index] = updated
  await writeBooks(books)
  return updated
}

export const deleteBook = async (id: number) => {
  const books = await readBooks()
  const loans = await readLoans()

  if (loans.some((loan) => loan.bookId === id && !loan.returnedAt)) {
    throw createError({
      statusCode: 409,
      message: 'Cannot delete a book that is currently on loan',
    })
  }

  const filtered = books.filter((book) => book.id !== id)

  if (filtered.length === books.length) {
    throw createError({ statusCode: 404, message: 'Book not found' })
  }

  await writeBooks(filtered)
}

export const listMembers = readMembers

export const findMember = async (id: number) => {
  const members = await readMembers()
  return members.find((member) => member.id === id) ?? null
}

export const createMember = async (input: CreateMemberInput) => {
  const members = await readMembers()
  const meta = await readMeta()

  const member: Member = {
    id: meta.nextMemberId,
    joinedAt: new Date().toISOString().slice(0, 10),
    ...input,
  }

  await writeMembers([...members, member])
  await writeMeta({ ...meta, nextMemberId: meta.nextMemberId + 1 })

  return member
}

export const updateMember = async (id: number, input: UpdateMemberInput) => {
  const members = await readMembers()
  const index = members.findIndex((member) => member.id === id)

  if (index === -1) {
    throw createError({ statusCode: 404, message: 'Member not found' })
  }

  const updated: Member = {
    ...members[index],
    ...input,
  }

  members[index] = updated
  await writeMembers(members)
  return updated
}

export const deleteMember = async (id: number) => {
  const members = await readMembers()
  const loans = await readLoans()

  if (loans.some((loan) => loan.memberId === id && !loan.returnedAt)) {
    throw createError({
      statusCode: 409,
      message: 'Cannot delete a member that has active loans',
    })
  }

  const filtered = members.filter((member) => member.id !== id)

  if (filtered.length === members.length) {
    throw createError({ statusCode: 404, message: 'Member not found' })
  }

  await writeMembers(filtered)
}

export const listLoans = readLoans

export const listActiveLoans = async () => {
  const loans = await readLoans()
  return loans.filter((loan) => !loan.returnedAt)
}

export const findLoan = async (id: number) => {
  const loans = await readLoans()
  return loans.find((loan) => loan.id === id) ?? null
}

export const createLoan = async (input: CreateLoanInput) => {
  const [loans, books, members, meta] = await Promise.all([
    readLoans(),
    readBooks(),
    readMembers(),
    readMeta(),
  ])

  const book = books.find((entry) => entry.id === input.bookId)
  if (!book) {
    throw createError({ statusCode: 404, message: 'Book not found' })
  }

  if (book.status === 'on-loan') {
    throw createError({
      statusCode: 409,
      message: 'Book is already on loan',
    })
  }

  const member = members.find((entry) => entry.id === input.memberId)
  if (!member) {
    throw createError({ statusCode: 404, message: 'Member not found' })
  }

  const loan: Loan = {
    id: meta.nextLoanId,
    ...input,
  }

  const updatedBook: Book = {
    ...book,
    status: input.returnedAt ? book.status : 'on-loan',
  }

  const nextBooks = books.map((entry) =>
    entry.id === updatedBook.id ? updatedBook : entry
  )

  await Promise.all([
    writeLoans([...loans, loan]),
    writeBooks(nextBooks),
    writeMeta({ ...meta, nextLoanId: meta.nextLoanId + 1 }),
  ])

  return loan
}

export const updateLoan = async (id: number, input: UpdateLoanInput) => {
  const [loans, books] = await Promise.all([readLoans(), readBooks()])
  const index = loans.findIndex((loan) => loan.id === id)

  if (index === -1) {
    throw createError({ statusCode: 404, message: 'Loan not found' })
  }

  const loan = loans[index]
  const updated: Loan = {
    ...loan,
    ...input,
  }

  loans[index] = updated

  if (input.returnedAt !== undefined) {
    const bookIndex = books.findIndex((book) => book.id === loan.bookId)
    if (bookIndex !== -1) {
      const updatedBook = { ...books[bookIndex] }
      updatedBook.status = input.returnedAt ? 'available' : 'on-loan'
      books[bookIndex] = updatedBook
    }
  }

  await Promise.all([writeLoans(loans), writeBooks(books)])
  return updated
}

export const deleteLoan = async (id: number) => {
  const loans = await readLoans()
  const filtered = loans.filter((loan) => loan.id !== id)

  if (filtered.length === loans.length) {
    throw createError({ statusCode: 404, message: 'Loan not found' })
  }

  await writeLoans(filtered)
}
