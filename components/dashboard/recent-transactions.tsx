import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowUpRight, Clock } from 'lucide-react'

interface Transaction {
  id: string
  receiver_name: string
  receiver_iban: string
  amount: number
  note: string | null
  created_at: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-foreground">
          Posledne transakcie
        </CardTitle>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ArrowUpRight className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              Zatial ziadne transakcie
            </p>
            <p className="text-xs text-muted-foreground/70">
              Vykonajte svoj prvy prevod
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prijemca</TableHead>
                  <TableHead className="hidden sm:table-cell">IBAN</TableHead>
                  <TableHead className="hidden md:table-cell">Poznamka</TableHead>
                  <TableHead className="text-right">Suma</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">
                    Datum
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium text-foreground">
                      {tx.receiver_name}
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs text-muted-foreground sm:table-cell">
                      {tx.receiver_iban.substring(0, 12)}...
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {tx.note || '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-destructive">
                      -{formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell className="hidden text-right text-muted-foreground sm:table-cell">
                      {formatDate(tx.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
