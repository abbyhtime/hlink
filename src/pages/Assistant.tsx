import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  typing?: boolean;
}

const Assistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your Executive Assistant. I help busy professionals like you schedule meetings efficiently. What meeting would you like to schedule today?",
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    purpose: '',
    duration: '',
    timing: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const extractInfoFromMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();
    const newContext = { ...conversationContext };
    
    // Extract purpose/context
    if (lowerMessage.includes('call') || lowerMessage.includes('meeting') || lowerMessage.includes('discuss') || 
        lowerMessage.includes('review') || lowerMessage.includes('catchup') || lowerMessage.includes('forecasting') ||
        lowerMessage.includes('project') || lowerMessage.includes('planning') || lowerMessage.includes('sync')) {
      if (!newContext.purpose) {
        if (lowerMessage.includes('forecasting')) newContext.purpose = 'forecasting call';
        else if (lowerMessage.includes('catchup')) newContext.purpose = 'regular catchup';
        else if (lowerMessage.includes('project')) newContext.purpose = 'project discussion';
        else if (lowerMessage.includes('review')) newContext.purpose = 'review meeting';
        else if (lowerMessage.includes('planning')) newContext.purpose = 'planning session';
        else newContext.purpose = 'meeting';
      }
    }
    
    // Extract duration
    if (lowerMessage.includes('30 min') || lowerMessage.includes('thirty min') || lowerMessage.includes('half hour')) {
      newContext.duration = '30 minutes';
    } else if (lowerMessage.includes('hour') || lowerMessage.includes('1 hour') || lowerMessage.includes('60 min')) {
      newContext.duration = '1 hour';
    } else if (lowerMessage.includes('15 min') || lowerMessage.includes('quick') || lowerMessage.includes('brief')) {
      newContext.duration = '15 minutes';
    } else if (lowerMessage.includes('no more than')) {
      if (lowerMessage.includes('30')) newContext.duration = '30 minutes max';
      else if (lowerMessage.includes('hour')) newContext.duration = '1 hour max';
    }
    
    // Extract timing preferences
    if (lowerMessage.includes('morning') || lowerMessage.includes('afternoon') || lowerMessage.includes('evening') ||
        lowerMessage.includes('tuesday') || lowerMessage.includes('wednesday') || lowerMessage.includes('thursday') ||
        lowerMessage.includes('friday') || lowerMessage.includes('monday') || lowerMessage.includes('tomorrow') ||
        lowerMessage.includes('next week') || lowerMessage.includes('this week')) {
      if (!newContext.timing) {
        if (lowerMessage.includes('morning')) {
          if (lowerMessage.includes('tuesday') && lowerMessage.includes('thursday')) {
            newContext.timing = 'mornings, Tuesday to Thursday';
          } else {
            newContext.timing = 'mornings';
          }
        } else if (lowerMessage.includes('afternoon')) {
          newContext.timing = 'afternoons';
        } else if (lowerMessage.includes('tuesday') && lowerMessage.includes('thursday')) {
          newContext.timing = 'Tuesday to Thursday';
        } else if (lowerMessage.includes('tomorrow')) {
          newContext.timing = 'tomorrow';
        } else if (lowerMessage.includes('next week')) {
          newContext.timing = 'next week';
        }
      }
    }
    
    return newContext;
  };

  const getSmartResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    // Update conversation context with new information
    const updatedContext = extractInfoFromMessage(userMessage);
    setConversationContext(updatedContext);
    
    // Check what information we still need
    const needsPurpose = !updatedContext.purpose;
    const needsDuration = !updatedContext.duration;
    const needsTiming = !updatedContext.timing;
    
    // If we have everything, suggest times
    if (!needsPurpose && !needsDuration && !needsTiming) {
      return `Perfect! I have all the details:\n• Purpose: ${updatedContext.purpose}\n• Duration: ${updatedContext.duration}\n• Timing: ${updatedContext.timing}\n\nLet me check your calendar... I found 3 great time slots:\n\n📅 Tuesday 9:30 AM - 10:00 AM\n📅 Wednesday 10:00 AM - 10:30 AM\n📅 Thursday 9:00 AM - 9:30 AM\n\nWhich works best for you?`;
    }
    
    // General availability queries
    if (message.includes('available') || message.includes('free') && message.includes('next')) {
      return "Looking at your calendar, you have good availability this week. Tuesday afternoon, Wednesday morning, and Friday are relatively open. What type of meeting are you looking to schedule?";
    }
    
    // Build response based on missing information
    let response = "Great! ";
    const missing = [];
    
    if (needsPurpose) missing.push("What's the main purpose of this meeting?");
    if (needsDuration) missing.push("How long should it be?");
    if (needsTiming) missing.push("Do you have any preferred days or times?");
    
    if (missing.length === 3) {
      return "I'd be happy to help schedule that! To find the perfect time, I'll need to know: What's the meeting about? How long should it be? Any time preferences?";
    } else if (missing.length === 2) {
      response += missing.join(" And ");
    } else if (missing.length === 1) {
      response += missing[0];
    }
    
    return response;
  };

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
      const smartResponse = getSmartResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: smartResponse,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
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
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="icon"
              className="text-lightGray hover:text-mintGreen hover:bg-lightGray/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="p-2 bg-mintGreen/20 rounded-lg">
              <MessageCircle className="w-6 h-6 text-mintGreen" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-lightGray">Executive Assistant</h1>
              <p className="text-sm text-lightGray/70">Your AI scheduling assistant</p>
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