"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setError("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Check admin credentials
    if (formData.email === "treasuryemergencyrentalprogram@gmail.com" && formData.password === "Neo4Cent47") {
      localStorage.setItem("isAdminLoggedIn", "true")
      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          email: formData.email,
          role: "admin",
          loginTime: new Date().toISOString(),
        }),
      )
      router.push("/admin/dashboard")
    } else {
      setError("Invalid admin credentials. Please check your email and password.")
    }

    setIsLoggingIn(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-blue-900 py-8 px-4">
      <div className="container mx-auto max-w-md">
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Image
                  src="/images/era-logo.jpeg"
                  alt="Emergency Rental Assistance Program Logo"
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <Shield className="absolute -bottom-2 -right-2 h-8 w-8 bg-red-600 text-white rounded-full p-1" />
              </div>
            </div>
            <CardTitle className="text-2xl text-red-600">Admin Portal</CardTitle>
            <CardDescription>Treasury ERA Administrative Access</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Admin Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter admin email"
                />
              </div>

              <div>
                <Label htmlFor="password">Admin Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter admin password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoggingIn}>
                {isLoggingIn ? "Signing In..." : "Access Admin Panel"}
              </Button>
            </form>

            {/* Admin Credentials Display */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-800 border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Admin Credentials:</h4>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>
                  <strong>Email:</strong> treasuryemergencyrentalprogram@gmail.com
                </p>
                <p>
                  <strong>Password:</strong> Neo4Cent47
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
