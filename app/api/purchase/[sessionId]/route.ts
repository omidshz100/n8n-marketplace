import { type NextRequest, NextResponse } from "next/server"
import { list } from "@vercel/blob"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
})

// Sample workspace data - in a real app, this would come from a database
const workspaces = [
  {
    id: "1",
    title: "E-commerce Order Processing",
    description:
      "Complete automation for order processing, inventory updates, and customer notifications across multiple platforms.",
    category: "E-commerce",
    version: "2.1",
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
    category: "Marketing",
    version: "1.8",
    includes: [
      "Multi-platform workflow JSON",
      "API setup guide",
      "Content templates",
      "Analytics dashboard setup",
      "Best practices guide",
    ],
  },
]

export async function GET(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params

    // Handle mock sessions for development
    if (sessionId.startsWith('cs_test_mock_')) {
      // Extract workspace ID from URL parameters
      const url = new URL(request.url)
      const workspaceId = url.searchParams.get('workspace_id') || '1'
      
      const workspace = workspaces.find((w) => w.id === workspaceId)
      
      return NextResponse.json({
        sessionId,
        workspaceId,
        customerEmail: 'test@example.com',
        amount: 4900, // $49.00 in cents
        currency: 'usd',
        purchaseDate: new Date().toISOString(),
        status: 'completed',
        workspace,
      })
    }

    // Real Stripe session handling
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    try {
      const { blobs } = await list({ prefix: `purchases/${sessionId}` })

      if (blobs.length === 0) {
        return NextResponse.json({ error: "Purchase record not found" }, { status: 404 })
      }

      const purchaseBlob = blobs[0]
      const response = await fetch(purchaseBlob.url)
      const purchaseData = await response.json()

      const workspace = workspaces.find((w) => w.id === purchaseData.workspaceId)

      return NextResponse.json({
        ...purchaseData,
        workspace,
      })
    } catch (blobError) {
      const workspaceId = session.metadata?.workspaceId
      const workspace = workspaces.find((w) => w.id === workspaceId)

      return NextResponse.json({
        sessionId,
        workspaceId,
        customerEmail: session.customer_details?.email,
        amount: session.amount_total,
        currency: session.currency,
        purchaseDate: new Date(session.created * 1000).toISOString(),
        status: "completed",
        workspace,
      })
    }
  } catch (error) {
    console.error("Purchase verification error:", error)
    return NextResponse.json({ error: "Purchase verification failed" }, { status: 500 })
  }
}
