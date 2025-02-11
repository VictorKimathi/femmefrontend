"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, ImageIcon, Sparkles } from 'lucide-react';
import { createIssue, CreateIssuePayload, IssueResponse } from '../api/page';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

const quickSuggestions = ['Cramps', 'Irregular periods', 'Heavy bleeding', 'Mood swings'];

export default function IssuesConditionsChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    setIsProcessing(true);
    const userMessage: Message = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    try {
      setIsTyping(true);
      const payload: CreateIssuePayload = { question: inputText, senderId: "user123" };
      const response: IssueResponse = await createIssue(payload);
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: response.answer,
        sender: 'bot'
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Error: " + error.message,
        sender: 'bot'
      }]);
    } finally {
      setIsTyping(false);
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    if (isProcessing) return;
    setInputText(suggestion);
    setTimeout(handleSendMessage, 100); // Allow time for input update
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Background elements unchanged */}
      <div className="relative w-full max-w-md mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-lg overflow-hidden">
        <div className="flower-bg-1"></div>
        <div className="flower-bg-2"></div>
        <div className="flower-bg-3"></div>
      </div>
    </div>
      <Card className="w-full h-[600px] flex flex-col bg-white bg-opacity-90 backdrop-blur-sm shadow-lg border-pink-200">
        <CardHeader className="bg-gradient-to-r from-pink-300 to-purple-300 rounded-t-lg">
   
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-yellow-400" />
            Health Companion
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-4">
          <ScrollArea className="h-full pr-4">
          {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{message.sender === 'user' ? 'U' : 'B'}</AvatarFallback>
                    <AvatarImage src={message.sender === 'user' ? "/user-avatar.png" : "/bot-avatar.png"} />
                  </Avatar>
                  <div
                    className={`mx-2 p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                        : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
                    } shadow-md`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4 animate-fade-in">
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
        </CardContent>
        <CardFooter className="flex flex-col gap-2 bg-gradient-to-r from-pink-200 to-purple-200 rounded-b-lg p-4">
          <div className="flex gap-2 w-full overflow-x-auto pb-2 scrollbar-hide">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSuggestion(suggestion)}
                disabled={isProcessing}
                className={`bg-white text-purple-700 border-pink-300 rounded-full transition-all ${
                  isProcessing 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-pink-100 hover:scale-105'
                }`}
              >
                {suggestion}
              </Button>
            ))}
          </div>
          <div className="flex w-full gap-2">
            <Input
              ref={inputRef}
              disabled={isProcessing}
              placeholder="Ask about your symptoms..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="bg-white border-pink-300 focus:border-purple-400 text-purple-800 placeholder-purple-400 rounded-full disabled:opacity-75 disabled:cursor-not-allowed"
            />
            <Button
              variant="outline"
              size="icon"
              disabled={isProcessing}
              onClick={() => alert("Feature under development")}
              className="bg-white text-purple-700 border-pink-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-100 hover:scale-105"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isProcessing}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:scale-105"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      {/* Styles unchanged */}
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