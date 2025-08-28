"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UserDashboard } from "@/components/user-dashboard"
import { EmailLogin } from "@/components/email-login"

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Check if user email is stored in localStorage
    const storedEmail = localStorage.getItem("userEmail")
    if (storedEmail) {
      setUserEmail(storedEmail)
    }
  }, [])

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email)
    localStorage.setItem("userEmail", email)
  }

  const handleLogout = () => {
    setUserEmail(null)
    localStorage.removeItem("userEmail")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userEmail ? (
          <UserDashboard userEmail={userEmail} onLogout={handleLogout} />
        ) : (
          <EmailLogin onEmailSubmit={handleEmailSubmit} />
        )}
      </main>
      <Footer />
    </div>
  )
}
