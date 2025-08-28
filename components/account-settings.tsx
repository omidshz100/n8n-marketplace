"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { User, Bell, Shield, Download, Trash2 } from "lucide-react"

interface AccountSettingsProps {
  userEmail: string
}

export function AccountSettings({ userEmail }: AccountSettingsProps) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    downloadNotifications: true,
    marketingEmails: false,
    autoDownload: false,
  })

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleExportData = () => {
    // Simulate data export
    const data = {
      email: userEmail,
      purchases: [],
      settings: settings,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `account-data-${userEmail.replace("@", "-")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This will remove all your purchase history and cannot be undone.",
      )
    ) {
      // Handle account deletion
      alert("Account deletion requested. You will receive a confirmation email.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={userEmail} disabled />
            <p className="text-sm text-muted-foreground">
              Your email address is used for purchase confirmations and download links.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications about your purchases and downloads</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={() => handleSettingChange("emailNotifications")}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Download Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified when your downloads are ready</p>
            </div>
            <Switch
              checked={settings.downloadNotifications}
              onCheckedChange={() => handleSettingChange("downloadNotifications")}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">Receive updates about new workspaces and promotions</p>
            </div>
            <Switch checked={settings.marketingEmails} onCheckedChange={() => handleSettingChange("marketingEmails")} />
          </div>
        </CardContent>
      </Card>

      {/* Download Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-download after purchase</Label>
              <p className="text-sm text-muted-foreground">Automatically start download when purchase is completed</p>
            </div>
            <Switch checked={settings.autoDownload} onCheckedChange={() => handleSettingChange("autoDownload")} />
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Export Your Data</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Download a copy of all your account data, including purchase history and settings.
              </p>
              <Button variant="outline" onClick={handleExportData} className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2 text-destructive">Delete Account</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="destructive" onClick={handleDeleteAccount} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
