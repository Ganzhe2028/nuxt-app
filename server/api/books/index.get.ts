import { listBooks } from '../../utils/libraryStore'

export default defineEventHandler(async () => {
  return await listBooks()
})
