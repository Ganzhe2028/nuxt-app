import { createError } from 'h3'
import { deleteLoan } from '../../utils/libraryStore'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, message: 'Invalid loan id' })
  }

  await deleteLoan(id)

  return { status: 'ok' }
})
