import { createError, readBody } from 'h3'
import { updateMember } from '../../utils/libraryStore'
import type { UpdateMemberInput } from '~/types/library'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, message: 'Invalid member id' })
  }

  const body = await readBody<UpdateMemberInput>(event)

  return await updateMember(id, body)
})
