import { createError } from 'h3'
import { deleteBook } from '../../utils/libraryStore'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, message: 'Invalid book id' })
  }

  await deleteBook(id)

  return { status: 'ok' }
})
