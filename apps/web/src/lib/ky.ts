import ky from 'ky'

export const api = ky.create({
  prefixUrl: import.meta.env.API_URL ?? 'http://localhost:8080',
  credentials: 'include',
})
