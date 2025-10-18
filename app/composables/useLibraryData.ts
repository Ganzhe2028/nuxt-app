import { computed } from 'vue'
import type {
  Book,
  CreateBookInput,
  CreateLoanInput,
  CreateMemberInput,
  LibrarySnapshot,
  Loan,
  Member,
  UpdateBookInput,
  UpdateLoanInput,
  UpdateMemberInput,
} from '~/types/library'

const BOOKS_ENDPOINT = '/api/books'
const MEMBERS_ENDPOINT = '/api/members'
const LOANS_ENDPOINT = '/api/loans'

export const useLibraryData = () => {
  const {
    data: snapshot,
    pending,
    error,
    refresh,
  } = useAsyncData('library-snapshot', () =>
    $fetch<LibrarySnapshot>('/api/library')
  )

  const books = computed<Book[]>(() => snapshot.value?.books ?? [])
  const members = computed<Member[]>(() => snapshot.value?.members ?? [])
  const loans = computed<Loan[]>(() => snapshot.value?.loans ?? [])

  const activeLoans = computed(() =>
    loans.value.filter((loan) => !loan.returnedAt)
  )

  const overdueLoans = computed(() => {
    const today = new Date().toISOString().slice(0, 10)
    return activeLoans.value.filter((loan) => loan.dueAt < today)
  })

  const dueSoonLoans = computed(() => {
    const today = new Date()
    const threeDaysOut = new Date(today)
    threeDaysOut.setDate(today.getDate() + 3)
    return activeLoans.value.filter((loan) => {
      const dueDate = new Date(loan.dueAt)
      return dueDate >= today && dueDate <= threeDaysOut
    })
  })

  const getBookById = (id: number) =>
    books.value.find((book) => book.id === id) ?? null

  const getMemberById = (id: number) =>
    members.value.find((member) => member.id === id) ?? null

  const refreshLibrary = async () => {
    await refresh()
  }

  const addBook = async (payload: CreateBookInput) => {
    await $fetch<Book>(BOOKS_ENDPOINT, {
      method: 'POST',
      body: payload,
    })
    await refreshLibrary()
  }

  const editBook = async (id: number, payload: UpdateBookInput) => {
    await $fetch<Book>(`${BOOKS_ENDPOINT}/${id}`, {
      method: 'PATCH',
      body: payload,
    })
    await refreshLibrary()
  }

  const removeBook = async (id: number) => {
    await $fetch(`${BOOKS_ENDPOINT}/${id}`, {
      method: 'DELETE',
    })
    await refreshLibrary()
  }

  const addMember = async (payload: CreateMemberInput) => {
    await $fetch<Member>(MEMBERS_ENDPOINT, {
      method: 'POST',
      body: payload,
    })
    await refreshLibrary()
  }

  const editMember = async (id: number, payload: UpdateMemberInput) => {
    await $fetch<Member>(`${MEMBERS_ENDPOINT}/${id}`, {
      method: 'PATCH',
      body: payload,
    })
    await refreshLibrary()
  }

  const removeMember = async (id: number) => {
    await $fetch(`${MEMBERS_ENDPOINT}/${id}`, {
      method: 'DELETE',
    })
    await refreshLibrary()
  }

  const addLoan = async (payload: CreateLoanInput) => {
    await $fetch<Loan>(LOANS_ENDPOINT, {
      method: 'POST',
      body: payload,
    })
    await refreshLibrary()
  }

  const editLoan = async (id: number, payload: UpdateLoanInput) => {
    await $fetch<Loan>(`${LOANS_ENDPOINT}/${id}`, {
      method: 'PATCH',
      body: payload,
    })
    await refreshLibrary()
  }

  const removeLoan = async (id: number) => {
    await $fetch(`${LOANS_ENDPOINT}/${id}`, {
      method: 'DELETE',
    })
    await refreshLibrary()
  }

  return {
    snapshot,
    pending,
    error,
    books,
    members,
    loans,
    activeLoans,
    overdueLoans,
    dueSoonLoans,
    getBookById,
    getMemberById,
    refreshLibrary,
    addBook,
    editBook,
    removeBook,
    addMember,
    editMember,
    removeMember,
    addLoan,
    editLoan,
    removeLoan,
  }
}
