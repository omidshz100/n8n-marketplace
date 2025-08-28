import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string
    workspace_id?: string
  }>
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id, workspace_id } = await searchParams

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Thank you for your purchase! Your n8n workspace is ready for download.
              </p>

              {session_id && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Order ID:</p>
                  <code className="text-sm font-mono">{session_id}</code>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" asChild>
                  <Link href={`/download?session_id=${session_id}&workspace_id=${workspace_id}`}>
                    <Download className="h-4 w-4" />
                    Download Workspace
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="gap-2 bg-transparent" asChild>
                  <Link href="/dashboard">
                    <ArrowRight className="h-4 w-4" />
                    View Dashboard
                  </Link>
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>A confirmation email has been sent to your email address.</p>
                <p>You can also access your purchases from your dashboard.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
