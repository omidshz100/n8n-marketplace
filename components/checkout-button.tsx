"use client"

import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutButtonProps {
  workspaceId: string
  price: number
  title: string
  className?: string
  size?: "default" | "sm" | "lg"
}

export function CheckoutButton({ workspaceId, price, title, className, size = "default" }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setIsLoading(true)

      // Create checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workspaceId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { sessionId } = await response.json()

      // Check if this is a mock session (for development)
      if (sessionId.startsWith('cs_test_mock_')) {
        // Mock checkout - redirect directly to success page
        window.location.href = `/success?session_id=${sessionId}&workspace_id=${workspaceId}`
        return
      }

      // Real Stripe checkout
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to load")
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (error) {
        console.error("Stripe checkout error:", error)
        throw error
      }
    } catch (error) {
      console.error("Checkout error:", error)
      // You might want to show a toast notification here
      alert("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading} className={className} size={size}>
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Buy for ${price}
        </>
      )}
    </Button>
  )
}
