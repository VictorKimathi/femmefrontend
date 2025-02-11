"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, MessageCircle, Book, Heart, Shield, Menu, Phone, Mail, Twitter, Linkedin } from 'lucide-react'
import { useRouter } from 'next/navigation'

// import {
//   ClerkProvider,
//   SignedIn,
//   SignInButton,
//   SignedOut,
//   UserButton
// } from '@clerk/nextjs'

export default function LandingPage() {
  const [showSubscription, setShowSubscription] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleClick = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Prevents the default form submission
    router.push("/home")
  }

  const features = [
    { icon: <Calendar className="h-6 w-6" />, title: "Cycle Tracking", description: "Easily track your menstrual cycle and predict future periods." },
    { icon: <MessageCircle className="h-6 w-6" />, title: "Issues and Conditions", description: "Get information and support for various reproductive health issues." },
    { icon: <Book className="h-6 w-6" />, title: "Educational Resources", description: "Access a wealth of information on reproductive health and wellness." },
    { icon: <Heart className="h-6 w-6" />, title: "Mood & Symptom Logging", description: "Track your moods and symptoms throughout your cycle." },
    { icon: <Shield className="h-6 w-6" />, title: "Birth Control Information", description: "Learn about various contraception methods and their suitability." },
  ];

  return (
    // <ClerkProvider>
      <div className="flex flex-col min-h-screen">
        <header className="bg-primary text-primary-foreground py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">FemmeHealth</h1>
            <nav className="hidden md:flex space-x-4">
              <ul className="flex space-x-4">
                <li><a href="#features" className="hover:underline">Features</a></li>
                <li><a href="#about" className="hover:underline">About</a></li>
                <li><a href="#contact" className="hover:underline">Contact</a></li>
              </ul>
            </nav>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                <Menu className="h-6 w-6" />
              </button>
            </div>
            {/* <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button>Sign In</Button>
              </SignInButton>
            </SignedOut> */}
          </div>
          {isMenuOpen && (
            <nav className="md:hidden bg-primary text-primary-foreground py-4">
              <ul className="flex flex-col space-y-4">
                <li><a href="#features" className="hover:underline">Features</a></li>
                <li><a href="#about" className="hover:underline">About</a></li>
                <li><a href="#contact" className="hover:underline">Contact</a></li>
              </ul>
            </nav>
          )}
        </header>

        <main className="flex-grow">
          <section className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-4">Take Control of Your Reproductive Health</h2>
              <p className="text-xl mb-8">Empowering women with knowledge, tracking tools, and personalized insights</p>
              <Button size="lg" onClick={handleClick} className="bg-white text-pink-500 hover:bg-gray-100">
                Get Started
              </Button>
            </div>
          </section>

          {showSubscription && (
            <section className="py-16 bg-gray-100">
              <div className="container mx-auto px-4">
                <Card className="max-w-md mx-auto">
                  <CardHeader>
                    <CardTitle>Subscribe to FemmeHealth</CardTitle>
                    <CardDescription>Get access to all features for only 10 KES per month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Enter your full name" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="Enter your email" />
                      </div>
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" type="number" placeholder="Enter your age" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number (for M-Pesa payment)</Label>
                        <Input id="phone" placeholder="Enter your phone number" />
                      </div>
                      <Button onClick={handleClick} className="w-full">Subscribe with M-Pesa (10 KES)</Button>
                    </form>
                    <p className="mt-4 text-sm text-gray-500">
                      By subscribing, you agree to our Terms of Service and Privacy Policy.
                      The subscription fee of 10 KES will be charged monthly via M-Pesa.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          <section id="features" className="py-16 bg-gray-100">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        {feature.icon}
                        <span className="ml-2">{feature.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section id="about" className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
                  <img src="/logo.png" alt="FemmeHealth Logo" className="rounded-lg shadow-lg" />
                </div>
                <div className="md:w-1/2 md:pl-8">
                  <h2 className="text-3xl font-bold mb-4">About FemmeHealth</h2>
                  <p className="text-lg mb-4">
                    FemmeHealth is a comprehensive women's health app designed to empower you with knowledge and tools for managing your reproductive health. Our mission is to make accurate, personalized health information accessible to all women.
                  </p>
                  <p className="text-lg mb-4">
                    With features like cycle tracking, health issue information, educational resources, mood logging, and birth control guidance, FemmeHealth is your trusted companion for all stages of your reproductive journey.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="py-16 bg-gray-100">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-lg mb-8">Have questions or feedback? We'd love to hear from you!</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center">
                      <Phone className="h-6 w-6 mr-2" />
                      Call/Text
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">+254742953013</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center">
                      <Mail className="h-6 w-6 mr-2" />
                      Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">kinyaoedwin@gmail.com</p>
                  </CardContent>
                </Card>
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4">Connect with Us</h3>
                <div className="flex justify-center space-x-6">
                  <a href="https://x.com/ke_ramadha71620" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 transition-colors">
                    <Twitter className="h-8 w-8" />
                  </a>
                  <a href="https://www.linkedin.com/in/kinyao-e-ramadhan-07926b231/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-700 transition-colors">
                    <Linkedin className="h-8 w-8" />
                  </a>
                </div>
              </div>
            </div>
          </section>

        </main>

        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold">FemmeHealth</h3>
                <p>Empowering women through health education</p>
              </div>
              <nav>
                <ul className="flex space-x-4">
                  <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                  <li><a href="#" className="hover:underline">Terms of Service</a></li>
                  <li><a href="#" className="hover:underline">FAQ</a></li>
                </ul>
              </nav>
            </div>
            <div className="mt-8 text-center">
              <p>&copy; 2025 FemmeHealth. All rights reserved.</p>
              
            </div>
          </div>
        </footer>

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/254742953013"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-colors duration-300"
          aria-label="Chat on WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    // </ClerkProvider>
  );
}