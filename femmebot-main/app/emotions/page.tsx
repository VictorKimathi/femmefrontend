"use client";
import { useState, FormEvent } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Heart } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const emotionsList = [
  { emoji: "😠", label: "Irritable" },
  { emoji: "😢", label: "Emotional" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "🥺", label: "Sensitive" },
  { emoji: "😴", label: "Tired" },
  { emoji: "🤸‍♀️", label: "Energetic" },
  { emoji: "😡", label: "Angry" },
  { emoji: "😒", label: "Moody" },
  { emoji: "😎", label: "Relaxed" },
  { emoji: "😏", label: "Confident" },
  { emoji: "🤩", label: "Excited" },
  { emoji: "😩", label: "Overwhelmed" },
  { emoji: "😤", label: "Frustrated" },
  { emoji: "😞", label: "Sad" },
  { emoji: "💪", label: "Empowered" },
  { emoji: "🤦‍♀️", label: "Forgetful" },
  { emoji: "🥲", label: "Lonely" },
  { emoji: "😜", label: "Playful" },
  { emoji: "🍫", label: "Craving" },
  { emoji: "😖", label: "Grumpy" },
  { emoji: "🥳", label: "Joyful" },
  { emoji: "😔", label: "Melancholy" },
  { emoji: "✨", label: "Inspired" },
  { emoji: "😐", label: "Unmotivated" },
  { emoji: "🤔", label: "Reflective" },
  { emoji: "🤗", label: "Clingy" },
  { emoji: "😶", label: "Detached" },
  { emoji: "🙁", label: "Insecure" },
  { emoji: "❤️", label: "Loving" },
  { emoji: "🤨", label: "Doubtful" },
  { emoji: "🌈", label: "Hopeful" },
  { emoji: "😯", label: "Surprised" },
  { emoji: "🤲", label: "Empathetic" },
  { emoji: "😕", label: "Disappointed" },
  { emoji: "😅", label: "Relieved" },
  { emoji: "🧐", label: "Curious" },
  { emoji: "🤭", label: "Giggly" },
  { emoji: "🌞", label: "Optimistic" },
] as const;

type Emotion = typeof emotionsList[number]['label'];

interface Advice {
  diet: string;
  behavior: string;
  exercise: string;
  coping: string;
  issues: string;
}

export default function EmotionSelector() {
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEmotionToggle = (emotion: Emotion) => {
    setSelectedEmotions(prev => {
      return prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion];
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedEmotions.length === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/emotions/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emotions: selectedEmotions }),
      });
      
      if (!response.ok) throw new Error('Failed to get advice');
      const data: Advice = await response.json();
      
      setAdvice(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch advice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmotions = emotionsList.filter(({ label }) =>
    label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-6">
      <Card className="w-full max-w-4xl mx-auto bg-white bg-opacity-90 backdrop-blur-sm shadow-lg border-pink-200">
        <CardHeader className="bg-gradient-to-r from-pink-300 to-purple-300 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-white flex items-center justify-center">
            <Heart className="w-8 h-8 mr-2 text-red-400" />
            Mind, Moods & Emotions
            <Sparkles className="w-8 h-8 ml-2 text-yellow-400" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-purple-700">How are you feeling today?</h3>
              <p className="text-sm text-purple-600 mb-4">Select one or more moods that describe your current state:</p>
              <Input
                type="text"
                placeholder="Search moods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 border-pink-300 focus:border-purple-400 rounded-full"
              />
              <ScrollArea className="h-[400px] rounded-lg border border-pink-200 shadow-inner p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredEmotions.map(({ emoji, label }) => (
                    <Button
                    type="button" 
                      key={label}
                      variant={selectedEmotions.includes(label) ? "default" : "outline"}
                      className={`h-20 flex flex-col items-center justify-center rounded-lg transition-all duration-300 ${
                        selectedEmotions.includes(label)
                          ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white transform scale-105'
                          : 'bg-white text-purple-700 border-pink-300 hover:bg-pink-50'
                      }`}
                      onClick={() => handleEmotionToggle(label)}
                    >
                      <span className="text-3xl mb-1">{emoji}</span>
                      <span className="text-xs text-center">{label}</span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-500 text-white rounded-lg py-3"
              disabled={loading}
            >
              {loading ? "Loading..." : "Get Advice"}
            </Button>
          </form>

          {advice && (
            <Card className="border-pink-200 shadow-md overflow-hidden mt-6">
              <CardHeader className="bg-gradient-to-r from-pink-200 to-purple-200">
                <CardTitle className="text-2xl font-semibold text-purple-700">Your Personalized Advice</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Tabs defaultValue="diet">
                  <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-1">
                    <TabsTrigger value="diet" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">Diet</TabsTrigger>
                    <TabsTrigger value="behavior" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">Behavior</TabsTrigger>
                    <TabsTrigger value="exercise" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">Exercise</TabsTrigger>
                    <TabsTrigger value="coping" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">Coping</TabsTrigger>
                    <TabsTrigger value="issues" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">Issues</TabsTrigger>
                  </TabsList>
                  <ScrollArea className="h-[200px] w-full rounded-md border border-pink-200 p-4 mt-4 bg-white">
                    <TabsContent value="diet" className="text-purple-700">{advice.diet}</TabsContent>
                    <TabsContent value="behavior" className="text-purple-700">{advice.behavior}</TabsContent>
                    <TabsContent value="exercise" className="text-purple-700">{advice.exercise}</TabsContent>
                    <TabsContent value="coping" className="text-purple-700">{advice.coping}</TabsContent>
                    <TabsContent value="issues" className="text-purple-700">{advice.issues}</TabsContent>
                  </ScrollArea>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface SectionProps {
  title: string;
  content: string;
}

function Section({ title, content }: SectionProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{content}</p>
    </div>
  );
}