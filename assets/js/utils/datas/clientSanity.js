import sanityClient from '@sanity/client'

export const clientSanity = sanityClient({
  projectId: '55y62mai',
  dataset: 'production',
  apiVersion: '2021-08-18', // use current UTC date - see "specifying API version"!
  // token: 'sanity-auth-token', // or leave blank for unauthenticated usage
  useCdn: true, // `false` if you want to ensure fresh data
})
