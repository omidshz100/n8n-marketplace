import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { put } from "@vercel/blob"

// Initialize Stripe with fallback for build time
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil",
    })
  : null

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe || !endpointSecret) {
      console.error("Stripe webhook not configured - missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET")
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
    }

    const body = await request.text()
    const sig = request.headers.get("stripe-signature")

    if (!sig) {
      console.error("Missing Stripe signature")
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const workspaceId = session.metadata?.workspaceId

    if (workspaceId) {
      try {
        const purchaseRecord = {
          sessionId: session.id,
          workspaceId,
          customerEmail: session.customer_details?.email,
          amount: session.amount_total,
          currency: session.currency,
          purchaseDate: new Date().toISOString(),
          status: "completed",
        }

        await put(`purchases/${session.id}.json`, JSON.stringify(purchaseRecord), {
          access: "public",
        })

        console.log("Purchase recorded:", session.id)
      } catch (error) {
        console.error("Failed to record purchase:", error)
      }
    }
  }

  return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
