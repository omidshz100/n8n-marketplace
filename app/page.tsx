import { WorkspaceGallery } from "@/components/workspace-gallery"
import { Hero } from "@/components/hero"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <WorkspaceGallery />
      </main>
      <Footer />
    </div>
  )
}
