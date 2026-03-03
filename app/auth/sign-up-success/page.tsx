import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Landmark, Mail } from 'lucide-react'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-primary">
              <Landmark className="h-8 w-8" />
              <span className="text-2xl font-bold tracking-tight">
                StudentBank
              </span>
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">
                Registracia uspesna!
              </CardTitle>
              <CardDescription>
                Skontrolujte svoju e-mailovu schranku
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Poslali sme vam potvrdzujuci e-mail. Kliknite na odkaz v e-maili
                pre aktivaciu uctu.
              </p>
              <div className="mt-4">
                <Link
                  href="/auth/login"
                  className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Spat na prihlasenie
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
