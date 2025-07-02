"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  UserCheck,
  Calendar,
  LogOut,
  Shield,
  Mail,
  Phone,
  MapPin,
  Send,
  Bell,
  Clock,
  RefreshCw,
  Lock,
  Ban,
  UserX,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Settings,
  Activity,
  Download,
  Eye,
  User,
} from "lucide-react"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([])
  const [resendRequests, setResendRequests] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    resendRequests: 0,
    verifiedUsers: 0,
    todayVisitors: 0,
    weeklyVisitors: 0,
    monthlyVisitors: 0,
    yearlyVisitors: 0,
  })
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationMessage, setVerificationMessage] = useState("")
  const [userDocuments, setUserDocuments] = useState<any[]>([])
  const [selectedUserForAction, setSelectedUserForAction] = useState<any>(null)
  const [actionType, setActionType] = useState("")
  const [actionReason, setActionReason] = useState("")
  const [showActionDialog, setShowActionDialog] = useState(false)
  const [activityLogs, setActivityLogs] = useState<any[]>([])
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [showDocumentDialog, setShowDocumentDialog] = useState(false)
  const [documentQueue, setDocumentQueue] = useState<any[]>([])
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [documentToReject, setDocumentToReject] = useState<any>(null)

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }

    // Load real registration data from localStorage
    loadRegistrationData()

    // Set up polling for new registrations
    const interval = setInterval(loadRegistrationData, 2000)

    setIsLoading(false)

    return () => clearInterval(interval)
  }, [router])

  const loadRegistrationData = () => {
    // Get all registration data from localStorage
    const allKeys = Object.keys(localStorage)
    const registrationKeys = allKeys.filter((key) => key.startsWith("registration_"))
    const verificationKeys = allKeys.filter((key) => key.startsWith("pending_verification_"))
    const resendKeys = allKeys.filter((key) => key.startsWith("resend_request_"))
    const documentKeys = allKeys.filter((key) => key.startsWith("documents_"))
    const activityKeys = allKeys.filter((key) => key.startsWith("activity_log"))

    const registrationData = registrationKeys.map((key) => {
      const data = JSON.parse(localStorage.getItem(key) || "{}")
      return { ...data, storageKey: key }
    })

    const pendingData = verificationKeys.map((key) => {
      const data = JSON.parse(localStorage.getItem(key) || "{}")
      return { ...data, storageKey: key }
    })

    const resendData = resendKeys.map((key) => {
      const data = JSON.parse(localStorage.getItem(key) || "{}")
      return { ...data, storageKey: key }
    })

    const documentData = documentKeys.map((key) => {
      const data = JSON.parse(localStorage.getItem(key) || "[]")
      const email = key.replace("documents_", "")
      return { email, documents: data }
    })

    // Load admin document queue
    const adminQueue = JSON.parse(localStorage.getItem("admin_document_queue") || "[]")
    setDocumentQueue(adminQueue)

    const activityData = activityKeys
      .flatMap((key) => {
        const data = JSON.parse(localStorage.getItem(key) || "[]")
        return data
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    setRegistrations(registrationData)
    setPendingVerifications(pendingData)
    setResendRequests(resendData)
    setUserDocuments(documentData)
    setActivityLogs(activityData.slice(0, 50)) // Keep last 50 activities

    setStats({
      totalUsers: registrationData.length,
      pendingVerifications: pendingData.length,
      resendRequests: resendData.length,
      verifiedUsers: registrationData.filter((u) => u.isVerified).length,
      todayVisitors: 45,
      weeklyVisitors: 312,
      monthlyVisitors: 1247,
      yearlyVisitors: 15680,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn")
    localStorage.removeItem("adminUser")
    router.push("/admin")
  }

  const generateVerificationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setVerificationCode(code)
    setVerificationMessage(
      `Your Treasury ERA verification code is: ${code}. Please enter this code to complete your registration.`,
    )
  }

  const sendVerificationCode = (user: any, isResend = false) => {
    if (!verificationCode) {
      alert("Please generate a verification code first")
      return
    }

    // Store the verification code for this user
    localStorage.setItem(`verification_code_${user.email}`, verificationCode)

    if (isResend) {
      // Remove the resend request
      localStorage.removeItem(user.storageKey)
      alert(`New verification code ${verificationCode} sent to ${user.email}`)
    } else {
      // Move user from pending to awaiting verification
      localStorage.removeItem(user.storageKey)
      localStorage.setItem(
        `awaiting_verification_${user.email}`,
        JSON.stringify({
          ...user,
          verificationCode: verificationCode,
          codeSentAt: new Date().toISOString(),
          status: "awaiting_verification",
        }),
      )
      alert(`Verification code ${verificationCode} sent to ${user.email}`)
    }

    // Clear the form
    setVerificationCode("")
    setVerificationMessage("")
    setSelectedUser(null)

    // Reload data
    loadRegistrationData()
  }

  const logActivity = (action: string, userEmail: string, details: string) => {
    const activity = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      userEmail,
      details,
      adminEmail: "treasuryemergencyrentalprogram@gmail.com",
    }

    const existingLogs = JSON.parse(localStorage.getItem("activity_log") || "[]")
    const updatedLogs = [activity, ...existingLogs].slice(0, 100) // Keep last 100 activities
    localStorage.setItem("activity_log", JSON.stringify(updatedLogs))
  }

  const handleUserAction = (user: any, action: string) => {
    setSelectedUserForAction(user)
    setActionType(action)
    setShowActionDialog(true)
  }

  const executeUserAction = () => {
    if (!selectedUserForAction || !actionType) return

    const updatedUser = {
      ...selectedUserForAction,
      accountStatus: actionType,
      actionReason: actionReason,
      actionDate: new Date().toISOString(),
      actionBy: "admin",
    }

    // Update user in localStorage
    localStorage.setItem(selectedUserForAction.storageKey, JSON.stringify(updatedUser))

    // Log the activity
    logActivity(
      `User ${actionType}`,
      selectedUserForAction.email,
      `Account ${actionType}: ${actionReason || "No reason provided"}`,
    )

    // Update local state
    setRegistrations((prev) => prev.map((user) => (user.email === selectedUserForAction.email ? updatedUser : user)))

    // Reset dialog
    setShowActionDialog(false)
    setSelectedUserForAction(null)
    setActionType("")
    setActionReason("")

    alert(`User account has been ${actionType}`)
  }

  const getUserStatusBadge = (user: any) => {
    const status = user.accountStatus || "active"
    switch (status) {
      case "locked":
        return (
          <Badge variant="destructive" className="bg-red-600">
            <Lock className="h-3 w-3 mr-1" />
            Locked
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="secondary" className="bg-orange-600 text-white">
            <Ban className="h-3 w-3 mr-1" />
            Suspended
          </Badge>
        )
      case "blocked":
        return (
          <Badge variant="destructive" className="bg-gray-600">
            <UserX className="h-3 w-3 mr-1" />
            Blocked
          </Badge>
        )
      default:
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
    }
  }

  const getUserDocuments = (userEmail: string) => {
    const userDocs = userDocuments.find((ud) => ud.email === userEmail)
    return userDocs ? userDocs.documents : []
  }

  const exportUserData = () => {
    const exportData = {
      registrations: registrations,
      stats: stats,
      activityLogs: activityLogs,
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `treasury-era-export-${new Date().toISOString().split("T")[0]}.json`
    link.click()
  }

  const totalNotifications = stats.pendingVerifications + stats.resendRequests

  const viewDocument = (document: any) => {
    setSelectedDocument(document)
    setShowDocumentDialog(true)
  }

  const approveDocument = (document: any) => {
    // Update document status
    const updatedDoc = { ...document, status: "approved", reviewDate: new Date().toISOString() }

    // Update user's documents
    const userDocs = JSON.parse(localStorage.getItem(`documents_${document.userEmail}`) || "[]")
    const updatedUserDocs = userDocs.map((doc: any) => (doc.id === document.id ? updatedDoc : doc))
    localStorage.setItem(`documents_${document.userEmail}`, JSON.stringify(updatedUserDocs))

    // Check if all required documents are approved
    const approvedDocs = updatedUserDocs.filter((doc: any) => doc.status === "approved")
    const hasIdDoc = approvedDocs.some((doc: any) => doc.category === "id_document")
    const hasSupportingDocs = approvedDocs.filter((doc: any) => doc.category === "other_document").length >= 2

    // If user has sufficient approved documents, update their status
    if (hasIdDoc && hasSupportingDocs) {
      // Update user data to trigger redirect
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      if (userData.email === document.userEmail) {
        const updatedUserData = {
          ...userData,
          documentsApproved: true,
          approvalAmount: 1000,
          approvalDate: new Date().toISOString(),
          status: "approved_for_assistance",
        }
        localStorage.setItem("userData", JSON.stringify(updatedUserData))
        localStorage.setItem("currentUser", JSON.stringify(updatedUserData))
      }

      // Update registration data
      const allKeys = Object.keys(localStorage)
      const registrationKeys = allKeys.filter((key) => key.startsWith("registration_"))

      registrationKeys.forEach((key) => {
        const regData = JSON.parse(localStorage.getItem(key) || "{}")
        if (regData.email === document.userEmail) {
          const updatedRegData = {
            ...regData,
            documentsApproved: true,
            approvalAmount: 1000,
            approvalDate: new Date().toISOString(),
            status: "approved_for_assistance",
          }
          localStorage.setItem(key, JSON.stringify(updatedRegData))
        }
      })

      // Create approval notification
      localStorage.setItem(
        `approval_notification_${document.userEmail}`,
        JSON.stringify({
          email: document.userEmail,
          approvalDate: new Date().toISOString(),
          amount: 1000,
          status: "approved",
        }),
      )
    }

    // Remove from admin queue
    const updatedQueue = documentQueue.filter((doc) => doc.id !== document.id)
    setDocumentQueue(updatedQueue)
    localStorage.setItem("admin_document_queue", JSON.stringify(updatedQueue))

    // Log activity
    logActivity("Document Approved", document.userEmail, `Approved ${document.fileName}`)

    alert(`Document ${document.fileName} has been approved`)
    loadRegistrationData()
  }

  const rejectDocument = (document: any) => {
    setDocumentToReject(document)
    setShowRejectionDialog(true)
  }

  const confirmRejectDocument = () => {
    if (!documentToReject || !rejectionReason.trim()) {
      alert("Please provide a rejection reason")
      return
    }

    // Update document status
    const updatedDoc = {
      ...documentToReject,
      status: "rejected",
      rejectionReason: rejectionReason,
      reviewDate: new Date().toISOString(),
    }

    // Update user's documents
    const userDocs = JSON.parse(localStorage.getItem(`documents_${documentToReject.userEmail}`) || "[]")
    const updatedUserDocs = userDocs.map((doc: any) => (doc.id === documentToReject.id ? updatedDoc : doc))
    localStorage.setItem(`documents_${documentToReject.userEmail}`, JSON.stringify(updatedUserDocs))

    // Remove from admin queue
    const updatedQueue = documentQueue.filter((doc) => doc.id !== documentToReject.id)
    setDocumentQueue(updatedQueue)
    localStorage.setItem("admin_document_queue", JSON.stringify(updatedQueue))

    // Log activity
    logActivity(
      "Document Rejected",
      documentToReject.userEmail,
      `Rejected ${documentToReject.fileName}: ${rejectionReason}`,
    )

    // Reset dialog
    setShowRejectionDialog(false)
    setDocumentToReject(null)
    setRejectionReason("")

    alert(`Document ${documentToReject.fileName} has been rejected`)
    loadRegistrationData()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 dark:from-red-950 dark:to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 dark:from-red-950 dark:to-blue-950">
      {/* Admin Header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-red-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src="/images/era-logo.jpeg"
                alt="Emergency Rental Assistance Program Logo"
                width={40}
                height={40}
                className="rounded"
              />
              <Shield className="absolute -bottom-1 -right-1 h-5 w-5 bg-red-600 text-white rounded-full p-0.5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-red-600">Treasury ERA Admin</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Administrative Dashboard</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {totalNotifications > 0 && (
              <div className="relative">
                <Bell className="h-6 w-6 text-red-600" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalNotifications}
                </span>
              </div>
            )}
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-red-600 text-red-600 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
              <p className="text-xs text-muted-foreground">Awaiting codes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resend Requests</CardTitle>
              <RefreshCw className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resendRequests}</div>
              <p className="text-xs text-muted-foreground">Code resends</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verifiedUsers}</div>
              <p className="text-xs text-muted-foreground">Active users</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="pending">
              New Registrations {stats.pendingVerifications > 0 && `(${stats.pendingVerifications})`}
            </TabsTrigger>
            <TabsTrigger value="resend">
              Resend Requests {stats.resendRequests > 0 && `(${stats.resendRequests})`}
            </TabsTrigger>
            <TabsTrigger value="verified">Verified Users</TabsTrigger>
            <TabsTrigger value="documents">Document Review</TabsTrigger>
            <TabsTrigger value="activity">Activity Logs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Pending Verifications Tab */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-red-600" />
                  New Registration Notifications
                </CardTitle>
                <CardDescription>
                  New users waiting for email verification codes. Generate and send codes to complete their
                  registration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingVerifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No pending registrations</p>
                    <p className="text-sm text-gray-400">New registrations will appear here automatically</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingVerifications.map((user, index) => (
                      <div key={index} className="border rounded-lg p-6 bg-orange-50 dark:bg-orange-900/20">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold">
                                {user.firstName} {user.lastName}
                              </h3>
                              <Badge variant="secondary">New Registration</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                {user.email}
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                {user.phoneNumber}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                {user.city}, {user.state}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(user.registrationDate).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Verification Code Generation */}
                        <div className="border-t pt-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="verificationCode">Verification Code</Label>
                              <div className="flex space-x-2">
                                <Input
                                  id="verificationCode"
                                  value={selectedUser?.email === user.email ? verificationCode : ""}
                                  placeholder="Generate code"
                                  readOnly
                                />
                                <Button
                                  onClick={() => {
                                    setSelectedUser(user)
                                    generateVerificationCode()
                                  }}
                                  variant="outline"
                                >
                                  Generate
                                </Button>
                              </div>
                            </div>
                          </div>

                          {selectedUser?.email === user.email && verificationCode && (
                            <div>
                              <Label htmlFor="message">Email Message</Label>
                              <Textarea
                                id="message"
                                value={verificationMessage}
                                onChange={(e) => setVerificationMessage(e.target.value)}
                                rows={3}
                                className="mt-1"
                              />
                            </div>
                          )}

                          <div className="flex justify-end">
                            <Button
                              onClick={() => sendVerificationCode(user, false)}
                              className="bg-green-600 hover:bg-green-700"
                              disabled={!selectedUser || selectedUser.email !== user.email || !verificationCode}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send Verification Code
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resend Requests Tab */}
          <TabsContent value="resend">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2 text-purple-600" />
                  Code Resend Requests
                </CardTitle>
                <CardDescription>
                  Users who didn't receive their verification codes and requested new ones.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {resendRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No resend requests</p>
                    <p className="text-sm text-gray-400">User resend requests will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {resendRequests.map((user, index) => (
                      <div key={index} className="border rounded-lg p-6 bg-purple-50 dark:bg-purple-900/20">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold">
                                {user.firstName} {user.lastName}
                              </h3>
                              <Badge variant="outline" className="border-purple-600 text-purple-600">
                                Resend Request
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                {user.email}
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                {user.phoneNumber}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                Requested: {new Date(user.requestedAt).toLocaleString()}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Original: {new Date(user.registrationDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Verification Code Generation for Resend */}
                        <div className="border-t pt-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="resendCode">New Verification Code</Label>
                              <div className="flex space-x-2">
                                <Input
                                  id="resendCode"
                                  value={selectedUser?.email === user.email ? verificationCode : ""}
                                  placeholder="Generate new code"
                                  readOnly
                                />
                                <Button
                                  onClick={() => {
                                    setSelectedUser(user)
                                    generateVerificationCode()
                                  }}
                                  variant="outline"
                                >
                                  Generate
                                </Button>
                              </div>
                            </div>
                          </div>

                          {selectedUser?.email === user.email && verificationCode && (
                            <div>
                              <Label htmlFor="resendMessage">Email Message</Label>
                              <Textarea
                                id="resendMessage"
                                value={verificationMessage}
                                onChange={(e) => setVerificationMessage(e.target.value)}
                                rows={3}
                                className="mt-1"
                              />
                            </div>
                          )}

                          <div className="flex justify-end">
                            <Button
                              onClick={() => sendVerificationCode(user, true)}
                              className="bg-purple-600 hover:bg-purple-700"
                              disabled={!selectedUser || selectedUser.email !== user.email || !verificationCode}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Send New Code
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Verified Users Tab */}
          <TabsContent value="verified">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage verified users and their account status</CardDescription>
                  </div>
                  <Button onClick={exportUserData} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {registrations.filter((u) => u.isVerified).length === 0 ? (
                  <div className="text-center py-12">
                    <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No verified users yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {registrations
                      .filter((u) => u.isVerified)
                      .map((user, index) => {
                        const userDocs = getUserDocuments(user.email)
                        return (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-4 mb-2">
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {user.firstName} {user.middleName} {user.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {user.registrationNumber}
                                    </p>
                                  </div>
                                  {getUserStatusBadge(user)}
                                </div>

                                {/* Complete User Information */}
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                                  <h4 className="font-medium mb-3">Complete User Information</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-500">Full Name:</span>
                                      <p className="font-medium">
                                        {user.firstName} {user.middleName} {user.lastName}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Email:</span>
                                      <p className="font-medium">{user.email}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Phone:</span>
                                      <p className="font-medium">{user.phoneNumber}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Date of Birth:</span>
                                      <p className="font-medium">
                                        {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Gender:</span>
                                      <p className="font-medium capitalize">{user.gender || "N/A"}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Relationship:</span>
                                      <p className="font-medium capitalize">{user.relationshipStatus || "N/A"}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Children:</span>
                                      <p className="font-medium">{user.numberOfChildren || "0"}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">City, State:</span>
                                      <p className="font-medium">
                                        {user.city}, {user.state}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">ZIP Code:</span>
                                      <p className="font-medium">{user.zipCode}</p>
                                    </div>
                                    <div className="col-span-2 md:col-span-3">
                                      <span className="text-gray-500">Address:</span>
                                      <p className="font-medium">{user.homeAddress}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Registration Date:</span>
                                      <p className="font-medium">
                                        {new Date(user.registrationDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                    {user.approvalAmount && (
                                      <div>
                                        <span className="text-gray-500">Approved Amount:</span>
                                        <p className="font-medium text-green-600">
                                          ${user.approvalAmount.toLocaleString()}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center space-x-4 text-sm">
                                  <div className="flex items-center">
                                    <FileText className="h-4 w-4 mr-1 text-blue-600" />
                                    <span>{userDocs.length} documents</span>
                                  </div>
                                  {user.actionDate && (
                                    <div className="flex items-center text-orange-600">
                                      <AlertTriangle className="h-4 w-4 mr-1" />
                                      <span>Action taken: {new Date(user.actionDate).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                </div>

                                {user.actionReason && (
                                  <Alert className="mt-3">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                      <strong>Admin Note:</strong> {user.actionReason}
                                    </AlertDescription>
                                  </Alert>
                                )}
                              </div>

                              <div className="flex items-center space-x-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Settings className="h-4 w-4 mr-2" />
                                      Actions
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleUserAction(user, "locked")}>
                                      <Lock className="h-4 w-4 mr-2" />
                                      Lock Account
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUserAction(user, "suspended")}>
                                      <Ban className="h-4 w-4 mr-2" />
                                      Suspend Account
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUserAction(user, "blocked")}>
                                      <UserX className="h-4 w-4 mr-2" />
                                      Block Account
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleUserAction(user, "active")}>
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Reactivate Account
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Document Review Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Document Review Queue</CardTitle>
                <CardDescription>Review and approve user-submitted documents with full details</CardDescription>
              </CardHeader>
              <CardContent>
                {documentQueue.filter((doc) => doc.status === "pending_review").length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No documents pending review</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {documentQueue
                      .filter((doc) => doc.status === "pending_review")
                      .map((doc, index) => (
                        <div key={index} className="border rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold">{doc.userName}</h3>
                                <Badge variant="outline" className="border-blue-600 text-blue-600">
                                  {doc.category === "id_document" ? "ID Document" : "Supporting Document"}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 mr-2" />
                                  {doc.userEmail}
                                </div>
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 mr-2" />
                                  {doc.fileName}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Uploaded: {new Date(doc.uploadDate).toLocaleString()}
                                </div>
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-2" />
                                  Reg: {doc.userRegistrationNumber}
                                </div>
                              </div>

                              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                                <h4 className="font-medium mb-2">Document Details:</h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <strong>Type:</strong> {doc.type}
                                  </div>
                                  <div>
                                    <strong>Size:</strong> {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                                  </div>
                                  <div>
                                    <strong>Format:</strong> {doc.fileType}
                                  </div>
                                  {doc.description && (
                                    <div>
                                      <strong>Description:</strong> {doc.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <Button
                              onClick={() => viewDocument(doc)}
                              variant="outline"
                              className="border-blue-600 text-blue-600 bg-transparent"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Document
                            </Button>

                            <div className="flex space-x-2">
                              <Button
                                onClick={() => rejectDocument(doc)}
                                variant="outline"
                                className="border-red-600 text-red-600 bg-transparent"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button onClick={() => approveDocument(doc)} className="bg-green-600 hover:bg-green-700">
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Logs Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>Recent admin actions and system activities</CardDescription>
              </CardHeader>
              <CardContent>
                {activityLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No activity logs yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activityLogs.map((log, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{log.action}</p>
                            <span className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-gray-600">User: {log.userEmail}</p>
                          <p className="text-sm text-gray-500">{log.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visitor Statistics</CardTitle>
                  <CardDescription>Website traffic overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Today</span>
                      <span className="font-semibold">{stats.todayVisitors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Week</span>
                      <span className="font-semibold">{stats.weeklyVisitors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Month</span>
                      <span className="font-semibold">{stats.monthlyVisitors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Year</span>
                      <span className="font-semibold">{stats.yearlyVisitors}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Registration Status</CardTitle>
                  <CardDescription>Current registration distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Pending Verification</span>
                      <Badge variant="secondary">{stats.pendingVerifications}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Resend Requests</span>
                      <Badge variant="outline" className="border-purple-600 text-purple-600">
                        {stats.resendRequests}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Verified Users</span>
                      <Badge variant="default">{stats.verifiedUsers}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Registrations</span>
                      <Badge variant="outline">{stats.totalUsers}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "active" ? "Reactivate" : actionType.charAt(0).toUpperCase() + actionType.slice(1)} User
              Account
            </DialogTitle>
            <DialogDescription>
              {selectedUserForAction && (
                <>
                  You are about to {actionType} the account for {selectedUserForAction.firstName}{" "}
                  {selectedUserForAction.lastName} ({selectedUserForAction.email}).
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="actionReason">Reason for Action *</Label>
              <Textarea
                id="actionReason"
                placeholder="Please provide a reason for this action..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowActionDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={executeUserAction}
                disabled={!actionReason.trim()}
                className={
                  actionType === "active"
                    ? "bg-green-600 hover:bg-green-700"
                    : actionType === "locked"
                      ? "bg-red-600 hover:bg-red-700"
                      : actionType === "suspended"
                        ? "bg-orange-600 hover:bg-orange-700"
                        : "bg-gray-600 hover:bg-gray-700"
                }
              >
                Confirm{" "}
                {actionType === "active" ? "Reactivation" : actionType.charAt(0).toUpperCase() + actionType.slice(1)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Dialog */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Review</DialogTitle>
            <DialogDescription>
              {selectedDocument && (
                <>
                  Review document from {selectedDocument.userName} ({selectedDocument.userEmail})
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>User:</strong> {selectedDocument.userName}
                </div>
                <div>
                  <strong>Email:</strong> {selectedDocument.userEmail}
                </div>
                <div>
                  <strong>Registration:</strong> {selectedDocument.userRegistrationNumber}
                </div>
                <div>
                  <strong>Document Type:</strong> {selectedDocument.type}
                </div>
                <div>
                  <strong>Category:</strong>{" "}
                  {selectedDocument.category === "id_document" ? "ID Document" : "Supporting Document"}
                </div>
                <div>
                  <strong>Upload Date:</strong> {new Date(selectedDocument.uploadDate).toLocaleString()}
                </div>
              </div>

              {selectedDocument.description && (
                <div>
                  <strong>Description:</strong>
                  <p className="mt-1 text-sm text-gray-600">{selectedDocument.description}</p>
                </div>
              )}

              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <h4 className="font-medium mb-2">Document Preview:</h4>
                {selectedDocument.fileType === "application/pdf" ? (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">PDF Document: {selectedDocument.fileName}</p>
                    <p className="text-sm text-gray-500">
                      Size: {(selectedDocument.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <img
                    src={selectedDocument.fileData || "/placeholder.svg"}
                    alt={selectedDocument.fileName}
                    className="max-w-full h-auto rounded-lg"
                  />
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => {
                    rejectDocument(selectedDocument)
                    setShowDocumentDialog(false)
                  }}
                  variant="outline"
                  className="border-red-600 text-red-600 bg-transparent"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Document
                </Button>
                <Button
                  onClick={() => {
                    approveDocument(selectedDocument)
                    setShowDocumentDialog(false)
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve Document
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Document Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              {documentToReject && <>Please provide a reason for rejecting {documentToReject.fileName}</>}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Rejection Reason *</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Please provide a clear reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={confirmRejectDocument}
                disabled={!rejectionReason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
