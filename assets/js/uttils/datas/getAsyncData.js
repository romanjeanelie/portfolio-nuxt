import { groq } from '@nuxtjs/sanity'

const getQuery = async () => {
  const query = groq`{ "projects": *[_type == 'projects']{ _id, title, subtitlte, slug, body }[0]}`
  const result = await this.$sanity.fetch(query)

  return result
}

export default getQuery
