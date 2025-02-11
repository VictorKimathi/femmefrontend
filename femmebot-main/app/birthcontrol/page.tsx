"use client"
import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Pill, Stethoscope, ShieldCheck, Clock, Calendar, Syringe, Info, HelpCircle, AlertTriangle, CheckCircle, Users, Scissors, Play, Pause } from 'lucide-react'

type ContraceptionMethod = {
  name: string;
  category: string;
  icon: React.ReactNode;
  effectiveness: string;
  duration: string;
  sideEffects: string;
  easeOfUse: string;
  availability: string;
  specialConsiderations: string;
  audioSrc: string;
};

const contraceptionMethods: ContraceptionMethod[] = [
  {
    name: "Birth Control Pills",
    category: "Hormonal Methods",
    icon: <Pill className="h-8 w-8 text-pink-500" />,
    effectiveness: "91-99% effective with perfect use",
    duration: "Daily",
    sideEffects: "Nausea, breast tenderness, headaches, mood changes",
    easeOfUse: "Must be taken daily at the same time",
    availability: "Prescription required, widely available",
    specialConsiderations: "Not suitable for smokers over 35",
    audioSrc: "/audio/birth-control-pills.mp3",
  },
  {
    name: "IUD (Intrauterine Device)",
    category: "Long-acting Reversible Contraceptives (LARCs)",
    icon: <Stethoscope className="h-8 w-8 text-purple-500" />,
    effectiveness: "Over 99% effective",
    duration: "3-10 years depending on type",
    sideEffects: "Cramping, irregular bleeding (initially)",
    easeOfUse: "Inserted by healthcare provider, no daily action required",
    availability: "Requires medical insertion, widely available",
    specialConsiderations: "Hormonal and non-hormonal options available",
    audioSrc: "/audio/iud.mp3",
  },
  {
    name: "Condoms",
    category: "Barrier Methods",
    icon: <ShieldCheck className="h-8 w-8 text-blue-500" />,
    effectiveness: "82-98% effective with perfect use",
    duration: "Single use",
    sideEffects: "Minimal, possible latex allergy",
    easeOfUse: "Must be used correctly every time",
    availability: "Widely available without prescription",
    specialConsiderations: "Protects against STIs",
    audioSrc: "/audio/condoms.mp3",
  },
  {
    name: "Contraceptive Implant",
    category: "Long-acting Reversible Contraceptives (LARCs)",
    icon: <Syringe className="h-8 w-8 text-green-500" />,
    effectiveness: "Over 99% effective",
    duration: "Up to 3 years",
    sideEffects: "Irregular bleeding, possible weight gain",
    easeOfUse: "Inserted by healthcare provider, no daily action required",
    availability: "Requires medical insertion, widely available",
    specialConsiderations: "Can be used while breastfeeding",
    audioSrc: "/audio/contraceptive-implant.mp3",
  },
  {
    name: "Fertility Awareness",
    category: "Natural Methods",
    icon: <Calendar className="h-8 w-8 text-yellow-500" />,
    effectiveness: "76-88% effective with perfect use",
    duration: "Ongoing",
    sideEffects: "None",
    easeOfUse: "Requires daily tracking and understanding of fertility signs",
    availability: "No medical intervention required",
    specialConsiderations: "Not suitable for those with irregular cycles",
    audioSrc: "/audio/fertility-awareness.mp3",
  },
  {
    name: "Tubal Ligation",
    category: "Permanent Methods",
    icon: <Scissors className="h-8 w-8 text-red-500" />,
    effectiveness: "Over 99% effective",
    duration: "Permanent",
    sideEffects: "Surgical risks, no hormonal side effects",
    easeOfUse: "One-time surgical procedure",
    availability: "Requires surgery, widely available",
    specialConsiderations: "Considered permanent, reversal is complex and not always successful",
    audioSrc: "/audio/tubal-ligation.mp3",
  },
];

type Question = {
  id: string;
  text: string;
  options: string[];
};

const questions: Question[] = [
  {
    id: "lifestyle",
    text: "What's your preferred contraception style?",
    options: [
      "I don't want to remember it daily",
      "I prefer a natural method without medication",
      "I'm okay with daily routines",
    ],
  },
  {
    id: "duration",
    text: "How long do you want the contraception to last?",
    options: [
      "Short-term (days to months)",
      "Long-term (years)",
      "Permanent",
    ],
  },
  {
    id: "hormones",
    text: "How do you feel about hormonal methods?",
    options: [
      "I'm sensitive to hormones",
      "I'm okay with possible hormonal side effects",
      "No preference",
    ],
  },
  {
    id: "accessibility",
    text: "What's your preference for obtaining contraception?",
    options: [
      "I prefer methods available without a prescription",
      "I'm okay with methods that require a doctor's visit",
      "No preference",
    ],
  },
];

export default function BirthControlContraception() {
  const [selectedMethod, setSelectedMethod] = useState<ContraceptionMethod | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const getSuitableMethods = () => {
    return contraceptionMethods.filter(method => {
      if (answers.lifestyle === "I don't want to remember it daily" && 
          (method.name === "Birth Control Pills" || method.name === "Condoms")) return false;
      if (answers.lifestyle === "I prefer a natural method without medication" && 
          method.name !== "Fertility Awareness") return false;
      if (answers.duration === "Short-term (days to months)" && 
          (method.category === "Long-acting Reversible Contraceptives (LARCs)" || method.category === "Permanent Methods")) return false;
      if (answers.duration === "Long-term (years)" && 
          (method.category !== "Long-acting Reversible Contraceptives (LARCs)" && method.category !== "Permanent Methods")) return false;
      if (answers.duration === "Permanent" && method.category !== "Permanent Methods") return false;
      if (answers.hormones === "I'm sensitive to hormones" && 
          (method.category === "Hormonal Methods" || method.name === "Contraceptive Implant")) return false;
      if (answers.accessibility === "I prefer methods available without a prescription" && 
          (method.availability.includes("Prescription required") || method.availability.includes("Requires medical"))) return false;
      return true;
    });
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMethodSelect = (method: ContraceptionMethod) => {
    setSelectedMethod(method);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-pink-50 to-purple-50">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-purple-800">Birth Control & Contraception</CardTitle>
        <CardDescription className="text-lg text-purple-600">
          Explore contraception options to make informed decisions about your reproductive health.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info" className="text-lg">Information</TabsTrigger>
            <TabsTrigger value="finder" className="text-lg">Method Finder</TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-700">Contraception Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    {contraceptionMethods.map((method, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start mb-2 p-3 hover:bg-purple-100 transition-colors"
                        onClick={() => handleMethodSelect(method)}
                      >
                        <div className="flex items-center space-x-3">
                          {method.icon}
                          <span>{method.name}</span>
                        </div>
                      </Button>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
              <Card className="md:col-span-2 bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-700">Method Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    {selectedMethod ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {selectedMethod.icon}
                            <h3 className="text-2xl font-bold text-purple-800">{selectedMethod.name}</h3>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePlayPause}
                            className="rounded-full"
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                        </div>
                        <audio
                          ref={audioRef}
                          src={selectedMethod.audioSrc}
                          onEnded={() => setIsPlaying(false)}
                        />
                        <p className="text-sm text-purple-600">{selectedMethod.category}</p>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="effectiveness">
                            <AccordionTrigger className="text-purple-700">
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5" />
                                <span>Effectiveness</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>{selectedMethod.effectiveness}</AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="duration">
                            <AccordionTrigger className="text-purple-700">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-5 w-5" />
                                <span>Duration</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>{selectedMethod.duration}</AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="sideEffects">
                            <AccordionTrigger className="text-purple-700">
                              <div className="flex items-center space-x-2">
                                <AlertTriangle className="h-5 w-5" />
                                <span>Side Effects</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>{selectedMethod.sideEffects}</AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="easeOfUse">
                            <AccordionTrigger className="text-purple-700">
                              <div className="flex items-center space-x-2">
                                <HelpCircle className="h-5 w-5" />
                                <span>Ease of Use</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>{selectedMethod.easeOfUse}</AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="availability">
                            <AccordionTrigger className="text-purple-700">
                              <div className="flex items-center space-x-2">
                                <Info className="h-5 w-5" />
                                <span>Availability</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>{selectedMethod.availability}</AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="specialConsiderations">
                            <AccordionTrigger className="text-purple-700">
                              <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5" />
                                <span>Special Considerations</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>{selectedMethod.specialConsiderations}</AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    ) : (
                      <p className="text-center text-purple-600 text-lg">Select a contraception method to view details.</p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="finder">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-purple-700">Find Suitable Methods</CardTitle>
                <CardDescription>Answer a few questions to find contraception methods that might work for you.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {questions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <h3 className="font-medium text-purple-800">{question.text}</h3>
                      <RadioGroup onValueChange={(value) => handleAnswerChange(question.id, value)} className="space-y-1">
                        {question.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                            <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                </div>
                <Card className="mt-6 bg-purple-100">
                  <CardHeader>
                    <CardTitle className="text-xl text-purple-800">Suitable Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getSuitableMethods().map((method, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow">
                          {method.icon}
                          <span className="text-purple-700">{method.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This information is for educational purposes only. After identifying a suitable method, please consult with a qualified healthcare professional for personalized advice and to discuss any potential risks or side effects.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}