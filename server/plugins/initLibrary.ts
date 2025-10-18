import { defineNitroPlugin, useStorage } from '#imports'
import { seedBooks, seedLoans, seedMembers } from '../utils/librarySeed'
import { setSeedSnapshot } from '../utils/libraryStore'

export default defineNitroPlugin(async () => {
  const storage = await useStorage('library')
  const meta = await storage.getItem<{ seeded: boolean }>('meta')

  if (meta?.seeded) {
    return
  }

  const seededBooks = seedBooks.map((book, index) => ({
    id: index + 1,
    ...book,
  }))

  const seededMembers = seedMembers.map((member, index) => ({
    id: index + 1,
    joinedAt: `2024-0${(index % 6) + 1}-15`,
    ...member,
  }))

  const seededLoans = seedLoans.map((loan, index) => ({
    id: index + 1,
    ...loan,
  }))

  const activeBookIds = new Set(
    seededLoans.filter((loan) => !loan.returnedAt).map((loan) => loan.bookId)
  )

  const snapshot = {
    books: seededBooks.map((book) =>
      activeBookIds.has(book.id) ? { ...book, status: 'on-loan' } : book
    ),
    members: seededMembers,
    loans: seededLoans,
  }

  await setSeedSnapshot(snapshot)
})
