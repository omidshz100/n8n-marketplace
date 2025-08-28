import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with fallback for build time
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil",
    })
  : null

// Sample n8n workspace JSON files - in a real app, these would be stored in blob storage
const workspaceFiles = {
  "1": {
    name: "E-commerce Order Processing",
    nodes: [
      {
        parameters: {
          httpMethod: "POST",
          path: "webhook",
          responseMode: "onReceived",
          options: {},
        },
        id: "webhook-node",
        name: "Webhook",
        type: "n8n-nodes-base.webhook",
        typeVersion: 1,
        position: [250, 300],
      },
      {
        parameters: {
          resource: "order",
          operation: "get",
        },
        id: "shopify-node",
        name: "Shopify",
        type: "n8n-nodes-base.shopify",
        typeVersion: 1,
        position: [450, 300],
      },
    ],
    connections: {
      Webhook: {
        main: [
          [
            {
              node: "Shopify",
              type: "main",
              index: 0,
            },
          ],
        ],
      },
    },
  },
  "2": {
    name: "Social Media Content Pipeline",
    nodes: [
      {
        parameters: {
          triggerTimes: {
            item: [
              {
                hour: 9,
                minute: 0,
              },
            ],
          },
        },
        id: "schedule-node",
        name: "Schedule Trigger",
        type: "n8n-nodes-base.scheduleTrigger",
        typeVersion: 1,
        position: [250, 300],
      },
    ],
    connections: {},
  },
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const { workspaceId } = await params
    const sessionId = request.nextUrl.searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    // Handle mock sessions for development
    if (sessionId.startsWith('cs_test_mock_')) {
      const workspaceJson = workspaceFiles[workspaceId as keyof typeof workspaceFiles]

      if (!workspaceJson) {
        return NextResponse.json({ error: "Workspace file not found" }, { status: 404 })
      }

      return new NextResponse(JSON.stringify(workspaceJson, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${workspaceJson.name.replace(/[^a-zA-Z0-9]/g, "-")}.json"`,
        },
      })
    }

    // Real Stripe session handling
    if (!stripe) {
      console.error("Stripe not configured - falling back to mock mode")
      // Fallback to mock mode if Stripe is not configured
      const workspaceJson = workspaceFiles[workspaceId as keyof typeof workspaceFiles]

      if (!workspaceJson) {
        return NextResponse.json({ error: "Workspace file not found" }, { status: 404 })
      }

      return new NextResponse(JSON.stringify(workspaceJson, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${workspaceJson.name.replace(/[^a-zA-Z0-9]/g, "-")}.json"`,
        },
      })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    if (session.metadata?.workspaceId !== workspaceId) {
      return NextResponse.json({ error: "Workspace not purchased" }, { status: 403 })
    }

    const workspaceJson = workspaceFiles[workspaceId as keyof typeof workspaceFiles]

    if (!workspaceJson) {
      return NextResponse.json({ error: "Workspace file not found" }, { status: 404 })
    }

    return new NextResponse(JSON.stringify(workspaceJson, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${workspaceJson.name.replace(/[^a-zA-Z0-9]/g, "-")}.json"`,
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
