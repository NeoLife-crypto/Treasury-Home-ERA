"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Home,
  LogOut,
  Menu,
  Shield,
  FileText,
  CreditCard,
} from "lucide-react"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<any>({})
  const [profileImage, setProfileImage] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const currentUser = localStorage.getItem("currentUser")
    const userDataStored = localStorage.getItem("userData")

    if (isLoggedIn && currentUser) {
      const user = JSON.parse(currentUser)
      setUserData(user)
      setEditedData(user)

      // Load profile image if exists
      const savedImage = localStorage.getItem(`profile_image_${user.email}`)
      if (savedImage) {
        setProfileImage(savedImage)
      }
    } else if (userDataStored) {
      const user = JSON.parse(userDataStored)
      setUserData(user)
      setEditedData(user)

      // Load profile image if exists
      const savedImage = localStorage.getItem(`profile_image_${user.email}`)
      if (savedImage) {
        setProfileImage(savedImage)
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB")
      return
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG and PNG images are allowed")
      return
    }

    setIsUploading(true)

    // Convert to base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      setProfileImage(imageData)

      // Save to localStorage
      if (userData) {
        localStorage.setItem(`profile_image_${userData.email}`, imageData)
      }

      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!userData) return

    // Update user data
    const updatedUser = { ...userData, ...editedData }

    // Save to localStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    localStorage.setItem("userData", JSON.stringify(updatedUser))

    // Update registration data if exists
    const allKeys = Object.keys(localStorage)
    const registrationKeys = allKeys.filter((key) => key.startsWith("registration_"))

    registrationKeys.forEach((key) => {
      const regData = JSON.parse(localStorage.getItem(key) || "{}")
      if (regData.email === userData.email) {
        localStorage.setItem(key, JSON.stringify({ ...regData, ...editedData }))
      }
    })

    setUserData(updatedUser)
    setIsEditing(false)
    alert("Profile updated successfully!")
  }

  const handleCancel = () => {
    setEditedData(userData)
    setIsEditing(false)
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase()
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
            <Link href="/welcome">
              <Button variant="ghost" className="flex flex-col items-center p-2">
                <Home className="h-6 w-6" />
                <span className="text-xs">Dashboard</span>
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
              <Link href="/upload-documents">
                <Button variant="ghost" className="w-full justify-start">
                  Documents
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profile" />
                      <AvatarFallback className="text-lg">
                        {getInitials(userData.firstName, userData.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2">
                      <label htmlFor="profile-image" className="cursor-pointer">
                        <div className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 text-white">
                          <Camera className="h-4 w-4" />
                        </div>
                      </label>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold era-gradient bg-clip-text text-transparent">
                      {userData.firstName} {userData.lastName}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">{userData.registrationNumber}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className="bg-green-600">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                      {userData.documentsSubmitted && (
                        <Badge variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          Documents Submitted
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} size="sm" className="era-bg-blue hover:bg-blue-700">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} size="sm" variant="outline">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your basic personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={editedData.firstName || ""}
                        onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{userData.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editedData.lastName || ""}
                        onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{userData.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="middleName">Middle Name</Label>
                  {isEditing ? (
                    <Input
                      id="middleName"
                      value={editedData.middleName || ""}
                      onChange={(e) => setEditedData({ ...editedData, middleName: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-medium mt-1">{userData.middleName || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={editedData.dateOfBirth || ""}
                      onChange={(e) => setEditedData({ ...editedData, dateOfBirth: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-medium mt-1">
                      {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  {isEditing ? (
                    <Input
                      id="gender"
                      value={editedData.gender || ""}
                      onChange={(e) => setEditedData({ ...editedData, gender: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-medium mt-1 capitalize">{userData.gender || "Not provided"}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="relationshipStatus">Relationship Status</Label>
                    {isEditing ? (
                      <Input
                        id="relationshipStatus"
                        value={editedData.relationshipStatus || ""}
                        onChange={(e) => setEditedData({ ...editedData, relationshipStatus: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1 capitalize">
                        {userData.relationshipStatus || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="numberOfChildren">Number of Children</Label>
                    {isEditing ? (
                      <Input
                        id="numberOfChildren"
                        type="number"
                        value={editedData.numberOfChildren || ""}
                        onChange={(e) => setEditedData({ ...editedData, numberOfChildren: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{userData.numberOfChildren || "0"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
                <CardDescription>How we can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedData.email || ""}
                      onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-medium mt-1">{userData.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={editedData.phoneNumber || ""}
                      onChange={(e) => setEditedData({ ...editedData, phoneNumber: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-medium mt-1">{userData.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="homeAddress">Home Address</Label>
                  {isEditing ? (
                    <Textarea
                      id="homeAddress"
                      value={editedData.homeAddress || ""}
                      onChange={(e) => setEditedData({ ...editedData, homeAddress: e.target.value })}
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm font-medium mt-1">{userData.homeAddress}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    {isEditing ? (
                      <Input
                        id="city"
                        value={editedData.city || ""}
                        onChange={(e) => setEditedData({ ...editedData, city: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{userData.city}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    {isEditing ? (
                      <Input
                        id="state"
                        value={editedData.state || ""}
                        onChange={(e) => setEditedData({ ...editedData, state: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{userData.state}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  {isEditing ? (
                    <Input
                      id="zipCode"
                      value={editedData.zipCode || ""}
                      onChange={(e) => setEditedData({ ...editedData, zipCode: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-medium mt-1">{userData.zipCode}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Account Status
              </CardTitle>
              <CardDescription>Your current account and application status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-3 w-fit mx-auto mb-2">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium">Account Status</h3>
                  <p className="text-sm text-green-600">Verified & Active</p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-3 w-fit mx-auto mb-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium">Documents</h3>
                  <p className="text-sm text-blue-600">{userData.documentsSubmitted ? "Submitted" : "Pending"}</p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full p-3 w-fit mx-auto mb-2">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium">Member Since</h3>
                  <p className="text-sm text-purple-600">
                    {userData.registrationDate ? new Date(userData.registrationDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and navigation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/upload-documents">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2 bg-transparent">
                    <FileText className="h-6 w-6" />
                    <span>Upload Documents</span>
                  </Button>
                </Link>

                <Link href="/bank-account">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2 bg-transparent">
                    <CreditCard className="h-6 w-6" />
                    <span>Bank Account</span>
                  </Button>
                </Link>

                <Link href="/welcome">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2 bg-transparent">
                    <Home className="h-6 w-6" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
