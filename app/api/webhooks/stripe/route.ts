import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"

// Initialize Stripe with fallback for build time
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil",
    })
  : null

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe || !webhookSecret) {
      console.error("Stripe webhook not configured - missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET")
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
    }

    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      console.error("Missing Stripe signature")
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session

        // Handle successful payment
        console.log("Payment successful for session:", session.id)
        console.log("Workspace ID:", session.metadata?.workspaceId)
        console.log("Customer email:", session.customer_details?.email)

        await handleSuccessfulPurchase({
          sessionId: session.id,
          workspaceId: session.metadata?.workspaceId,
          customerEmail: session.customer_details?.email,
          amountTotal: session.amount_total,
        })

        break

      case "payment_intent.payment_failed":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("Payment failed:", paymentIntent.id)

        // Handle failed payment
        // You might want to notify the customer or log for analytics

        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleSuccessfulPurchase({
  sessionId,
  workspaceId,
  customerEmail,
  amountTotal,
}: {
  sessionId: string
  workspaceId?: string
  customerEmail?: string | null
  amountTotal?: number | null
}) {
  try {
    if (!workspaceId || !customerEmail) {
      console.error("Missing required purchase data")
      return
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/purchases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        workspaceId,
        customerEmail,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create purchase record")
    }

    const { purchaseId, downloadUrl } = await response.json()

    console.log("Purchase record created:", {
      purchaseId,
      downloadUrl,
      sessionId,
      workspaceId,
      customerEmail,
    })

    // await sendDownloadEmail(customerEmail, downloadUrl, workspaceId)
  } catch (error) {
    console.error("Error handling successful purchase:", error)
  }
}
