import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar, Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';

interface AgentCapabilitiesProps {
  data: any;
  onChange: (data: any) => void;
}

const capabilities = [
  { id: 'scheduling', label: 'Meeting Scheduling', icon: Calendar },
  { id: 'email', label: 'Email Management', icon: Mail },
  { id: 'calls', label: 'Call Screening', icon: Phone },
  { id: 'venues', label: 'Venue Suggestions', icon: MapPin },
  { id: 'reminders', label: 'Smart Reminders', icon: Clock },
  { id: 'chat', label: 'Visitor Chat', icon: MessageSquare },
];

const AgentCapabilities = ({ data, onChange }: AgentCapabilitiesProps) => {
  const toggleCapability = (capabilityId: string) => {
    const current = data.capabilities || [];
    const updated = current.includes(capabilityId)
      ? current.filter((id: string) => id !== capabilityId)
      : [...current, capabilityId];
    onChange({ ...data, capabilities: updated });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Select the capabilities you want your assistant to have. You can always modify these later.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {capabilities.map((capability) => {
          const Icon = capability.icon;
          return (
            <div
              key={capability.id}
              className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer"
              onClick={() => toggleCapability(capability.id)}
            >
              <Checkbox
                checked={data.capabilities?.includes(capability.id)}
                onCheckedChange={() => toggleCapability(capability.id)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <Label className="cursor-pointer">{capability.label}</Label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentCapabilities;
