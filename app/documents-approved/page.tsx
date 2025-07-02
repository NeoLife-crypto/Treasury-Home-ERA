"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, DollarSign, Home, LogOut, Menu, User, FileText, CreditCard } from "lucide-react"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DocumentsApprovedPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [approvalAmount] = useState(1000) // All users approved for $1000

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const currentUser = localStorage.getItem("currentUser")
    const userDataStored = localStorage.getItem("userData")

    if (isLoggedIn && currentUser) {
      const user = JSON.parse(currentUser)
      setUserData(user)
    } else if (userDataStored) {
      const user = JSON.parse(userDataStored)
      setUserData(user)
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 dark:from-blue-950 dark:to-red-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 dark:from-blue-950 dark:to-red-950">
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setShowMenu(!showMenu)} className="relative">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center space-x-3">
              <Image
                src="/images/era-logo.jpeg"
                alt="Emergency Rental Assistance Program Logo"
                width={40}
                height={40}
                className="rounded"
              />
              <h1 className="text-xl font-bold era-blue">Treasury ERA</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/profile">
              <Button variant="ghost" className="flex flex-col items-center p-2">
                <User className="h-6 w-6" />
                <span className="text-xs">Profile</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="absolute top-16 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-4 z-50">
            <div className="space-y-2">
              <Link href="/welcome">
                <Button variant="ghost" className="w-full justify-start">
                  Dashboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" className="w-full justify-start">
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <CheckCircle className="h-24 w-24 text-green-500" />
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold era-gradient bg-clip-text text-transparent mb-4">Congratulations!</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your documents have been approved and your assistance has been processed.
          </p>
        </div>

        {/* Approval Details */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Approval Card */}
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-800 dark:text-green-400">
                Emergency Rental Assistance Approved
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                Your application has been successfully processed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-green-600 mb-2">${approvalAmount.toLocaleString()}</div>
                <p className="text-lg text-green-700 dark:text-green-300">Approved Assistance Amount</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-green-800 dark:text-green-400">Beneficiary Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Full Name:</span>
                      <span className="font-medium">
                        {userData.firstName} {userData.middleName} {userData.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Registration Number:</span>
                      <span className="font-medium">{userData.registrationNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>
                      <span className="font-medium">{userData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                      <span className="font-medium">{userData.phoneNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-green-800 dark:text-green-400">Approval Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Approval Date:</span>
                      <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <Badge className="bg-green-600">Approved</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Assistance Type:</span>
                      <span className="font-medium">Emergency Rental Assistance</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Processing Time:</span>
                      <span className="font-medium">2-3 Business Days</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Next Steps
              </CardTitle>
              <CardDescription>What happens next with your approved assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-2 mt-1">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Bank Account Setup</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add your bank account information to receive the assistance funds directly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-2 mt-1">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Fund Processing</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your approved amount will be processed and transferred within 2-3 business days.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-2 mt-1">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Confirmation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You'll receive email and SMS notifications once the transfer is complete.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bank-account">
              <Button size="lg" className="era-bg-blue hover:bg-blue-700 w-full sm:w-auto">
                <CreditCard className="h-5 w-5 mr-2" />
                Add Bank Account
              </Button>
            </Link>
            <Link href="/welcome">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                <Home className="h-5 w-5 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          </div>

          {/* Important Notice */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Important Notice</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  This assistance is provided by the U.S. Treasury Emergency Rental Assistance Program. Funds are
                  intended for rental assistance and related housing expenses. Please ensure your bank account
                  information is accurate to avoid processing delays.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
