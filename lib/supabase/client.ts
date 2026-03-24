import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('[v0] Supabase URL:', supabaseUrl ? 'SET' : 'MISSING')
  console.log('[v0] Supabase Anon Key:', supabaseAnonKey ? 'SET' : 'MISSING')

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return client
}
