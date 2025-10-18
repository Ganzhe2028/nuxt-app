import { createError } from 'h3'
import { findBook } from '../../utils/libraryStore'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, message: 'Invalid book id' })
  }

  const book = await findBook(id)

  if (!book) {
    throw createError({ statusCode: 404, message: 'Book not found' })
  }

  return book
})
