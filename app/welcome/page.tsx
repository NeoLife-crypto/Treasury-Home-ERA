"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, Info, Phone, Eye, Target, Menu, User, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export default function WelcomePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const currentUser = localStorage.getItem("currentUser")

    if (isLoggedIn && currentUser) {
      setUserData(JSON.parse(currentUser))
    } else {
      // Check for userData from registration flow
      const data = localStorage.getItem("userData")
      if (data) {
        setUserData(JSON.parse(data))
      } else {
        router.push("/login")
      }
    }
  }, [router])

  // Check for document approval and redirect
  useEffect(() => {
    if (userData) {
      const checkApprovalStatus = () => {
        const approvalNotification = localStorage.getItem(`approval_notification_${userData.email}`)
        if (approvalNotification) {
          // Remove the notification
          localStorage.removeItem(`approval_notification_${userData.email}`)
          // Redirect to approval page
          router.push("/documents-approved")
        }
      }

      // Check immediately
      checkApprovalStatus()

      // Set up polling to check for approval
      const interval = setInterval(checkApprovalStatus, 3000)

      return () => clearInterval(interval)
    }
  }, [userData, router])

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
              <Link href="/profile-settings">
                <Button variant="ghost" className="w-full justify-start">
                  Profile Settings
                </Button>
              </Link>
              <Link href="/general-settings">
                <Button variant="ghost" className="w-full justify-start">
                  General Settings
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
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl era-gradient bg-clip-text text-transparent">
              Welcome to Treasury ERA!
            </CardTitle>
            <CardDescription className="text-lg">
              Hello {userData.firstName} {userData.lastName}
            </CardDescription>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Registration Number: {userData.registrationNumber}
            </p>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <Link href="/">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2 bg-transparent">
                  <Home className="h-6 w-6" />
                  <span>Home</span>
                </Button>
              </Link>

              <Link href="/about">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2 bg-transparent">
                  <Info className="h-6 w-6" />
                  <span>About Us</span>
                </Button>
              </Link>

              <Link href="/contact">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2 bg-transparent">
                  <Phone className="h-6 w-6" />
                  <span>Contact</span>
                </Button>
              </Link>

              <Link href="/vision">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2 bg-transparent">
                  <Eye className="h-6 w-6" />
                  <span>Our Vision</span>
                </Button>
              </Link>

              <Link href="/mission">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2 bg-transparent">
                  <Target className="h-6 w-6" />
                  <span>Our Mission</span>
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <p className="text-lg mb-6">Before you can apply for assistance, please verify your eligibility.</p>
              <Link href="/verify-eligibility">
                <Button size="lg" className="era-bg-blue hover:bg-blue-700">
                  Verify Account Eligibility
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
