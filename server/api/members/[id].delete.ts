import { createError } from 'h3'
import { deleteMember } from '../../utils/libraryStore'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, message: 'Invalid member id' })
  }

  await deleteMember(id)

  return { status: 'ok' }
})
