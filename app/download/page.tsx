import { DownloadInterface } from "@/components/download-interface"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface DownloadPageProps {
  searchParams: Promise<{
    session_id?: string
    workspace_id?: string
  }>
}

export default async function DownloadPage({ searchParams }: DownloadPageProps) {
  const { session_id, workspace_id } = await searchParams

  if (!session_id) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
            <h1 className="text-2xl font-bold mb-4">Invalid Download Link</h1>
            <p className="text-muted-foreground">Please use a valid download link from your purchase confirmation.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-20">
        <DownloadInterface sessionId={session_id} workspaceId={workspace_id} />
      </main>
      <Footer />
    </div>
  )
}
