
import React from 'react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';

// Add these imports at the top
import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useToast } from '@/hooks/use-toast';
import { Cross } from 'lucide-react';

// Add above Chat component
const API_KEY = import.meta.env.VITE_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Update Chat component
const Chat: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<{ content: string; role: 'user' | 'assistant' }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Add scroll effect
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add message handling
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    try {
      setMessages(prev => [...prev, { content, role: 'user' }]);
      setIsLoading(true);
      
      const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
      const result = await model.generateContent(content);
      const response = await result.response;
      
      setMessages(prev => [...prev, { content: response.text(), role: 'assistant' }]);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to get response from AI',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update return statement
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-white">
      <Header />
      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto mt-8 text-center mb-8 animate-fade-in">
          <div className="mb-4 inline-block p-1.5 bg-blue-50 rounded-full">
            <div className="bg-blue-500/10 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              Powered by Gemini
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">
            AI Drug Information Assistant
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ask questions about medications, dosages, side effects, interactions, and more. 
            Our AI assistant provides detailed information to help you make informed decisions.
          </p>
        </div>
        <ChatInterface />
        
        <div className="mt-12 max-w-2xl mx-auto text-center animate-fade-in opacity-0" style={{animationDelay: '0.3s'}}>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Example Questions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ExampleQuestion question="What are the side effects of ibuprofen?" />
            <ExampleQuestion question="How does metformin work for diabetes?" />
            <ExampleQuestion question="Can I take aspirin with lisinopril?" />
            <ExampleQuestion question="What is the normal dosage for amoxicillin?" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface ExampleQuestionProps {
  question: string;
}

const ExampleQuestion: React.FC<ExampleQuestionProps> = ({ question }) => {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow transition-all cursor-pointer text-left">
      <p className="text-gray-700">{question}</p>
    </div>
  );
};

export default Chat;
