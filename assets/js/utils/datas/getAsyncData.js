import { clientSanity } from './clientSanity.js'

const getAsyncData = async (query) => {
  const result = await clientSanity.fetch(query)
  return result
}

export default getAsyncData
