import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Settings, Eye } from 'lucide-react';
import AgentEditDialog from '@/components/AgentEditDialog';

const MyAssistant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agent, setAgent] = useState<any>(null);
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgent();
  }, []);

  const loadAgent = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

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

      // Load username
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileData?.username) {
        setUsername(profileData.username);
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
          <h1 className="text-3xl font-bold text-white mb-2">My Executive Assistant</h1>
          <p className="text-gray-400">Manage your AI assistant settings and public profile</p>
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
              <CardTitle>Public Profile (hIP)</CardTitle>
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
                  disabled={!username}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {username ? 'Preview Public Page' : 'Set Username First'}
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
