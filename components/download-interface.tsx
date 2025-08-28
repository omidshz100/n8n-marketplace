"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface PurchaseData {
  sessionId: string
  workspaceId: string
  customerEmail: string
  amount: number
  currency: string
  purchaseDate: string
  status: string
  workspace?: {
    title: string
    description: string
    category: string
    version: string
    includes: string[]
  }
}

interface DownloadInterfaceProps {
  sessionId: string
  workspaceId?: string
}

export function DownloadInterface({ sessionId, workspaceId }: DownloadInterfaceProps) {
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchPurchaseData()
  }, [sessionId])

  const fetchPurchaseData = async () => {
    try {
      const url = workspaceId 
        ? `/api/purchase/${sessionId}?workspace_id=${workspaceId}`
        : `/api/purchase/${sessionId}`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Purchase not found")
      }
      const data = await response.json()
      setPurchaseData(data)
    } catch (err) {
      setError("Unable to verify purchase. Please contact support.")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!purchaseData) return

    setDownloading(true)
    try {
      const response = await fetch(`/api/download/workspace/${purchaseData.workspaceId}?session_id=${sessionId}`)
      if (!response.ok) {
        throw new Error("Download failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${purchaseData.workspace?.title?.replace(/[^a-zA-Z0-9]/g, "-") || "workspace"}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError("Download failed. Please try again or contact support.")
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Verifying purchase...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Download Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!purchaseData) {
    return null
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <CardTitle>Download Ready</CardTitle>
          </div>
          <p className="text-muted-foreground">Your purchase has been verified. Download your n8n workspace below.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {purchaseData.workspace && (
            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{purchaseData.workspace.title}</h3>
                  <p className="text-sm text-muted-foreground">{purchaseData.workspace.description}</p>
                </div>
                <Badge variant="secondary">{purchaseData.workspace.category}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-muted-foreground">Version:</span>
                  <span className="ml-2 font-mono">{purchaseData.workspace.version}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Purchase Date:</span>
                  <span className="ml-2">{new Date(purchaseData.purchaseDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Package Includes:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {purchaseData.workspace.includes.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">How to Import:</h4>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. Open your n8n instance</li>
              <li>2. Go to Workflows → Import from File</li>
              <li>3. Select the downloaded JSON file</li>
              <li>4. Configure your credentials and connections</li>
              <li>5. Activate the workflow</li>
            </ol>
          </div>

          <Button onClick={handleDownload} disabled={downloading} size="lg" className="w-full gap-2">
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {downloading ? "Preparing Download..." : "Download n8n Workspace JSON"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Need help?{" "}
              <a href="#contact" className="text-primary hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
