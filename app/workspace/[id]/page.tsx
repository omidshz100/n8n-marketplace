import { WorkspaceDetail } from "@/components/workspace-detail"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"

// Sample workspace data - in a real app, this would come from a database
const workspaces = [
  {
    id: "1",
    title: "E-commerce Order Processing",
    description:
      "Complete automation for order processing, inventory updates, and customer notifications across multiple platforms.",
    longDescription: `This comprehensive e-commerce automation workspace handles the entire order lifecycle from placement to fulfillment. It integrates with major e-commerce platforms like Shopify, WooCommerce, and Magento to automatically process orders, update inventory levels, and send personalized customer notifications.

Key features include:
• Automatic order processing and validation
• Real-time inventory synchronization across platforms
• Customer notification workflows (order confirmation, shipping updates, delivery confirmation)
• Integration with shipping providers for tracking
• Automated refund and return processing
• Sales analytics and reporting

Perfect for e-commerce businesses looking to streamline their operations and provide excellent customer experience without manual intervention.`,
    price: 49,
    category: "E-commerce",
    tags: ["Shopify", "Email", "Slack", "Inventory"],
    downloads: 234,
    rating: 4.8,
    reviews: 47,
    image: "/e-commerce-automation-dashboard.png",
    featured: true,
    author: "AutomationPro",
    lastUpdated: "2024-01-15",
    version: "2.1",
    requirements: ["n8n v1.0+", "Shopify API access", "Email service (Gmail/Outlook)", "Slack workspace"],
    includes: [
      "Complete n8n workflow JSON",
      "Setup documentation",
      "Configuration guide",
      "Sample data for testing",
      "Video walkthrough",
    ],
  },
  {
    id: "2",
    title: "Social Media Content Pipeline",
    description: "Automated content creation, scheduling, and performance tracking across all major social platforms.",
    longDescription: `Transform your social media strategy with this powerful automation pipeline that handles content creation, scheduling, and performance analysis across multiple platforms.

This workspace automates:
• Content generation using AI tools
• Multi-platform posting (Twitter, LinkedIn, Instagram, Facebook)
• Optimal timing based on audience analytics
• Hashtag research and optimization
• Performance tracking and reporting
• Engagement monitoring and response workflows
• Content calendar management

Ideal for marketing teams, social media managers, and content creators who want to maintain consistent presence across platforms while maximizing engagement.`,
    price: 39,
    category: "Marketing",
    tags: ["Twitter", "LinkedIn", "Instagram", "Analytics"],
    downloads: 189,
    rating: 4.9,
    reviews: 32,
    image: "/social-media-automation.png",
    author: "SocialGuru",
    lastUpdated: "2024-01-20",
    version: "1.8",
    requirements: ["n8n v1.0+", "Social platform API keys", "OpenAI API", "Google Analytics"],
    includes: [
      "Multi-platform workflow JSON",
      "API setup guide",
      "Content templates",
      "Analytics dashboard setup",
      "Best practices guide",
    ],
  },
  // Add more workspaces as needed...
]

interface WorkspacePageProps {
  params: {
    id: string
  }
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { id } = await params
  const workspace = workspaces.find((w) => w.id === id)

  if (!workspace) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <WorkspaceDetail workspace={workspace} />
      </main>
      <Footer />
    </div>
  )
}

export function generateStaticParams() {
  return workspaces.map((workspace) => ({
    id: workspace.id,
  }))
}
