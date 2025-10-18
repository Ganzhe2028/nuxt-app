import { getQuery } from 'h3'
import { listActiveLoans, listLoans } from '../../utils/libraryStore'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  if (query.active === 'true') {
    return await listActiveLoans()
  }

  return await listLoans()
})
