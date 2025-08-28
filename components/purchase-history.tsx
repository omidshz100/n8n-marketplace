"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Download, DollarSign, Eye } from "lucide-react"
import Link from "next/link"

interface Purchase {
  id: string
  workspaceId: string
  workspaceTitle: string
  amount: number
  purchaseDate: string
  downloadCount: number
  maxDownloads: number
  status: "completed" | "pending" | "refunded"
}

interface PurchaseHistoryProps {
  customerEmail: string
}

// Sample data - in a real app, this would come from your API
const samplePurchases: Purchase[] = [
  {
    id: "purchase_1",
    workspaceId: "1",
    workspaceTitle: "E-commerce Order Processing",
    amount: 49,
    purchaseDate: "2024-01-15T10:00:00Z",
    downloadCount: 3,
    maxDownloads: 5,
    status: "completed",
  },
  {
    id: "purchase_2",
    workspaceId: "2",
    workspaceTitle: "Social Media Content Pipeline",
    amount: 39,
    purchaseDate: "2024-01-10T14:30:00Z",
    downloadCount: 2,
    maxDownloads: 5,
    status: "completed",
  },
  {
    id: "purchase_3",
    workspaceId: "3",
    workspaceTitle: "Lead Generation & CRM Sync",
    amount: 59,
    purchaseDate: "2024-01-05T09:15:00Z",
    downloadCount: 5,
    maxDownloads: 5,
    status: "completed",
  },
]

export function PurchaseHistory({ customerEmail }: PurchaseHistoryProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPurchaseHistory()
  }, [customerEmail])

  const fetchPurchaseHistory = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setPurchases(samplePurchases)
    } catch (error) {
      console.error("Error fetching purchase history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: Purchase["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "refunded":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading purchase history...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{purchases.length}</p>
              <p className="text-sm text-muted-foreground">Total Purchases</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">${totalSpent}</p>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{purchases.reduce((sum, p) => sum + p.downloadCount, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Downloads</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase List */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No purchases found. Browse our workspace collection to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="border border-border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{purchase.workspaceTitle}</h3>
                        <Badge className={getStatusColor(purchase.status)} variant="secondary">
                          {purchase.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>${purchase.amount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          <span>
                            {purchase.downloadCount}/{purchase.maxDownloads} downloads
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/workspace/${purchase.workspaceId}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      {purchase.status === "completed" && (
                        <Button size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
