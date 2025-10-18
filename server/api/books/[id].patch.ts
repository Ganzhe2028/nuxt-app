import { createError, readBody } from 'h3'
import { updateBook } from '../../utils/libraryStore'
import type { UpdateBookInput } from '~/types/library'

const allowedStatuses = new Set([
  'available',
  'on-loan',
  'reserved',
  'maintenance',
])

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, message: 'Invalid book id' })
  }

  const body = await readBody<UpdateBookInput>(event)

  if (body.status && !allowedStatuses.has(body.status)) {
    throw createError({ statusCode: 400, message: 'Invalid book status' })
  }

  return await updateBook(id, body)
})
