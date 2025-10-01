import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Mock time slots - in production, these would come from the user's actual availability
  const availableTimeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ];

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
              <Button
                key={time}
                variant={selectedTime === time ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>

          {selectedTime && (
            <Button className="w-full mt-4">
              Schedule Meeting at {selectedTime}
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default CalendarView;
