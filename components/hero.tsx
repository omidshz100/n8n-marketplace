import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Download, Star } from "lucide-react"

export function Hero() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Premium n8n Automation Templates
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-balance mb-6">
            Ready-to-Use <span className="text-primary">n8n Workspaces</span> for Your Business
          </h1>

          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
            Skip the setup time. Get professional automation workflows that you can import directly into n8n and start
            using immediately.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="gap-2">
              Browse Workspaces
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Free Samples
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>50+ Premium Workspaces</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Instant JSON Download</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Ready to Import</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
