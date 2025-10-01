import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { AlertTriangle } from 'lucide-react';

interface CalendarViewProps {
  config: any;
  onTimeSlotSelect?: (timeSlot: string) => void;
}

const CalendarView = ({ config, onTimeSlotSelect }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeSlotAlerts, setTimeSlotAlerts] = useState<Record<string, string>>({});

  // Mock time slots - in production, these would come from the user's actual availability
  const availableTimeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ];

  // Intelligent alerts pool
  const alertMessages = [
    'Usually Tim or Joe is busy during this hour, high chance they might ask for a reschedule',
    'There is an upcoming trip that Tim/Joe hasn\'t marked here, I\'d recommend a later date',
    'This time slot is popular and often gets booked quickly',
    'Back-to-back meetings are scheduled around this time, energy might be lower',
    'This is typically a high-focus work period - virtual meetings work better',
    'Travel time from previous meeting might make this tight',
    'End of day slot - consider energy levels for important discussions',
    'Morning slots tend to have better engagement for strategy discussions',
  ];

  // Generate random alerts for time slots when date changes
  useEffect(() => {
    if (config?.show_intelligent_alerts && selectedDate) {
      const newAlerts: Record<string, string> = {};
      // Randomly assign alerts to 2-3 time slots
      const numAlerts = Math.floor(Math.random() * 2) + 2;
      const shuffledSlots = [...availableTimeSlots].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < numAlerts && i < shuffledSlots.length; i++) {
        const randomAlert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
        newAlerts[shuffledSlots[i]] = randomAlert;
      }
      
      setTimeSlotAlerts(newAlerts);
    }
  }, [selectedDate, config?.show_intelligent_alerts]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate && onTimeSlotSelect) {
      const formattedTimeSlot = `${format(selectedDate, 'PPP')} at ${time}`;
      onTimeSlotSelect(formattedTimeSlot);
    }
  };

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
      />

      {selectedDate && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">
            Available times for {format(selectedDate, 'PPP')}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {availableTimeSlots.map((time) => (
              <div key={time} className="space-y-1">
                <Button
                  variant={selectedTime === time ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTimeSelect(time)}
                  className="w-full"
                >
                  {time}
                </Button>
                {config?.show_intelligent_alerts && timeSlotAlerts[time] && (
                  <div className="flex items-start gap-1 p-2 bg-amber-500/10 rounded text-xs text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{timeSlotAlerts[time]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedTime && (
            <Button className="w-full mt-4" disabled={!config?.enable_meeting_scheduling}>
              Schedule Meeting at {selectedTime}
            </Button>
          )}
        </Card>
      )}

    </div>
  );
};

export default CalendarView;
