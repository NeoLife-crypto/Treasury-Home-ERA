"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Home, Shield, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 dark:from-blue-950 dark:to-red-950">
      {/* Header */}
      <header className="relative z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/era-logo.jpeg"
              alt="Emergency Rental Assistance Program Logo"
              width={60}
              height={60}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-lg font-bold era-blue">Treasury ERA</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Emergency Rental Assistance</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="era-bg-blue hover:bg-blue-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 era-gradient bg-clip-text text-transparent">
              Treasury Home Of Emergency Rental Assistance (ERA)
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Welcome to a program dedicated to helping United States citizens whose homes or businesses have been
              affected by natural disasters, those struggling to pay rent, or individuals experiencing homelessness.
              We're here to provide the support you need during difficult times.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="era-bg-blue hover:bg-blue-700 text-white px-8 py-3">
                  Apply for Assistance
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 bg-transparent"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 era-gradient bg-clip-text text-transparent">
            Real Stories, Real Impact
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src="/images/homeless-assistance.jpeg"
                  alt="Providing assistance to homeless individuals"
                  width={500}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 era-blue">Homeless Support</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Providing immediate assistance and long-term solutions for individuals and families experiencing
                    homelessness. Our compassionate approach ensures dignity and respect for all.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src="/images/disaster-recovery.jpeg"
                  alt="Before and after disaster recovery assistance"
                  width={500}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 era-red">Disaster Recovery</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    From devastation to restoration - we help families rebuild their lives after natural disasters.
                    Emergency assistance and long-term recovery support.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Images Row */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src="/images/community-support.jpeg"
                  alt="Community leaders and volunteers working together"
                  width={500}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 era-blue">Community Partnership</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Working together with community leaders, volunteers, and local organizations to create lasting
                    positive change in neighborhoods across America.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src="/images/homeless-group.jpeg"
                  alt="Group of people working together on housing assistance"
                  width={500}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 era-red">Housing Solutions</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Collaborative efforts to provide sustainable housing solutions and support services for those in
                    need. Building stronger communities together.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 era-gradient bg-clip-text text-transparent">
            How We Help
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Home className="h-12 w-12 era-blue mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Rental Assistance</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Help with rent payments and housing stability for qualifying individuals and families.
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 era-red mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Disaster Relief</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Emergency financial assistance for those affected by natural disasters.
              </p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 era-blue mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Homeless Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive assistance for individuals experiencing homelessness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Image
              src="/images/era-logo.jpeg"
              alt="Emergency Rental Assistance Program Logo"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="text-lg font-semibold">Treasury ERA</span>
          </div>
          <p className="text-gray-300 mb-4">Providing hope and assistance to those in need across the United States.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
            <span>Phone: +1 (628) 400-3594</span>
            <span>Email: treasuryemergencyrentalprogram@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
