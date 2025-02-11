"use client"

import type React from "react"
import { useState } from "react"
import { Bell, Calendar, Heart, Info, AlertTriangle, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"

type Notification = {
  id: number
  type: "cycle" | "health" | "app" | "tip"
  title: string
  description: string
  date: string
  icon: React.ReactNode
  read: boolean
}

const notifications: Notification[] = [
  {
    id: 1,
    type: "cycle",
    title: "Period Starting Soon",
    description: "Your next period is expected to start in 3 days.",
    date: "2023-06-15",
    icon: <Calendar className="h-5 w-5 text-blue-500" />,
    read: false,
  },
  {
    id: 2,
    type: "health",
    title: "Fertility Window",
    description: "Your fertility window begins tomorrow.",
    date: "2023-06-16",
    icon: <Heart className="h-5 w-5 text-teal-500" />,
    read: false,
  },
  {
    id: 3,
    type: "app",
    title: "New Feature Available",
    description: "Check out our new mood tracking feature!",
    date: "2023-06-14",
    icon: <Info className="h-5 w-5 text-blue-500" />,
    read: true,
  },
  {
    id: 4,
    type: "health",
    title: "Medication Reminder",
    description: "Remember to take your birth control pill.",
    date: "2023-06-15",
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    read: false,
  },
  {
    id: 5,
    type: "tip",
    title: "Tip of the Day",
    description: "Stay hydrated! Aim for 8 glasses of water daily.",
    date: "2023-06-15",
    icon: <Sparkles className="h-5 w-5 text-teal-500" />,
    read: false,
  },
]

export default function NotificationBell() {
  const [notifs, setNotifs] = useState(notifications)
  const unreadCount = notifs.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-white text-blue-500 border-blue-500 hover:bg-blue-50"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-teal-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Card className="border-none shadow-lg">
          <CardContent className="p-0">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-teal-500">
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
            </div>
            <ScrollArea className="h-[300px] p-4">
              {notifs.map((notification) => (
                <div
                  key={notification.id}
                  className={`mb-4 p-3 rounded-lg ${notification.read ? "bg-gray-50" : "bg-white shadow-md"}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 bg-gradient-to-br from-blue-100 to-teal-100 p-2 rounded-full">
                      {notification.icon}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-semibold text-blue-700">{notification.title}</h3>
                      <p className="text-xs text-gray-600">{notification.description}</p>
                      <p className="text-xs text-teal-500 mt-1">{notification.date}</p>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-gray-600"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
            
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

