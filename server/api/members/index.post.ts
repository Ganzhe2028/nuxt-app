import { createError, readBody } from 'h3'
import { createMember } from '../../utils/libraryStore'
import type { CreateMemberInput } from '~/types/library'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<CreateMemberInput>>(event)

  if (!body?.name || !body.grade || !body.email || !body.phone) {
    throw createError({
      statusCode: 400,
      message: 'name, grade, email, and phone are required',
    })
  }

  return await createMember({
    name: body.name,
    grade: body.grade,
    email: body.email,
    phone: body.phone,
    joinedAt: body.joinedAt,
  })
})
