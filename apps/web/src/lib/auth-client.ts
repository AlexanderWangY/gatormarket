import { createAuthClient } from 'better-auth/react'
export const authClient = createAuthClient({
  baseURL: import.meta.env.API_URL ?? 'http://localhost:8080',
})

export const isLoggedIn = async () => {
  const session = await authClient.getSession()
  return !!(session.data && session.data.user && session.data.session)
}

export const getSession = async () => {
  const session = await authClient.getSession()
  return session.data
}
