import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
})

// Sample workspace data - in a real app, this would come from a database
const workspaces = [
  {
    id: "1",
    title: "E-commerce Order Processing",
    price: 49,
    image: "/e-commerce-automation-dashboard.png",
  },
  {
    id: "2",
    title: "Social Media Content Pipeline",
    price: 39,
    image: "/social-media-automation.png",
  },
  // Add more workspaces as needed...
]

export async function POST(request: NextRequest) {
  try {
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

    // Check for required environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured")
      return NextResponse.json({ error: "Payment system not configured" }, { status: 500 })
    }

    // Get base URL with fallback
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: workspace.title,
              description: "n8n Automation Workspace - Instant Download",
              images: workspace.image ? [`${baseUrl}${workspace.image}`] : [],
            },
            unit_amount: workspace.price * 100, // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&workspace_id=${workspaceId}`,
      cancel_url: `${baseUrl}/workspace/${workspaceId}`,
      metadata: {
        workspaceId: workspaceId,
      },
      // Enable automatic tax calculation if needed
      automatic_tax: { enabled: false },
      // Collect customer email for delivery
      customer_email: undefined, // Will be collected during checkout
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
