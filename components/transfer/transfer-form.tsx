'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowRight, Loader2, Wallet } from 'lucide-react'

interface Template {
  id: string
  template_name: string
  receiver_iban: string
  receiver_name: string
  amount: number | null
  note: string | null
}

interface TransferFormProps {
  userId: string
  balance: number
  templates: Template[]
}

export function TransferForm({ userId, balance, templates }: TransferFormProps) {
  const [receiverIban, setReceiverIban] = useState('')
  const [receiverName, setReceiverName] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const formattedBalance = new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
  }).format(balance)

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setReceiverIban(template.receiver_iban)
      setReceiverName(template.receiver_name)
      if (template.amount) setAmount(template.amount.toString())
      if (template.note) setNote(template.note)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const numAmount = parseFloat(amount)

    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Zadajte platnu sumu')
      setIsLoading(false)
      return
    }

    if (numAmount > balance) {
      toast.error('Nedostatok prostriedkov na ucte')
      setIsLoading(false)
      return
    }

    if (!receiverIban.trim()) {
      toast.error('Zadajte IBAN prijemcu')
      setIsLoading(false)
      return
    }

    if (!receiverName.trim()) {
      toast.error('Zadajte meno prijemcu')
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const { error: txError } = await supabase.from('transactions').insert({
        sender_id: userId,
        receiver_iban: receiverIban.replace(/\s/g, ''),
        receiver_name: receiverName,
        amount: numAmount,
        note: note || null,
      })

      if (txError) throw txError

      const newBalance = balance - numAmount
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', userId)

      if (balanceError) throw balanceError

      toast.success(`Prevod ${numAmount.toFixed(2)} EUR bol uspesny`)
      router.push('/dashboard')
      router.refresh()
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : 'Nastala chyba pri prevode'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ArrowRight className="h-5 w-5 text-primary" />
            Novy prevod
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {templates.length > 0 && (
              <div className="grid gap-2">
                <Label>Pouzit sablonu</Label>
                <Select onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte sablonu..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.template_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="receiverName">Meno prijemcu</Label>
              <Input
                id="receiverName"
                type="text"
                placeholder="Jan Novak"
                required
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="receiverIban">IBAN prijemcu</Label>
              <Input
                id="receiverIban"
                type="text"
                placeholder="SK00 0000 0000 0000 0000 0000"
                required
                className="font-mono"
                value={receiverIban}
                onChange={(e) => setReceiverIban(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Suma (EUR)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="note">Poznamka (volitelne)</Label>
              <Textarea
                id="note"
                placeholder="Napr. platba za obed, najomne..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Odosielam...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4" />
                  Odoslat prevod
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Wallet className="h-4 w-4" />
            Dostupny zostatok
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">
            {formattedBalance}
          </p>
          {amount && parseFloat(amount) > 0 && (
            <div className="mt-3 rounded-lg border border-border bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground">
                Zostatok po prevode
              </p>
              <p
                className={`text-lg font-semibold ${
                  balance - parseFloat(amount) < 0
                    ? 'text-destructive'
                    : 'text-foreground'
                }`}
              >
                {new Intl.NumberFormat('sk-SK', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(balance - parseFloat(amount))}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
