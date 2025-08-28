import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">N8</span>
              </div>
              <span className="font-semibold text-lg">Workspace Hub</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#workspaces" className="text-muted-foreground hover:text-foreground transition-colors">
              Workspaces
            </Link>
            <Link href="/#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
