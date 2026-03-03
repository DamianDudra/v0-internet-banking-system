import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Copy } from 'lucide-react'

interface AccountInfoCardProps {
  firstName: string
  lastName: string
  iban: string
  email: string
}

export function AccountInfoCard({
  firstName,
  lastName,
  iban,
  email,
}: AccountInfoCardProps) {
  const formattedIban = iban.replace(/(.{4})/g, '$1 ').trim()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Informacie o ucte
        </CardTitle>
        <User className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Meno a priezvisko</p>
          <p className="font-medium text-foreground">
            {firstName} {lastName}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">IBAN</p>
          <p className="font-mono text-xs font-medium text-foreground">
            {formattedIban}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">E-mail</p>
          <p className="text-sm font-medium text-foreground">{email}</p>
        </div>
      </CardContent>
    </Card>
  )
}
