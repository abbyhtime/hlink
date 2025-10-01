import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  agentName: string;
  agentPersonality?: string;
  config?: any;
}

const ChatInterface = ({ agentName, agentPersonality, config }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm ${agentName}. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response based on interaction level
    setTimeout(() => {
      let responses: string[] = [];
      
      if (config?.assistant_interaction_level === 'basic') {
        responses = [
          `Thank you for your message. I'll get back to you soon.`,
          `Message received. How can I help you today?`,
          `I'm here to assist. What do you need?`,
        ];
      } else if (config?.assistant_interaction_level === 'full') {
        responses = [
          `I understand you're looking to schedule a meeting. ${config?.enable_calendar_integration ? 'Would you like to connect your Google Calendar for easier scheduling?' : 'Let me check the available time slots.'}`,
          `Thank you for reaching out! ${config?.show_smart_scheduling ? 'Based on the calendar, I can suggest optimal meeting times. Do you need something ASAP or are you flexible?' : 'I can help you find a time slot.'}`,
          `I'd be happy to coordinate this meeting. ${config?.require_meeting_purpose ? 'Could you briefly share the purpose or context for this meeting?' : 'What timeframe works best?'}`,
        ];
      } else {
        responses = [
          `I understand you're looking to schedule a meeting. Let me help you find the best time slot.`,
          `Thank you for reaching out! I can assist you with scheduling and availability.`,
          `Based on the current calendar, I can suggest meeting times for you.`,
        ];
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isTyping}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
