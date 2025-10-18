import { createError, readBody } from 'h3'
import { createBook } from '../../utils/libraryStore'
import type { CreateBookInput } from '~/types/library'

const allowedStatuses = new Set([
  'available',
  'on-loan',
  'reserved',
  'maintenance',
])

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<CreateBookInput>>(event)

  if (!body?.title || !body.author || !body.category || !body.level) {
    throw createError({
      statusCode: 400,
      message: 'title, author, category, and level are required',
    })
  }

  const status = body.status ?? 'available'

  if (!allowedStatuses.has(status)) {
    throw createError({ statusCode: 400, message: 'Invalid book status' })
  }

  const payload: CreateBookInput = {
    title: body.title,
    author: body.author,
    category: body.category,
    level: body.level,
    status,
    summary: body.summary,
    isbn: body.isbn,
    tags: body.tags,
  }

  return await createBook(payload)
})
