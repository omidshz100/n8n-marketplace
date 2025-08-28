import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with fallback for build time
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil",
    })
  : null

// Sample workspace data - in a real app, this would come from a database
const workspaces = [
  {
    id: "1",
    title: "E-commerce Order Processing",
    price: 49,
  },
  {
    id: "2",
    title: "Social Media Content Pipeline",
    price: 39,
  },
]

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Payment system not configured" }, { status: 500 })
    }

    const { workspaceId } = await request.json()

    // Validate workspace exists and get price from backend (security best practice)
    const workspace = workspaces.find((w) => w.id === workspaceId)
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    // Check if we're using mock keys (for development without real Stripe setup)
    if (process.env.STRIPE_SECRET_KEY === 'sk_test_mock_key') {
      // Mock response for development
      const mockSessionId = 'cs_test_mock_' + Math.random().toString(36).substr(2, 24)
      console.log('Mock Stripe session created:', mockSessionId)
      return NextResponse.json({ sessionId: mockSessionId })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: workspace.title,
              description: `n8n Workspace: ${workspace.title}`,
            },
            unit_amount: workspace.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}&workspace_id=${workspaceId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/workspace/${workspaceId}`,
      metadata: {
        workspaceId,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Payment setup failed" }, { status: 500 })
  }
}
