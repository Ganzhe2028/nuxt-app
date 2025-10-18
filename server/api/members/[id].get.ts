import { createError } from 'h3'
import { findMember } from '../../utils/libraryStore'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, message: 'Invalid member id' })
  }

  const member = await findMember(id)

  if (!member) {
    throw createError({ statusCode: 404, message: 'Member not found' })
  }

  return member
})
