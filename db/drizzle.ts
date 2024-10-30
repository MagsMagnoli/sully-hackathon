import { drizzle } from 'drizzle-orm/postgres-js'

const { DATABASE_URL } = process.env

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

export const db = drizzle(DATABASE_URL)
