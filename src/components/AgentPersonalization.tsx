import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AgentPersonalizationProps {
  data: any;
  onChange: (data: any) => void;
}

const AgentPersonalization = ({ data, onChange }: AgentPersonalizationProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Assistant Name</Label>
        <Input
          id="name"
          placeholder="e.g., Alex, Jordan, Sam"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Gender Presentation</Label>
        <RadioGroup
          value={data.gender}
          onValueChange={(value) => onChange({ ...data, gender: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="neutral" id="neutral" />
            <Label htmlFor="neutral">Neutral</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="personality">Personality</Label>
        <Select
          value={data.personality}
          onValueChange={(value) => onChange({ ...data, personality: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="voice">Voice</Label>
        <Select
          value={data.voice}
          onValueChange={(value) => onChange({ ...data, voice: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alloy">Alloy</SelectItem>
            <SelectItem value="echo">Echo</SelectItem>
            <SelectItem value="fable">Fable</SelectItem>
            <SelectItem value="onyx">Onyx</SelectItem>
            <SelectItem value="nova">Nova</SelectItem>
            <SelectItem value="shimmer">Shimmer</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AgentPersonalization;
