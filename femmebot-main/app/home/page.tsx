"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MessageCircle, Heart, Shield, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs"
import NotificationBell from "@/components/NotificationBell"

export default function HomePage() {
  const router = useRouter()
  // const { user } = useUser()
  const mainSections = [
    { link: "calendar", title: "Menstrual Cycle Calendar", icon: <Calendar className="h-6 w-6" /> },
    { link: "conditions", title: "Issues & Conditions Chatbot", icon: <MessageCircle className="h-6 w-6" /> },
    { link: "emotions", title: "Mind, Moods & Emotions", icon: <Heart className="h-6 w-6" /> },
    { link: "education", title: "Sex Life & Education", icon: <Heart className="h-6 w-6" /> },
    { link: "birthcontrol", title: "Birth Control & Contraception", icon: <Shield className="h-6 w-6" /> },
  ]

  const handleClick = (link: string) => {
    router.replace(link)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-400 to-purple-400 text-white p-4 flex justify-between items-center shadow-md rounded-b-lg">
        <h1 className="text-2xl font-bold flex items-center">
          <Sparkles className="h-6 w-6 mr-2" />
          Women's Health
        </h1>
        <div className="flex items-center space-x-4">
          <NotificationBell />
          {/* <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut> */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        {/* Welcome Message */}
        <div className="mb-8 bg-white bg-opacity-70 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <h2 className="text-3xl font-bold text-purple-700">Welcome, angie</h2>
          <p className="text-pink-600 text-lg mt-2">How are you feeling today?</p>
        </div>

        {/* Main Sections */}
        <section aria-label="Main Features" className="mb-8">
          <h3 className="text-2xl font-semibold mb-6 text-purple-700">Explore Your Health</h3>
          <div className="grid grid-cols-2 gap-6">
            {mainSections.map((section, index) => (
              <Card
                onClick={() => handleClick(section.link)}
                key={index}
                className="bg-white hover:bg-gradient-to-br hover:from-pink-200 hover:to-purple-200 transition-all duration-300 shadow-lg rounded-2xl overflow-hidden transform hover:scale-105"
              >
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="bg-gradient-to-br from-pink-400 to-purple-400 p-3 rounded-full mb-4">
                    {React.cloneElement(section.icon, { className: "h-8 w-8 text-white" })}
                  </div>
                  <h3 className="text-lg font-medium text-purple-700">{section.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Announcements/Updates */}
        <section aria-label="Today's Tip">
          <Card className="bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Sparkles className="h-6 w-6 mr-2" />
                Today's Tip
              </h3>
              <p className="text-lg">
                Stay hydrated! Drinking enough water can help reduce bloating during your period.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

