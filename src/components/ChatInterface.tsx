
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User, Copy, Volume2, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useSpeech } from '@/hooks/use-speech';
import { cn } from '@/lib/utils';

const ChatInterface: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { speak, isSpeaking, stopSpeaking } = useSpeech();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyValidation = async () => {
    if (!apiKey.trim()) {
      toast.error("API key is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simple validation request to Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Hello" }
              ]
            }
          ]
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.candidates) {
        setIsKeyValid(true);
        toast.success("API key validated successfully");
        
        // Add initial system message
        setChatHistory([
          { 
            role: 'assistant', 
            content: "Hello! I'm your Drug AI Assistant. I can help you with information about medications, drug interactions, side effects, and more. How can I assist you today?" 
          }
        ]);
      } else {
        setIsKeyValid(false);
        toast.error(data.error?.message || "Invalid API key");
      }
    } catch (error) {
      console.error("Error validating API key:", error);
      setIsKeyValid(false);
      toast.error("Failed to validate API key");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !apiKey) return;
    
    const userMessage = { role: 'user' as const, content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      // Create message history in Gemini format
      const formattedHistory = chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      
      // Add current user message
      formattedHistory.push({
        role: 'user',
        parts: [{ text: userMessage.content }]
      });
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: formattedHistory,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.candidates && data.candidates[0].content) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      } else {
        console.error("API error:", data);
        toast.error(data.error?.message || "Failed to get response");
        setChatHistory(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble processing your request. Please try again." }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setChatHistory(prev => [...prev, { role: 'assistant', content: "I'm sorry, there was an error processing your request. Please check your internet connection and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  };

  const resetChat = () => {
    setChatHistory([
      { 
        role: 'assistant', 
        content: "Hello! I'm your Drug AI Assistant. I can help you with information about medications, drug interactions, side effects, and more. How can I assist you today?" 
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* API Key Input Section */}
      {!isKeyValid && (
        <Card className="mb-6 overflow-hidden border border-blue-100">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-3">Enter your Gemini API Key</h3>
            <p className="text-sm text-gray-500 mb-4">
              To use the chatbot, please provide your Gemini API key. You can get one from the Google AI Studio.
            </p>
            <div className="flex gap-2">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter Gemini API Key"
                className="flex-1"
              />
              <Button 
                onClick={handleKeyValidation} 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Validate
              </Button>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Your API key is only used in your browser and is not stored on our servers.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="overflow-hidden border border-slate-200">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div className="flex items-center">
            <Bot className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="font-medium">Drug AI Assistant</h3>
          </div>
          {isKeyValid && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetChat} 
              className="text-gray-500 hover:text-gray-700"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Chat Messages */}
        <div className="p-4 h-[500px] overflow-y-auto bg-slate-50/50">
          {chatHistory.map((chat, index) => (
            <div 
              key={index} 
              className={cn(
                "mb-4 flex",
                chat.role === 'user' ? "justify-end" : "justify-start",
                "message-animation opacity-0"
              )}
            >
              <div 
                className={cn(
                  "max-w-[80%] p-3 rounded-lg",
                  chat.role === 'user' 
                    ? "bg-blue-500 text-white rounded-tr-none" 
                    : "bg-white border border-slate-200 shadow-sm rounded-tl-none"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  {chat.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="text-xs font-medium">
                    {chat.role === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                </div>
                <div className="text-sm whitespace-pre-wrap">{chat.content}</div>
                
                {chat.role === 'assistant' && (
                  <div className="flex mt-2 gap-1 justify-end">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => copyToClipboard(chat.content)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={cn(
                        "h-6 w-6",
                        isSpeaking ? "text-blue-500" : ""
                      )}
                      onClick={() => {
                        if (isSpeaking) {
                          stopSpeaking();
                        } else {
                          speak(chat.content);
                        }
                      }}
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input */}
        {isKeyValid && (
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button 
                disabled={isLoading || !message.trim()} 
                onClick={sendMessage}
                className="self-end"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChatInterface;
