import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TransferForm } from '@/components/transfer/transfer-form'

export default async function TransferPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', user.id)
    .single()

  const { data: templates } = await supabase
    .from('transfer_templates')
    .select('*')
    .eq('user_id', user.id)
    .order('template_name', { ascending: true })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Prevod penazi
        </h1>
        <p className="text-muted-foreground">
          Odoslite peniaze na lubovolny ucet
        </p>
      </div>

      <TransferForm
        userId={user.id}
        balance={profile?.balance ?? 0}
        templates={templates ?? []}
      />
    </div>
  )
}
