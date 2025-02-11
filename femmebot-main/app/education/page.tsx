"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Heart, Sparkles } from 'lucide-react'
import { createEducationResponse } from '../api/page'

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

type AgeBracket = 'under18' | '18-25' | '26-35' | '36plus';

const ageBrackets: { value: AgeBracket; label: string; icon: React.ReactNode }[] = [
  { value: 'under18', label: 'Under 18', icon: <Sparkles className="h-6 w-6 text-pink-400" /> },
  { value: '18-25', label: '18-25', icon: <Heart className="h-6 w-6 text-red-400" /> },
  { value: '26-35', label: '26-35', icon: <Heart className="h-6 w-6 text-purple-400" /> },
  { value: '36plus', label: '36+', icon: <Heart className="h-6 w-6 text-indigo-400" /> },
];

const commonTopics: { [key in AgeBracket]: string[] } = {
  under18: ['Puberty', 'Body changes', 'Menstruation', 'Personal hygiene'],
  '18-25': ['Safe sex practices', 'Birth control options', 'STI prevention', 'Consent and boundaries'],
  '26-35': ['Family planning', 'Fertility awareness', 'Sexual health check-ups', 'Relationship communication'],
  '36plus': ['Menopause', 'Hormonal changes', 'Sexual health in aging', 'Maintaining intimacy'],
};

const educationalContent: { [key: string]: string } = {
  // ... (keep all the existing educational content)
};

export default function SexLifeEducation() {
  const [selectedAgeBrackets, setSelectedAgeBrackets] = useState<AgeBracket[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleAgeBracketSelect = (bracket: AgeBracket) => {
    setSelectedAgeBrackets((prev) =>
      prev.includes(bracket) ? prev.filter((b) => b !== bracket) : [...prev, bracket]
    );
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const newUserMessage: Message = { id: messages.length + 1, text: inputText, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    setIsTyping(true);
    setTimeout(async () => {
      const botResponse = await getBotResponse(inputText);
      const newBotMessage: Message = { id: messages.length + 2, text: botResponse, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
      setIsTyping(false);
    }, 1000);

    setInputText('');
  };

const  getBotResponse = async (input: string): Promise<string>=> {
    console.log("Age bracket");

    const promptInput = `I am between ${selectedAgeBrackets[0]} ${input}`;
    console.log("Prompt input:", promptInput);
    const payload = { question: promptInput, senderId: "user123" };

    try {
        const response = await createEducationResponse(payload);
        console.log("Response:", response.answer);
        return response.answer; // Assuming the API returns an object with a `message` field
    } catch (error) {
        console.error("Error fetching bot response:", error);
        return "Sorry, I couldn't process your request.";
    }
}


  const handleCommonTopicClick = (topic: string) => {
    setInputText(topic);
    handleSendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-lg overflow-hidden">
        <div className="flower-bg-1"></div>
        <div className="flower-bg-2"></div>
        <div className="flower-bg-3"></div>
      </div>
      <Card className="w-full bg-white bg-opacity-90 backdrop-blur-sm shadow-lg border-pink-200">
        <CardHeader className="bg-gradient-to-r from-pink-300 to-purple-300 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-white flex items-center justify-center">
            <Heart className="w-6 h-6 mr-2 text-red-400" />
            Sex Life & Education
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {selectedAgeBrackets.length === 0 ? (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center text-purple-700">Select your age group:</h3>
              <div className="grid grid-cols-2 gap-4">
                {ageBrackets.map((bracket) => (
                 <Button
                 key={bracket.value}
                 onClick={() => handleAgeBracketSelect(bracket.value)}
                 variant="outline"
                 className={`h-20 bg-gradient-to-r from-pink-100 to-purple-100 
                   hover:from-pink-200 hover:to-purple-200 text-purple-700 border-pink-300 
                   transition-all duration-300 transform hover:scale-105 
                   ${selectedAgeBrackets.includes(bracket.value) ? 'ring-2 ring-purple-500' : ''}`
                 }
               >
                 <div className="flex flex-col items-center">
                   {bracket.icon}
                   <span className="mt-2">{bracket.label}</span>
                 </div>
               </Button>
               
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 bg-white shadow-md">
                <CardHeader className="bg-gradient-to-r from-pink-200 to-purple-200">
                  <CardTitle className="text-lg font-semibold text-purple-700">Chat</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ScrollArea className="h-[400px] w-full pr-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                        <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{message.sender === 'user' ? 'U' : 'B'}</AvatarFallback>
                            <AvatarImage src={message.sender === 'user' ? "/user-avatar.png" : "/bot-avatar.png"} />
                          </Avatar>
                          <div className={`mx-2 p-3 rounded-lg ${
                            message.sender === 'user' 
                              ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white' 
                              : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
                          } shadow-md max-w-[70%]`}>
                            {message.text}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start mb-4">
                        <div className="flex items-center bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full px-4 py-2 shadow-md">
                          <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </ScrollArea>
                  <div className="flex items-center mt-4">
                    <Input
                      placeholder="Type your question here..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-grow border-pink-300 focus:border-purple-400 rounded-full"
                    />
                    <Button onClick={handleSendMessage} className="ml-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full transition-all duration-300 transform hover:scale-105">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-md">
                <CardHeader className="bg-gradient-to-r from-pink-200 to-purple-200">
                  <CardTitle className="text-lg font-semibold text-purple-700">Common Topics</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ScrollArea className="h-[400px]">
                    {selectedAgeBrackets.flatMap((bracket) => commonTopics[bracket]).map((topic, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start mb-2 text-left text-purple-700 hover:bg-pink-100 transition-colors"
                        onClick={() => handleCommonTopicClick(topic)}
                      >
                        {topic}
                      </Button>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
      <style jsx>{`
        .flower-bg-1,
        .flower-bg-2,
        .flower-bg-3 {
          position: absolute;
          opacity: 0.1;
          background-repeat: no-repeat;
          background-size: contain;
        }
        .flower-bg-1 {
          top: -50px;
          left: -50px;
          width: 200px;
          height: 200px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23FF69B4' d='M50 0c27.6 0 50 22.4 50 50S77.6 100 50 100 0 77.6 0 50 22.4 0 50 0zm0 10c-22.1 0-40 17.9-40 40s17.9 40 40 40 40-17.9 40-40-17.9-40-40-40z'/%3E%3Cpath fill='%23FF69B4' d='M50 20c16.6 0 30 13.4 30 30S66.6 80 50 80 20 66.6 20 50s13.4-30 30-30zm0 10c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20z'/%3E%3C/svg%3E");
        }
        .flower-bg-2 {
          top: 50%;
          right: -30px;
          width: 150px;
          height: 150px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23DDA0DD' d='M50 0L0 50l50 50 50-50L50 0zm0 20l30 30-30 30-30-30 30-30z'/%3E%3C/svg%3E");
        }
        .flower-bg-3 {
          bottom: -40px;
          left: 50%;
          width: 180px;
          height: 180px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23FF1493' d='M50 0l50 50-50 50L0 50 50 0zm0 20L20 50l30 30 30-30-30-30z'/%3E%3C/svg%3E");
        }
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        .typing-indicator span {
          height: 8px;
          width: 8px;
          background-color: #9C27B0;
          border-radius: 50%;
          display: inline-block;
          margin-right: 5px;
          animation: bounce 1.4s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}