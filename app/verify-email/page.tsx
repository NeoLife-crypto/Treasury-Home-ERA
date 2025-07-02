"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, RefreshCw } from "lucide-react"
import Image from "next/image"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isWaiting, setIsWaiting] = useState(true)
  const [resendTimer, setResendTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const [hasRequestedResend, setHasRequestedResend] = useState(false)

  useEffect(() => {
    const registrationData = localStorage.getItem("registrationData")
    if (registrationData) {
      const data = JSON.parse(registrationData)
      setEmail(data.email)

      // Check if admin has sent a verification code
      const checkForCode = setInterval(() => {
        const adminCode = localStorage.getItem(`verification_code_${data.email}`)
        if (adminCode) {
          setIsWaiting(false)
          setCanResend(true)
          clearInterval(checkForCode)
        }
      }, 2000)

      return () => clearInterval(checkForCode)
    } else {
      router.push("/signup")
    }
  }, [router])

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setError("")

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Check the admin-generated code
    const adminCode = localStorage.getItem(`verification_code_${email}`)

    if (verificationCode === adminCode) {
      const registrationData = localStorage.getItem("registrationData")
      if (registrationData) {
        const data = JSON.parse(registrationData)
        const verifiedUser = {
          ...data,
          isVerified: true,
          status: "pending_eligibility",
          verificationDate: new Date().toISOString(),
        }

        // Store as verified user
        localStorage.setItem("userData", JSON.stringify(verifiedUser))
        localStorage.setItem(`registration_${Date.now()}`, JSON.stringify(verifiedUser))

        // Clean up
        localStorage.removeItem(`verification_code_${email}`)
        localStorage.removeItem("registrationData")

        // Remove from pending verifications and resend requests
        const allKeys = Object.keys(localStorage)
        const pendingKeys = allKeys.filter((key) => key.startsWith("pending_verification_"))
        const resendKeys = allKeys.filter((key) => key.startsWith("resend_request_"))

        pendingKeys.forEach((key) => {
          const pendingData = JSON.parse(localStorage.getItem(key) || "{}")
          if (pendingData.email === email) {
            localStorage.removeItem(key)
          }
        })

        resendKeys.forEach((key) => {
          const resendData = JSON.parse(localStorage.getItem(key) || "{}")
          if (resendData.email === email) {
            localStorage.removeItem(key)
          }
        })
      }
      router.push("/welcome")
    } else {
      setError("Invalid verification code. Please check the code sent to your email.")
    }

    setIsVerifying(false)
  }

  const handleResendRequest = () => {
    if (!canResend || resendTimer > 0) return

    const registrationData = localStorage.getItem("registrationData")
    if (registrationData) {
      const data = JSON.parse(registrationData)

      // Create resend request for admin
      const resendRequest = {
        ...data,
        requestType: "resend_verification",
        requestedAt: new Date().toISOString(),
        userMessage: "User requested to resend verification code",
      }

      localStorage.setItem(`resend_request_${Date.now()}`, JSON.stringify(resendRequest))

      setHasRequestedResend(true)
      setCanResend(false)
      setResendTimer(60) // 60 second cooldown

      // Show success message
      setError("")
    }
  }

  if (isWaiting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 dark:from-blue-950 dark:to-red-950 flex items-center justify-center py-8 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/era-logo.jpeg"
                alt="Emergency Rental Assistance Program Logo"
                width={80}
                height={80}
                className="rounded-lg"
              />
            </div>
            <CardTitle className="text-2xl era-gradient bg-clip-text text-transparent">
              Processing Registration
            </CardTitle>
            <CardDescription>Your registration has been submitted successfully to {email}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex justify-center">
              <Clock className="h-12 w-12 text-blue-600 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Verification Code Pending</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Our admin team is reviewing your registration and will send a verification code to your email shortly.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                <strong>Next Steps:</strong>
                <br />
                1. Check your email for the verification code
                <br />
                2. Return to this page to enter the code
                <br />
                3. Complete your registration process
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 dark:from-blue-950 dark:to-red-950 flex items-center justify-center py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/era-logo.jpeg"
              alt="Emergency Rental Assistance Program Logo"
              width={80}
              height={80}
              className="rounded-lg"
            />
          </div>
          <CardTitle className="text-2xl era-gradient bg-clip-text text-transparent">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification code to {email}. Please enter the code below to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerification} className="space-y-4">
            <div>
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {hasRequestedResend && resendTimer === 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <p className="text-sm text-green-600 dark:text-green-400">
                  Resend request sent to admin. You'll receive a new code shortly.
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full era-bg-blue hover:bg-blue-700"
              disabled={isVerifying || verificationCode.length !== 6}
            >
              {isVerifying ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">Didn't receive the code? Check your spam folder.</p>

            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendRequest}
                disabled={!canResend || resendTimer > 0}
                className="w-full"
              >
                {resendTimer > 0 ? (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Resend in {resendTimer}s
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Request New Code
                  </>
                )}
              </Button>
            </div>

            {hasRequestedResend && resendTimer > 0 && (
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Resend request submitted. Admin will send a new code shortly.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
