"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DownloadManager } from "@/components/download-manager"
import { PurchaseHistory } from "@/components/purchase-history"
import { AccountSettings } from "@/components/account-settings"
import { User, Download, History, Settings, LogOut, ShoppingBag } from "lucide-react"

interface UserDashboardProps {
  userEmail: string
  onLogout: () => void
}

interface DashboardStats {
  totalPurchases: number
  totalDownloads: number
  activeWorkspaces: number
}

export function UserDashboard({ userEmail, onLogout }: UserDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalPurchases: 0,
    totalDownloads: 0,
    activeWorkspaces: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [userEmail])

  const fetchDashboardStats = async () => {
    try {
      // Simulate fetching dashboard stats
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStats({
        totalPurchases: 3,
        totalDownloads: 8,
        activeWorkspaces: 3,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {userEmail}</p>
        </div>
        <Button variant="outline" onClick={onLogout} className="gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{isLoading ? "..." : stats.totalPurchases}</p>
                <p className="text-sm text-muted-foreground">Total Purchases</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{isLoading ? "..." : stats.totalDownloads}</p>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{isLoading ? "..." : stats.activeWorkspaces}</p>
                <p className="text-sm text-muted-foreground">Active Workspaces</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="downloads" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="downloads" className="gap-2">
            <Download className="h-4 w-4" />
            Downloads
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Purchase History
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="downloads" className="space-y-4">
          <DownloadManager customerEmail={userEmail} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <PurchaseHistory customerEmail={userEmail} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <AccountSettings userEmail={userEmail} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
