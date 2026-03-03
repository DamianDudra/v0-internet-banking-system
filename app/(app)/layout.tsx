import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <AppShell
      user={{
        id: user.id,
        email: user.email ?? '',
        firstName: profile?.first_name ?? '',
        lastName: profile?.last_name ?? '',
        balance: profile?.balance ?? 0,
        iban: profile?.iban ?? '',
      }}
    >
      {children}
    </AppShell>
  )
}
