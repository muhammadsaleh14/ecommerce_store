import { readFileSync } from 'fs'
import { resolve } from 'path'
import type { NextConfig } from 'next'

const envPath = resolve(process.cwd(), '../.env')
try {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const sep = trimmed.indexOf('=')
    if (sep === -1) continue
    const key = trimmed.slice(0, sep).trim()
    const value = trimmed.slice(sep + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
} catch {}

const nextConfig: NextConfig = {}

export default nextConfig
