import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Sample purchase database - in a real app, this would be a proper database
const purchases = new Map<
  string,
  {
    id: string
    workspaceId: string
    customerEmail: string
    sessionId: string
    downloadCount: number
    maxDownloads: number
    purchaseDate: Date
    expiresAt: Date
  }
>()

export async function POST(request: NextRequest) {
  try {
    const { sessionId, workspaceId, customerEmail } = await request.json()

    // Generate unique purchase ID
    const purchaseId = crypto.randomUUID()

    // Create purchase record
    const purchase = {
      id: purchaseId,
      workspaceId,
      customerEmail,
      sessionId,
      downloadCount: 0,
      maxDownloads: 5, // Allow 5 downloads
      purchaseDate: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    }

    purchases.set(purchaseId, purchase)

    return NextResponse.json({
      purchaseId,
      downloadUrl: `/api/download/${purchaseId}`,
      expiresAt: purchase.expiresAt,
      maxDownloads: purchase.maxDownloads,
    })
  } catch (error) {
    console.error("Error creating purchase record:", error)
    return NextResponse.json({ error: "Failed to create purchase record" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    // Get all purchases for this email
    const userPurchases = Array.from(purchases.values())
      .filter((purchase) => purchase.customerEmail === email)
      .map((purchase) => ({
        id: purchase.id,
        workspaceId: purchase.workspaceId,
        purchaseDate: purchase.purchaseDate,
        downloadCount: purchase.downloadCount,
        maxDownloads: purchase.maxDownloads,
        expiresAt: purchase.expiresAt,
        downloadUrl: `/api/download/${purchase.id}`,
      }))

    return NextResponse.json({ purchases: userPurchases })
  } catch (error) {
    console.error("Error fetching purchases:", error)
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 })
  }
}
