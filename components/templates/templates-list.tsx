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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  ArrowLeftRight,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'

interface Template {
  id: string
  user_id: string
  template_name: string
  receiver_iban: string
  receiver_name: string
  amount: number | null
  note: string | null
  created_at: string
}

interface TemplatesListProps {
  userId: string
  templates: Template[]
}

export function TemplatesList({ userId, templates: initialTemplates }: TemplatesListProps) {
  const [templates, setTemplates] = useState(initialTemplates)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Form state
  const [templateName, setTemplateName] = useState('')
  const [receiverName, setReceiverName] = useState('')
  const [receiverIban, setReceiverIban] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const resetForm = () => {
    setTemplateName('')
    setReceiverName('')
    setReceiverIban('')
    setAmount('')
    setNote('')
  }

  const openEdit = (template: Template) => {
    setEditingTemplate(template)
    setTemplateName(template.template_name)
    setReceiverName(template.receiver_name)
    setReceiverIban(template.receiver_iban)
    setAmount(template.amount?.toString() ?? '')
    setNote(template.note ?? '')
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('transfer_templates')
        .insert({
          user_id: userId,
          template_name: templateName,
          receiver_name: receiverName,
          receiver_iban: receiverIban.replace(/\s/g, ''),
          amount: amount ? parseFloat(amount) : null,
          note: note || null,
        })
        .select()
        .single()

      if (error) throw error

      setTemplates([data, ...templates])
      setIsCreateOpen(false)
      resetForm()
      toast.success('Sablona bola vytvorena')
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : 'Nastala chyba'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTemplate) return
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('transfer_templates')
        .update({
          template_name: templateName,
          receiver_name: receiverName,
          receiver_iban: receiverIban.replace(/\s/g, ''),
          amount: amount ? parseFloat(amount) : null,
          note: note || null,
        })
        .eq('id', editingTemplate.id)
        .select()
        .single()

      if (error) throw error

      setTemplates(
        templates.map((t) => (t.id === editingTemplate.id ? data : t))
      )
      setEditingTemplate(null)
      resetForm()
      toast.success('Sablona bola aktualizovana')
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : 'Nastala chyba'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (templateId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('transfer_templates')
        .delete()
        .eq('id', templateId)

      if (error) throw error

      setTemplates(templates.filter((t) => t.id !== templateId))
      toast.success('Sablona bola vymazana')
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : 'Nastala chyba'
      )
    }
  }

  const TemplateFormFields = () => (
    <>
      <div className="grid gap-2">
        <Label htmlFor="templateName">Nazov sablony</Label>
        <Input
          id="templateName"
          required
          placeholder="Napr. Najomne, Skola..."
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="receiverName">Meno prijemcu</Label>
        <Input
          id="receiverName"
          required
          placeholder="Jan Novak"
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="receiverIban">IBAN prijemcu</Label>
        <Input
          id="receiverIban"
          required
          placeholder="SK00 0000 0000 0000 0000 0000"
          className="font-mono"
          value={receiverIban}
          onChange={(e) => setReceiverIban(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="amount">Suma EUR (volitelne)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="note">Poznamka (volitelne)</Label>
        <Textarea
          id="note"
          placeholder="Popis platby..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />
      </div>
    </>
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Create Button */}
      <div className="flex justify-end">
        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            setIsCreateOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova sablona
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova sablona</DialogTitle>
              <DialogDescription>
                Vytvorte sablonu pre opakovane prevody
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <TemplateFormFields />
              <DialogFooter>
                <Button type="submit" disabled={isLoading} className="gap-2">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Vytvorit
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingTemplate}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTemplate(null)
            resetForm()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upravit sablonu</DialogTitle>
            <DialogDescription>
              Zmente udaje sablony
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <TemplateFormFields />
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Pencil className="h-4 w-4" />
                )}
                Ulozit zmeny
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="text-lg font-medium text-muted-foreground">
              Zatial ziadne sablony
            </p>
            <p className="mb-4 text-sm text-muted-foreground/70">
              Vytvorte si sablonu pre rychle opakovane prevody
            </p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Vytvorit prvu sablonu
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-primary" />
                  {template.template_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Prijemca</p>
                    <p className="text-sm font-medium text-foreground">
                      {template.receiver_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">IBAN</p>
                    <p className="font-mono text-xs text-foreground">
                      {template.receiver_iban
                        .replace(/(.{4})/g, '$1 ')
                        .trim()}
                    </p>
                  </div>
                  {template.amount && (
                    <div>
                      <p className="text-xs text-muted-foreground">Suma</p>
                      <p className="text-sm font-semibold text-foreground">
                        {new Intl.NumberFormat('sk-SK', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(template.amount)}
                      </p>
                    </div>
                  )}
                  {template.note && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Poznamka
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {template.note}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-auto flex gap-2 pt-3 border-t border-border">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                  >
                    <Link href="/transfer">
                      <ArrowLeftRight className="h-3.5 w-3.5" />
                      Pouzit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(template)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="sr-only">Upravit</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Vymazat</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Vymazat sablonu?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Naozaj chcete vymazat sablonu &ldquo;{template.template_name}&rdquo;?
                          Tato akcia sa neda vratit.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Zrusit</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(template.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Vymazat
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
