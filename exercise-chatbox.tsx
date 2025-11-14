"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const FITNESS_KNOWLEDGE_BASE = {
  // Exercise information
  exercises: {
    pushups: "Push-ups work your chest, shoulders, and triceps. Start with 3 sets of 8-12 reps. Modify by doing knee push-ups if needed.",
    squats: "Squats target your quads, glutes, and hamstrings. Perform 3 sets of 10-15 reps with proper form. Keep your chest up and knees tracking over toes.",
    deadlifts: "Deadlifts work your entire posterior chain. Start with light weight and focus on hip hinge movement. 3 sets of 6-10 reps.",
    pullups: "Pull-ups strengthen your back and biceps. If you can't do one yet, try assisted pull-ups or negative pull-ups. Aim for 3 sets of 3-8 reps.",
    planks: "Planks build core stability. Hold for 30-60 seconds, focusing on keeping your body in a straight line. 3 sets."
  },
  
  // Muscle groups
  muscles: {
    chest: "Chest exercises: Push-ups, bench press, dumbbell flyes, dips. Aim for 2-3 exercises, 3 sets each, 8-12 reps.",
    back: "Back exercises: Pull-ups, rows, lat pulldowns, deadlifts. Include both vertical and horizontal pulling movements. 3-4 exercises, 3 sets each.",
    legs: "Leg exercises: Squats, lunges, deadlifts, leg press. Focus on compound movements. 3-4 exercises, 3-5 sets each.",
    shoulders: "Shoulder exercises: Overhead press, lateral raises, front raises, rear delt flyes. 3 exercises, 3 sets each, 10-15 reps.",
    arms: "Arm exercises: Bicep curls, tricep extensions, hammer curls, dips. 2-3 exercises for each muscle, 3 sets, 10-15 reps."
  },
  
  // Workout splits
  splits: {
    pushpulllegs: "Push/Pull/Legs split:\n- Push: Chest, shoulders, triceps\n- Pull: Back, biceps\n- Legs: Quads, hamstrings, glutes, calves\nRest day between each session.",
    upperlower: "Upper/Lower split:\n- Upper body: Chest, back, shoulders, arms\n- Lower body: Legs, glutes, calves\nAlternate between upper and lower days.",
    fullbody: "Full body workouts target all major muscle groups in each session. Ideal for beginners. 3-4 sessions per week with rest days between."
  },
  
  // Rep/set recommendations
  reps: {
    strength: "Strength training: 3-5 reps, 3-6 sets, heavy weight, 2-3 min rest",
    hypertrophy: "Hypertrophy: 6-12 reps, 3-4 sets, moderate weight, 60-90 sec rest",
    endurance: "Endurance training: 12-20 reps, 2-3 sets, light weight, 30-60 sec rest"
  }
};

const SUGGESTED_QUESTIONS = [
  "How many reps should I do for muscle growth?",
  "What exercises work the chest?",
  "Explain the push/pull/legs split",
  "How to do a proper squat?",
  "Best exercises for beginners?"
];

export default function FitnessChatbox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your fitness assistant. Ask me about exercises, muscle groups, workout splits, or rep ranges!",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for exercise queries
    for (const [exercise, info] of Object.entries(FITNESS_KNOWLEDGE_BASE.exercises)) {
      if (lowerMessage.includes(exercise)) {
        return info;
      }
    }
    
    // Check for muscle group queries
    for (const [muscle, info] of Object.entries(FITNESS_KNOWLEDGE_BASE.muscles)) {
      if (lowerMessage.includes(muscle)) {
        return info;
      }
    }
    
    // Check for workout split queries
    for (const [split, info] of Object.entries(FITNESS_KNOWLEDGE_BASE.splits)) {
      if (lowerMessage.includes(split)) {
        return info;
      }
    }
    
    // Check for rep range queries
    for (const [goal, info] of Object.entries(FITNESS_KNOWLEDGE_BASE.reps)) {
      if (lowerMessage.includes(goal) || lowerMessage.includes("rep") || lowerMessage.includes("set")) {
        return info;
      }
    }
    
    // Default responses
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! How can I help with your fitness journey today?";
    }
    
    if (lowerMessage.includes("thank")) {
      return "You're welcome! Keep up the great work!";
    }
    
    return "I can help with exercises, muscle groups, workout splits, and rep ranges. Try asking about specific exercises like 'push-ups' or goals like 'muscle growth'.";
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "" || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-background border border-border rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
        <Dumbbell className="h-6 w-6" />
        <div>
          <h1 className="text-xl font-bold">Fitness Assistant</h1>
          <p className="text-sm text-primary-foreground/80">Ask about exercises, reps, and workout plans</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-secondary text-secondary-foreground rounded-bl-none"
              }`}
            >
              <div className="whitespace-pre-wrap">{message.text}</div>
              <div
                className={`text-xs mt-1 ${
                  message.sender === "user" ? "text-primary-foreground/70" : "text-secondary-foreground/70"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-secondary-foreground rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-secondary-foreground rounded-full animate-bounce delay-100"></div>
                <div className="h-2 w-2 bg-secondary-foreground rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 bg-muted/50 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-xs bg-background border border-border rounded-full px-3 py-1 hover:bg-primary/10 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-background">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about fitness, exercises, or workout plans..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || inputValue.trim() === ""}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Fitness Assistant v1.0 • Responses are for informational purposes only
        </p>
      </div>
    </div>
  );
}