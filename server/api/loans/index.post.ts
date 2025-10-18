import { createError, readBody } from 'h3'
import { createLoan } from '../../utils/libraryStore'
import type { CreateLoanInput } from '~/types/library'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<CreateLoanInput>>(event)

  if (
    !body ||
    typeof body.bookId !== 'number' ||
    typeof body.memberId !== 'number' ||
    !body.borrowedAt ||
    !body.dueAt
  ) {
    throw createError({
      statusCode: 400,
      message: 'bookId, memberId, borrowedAt, and dueAt are required',
    })
  }

  return await createLoan({
    bookId: body.bookId,
    memberId: body.memberId,
    borrowedAt: body.borrowedAt,
    dueAt: body.dueAt,
    notes: body.notes,
    returnedAt: body.returnedAt,
  })
})
