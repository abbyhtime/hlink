import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { MapPin, Video, AlertTriangle } from 'lucide-react';

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

  // Suggested venues based on meeting type
  const suggestedVenues = {
    'in-person': [
      { name: 'Starbucks Downtown', address: '123 Main St', mapsUrl: 'https://maps.google.com/?q=Starbucks+Downtown' },
      { name: 'WeWork Hub', address: '456 Tech Blvd', mapsUrl: 'https://maps.google.com/?q=WeWork+Hub' },
      { name: 'Local Coffee Co', address: '789 Park Ave', mapsUrl: 'https://maps.google.com/?q=Local+Coffee+Co' },
    ],
    'virtual': [
      { name: 'Zoom', icon: Video, url: 'https://zoom.us' },
      { name: 'Google Meet', icon: Video, url: 'https://meet.google.com' },
      { name: 'Microsoft Teams', icon: Video, url: 'https://teams.microsoft.com' },
      { name: 'WhatsApp', icon: Video, url: 'https://whatsapp.com' },
    ]
  };

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

      {/* Suggested Venues Section */}
      {config?.show_suggested_venues && selectedTime && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Suggested Venues
          </h3>
          
          {config?.preferred_meeting_types?.includes('in-person') && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">In-Person Options</h4>
              <div className="space-y-2">
                {suggestedVenues['in-person'].map((venue) => (
                  <a
                    key={venue.name}
                    href={venue.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{venue.name}</p>
                      <p className="text-xs text-muted-foreground">{venue.address}</p>
                    </div>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {config?.preferred_meeting_types?.includes('virtual') && (
            <div>
              <h4 className="text-sm font-medium mb-2">Virtual Platforms</h4>
              <div className="flex flex-wrap gap-2">
                {suggestedVenues['virtual']
                  .filter(platform => 
                    config?.virtual_platforms?.includes(platform.name.toLowerCase()) ||
                    config?.virtual_platforms?.includes(platform.name.toLowerCase().replace(' ', ''))
                  )
                  .map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 flex items-center gap-1">
                        <platform.icon className="h-3 w-3" />
                        {platform.name}
                      </Badge>
                    </a>
                  ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default CalendarView;
