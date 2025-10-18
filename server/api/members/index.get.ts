import { listMembers } from '../../utils/libraryStore'

export default defineEventHandler(async () => {
  return await listMembers()
})
