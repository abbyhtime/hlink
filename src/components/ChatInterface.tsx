import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Calendar, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  buttons?: Array<{
    label: string;
    action: string;
    data?: any;
  }>;
}

interface ChatInterfaceProps {
  agentName: string;
  agentPersonality?: string;
  config?: any;
  onScheduleMeeting?: (timeSlot?: string) => void;
}

const ChatInterface = ({ agentName, agentPersonality, config, onScheduleMeeting }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm ${agentName}. ${config?.enable_meeting_scheduling ? 'I can help you schedule a meeting or answer any questions you have.' : 'How can I help you today?'}`,
      timestamp: new Date(),
      buttons: config?.enable_interactive_buttons && config?.enable_meeting_scheduling ? [
        { label: 'Schedule Meeting', action: 'schedule', data: {} }
      ] : undefined,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [conversationContext, setConversationContext] = useState<string[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleButtonClick = async (action: string, data?: any) => {
    if (action === 'schedule') {
      const schedulingMessage: Message = {
        role: 'user',
        content: 'I would like to schedule a meeting',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, schedulingMessage]);
      setConversationContext(prev => [...prev, 'user_wants_to_schedule']);
      
      await streamAIResponse([...messages, schedulingMessage]);
    } else if (action === 'select_time') {
      const timeMessage: Message = {
        role: 'user',
        content: `I'd like to book the ${data.time} time slot`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, timeMessage]);
      
      await streamAIResponse([...messages, timeMessage]);
    }
  };

  const streamAIResponse = async (messageHistory: Message[]) => {
    setIsTyping(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messageHistory.map(m => ({
            role: m.role,
            content: m.content
          })),
          config: config
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to start stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let textBuffer = '';
      let streamDone = false;

      // Add empty assistant message to start
      const assistantIndex = messageHistory.length;
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantMessage += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[assistantIndex] = {
                  ...newMessages[assistantIndex],
                  content: assistantMessage
                };
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Add interactive buttons based on conversation context
      if (config?.enable_interactive_buttons && conversationContext.includes('user_wants_to_schedule')) {
        const timeSlots = ['9:00 AM', '10:30 AM', '2:00 PM', '4:00 PM'];
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[assistantIndex] = {
            ...newMessages[assistantIndex],
            buttons: timeSlots.map(time => ({
              label: time,
              action: 'select_time',
              data: { time }
            }))
          };
          return newMessages;
        });
      }

    } catch (error) {
      console.error('Error streaming AI response:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    await streamAIResponse([...messages, userMessage]);
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
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.buttons && message.buttons.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.buttons.map((button, btnIndex) => (
                      <Button
                        key={btnIndex}
                        size="sm"
                        variant="outline"
                        onClick={() => handleButtonClick(button.action, button.data)}
                        className="text-xs"
                      >
                        {button.action === 'schedule' && <Calendar className="h-3 w-3 mr-1" />}
                        {button.action === 'select_time' && <Clock className="h-3 w-3 mr-1" />}
                        {button.label}
                      </Button>
                    ))}
                  </div>
                )}
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
