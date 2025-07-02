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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Home,
  LogOut,
  Menu,
  X,
  Camera,
  CreditCard,
  Building,
  Receipt,
  BadgeIcon as IdCard,
  RefreshCw,
} from "lucide-react"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

const ID_DOCUMENT_TYPES = [
  { value: "drivers_license", label: "Driver's License", icon: IdCard },
  { value: "state_id", label: "State ID Card", icon: IdCard },
  { value: "passport", label: "US Passport", icon: IdCard },
  { value: "military_id", label: "Military ID", icon: IdCard },
]

const OTHER_DOCUMENT_TYPES = [
  { value: "proof_of_income", label: "Proof of Income (Pay Stubs, Tax Returns, Benefits Letter)", icon: Receipt },
  { value: "lease_agreement", label: "Lease Agreement or Rental Contract", icon: FileText },
  { value: "utility_bills", label: "Utility Bills (Electric, Gas, Water)", icon: Building },
  { value: "bank_statements", label: "Bank Statements (Last 3 months)", icon: CreditCard },
  { value: "eviction_notice", label: "Eviction Notice (if applicable)", icon: AlertCircle },
  { value: "employment_verification", label: "Employment Verification Letter", icon: FileText },
  { value: "social_security", label: "Social Security Award Letter", icon: FileText },
  { value: "medical_bills", label: "Medical Bills or Documentation", icon: FileText },
  { value: "other", label: "Other Supporting Documents", icon: FileText },
]

export default function UploadDocumentsPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([])
  const [currentUpload, setCurrentUpload] = useState({
    category: "", // "id_document" or "other_document"
    type: "",
    description: "",
    file: null as File | null,
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [rejectedDocuments, setRejectedDocuments] = useState<any[]>([])

  useEffect(() => {
    // Check if user is logged in and eligible
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const currentUser = localStorage.getItem("currentUser")
    const userDataStored = localStorage.getItem("userData")

    if (isLoggedIn && currentUser) {
      const user = JSON.parse(currentUser)
      setUserData(user)
      loadUserDocuments(user.email)
    } else if (userDataStored) {
      const user = JSON.parse(userDataStored)
      if (user.eligibilityStatus === "approved") {
        setUserData(user)
        loadUserDocuments(user.email)
      } else {
        router.push("/verify-eligibility")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const loadUserDocuments = (email: string) => {
    // Load existing documents
    const existingDocs = localStorage.getItem(`documents_${email}`)
    if (existingDocs) {
      const docs = JSON.parse(existingDocs)
      setUploadedDocuments(docs)

      // Filter rejected documents
      const rejected = docs.filter((doc: any) => doc.status === "rejected")
      setRejectedDocuments(rejected)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB")
        return
      }

      // Check file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPEG, PNG, and PDF files are allowed")
        return
      }

      setCurrentUpload((prev) => ({ ...prev, file }))
    }
  }

  const handleUpload = async () => {
    if (!currentUpload.category || !currentUpload.type || !currentUpload.file) {
      alert("Please select document category, type and file")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setUploadProgress(100)

    // Create document record with file data
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      const newDocument = {
        id: Date.now().toString(),
        category: currentUpload.category,
        type: currentUpload.type,
        description: currentUpload.description,
        fileName: currentUpload.file!.name,
        fileSize: currentUpload.file!.size,
        fileType: currentUpload.file!.type,
        uploadDate: new Date().toISOString(),
        status: "pending_review",
        fileData: e.target?.result, // Base64 encoded file data
        userEmail: userData.email,
        userName: `${userData.firstName} ${userData.lastName}`,
        userRegistrationNumber: userData.registrationNumber,
      }

      const updatedDocs = [...uploadedDocuments, newDocument]
      setUploadedDocuments(updatedDocs)

      // Save to localStorage
      if (userData) {
        localStorage.setItem(`documents_${userData.email}`, JSON.stringify(updatedDocs))

        // Also save to admin review queue
        const adminQueue = JSON.parse(localStorage.getItem("admin_document_queue") || "[]")
        adminQueue.push(newDocument)
        localStorage.setItem("admin_document_queue", JSON.stringify(adminQueue))

        // Update user data with document submission status
        const updatedUserData = {
          ...userData,
          documentsSubmitted: true,
          documentSubmissionDate: new Date().toISOString(),
          status: "documents_under_review",
        }
        localStorage.setItem("userData", JSON.stringify(updatedUserData))
        setUserData(updatedUserData)
      }

      // Reset form
      setCurrentUpload({ category: "", type: "", description: "", file: null })
      setIsUploading(false)
      setUploadProgress(0)
    }

    fileReader.readAsDataURL(currentUpload.file)
  }

  const removeDocument = (docId: string) => {
    const updatedDocs = uploadedDocuments.filter((doc) => doc.id !== docId)
    setUploadedDocuments(updatedDocs)

    if (userData) {
      localStorage.setItem(`documents_${userData.email}`, JSON.stringify(updatedDocs))

      // Also remove from admin queue
      const adminQueue = JSON.parse(localStorage.getItem("admin_document_queue") || "[]")
      const updatedQueue = adminQueue.filter((doc: any) => doc.id !== docId)
      localStorage.setItem("admin_document_queue", JSON.stringify(updatedQueue))
    }
  }

  const reuploadDocument = (rejectedDoc: any) => {
    // Set the form to reupload the same type of document
    setCurrentUpload({
      category: rejectedDoc.category,
      type: rejectedDoc.type,
      description: rejectedDoc.description,
      file: null,
    })

    // Scroll to upload form
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getDocumentIcon = (type: string) => {
    const allTypes = [...ID_DOCUMENT_TYPES, ...OTHER_DOCUMENT_TYPES]
    const docType = allTypes.find((dt) => dt.value === type)
    return docType ? docType.icon : FileText
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50 border-green-200"
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200"
      case "pending_review":
        return "text-orange-600 bg-orange-50 border-orange-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const hasIdDocument = uploadedDocuments.some((doc) => doc.category === "id_document" && doc.status === "approved")

  const completionPercentage = Math.min(
    (uploadedDocuments.filter((doc) => doc.status === "approved").length / 6) * 100,
    100,
  )

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
        {/* Progress Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl era-gradient bg-clip-text text-transparent">Document Upload</CardTitle>
                <CardDescription>Upload required documents to complete your application</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold era-blue">{Math.round(completionPercentage)}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
            <Progress value={completionPercentage} className="mt-4" />
          </CardHeader>
        </Card>

        {/* Rejected Documents Alert */}
        {rejectedDocuments.length > 0 && (
          <Alert className="mb-8 border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Action Required:</strong> You have {rejectedDocuments.length} rejected document(s) that need to be
              re-uploaded. Please review the rejection reasons and upload new documents.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload New Document
              </CardTitle>
              <CardDescription>
                Select document category and upload your file (PDF, JPEG, PNG - Max 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="documentCategory">Document Category *</Label>
                <Select onValueChange={(value) => setCurrentUpload((prev) => ({ ...prev, category: value, type: "" }))}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-2">
                    <SelectValue placeholder="Select document category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-2 shadow-lg">
                    <SelectItem value="id_document" className="hover:bg-blue-50 dark:hover:bg-blue-900/20 p-3">
                      <div className="flex items-center">
                        <IdCard className="h-4 w-4 mr-2 text-blue-600" />
                        <div>
                          <div className="font-medium">Government ID / Driver's License</div>
                          <div className="text-sm text-gray-500">Required identification document</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="other_document" className="hover:bg-green-50 dark:hover:bg-green-900/20 p-3">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-green-600" />
                        <div>
                          <div className="font-medium">Supporting Documents</div>
                          <div className="text-sm text-gray-500">Income, lease, utilities, etc.</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {currentUpload.category && (
                <div>
                  <Label htmlFor="documentType">
                    {currentUpload.category === "id_document" ? "ID Document Type" : "Document Type"} *
                  </Label>
                  <Select onValueChange={(value) => setCurrentUpload((prev) => ({ ...prev, type: value }))}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-2">
                      <SelectValue
                        placeholder={`Select ${currentUpload.category === "id_document" ? "ID" : ""} document type`}
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-2 shadow-lg max-h-60 overflow-y-auto">
                      {(currentUpload.category === "id_document" ? ID_DOCUMENT_TYPES : OTHER_DOCUMENT_TYPES).map(
                        (type) => (
                          <SelectItem
                            key={type.value}
                            value={type.value}
                            className="hover:bg-blue-50 dark:hover:bg-blue-900/20 p-3"
                          >
                            <div className="flex items-center">
                              <type.icon className="h-4 w-4 mr-2 text-blue-600" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional notes about this document..."
                  value={currentUpload.description}
                  onChange={(e) => setCurrentUpload((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="file">Select File *</Label>
                <div className="mt-2">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {currentUpload.file && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: {currentUpload.file.name} ({(currentUpload.file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              <Button
                onClick={handleUpload}
                className="w-full era-bg-blue hover:bg-blue-700"
                disabled={isUploading || !currentUpload.category || !currentUpload.type || !currentUpload.file}
              >
                {isUploading ? "Uploading..." : "Upload Document"}
              </Button>
            </CardContent>
          </Card>

          {/* Uploaded Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Uploaded Documents ({uploadedDocuments.length})
              </CardTitle>
              <CardDescription>Review your uploaded documents and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No documents uploaded yet</p>
                  <p className="text-sm text-gray-400">Upload your first document to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {uploadedDocuments.map((doc) => {
                    const IconComponent = getDocumentIcon(doc.type)
                    return (
                      <div key={doc.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <IconComponent className="h-5 w-5 text-blue-600 mt-1" />
                            <div className="flex-1">
                              <h4 className="font-medium">{doc.fileName}</h4>
                              <p className="text-sm text-gray-600">
                                {doc.category === "id_document" ? "ID Document: " : "Supporting Document: "}
                                {
                                  [...ID_DOCUMENT_TYPES, ...OTHER_DOCUMENT_TYPES].find((t) => t.value === doc.type)
                                    ?.label
                                }
                              </p>
                              {doc.description && <p className="text-sm text-gray-500 mt-1">{doc.description}</p>}
                              {doc.rejectionReason && (
                                <Alert className="mt-2 border-red-200 bg-red-50 dark:bg-red-900/20">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    <strong>Rejection Reason:</strong> {doc.rejectionReason}
                                  </AlertDescription>
                                </Alert>
                              )}
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge className={getStatusColor(doc.status)}>
                              {doc.status === "pending_review" && "Under Review"}
                              {doc.status === "approved" && "Approved"}
                              {doc.status === "rejected" && "Rejected"}
                            </Badge>
                            <div className="flex space-x-1">
                              {doc.status === "rejected" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => reuploadDocument(doc)}
                                  className="text-blue-600 border-blue-600 bg-transparent"
                                >
                                  <RefreshCw className="h-4 w-4 mr-1" />
                                  Re-upload
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDocument(doc.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Required Documents Checklist */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Required Documents Checklist</CardTitle>
            <CardDescription>Make sure to upload all required documents for faster processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {/* ID Documents */}
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-600">Government ID (Required)</h4>
                {ID_DOCUMENT_TYPES.map((docType) => {
                  const isUploaded = uploadedDocuments.some(
                    (doc) => doc.type === docType.value && doc.status === "approved",
                  )
                  return (
                    <div key={docType.value} className="flex items-center space-x-3">
                      {isUploaded ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                      )}
                      <span className={isUploaded ? "text-green-700" : "text-gray-700"}>{docType.label}</span>
                    </div>
                  )
                })}
              </div>

              {/* Supporting Documents */}
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">Supporting Documents</h4>
                {OTHER_DOCUMENT_TYPES.slice(0, 5).map((docType) => {
                  const isUploaded = uploadedDocuments.some(
                    (doc) => doc.type === docType.value && doc.status === "approved",
                  )
                  return (
                    <div key={docType.value} className="flex items-center space-x-3">
                      {isUploaded ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                      )}
                      <span className={isUploaded ? "text-green-700" : "text-gray-700"}>{docType.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        {uploadedDocuments.length >= 3 && (
          <Card className="mt-8 bg-green-50 dark:bg-green-900/20 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">Great Progress!</h3>
                  <p className="text-green-700 dark:text-green-300">
                    You've uploaded {uploadedDocuments.length} documents. Our team will review them within 2-3 business
                    days. You'll receive an email notification once the review is complete.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
