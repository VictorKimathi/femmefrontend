import NotificationBell from "@/components/NotificationBell"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-700">My App</h1>
        <NotificationBell />
      </header>

      {/* Rest of your home page content */}
    </div>
  )
}