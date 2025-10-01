import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save } from 'lucide-react';

const ConfigureHIP = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string>('');
  
  const [config, setConfig] = useState({
    is_public: false,
    show_calendar: true,
    show_chatbot: true,
    profile_description: '',
    brand_colors: {
      primary: '#479E7D',
      secondary: '#2A2A2A',
    },
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from('hip_configurations')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const brandColors = typeof data.brand_colors === 'object' && data.brand_colors !== null
          ? data.brand_colors as { primary: string; secondary: string }
          : config.brand_colors;
          
        setConfig({
          is_public: data.is_public,
          show_calendar: data.show_calendar,
          show_chatbot: data.show_chatbot,
          profile_description: data.profile_description || '',
          brand_colors: brandColors,
        });
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('hip_configurations')
        .upsert({
          user_id: user.id,
          ...config,
        });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Your hIP configuration has been saved.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
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
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Configure hIP</h1>
          <p className="text-gray-400">Customize your hTime Inquiry Page</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visibility Settings</CardTitle>
              <CardDescription>Control who can see your hIP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public">Make Profile Public</Label>
                  <p className="text-sm text-muted-foreground">Allow anyone to access your hIP</p>
                </div>
                <Switch
                  id="public"
                  checked={config.is_public}
                  onCheckedChange={(checked) => setConfig({ ...config, is_public: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="calendar">Show Calendar</Label>
                  <p className="text-sm text-muted-foreground">Display your availability calendar</p>
                </div>
                <Switch
                  id="calendar"
                  checked={config.show_calendar}
                  onCheckedChange={(checked) => setConfig({ ...config, show_calendar: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="chatbot">Show Chatbot</Label>
                  <p className="text-sm text-muted-foreground">Enable your executive assistant chatbot</p>
                </div>
                <Switch
                  id="chatbot"
                  checked={config.show_chatbot}
                  onCheckedChange={(checked) => setConfig({ ...config, show_chatbot: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Content</CardTitle>
              <CardDescription>Customize your public profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Profile Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell visitors about yourself, your services, or who you're looking to connect with..."
                  value={config.profile_description}
                  onChange={(e) => setConfig({ ...config, profile_description: e.target.value })}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Customize colors to match your brand</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary">Primary Color</Label>
                  <Input
                    id="primary"
                    type="color"
                    value={config.brand_colors.primary}
                    onChange={(e) => setConfig({
                      ...config,
                      brand_colors: { ...config.brand_colors, primary: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary">Secondary Color</Label>
                  <Input
                    id="secondary"
                    type="color"
                    value={config.brand_colors.secondary}
                    onChange={(e) => setConfig({
                      ...config,
                      brand_colors: { ...config.brand_colors, secondary: e.target.value }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/hip/${userId}`)}
              className="flex-1"
            >
              Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigureHIP;
