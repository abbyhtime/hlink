import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  typing?: boolean;
}

const Assistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your scheduling assistant. I can help you find the perfect time to meet with your contact. Just tell me what you need!",
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const mockResponses = [
    "I'd be happy to help you schedule that meeting! What days work best for you?",
    "Let me check the available time slots... I see Tuesday at 2 PM and Thursday at 10 AM are open. Which would you prefer?",
    "Perfect! I'll send the invite for Tuesday at 2 PM. You'll receive a confirmation shortly.",
    "I've found 3 available slots this week: Monday 3 PM, Wednesday 11 AM, and Friday 2 PM. Which works for you?",
    "Great choice! The meeting is now scheduled. I'll send calendar invites to both parties.",
    "I can help with that! Are you looking for a quick 15-minute call or a longer meeting?",
    "Based on your contact's preferences, I'd recommend either morning slots (9-11 AM) or late afternoon (4-6 PM). What's your preference?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-lightGray">
      {/* Header */}
      <div className="bg-charcoal/95 backdrop-blur-sm border-b border-lightGray/10 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-mintGreen/20 rounded-lg">
              <MessageCircle className="w-6 h-6 text-mintGreen" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-lightGray">AI Scheduling Assistant</h1>
              <p className="text-sm text-lightGray/70">Help schedule meetings without bothering your contacts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-120px)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex animate-fade-in",
                message.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 shadow-lg",
                  message.sender === 'user'
                    ? "bg-mintGreen text-white rounded-br-md"
                    : "bg-lightGray/10 text-lightGray rounded-bl-md border border-lightGray/20"
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={cn(
                  "text-xs mt-2 opacity-70",
                  message.sender === 'user' ? "text-white/70" : "text-lightGray/50"
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-lightGray/10 border border-lightGray/20 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-mintGreen rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-mintGreen rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-mintGreen rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-xs text-lightGray/70 ml-2">Assistant is typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-lightGray/10 bg-charcoal/95 backdrop-blur-sm p-4">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message... (e.g., 'I want to schedule a call')"
                className="bg-lightGray/5 border-lightGray/20 text-lightGray placeholder:text-lightGray/50 pr-12 rounded-xl focus:ring-mintGreen focus:border-mintGreen"
                disabled={isTyping}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="bg-mintGreen hover:bg-mintGreen/90 text-white rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-3 max-w-4xl mx-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue("I want to schedule a call")}
              className="text-xs bg-lightGray/5 border-lightGray/20 text-lightGray hover:bg-lightGray/10"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Schedule a call
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue("What's the earliest available time?")}
              className="text-xs bg-lightGray/5 border-lightGray/20 text-lightGray hover:bg-lightGray/10"
            >
              <Clock className="w-3 h-3 mr-1" />
              Earliest time
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputValue("Help me find a good meeting time")}
              className="text-xs bg-lightGray/5 border-lightGray/20 text-lightGray hover:bg-lightGray/10"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Find meeting time
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;