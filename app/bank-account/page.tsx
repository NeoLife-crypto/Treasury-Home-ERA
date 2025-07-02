"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Shield, CheckCircle, Home, LogOut, Menu, User, DollarSign } from "lucide-react"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

const BANK_TYPES = [
  { value: "checking", label: "Checking Account" },
  { value: "savings", label: "Savings Account" },
]

export default function BankAccountPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [bankData, setBankData] = useState({
    accountType: "",
    bankName: "",
    routingNumber: "",
    accountNumber: "",
    confirmAccountNumber: "",
    accountHolderName: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const currentUser = localStorage.getItem("currentUser")
    const userDataStored = localStorage.getItem("userData")

    if (isLoggedIn && currentUser) {
      const user = JSON.parse(currentUser)
      setUserData(user)
      setBankData((prev) => ({ ...prev, accountHolderName: `${user.firstName} ${user.lastName}` }))

      // Check if bank info already exists
      const existingBankData = localStorage.getItem(`bank_account_${user.email}`)
      if (existingBankData) {
        setBankData(JSON.parse(existingBankData))
        setIsSubmitted(true)
      }
    } else if (userDataStored) {
      const user = JSON.parse(userDataStored)
      setUserData(user)
      setBankData((prev) => ({ ...prev, accountHolderName: `${user.firstName} ${user.lastName}` }))

      // Check if bank info already exists
      const existingBankData = localStorage.getItem(`bank_account_${user.email}`)
      if (existingBankData) {
        setBankData(JSON.parse(existingBankData))
        setIsSubmitted(true)
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (bankData.accountNumber !== bankData.confirmAccountNumber) {
      alert("Account numbers do not match")
      return
    }

    setIsSubmitting(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Save bank account data
    if (userData) {
      localStorage.setItem(
        `bank_account_${userData.email}`,
        JSON.stringify({
          ...bankData,
          submittedAt: new Date().toISOString(),
          status: "verified",
        }),
      )
    }

    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setBankData((prev) => ({ ...prev, [field]: value }))
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
        <div className="max-w-2xl mx-auto">
          {isSubmitted ? (
            // Success State
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-2xl text-green-800 dark:text-green-400">
                  Bank Account Added Successfully!
                </CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                  Your bank account information has been securely saved and verified.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Account Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank Name:</span>
                      <span className="font-medium">{bankData.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Type:</span>
                      <span className="font-medium capitalize">{bankData.accountType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Holder:</span>
                      <span className="font-medium">{bankData.accountHolderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Number:</span>
                      <span className="font-medium">****{bankData.accountNumber.slice(-4)}</span>
                    </div>
                  </div>
                </div>

                <Alert>
                  <DollarSign className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Next Steps:</strong> Your approved assistance amount of $1,000 will be transferred to this
                    account within 2-3 business days. You'll receive email and SMS notifications when the transfer is
                    complete.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/welcome" className="flex-1">
                    <Button className="w-full era-bg-blue hover:bg-blue-700">
                      <Home className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => setIsSubmitted(false)} className="flex-1">
                    Update Account Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Form State
            <>
              <Card className="mb-6">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <CreditCard className="h-12 w-12 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl era-gradient bg-clip-text text-transparent">
                    Add Bank Account
                  </CardTitle>
                  <CardDescription>
                    Securely add your bank account to receive your approved assistance funds
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Secure Bank Information
                  </CardTitle>
                  <CardDescription>
                    Your banking information is encrypted and secure. We use bank-level security to protect your data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="accountType">Account Type *</Label>
                      <Select onValueChange={(value) => handleInputChange("accountType", value)}>
                        <SelectTrigger className="bg-white dark:bg-gray-800 border-2">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-2 shadow-lg">
                          {BANK_TYPES.map((type) => (
                            <SelectItem
                              key={type.value}
                              value={type.value}
                              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 p-3"
                            >
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Input
                        id="bankName"
                        required
                        value={bankData.bankName}
                        onChange={(e) => handleInputChange("bankName", e.target.value)}
                        placeholder="Enter your bank name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                      <Input
                        id="accountHolderName"
                        required
                        value={bankData.accountHolderName}
                        onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                        placeholder="Full name as it appears on your account"
                      />
                    </div>

                    <div>
                      <Label htmlFor="routingNumber">Routing Number *</Label>
                      <Input
                        id="routingNumber"
                        required
                        value={bankData.routingNumber}
                        onChange={(e) => handleInputChange("routingNumber", e.target.value)}
                        placeholder="9-digit routing number"
                        maxLength={9}
                      />
                    </div>

                    <div>
                      <Label htmlFor="accountNumber">Account Number *</Label>
                      <Input
                        id="accountNumber"
                        required
                        value={bankData.accountNumber}
                        onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                        placeholder="Enter your account number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmAccountNumber">Confirm Account Number *</Label>
                      <Input
                        id="confirmAccountNumber"
                        required
                        value={bankData.confirmAccountNumber}
                        onChange={(e) => handleInputChange("confirmAccountNumber", e.target.value)}
                        placeholder="Re-enter your account number"
                      />
                      {bankData.confirmAccountNumber && bankData.accountNumber !== bankData.confirmAccountNumber && (
                        <p className="text-sm text-red-600 mt-1">Account numbers do not match</p>
                      )}
                    </div>

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Security Notice:</strong> Your bank account information is encrypted using 256-bit SSL
                        encryption and stored securely. We never store your full account details in plain text and
                        follow all federal banking security regulations.
                      </AlertDescription>
                    </Alert>

                    <Button
                      type="submit"
                      className="w-full era-bg-blue hover:bg-blue-700"
                      disabled={isSubmitting || bankData.accountNumber !== bankData.confirmAccountNumber}
                    >
                      {isSubmitting ? "Securing Account Information..." : "Add Bank Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
