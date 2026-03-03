import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BalanceCard } from '@/components/dashboard/balance-card'
import { AccountInfoCard } from '@/components/dashboard/account-info-card'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { QuickActions } from '@/components/dashboard/quick-actions'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('sender_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Prehad
        </h1>
        <p className="text-muted-foreground">
          Vitajte spat, {profile?.first_name ?? 'pouzivatel'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BalanceCard balance={profile?.balance ?? 0} />
        <AccountInfoCard
          firstName={profile?.first_name ?? ''}
          lastName={profile?.last_name ?? ''}
          iban={profile?.iban ?? ''}
          email={user.email ?? ''}
        />
        <QuickActions />
      </div>

      <RecentTransactions transactions={transactions ?? []} />
    </div>
  )
}
