import { type NextRequest, NextResponse } from "next/server"

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

// Sample workspace files mapping - in a real app, these would be stored in Blob storage
const workspaceFiles = new Map<string, any>([
  [
    "1",
    {
      name: "E-commerce Order Processing",
      version: "2.1",
      description: "Complete automation for order processing, inventory updates, and customer notifications",
      workflows: [
        {
          id: "order-processing-main",
          name: "Order Processing Main Flow",
          nodes: [
            {
              id: "webhook-trigger",
              type: "n8n-nodes-base.webhook",
              typeVersion: 1,
              name: "Order Webhook",
              parameters: {
                path: "order-received",
                httpMethod: "POST",
              },
              position: [250, 300],
            },
            {
              id: "validate-order",
              type: "n8n-nodes-base.function",
              typeVersion: 1,
              name: "Validate Order Data",
              parameters: {
                functionCode: `
                // Validate required order fields
                const order = items[0].json;
                
                if (!order.customer_email || !order.items || !order.total) {
                  throw new Error('Missing required order fields');
                }
                
                return items.map(item => ({
                  json: {
                    ...item.json,
                    validated: true,
                    processing_date: new Date().toISOString()
                  }
                }));
              `,
              },
              position: [450, 300],
            },
            {
              id: "update-inventory",
              type: "n8n-nodes-base.httpRequest",
              typeVersion: 4,
              name: "Update Inventory",
              parameters: {
                url: "https://api.shopify.com/admin/api/2023-01/inventory_levels.json",
                method: "PUT",
                headers: {
                  "X-Shopify-Access-Token": "={{$env.SHOPIFY_ACCESS_TOKEN}}",
                },
              },
              position: [650, 200],
            },
            {
              id: "send-confirmation",
              type: "n8n-nodes-base.gmail",
              typeVersion: 2,
              name: "Send Order Confirmation",
              parameters: {
                operation: "send",
                subject: "Order Confirmation - {{$json.order_number}}",
                toList: "={{$json.customer_email}}",
                message:
                  "Thank you for your order! Your order #{{$json.order_number}} has been received and is being processed.",
              },
              position: [650, 400],
            },
          ],
          connections: {
            "webhook-trigger": {
              main: [
                [
                  {
                    node: "validate-order",
                    type: "main",
                    index: 0,
                  },
                ],
              ],
            },
            "validate-order": {
              main: [
                [
                  {
                    node: "update-inventory",
                    type: "main",
                    index: 0,
                  },
                  {
                    node: "send-confirmation",
                    type: "main",
                    index: 0,
                  },
                ],
              ],
            },
          },
        },
      ],
      credentials: [
        {
          name: "shopifyApi",
          type: "shopifyApi",
        },
        {
          name: "gmail",
          type: "gmailOAuth2",
        },
      ],
    },
  ],
  [
    "2",
    {
      name: "Social Media Content Pipeline",
      version: "1.8",
      description: "Automated content creation, scheduling, and performance tracking",
      workflows: [
        {
          id: "content-pipeline-main",
          name: "Social Media Content Pipeline",
          nodes: [
            {
              id: "schedule-trigger",
              type: "n8n-nodes-base.cron",
              typeVersion: 1,
              name: "Daily Content Schedule",
              parameters: {
                rule: {
                  hour: 9,
                  minute: 0,
                },
              },
              position: [250, 300],
            },
            {
              id: "generate-content",
              type: "n8n-nodes-base.openAi",
              typeVersion: 1,
              name: "Generate Content Ideas",
              parameters: {
                operation: "text",
                model: "gpt-4",
                prompt: "Generate 3 engaging social media post ideas for a tech company, including hashtags",
              },
              position: [450, 300],
            },
            {
              id: "post-twitter",
              type: "n8n-nodes-base.twitter",
              typeVersion: 2,
              name: "Post to Twitter",
              parameters: {
                operation: "tweet",
                text: "={{$json.content}}",
              },
              position: [650, 200],
            },
            {
              id: "post-linkedin",
              type: "n8n-nodes-base.linkedIn",
              typeVersion: 1,
              name: "Post to LinkedIn",
              parameters: {
                operation: "create",
                text: "={{$json.content}}",
              },
              position: [650, 400],
            },
          ],
          connections: {
            "schedule-trigger": {
              main: [
                [
                  {
                    node: "generate-content",
                    type: "main",
                    index: 0,
                  },
                ],
              ],
            },
            "generate-content": {
              main: [
                [
                  {
                    node: "post-twitter",
                    type: "main",
                    index: 0,
                  },
                  {
                    node: "post-linkedin",
                    type: "main",
                    index: 0,
                  },
                ],
              ],
            },
          },
        },
      ],
      credentials: [
        {
          name: "openAiApi",
          type: "openAiApi",
        },
        {
          name: "twitterOAuth2Api",
          type: "twitterOAuth2Api",
        },
        {
          name: "linkedInOAuth2Api",
          type: "linkedInOAuth2Api",
        },
      ],
    },
  ],
])

export async function GET(request: NextRequest, { params }: { params: Promise<{ purchaseId: string }> }) {
  try {
    const { purchaseId } = await params

    // Verify purchase exists and is valid
    const purchase = purchases.get(purchaseId)
    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 })
    }

    // Check if download limit exceeded
    if (purchase.downloadCount >= purchase.maxDownloads) {
      return NextResponse.json({ error: "Download limit exceeded" }, { status: 403 })
    }

    // Check if purchase has expired
    if (new Date() > purchase.expiresAt) {
      return NextResponse.json({ error: "Download link has expired" }, { status: 403 })
    }

    // Get workspace file
    const workspaceData = workspaceFiles.get(purchase.workspaceId)
    if (!workspaceData) {
      return NextResponse.json({ error: "Workspace file not found" }, { status: 404 })
    }

    // Increment download count
    purchase.downloadCount += 1
    purchases.set(purchaseId, purchase)

    // Create the n8n workflow JSON format
    const n8nWorkflow = {
      name: workspaceData.name,
      nodes: workspaceData.workflows[0].nodes,
      connections: workspaceData.workflows[0].connections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        executionOrder: "v1",
      },
      staticData: null,
      tags: [],
      triggerCount: 0,
      versionId: workspaceData.version,
    }

    // Return the JSON file for download
    const fileName = `${workspaceData.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-v${workspaceData.version}.json`

    return new NextResponse(JSON.stringify(n8nWorkflow, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Failed to process download" }, { status: 500 })
  }
}
