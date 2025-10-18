import { getSnapshot } from '../utils/libraryStore'

export default defineEventHandler(async () => {
  return await getSnapshot()
})
