import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeftRight, FileText, Plus } from 'lucide-react'
import Link from 'next/link'

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Rychle akcie
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button asChild variant="outline" className="justify-start gap-3">
          <Link href="/transfer">
            <ArrowLeftRight className="h-4 w-4 text-primary" />
            Novy prevod
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start gap-3">
          <Link href="/templates">
            <FileText className="h-4 w-4 text-primary" />
            Sprava sablon
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start gap-3">
          <Link href="/templates?new=true">
            <Plus className="h-4 w-4 text-primary" />
            Nova sablona
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
