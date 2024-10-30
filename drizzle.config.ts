import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const { DATABASE_URL } = process.env

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

export default defineConfig({
  schema: './db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
  },
})
