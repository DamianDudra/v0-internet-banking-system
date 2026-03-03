import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet } from 'lucide-react'

interface BalanceCardProps {
  balance: number
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const formattedBalance = new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
  }).format(balance)

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <CardHeader className="relative flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Zostatok na ucte
        </CardTitle>
        <Wallet className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent className="relative">
        <p className="text-3xl font-bold tracking-tight text-foreground">
          {formattedBalance}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Dostupne prostriedky</p>
      </CardContent>
    </Card>
  )
}
