import { createError, readBody } from 'h3'
import { updateLoan } from '../../utils/libraryStore'
import type { UpdateLoanInput } from '~/types/library'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, message: 'Invalid loan id' })
  }

  const body = await readBody<UpdateLoanInput>(event)

  return await updateLoan(id, body)
})
