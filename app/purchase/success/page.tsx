"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, ArrowLeft, Mail, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface SuccessPageProps {
  searchParams: {
    session_id?: string
    workspace_id?: string
  }
}

interface PurchaseData {
  purchaseId: string
  downloadUrl: string
  expiresAt: string
  maxDownloads: number
}

export default function PurchaseSuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id, workspace_id } = searchParams
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session_id && workspace_id) {
      // In a real app, you would verify the session and get purchase data
      // For now, we'll simulate the purchase data
      setTimeout(() => {
        setPurchaseData({
          purchaseId: "purchase_" + Math.random().toString(36).substr(2, 9),
          downloadUrl: `/api/download/purchase_${Math.random().toString(36).substr(2, 9)}`,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          maxDownloads: 5,
        })
        setIsLoading(false)
      }, 1000)
    } else {
      setError("Invalid purchase session")
      setIsLoading(false)
    }
  }, [session_id, workspace_id])

  const handleDownload = async () => {
    if (!purchaseData) return

    try {
      const response = await fetch(purchaseData.downloadUrl)
      if (!response.ok) {
        throw new Error("Download failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `n8n-workspace-${workspace_id}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download error:", error)
      alert("Download failed. Please try again or contact support.")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Processing your purchase...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Purchase Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Purchase Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Thank you for your purchase! Your n8n workspace is ready for download.
          </p>

          <div className="space-y-3">
            <Button onClick={handleDownload} className="w-full gap-2" size="lg">
              <Download className="h-4 w-4" />
              Download Workspace JSON
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-3 w-3" />
                <span>Download link also sent to your email</span>
              </div>
              <div>
                <span>Downloads remaining: {purchaseData?.maxDownloads}</span>
              </div>
              <div>
                <span>Expires: {purchaseData ? new Date(purchaseData.expiresAt).toLocaleDateString() : "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Need help importing your workspace?</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                View Setup Guide
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Contact Support
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <Button variant="ghost" asChild>
              <Link href="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Workspaces
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
