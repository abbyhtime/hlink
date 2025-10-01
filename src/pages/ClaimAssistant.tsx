import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AgentPersonalization from '@/components/AgentPersonalization';
import AgentCapabilities from '@/components/AgentCapabilities';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const ClaimAssistant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [agentData, setAgentData] = useState({
    name: '',
    gender: 'neutral',
    appearance: {},
    personality: 'professional',
    voice: 'alloy',
    capabilities: [] as string[],
    context: {},
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {

      const { error } = await supabase
        .from('executive_agents')
        .insert({
          user_id: user.id,
          ...agentData,
        });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Your personal assistant has been created.',
      });

      navigate('/my-assistant');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return agentData.name.length > 0;
    if (step === 2) return agentData.capabilities.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-charcoal p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Claim Your Personal Assistant</h1>
          <p className="text-gray-400">Let's personalize your AI assistant in {totalSteps} simple steps</p>
          <Progress value={progress} className="mt-4" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Step {step} of {totalSteps}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Personalize your assistant'}
              {step === 2 && 'Select capabilities'}
              {step === 3 && 'Review and confirm'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <AgentPersonalization 
                data={agentData} 
                onChange={setAgentData} 
              />
            )}
            {step === 2 && (
              <AgentCapabilities 
                data={agentData} 
                onChange={setAgentData} 
              />
            )}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Review Your Assistant</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {agentData.name}</p>
                  <p><span className="font-medium">Gender:</span> {agentData.gender}</p>
                  <p><span className="font-medium">Personality:</span> {agentData.personality}</p>
                  <p><span className="font-medium">Voice:</span> {agentData.voice}</p>
                  <p><span className="font-medium">Capabilities:</span> {agentData.capabilities.join(', ')}</p>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1 || loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed() || loading}
              >
                {step === totalSteps ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {loading ? 'Creating...' : 'Create Assistant'}
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClaimAssistant;
