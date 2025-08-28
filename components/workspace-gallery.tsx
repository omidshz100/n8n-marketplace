import { WorkspaceCard } from "@/components/workspace-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

// Sample workspace data - in a real app, this would come from a database
const workspaces = [
  {
    id: "1",
    title: "E-commerce Order Processing",
    description:
      "Complete automation for order processing, inventory updates, and customer notifications across multiple platforms.",
    price: 49,
    category: "E-commerce",
    tags: ["Shopify", "Email", "Slack", "Inventory"],
    downloads: 234,
    rating: 4.8,
    image: "/e-commerce-automation-dashboard.png",
    featured: true,
  },
  {
    id: "2",
    title: "Social Media Content Pipeline",
    description: "Automated content creation, scheduling, and performance tracking across all major social platforms.",
    price: 39,
    category: "Marketing",
    tags: ["Twitter", "LinkedIn", "Instagram", "Analytics"],
    downloads: 189,
    rating: 4.9,
    image: "/social-media-automation.png",
  },
  {
    id: "3",
    title: "Lead Generation & CRM Sync",
    description: "Capture leads from multiple sources and automatically sync with your CRM with data enrichment.",
    price: 59,
    category: "Sales",
    tags: ["HubSpot", "Salesforce", "LinkedIn", "Email"],
    downloads: 156,
    rating: 4.7,
    image: "/crm-lead-generation-automation.png",
  },
  {
    id: "4",
    title: "Customer Support Automation",
    description: "Intelligent ticket routing, auto-responses, and escalation workflows for customer support teams.",
    price: 44,
    category: "Support",
    tags: ["Zendesk", "Slack", "Email", "AI"],
    downloads: 203,
    rating: 4.6,
    image: "/customer-support-automation-system.png",
  },
  {
    id: "5",
    title: "Financial Data Aggregation",
    description: "Collect and process financial data from multiple sources with automated reporting and alerts.",
    price: 69,
    category: "Finance",
    tags: ["Stripe", "PayPal", "Sheets", "Slack"],
    downloads: 98,
    rating: 4.9,
    image: "/financial-data-automation-dashboard.png",
  },
  {
    id: "6",
    title: "Content Publishing Workflow",
    description: "Streamlined content creation, review, approval, and publishing across multiple channels.",
    price: 35,
    category: "Content",
    tags: ["WordPress", "Medium", "Twitter", "Notion"],
    downloads: 167,
    rating: 4.5,
    image: "/content-publishing-automation-workflow.png",
  },
]

export function WorkspaceGallery() {
  return (
    <section id="workspaces" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Professional Automation Workspaces</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our collection of battle-tested n8n workflows. Each workspace is professionally designed and ready to
            import.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search workspaces..." className="pl-10" />
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Featured Workspace */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm">Featured</span>
            Most Popular This Week
          </h3>
          <div className="max-w-4xl mx-auto">
            <WorkspaceCard workspace={workspaces[0]} featured />
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.slice(1).map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Workspaces
          </Button>
        </div>
      </div>
    </section>
  )
}
