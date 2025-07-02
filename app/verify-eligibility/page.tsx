"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VerifyEligibilityPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isApproved, setIsApproved] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const data = localStorage.getItem("userData")
    if (data) {
      setUserData(JSON.parse(data))
    }

    // Simulate admin approval process
    const timer = setTimeout(() => {
      setIsLoading(false)
      setIsApproved(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleContinue = () => {
    if (userData) {
      const updatedData = { ...userData, eligibilityStatus: "approved" }
      localStorage.setItem("userData", JSON.stringify(updatedData))
    }
    router.push("/upload-documents")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 dark:from-blue-950 dark:to-red-950 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-lg font-medium">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isApproved && userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 dark:from-blue-950 dark:to-red-950 flex items-center justify-center py-8 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">Congratulations!</CardTitle>
            <CardDescription>
              {userData.firstName} {userData.lastName}
            </CardDescription>
            <p className="text-sm text-gray-600 dark:text-gray-400">Date of Birth: {userData.dateOfBirth}</p>
          </CardHeader>

          <CardContent className="text-center space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="font-semibold text-green-700 dark:text-green-400">Status: Eligible</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                <strong>NOTE:</strong> We need some additional information before you can add your payment method.
              </p>
            </div>

            <Button onClick={handleContinue} className="w-full era-bg-blue hover:bg-blue-700">
              OK - Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
