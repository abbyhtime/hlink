import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Settings, Eye, ArrowLeft } from 'lucide-react';
import AgentEditDialog from '@/components/AgentEditDialog';
import { DeleteAssistantDialog } from '@/components/DeleteAssistantDialog';

const MyAssistant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [agent, setAgent] = useState<any>(null);
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    loadAgent();
  }, [user]);

  const loadAgent = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('executive_agents')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        navigate('/claim-assistant');
        return;
      }

      setAgent(data);

      // Load username and hip config
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileData?.username) {
        setUsername(profileData.username);
      }

      // Check if hIP is published
      const { data: hipData } = await supabase
        .from('hip_configurations')
        .select('is_published')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (hipData) {
        setIsPublished(hipData.is_published || false);
      }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sage" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal p-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
          <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Personal Assistant</h1>
            <p className="text-gray-400">Manage your AI assistant settings and Inquiry Page profile</p>
          </div>
            {agent && <DeleteAssistantDialog agentId={agent.id} />}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Assistant Profile</CardTitle>
              <CardDescription>Your assistant's identity and capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-lg font-medium">{agent.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Personality</p>
                <p className="text-lg font-medium capitalize">{agent.personality}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Capabilities</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {agent.capabilities?.map((cap: string) => (
                    <span key={cap} className="px-2 py-1 bg-sage/20 text-sage rounded text-sm">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
              <AgentEditDialog agent={agent} onUpdate={loadAgent} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>hIP (hTime Inquiry Page)</CardTitle>
              <CardDescription>Configure your hTime Inquiry Page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share your assistant with the world. Visitors can chat with your assistant and schedule meetings directly.
              </p>
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/configure-hip')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configure hIP
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate(`/hip/${username || agent.user_id}`)}
                  disabled={!username || !isPublished}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {!username ? 'Set Username First' : !isPublished ? 'Publish hIP First' : 'View Inquiry Page'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyAssistant;
