export type BookStatus = 'available' | 'on-loan' | 'reserved' | 'maintenance'

export interface Book {
  id: number
  title: string
  author: string
  category: string
  level: string
  status: BookStatus
  summary?: string
  isbn?: string
  tags?: string[]
}

export interface Member {
  id: number
  name: string
  grade: string
  email: string
  phone: string
  joinedAt?: string
}

export interface Loan {
  id: number
  bookId: number
  memberId: number
  borrowedAt: string
  dueAt: string
  returnedAt?: string
  notes?: string
}

export type CreateBookInput = Omit<Book, 'id'>
export type CreateMemberInput = Omit<Member, 'id'>
export type CreateLoanInput = Omit<Loan, 'id' | 'returnedAt'> & {
  returnedAt?: string
}

export type UpdateBookInput = Partial<CreateBookInput>
export type UpdateMemberInput = Partial<CreateMemberInput>
export type UpdateLoanInput = Partial<
  Omit<Loan, 'id' | 'bookId' | 'memberId' | 'borrowedAt'>
> & {
  returnedAt?: string | null
}

export interface LibrarySnapshot {
  books: Book[]
  members: Member[]
  loans: Loan[]
}
