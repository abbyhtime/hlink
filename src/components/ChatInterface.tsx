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
  onScheduleMeeting?: (meetingData: any) => void;
  onTimeSlotSelected?: string | null;
}

const ChatInterface = ({ agentName, agentPersonality, config, onScheduleMeeting, onTimeSlotSelected }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [meetingDetails, setMeetingDetails] = useState('');

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: `Hi! I'm ${agentName}, ${agentName.split(' ')[0]}'s personal assistant. Ask about availability or choose a time from the calendar. Connect your calendar for quick scheduling.`,
      timestamp: new Date(),
      buttons: [
        {
          label: 'Connect Calendar',
          action: 'connect_calendar'
        }
      ]
    };
    setMessages([welcomeMessage]);
  }, [agentName]);

  // Handle time slot selection from calendar
  useEffect(() => {
    if (onTimeSlotSelected && onTimeSlotSelected !== selectedTimeSlot) {
      setSelectedTimeSlot(onTimeSlotSelected);
      if (onTimeSlotSelected) {
        const userMessage: Message = {
          role: 'user',
          content: `I'd like to schedule a meeting at ${onTimeSlotSelected}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        
        setTimeout(() => {
          const botMessage: Message = {
            role: 'assistant',
            content: "Great! What's the meeting about?",
            timestamp: new Date(),
            buttons: [
              {
                label: 'Enter Details',
                action: 'enter_meeting_details'
              }
            ]
          };
          setMessages(prev => [...prev, botMessage]);
        }, 500);
      }
    }
  }, [onTimeSlotSelected]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleButtonClick = async (action: string, data?: any) => {
    if (action === 'connect_calendar') {
      setIsCalendarConnected(true);
      const connectMessage: Message = {
        role: 'assistant',
        content: 'Calendar connected to test@gmail.com! Now I can find the best times for you.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, connectMessage]);
    } else if (action === 'enter_meeting_details') {
      // Focus on input field
      const inputElement = document.querySelector('input[placeholder="Type your message..."]') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
        inputElement.placeholder = 'Enter meeting details...';
      }
    } else if (action === 'signup_htime') {
      window.open('https://htime.io/signup', '_blank');
      const followUpMessage: Message = {
        role: 'assistant',
        content: 'Great choice! If you don\'t wish to sign up, I can set up a reminder for this meeting instead.',
        timestamp: new Date(),
        buttons: [
          {
            label: 'Set 24h Reminder',
            action: 'set_reminder'
          },
          {
            label: 'No, thanks',
            action: 'close_conversation'
          }
        ]
      };
      setMessages(prev => [...prev, followUpMessage]);
    } else if (action === 'set_reminder') {
      const reminderMessage: Message = {
        role: 'assistant',
        content: '24-hour reminder set! Can I help with anything else?',
        timestamp: new Date(),
        buttons: [
          {
            label: 'Yes, please',
            action: 'continue_chat'
          },
          {
            label: 'No, that\'s all',
            action: 'close_conversation'
          }
        ]
      };
      setMessages(prev => [...prev, reminderMessage]);
    } else if (action === 'close_conversation') {
      const refNumber = `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const closingMessage: Message = {
        role: 'assistant',
        content: `Thanks! Email sent with reference number ${refNumber}. Feel free to come back and give me your reference number for further actions. Have a nice day!`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, closingMessage]);
    } else if (action === 'continue_chat') {
      const continueMessage: Message = {
        role: 'assistant',
        content: 'Sure! What else can I help you with?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, continueMessage]);
    } else if (action === 'confirm_meeting') {
      const confirmMessage: Message = {
        role: 'assistant',
        content: `Perfect! Meeting scheduled for ${selectedTimeSlot}.\n\nWould you like your own PA (Personal Assistant)? Signup with hTime, claim and configure your PA and we can make scheduling invisible to you!`,
        timestamp: new Date(),
        buttons: [
          {
            label: 'Signup to hTime',
            action: 'signup_htime'
          },
          {
            label: 'Set 24h Reminder',
            action: 'set_reminder'
          }
        ]
      };
      setMessages(prev => [...prev, confirmMessage]);
      if (onScheduleMeeting) {
        onScheduleMeeting({ time: selectedTimeSlot, details: data?.details || meetingDetails });
      }
    } else if (action === 'schedule') {
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
      const contextualConfig = {
        ...config,
        calendar_connected: isCalendarConnected,
        selected_time_slot: selectedTimeSlot
      };

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
          config: contextualConfig
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
      if (selectedTimeSlot && assistantMessage.toLowerCase().includes('meeting about')) {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[assistantIndex] = {
            ...newMessages[assistantIndex],
            buttons: [
              {
                label: 'Confirm Meeting',
                action: 'confirm_meeting',
                data: { time: selectedTimeSlot }
              }
            ]
          };
          return newMessages;
        });
      } else if (config?.enable_interactive_buttons && conversationContext.includes('user_wants_to_schedule')) {
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

    // Check if this is meeting details after time selection
    if (selectedTimeSlot && !meetingDetails) {
      setMeetingDetails(input);
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      
      // Confirm meeting and show post-meeting flow
      setTimeout(() => {
        const confirmMessage: Message = {
          role: 'assistant',
          content: `Perfect! Meeting scheduled for ${selectedTimeSlot}.\n\nDetails: ${input}\n\nWould you like your own PA (Personal Assistant)? Signup with hTime, claim and configure your PA and we can make scheduling invisible to you!`,
          timestamp: new Date(),
          buttons: [
            {
              label: 'Signup to hTime',
              action: 'signup_htime'
            },
            {
              label: 'Set 24h Reminder',
              action: 'set_reminder'
            }
          ]
        };
        setMessages(prev => [...prev, confirmMessage]);
        if (onScheduleMeeting) {
          onScheduleMeeting({ time: selectedTimeSlot, details: input });
        }
      }, 500);
      return;
    }

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
