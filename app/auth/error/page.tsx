import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Landmark, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

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
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">
                Nastala chyba
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {params?.error ? (
                <p className="text-sm text-muted-foreground">
                  Kod chyby: {params.error}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nastala neznama chyba.
                </p>
              )}
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
