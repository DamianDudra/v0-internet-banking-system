import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TemplatesList } from '@/components/templates/templates-list'

export default async function TemplatesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: templates } = await supabase
    .from('transfer_templates')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Sablony prevodov
        </h1>
        <p className="text-muted-foreground">
          Spravujte svoje ulozene sablony pre rychle prevody
        </p>
      </div>

      <TemplatesList userId={user.id} templates={templates ?? []} />
    </div>
  )
}
