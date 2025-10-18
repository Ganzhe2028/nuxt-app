import { createError } from 'h3'
import { findLoan } from '../../utils/libraryStore'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, message: 'Invalid loan id' })
  }

  const loan = await findLoan(id)

  if (!loan) {
    throw createError({ statusCode: 404, message: 'Loan not found' })
  }

  return loan
})
