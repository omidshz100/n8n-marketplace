"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"

interface Purchase {
  id: string
  workspaceId: string
  purchaseDate: string
  downloadCount: number
  maxDownloads: number
  expiresAt: string
  downloadUrl: string
}

interface DownloadManagerProps {
  customerEmail: string
}

export function DownloadManager({ customerEmail }: DownloadManagerProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPurchases()
  }, [customerEmail])

  const fetchPurchases = async () => {
    try {
      const response = await fetch(`/api/purchases?email=${encodeURIComponent(customerEmail)}`)
      if (response.ok) {
        const data = await response.json()
        setPurchases(data.purchases)
      }
    } catch (error) {
      console.error("Error fetching purchases:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (purchase: Purchase) => {
    try {
      const response = await fetch(purchase.downloadUrl)
      if (!response.ok) {
        throw new Error("Download failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `n8n-workspace-${purchase.workspaceId}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      // Refresh purchases to update download count
      fetchPurchases()
    } catch (error) {
      console.error("Download error:", error)
      alert("Download failed. Please try again or contact support.")
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your purchases...</p>
        </CardContent>
      </Card>
    )
  }

  if (purchases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No purchases found. Browse our workspace collection to get started!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Downloads</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {purchases.map((purchase) => {
          const isExpired = new Date() > new Date(purchase.expiresAt)
          const downloadsRemaining = purchase.maxDownloads - purchase.downloadCount

          return (
            <div key={purchase.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium">Workspace #{purchase.workspaceId}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>Purchased {new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isExpired && (
                    <Badge variant="destructive" className="text-xs">
                      Expired
                    </Badge>
                  )}
                  {downloadsRemaining === 0 && !isExpired && (
                    <Badge variant="secondary" className="text-xs">
                      No downloads left
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <div>
                    Downloads: {purchase.downloadCount}/{purchase.maxDownloads}
                  </div>
                  <div>Expires: {new Date(purchase.expiresAt).toLocaleDateString()}</div>
                </div>

                <Button
                  onClick={() => handleDownload(purchase)}
                  disabled={isExpired || downloadsRemaining === 0}
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>

              {(isExpired || downloadsRemaining === 0) && (
                <div className="flex items-center gap-2 mt-3 p-2 bg-muted rounded text-sm">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {isExpired ? "This download has expired." : "Download limit reached."}
                    Contact support if you need assistance.
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
