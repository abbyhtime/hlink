import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Calendar as CalendarIcon, MessageSquare, Settings, MapPin, Video, Palette, RotateCcw } from 'lucide-react';
import { ImageUploadField } from '@/components/ImageUploadField';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const ConfigureHIP = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  
  const [config, setConfig] = useState({
    is_public: false,
    show_calendar: true,
    show_chatbot: true,
    profile_description: '',
    brand_colors: {
      primary: '#479E7D',
      secondary: '#2A2A2A',
    },
    // Calendar features
    show_intelligent_alerts: true,
    show_suggested_venues: true,
    enable_calendar_integration: true,
    show_smart_scheduling: true,
    // Meeting flow
    enable_meeting_scheduling: true,
    require_meeting_purpose: true,
    enable_meeting_reminders: true,
    collect_guest_email: true,
    // Assistant settings
    assistant_interaction_level: 'enhanced',
    enable_interactive_buttons: true,
    enable_calendar_connection_flow: true,
    // Preferences
    preferred_meeting_types: ['in-person', 'virtual'],
    virtual_platforms: ['zoom', 'teams', 'meet'],
    // Theme customization
    custom_theme: {
      backgroundColor: 'hsl(var(--background))',
      cardBackground: 'hsl(var(--card))',
      primaryColor: 'hsl(var(--primary))',
      secondaryColor: 'hsl(var(--secondary))',
      accentColor: 'hsl(var(--accent))',
      textColor: 'hsl(var(--foreground))',
      borderColor: 'hsl(var(--border))',
      borderRadius: '0.5rem',
      sectionSpacing: '2rem',
    },
    banner_image_url: '',
    agent_avatar_url: '',
    custom_css: '',
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

      // Load profile username
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileData?.username) {
        setUsername(profileData.username);
      }

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

        // Type guard for string arrays
        const isStringArray = (arr: any): arr is string[] => {
          return Array.isArray(arr) && arr.every(item => typeof item === 'string');
        };

        const customTheme = typeof data.custom_theme === 'object' && data.custom_theme !== null
          ? data.custom_theme as any
          : config.custom_theme;
          
        setConfig({
          is_public: data.is_public,
          show_calendar: data.show_calendar,
          show_chatbot: data.show_chatbot,
          profile_description: data.profile_description || '',
          brand_colors: brandColors,
          show_intelligent_alerts: data.show_intelligent_alerts ?? true,
          show_suggested_venues: data.show_suggested_venues ?? true,
          enable_calendar_integration: data.enable_calendar_integration ?? true,
          show_smart_scheduling: data.show_smart_scheduling ?? true,
          enable_meeting_scheduling: data.enable_meeting_scheduling ?? true,
          require_meeting_purpose: data.require_meeting_purpose ?? true,
          enable_meeting_reminders: data.enable_meeting_reminders ?? true,
          collect_guest_email: data.collect_guest_email ?? true,
          assistant_interaction_level: data.assistant_interaction_level || 'enhanced',
          enable_interactive_buttons: data.enable_interactive_buttons ?? true,
          enable_calendar_connection_flow: data.enable_calendar_connection_flow ?? true,
          preferred_meeting_types: isStringArray(data.preferred_meeting_types) ? data.preferred_meeting_types : ['in-person', 'virtual'],
          virtual_platforms: isStringArray(data.virtual_platforms) ? data.virtual_platforms : ['zoom', 'teams', 'meet'],
          custom_theme: customTheme,
          banner_image_url: data.banner_image_url || '',
          agent_avatar_url: data.agent_avatar_url || '',
          custom_css: data.custom_css || '',
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

  const validateUsername = (value: string): boolean => {
    if (!value) {
      setUsernameError('Username is required');
      return false;
    }
    if (value.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      setUsernameError('Username can only contain letters, numbers, hyphens, and underscores');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    validateUsername(value);
  };

  const handleRestoreDefaults = () => {
    setConfig({
      ...config,
      custom_theme: {
        backgroundColor: 'hsl(var(--background))',
        cardBackground: 'hsl(var(--card))',
        primaryColor: 'hsl(var(--primary))',
        secondaryColor: 'hsl(var(--secondary))',
        accentColor: 'hsl(var(--accent))',
        textColor: 'hsl(var(--foreground))',
        borderColor: 'hsl(var(--border))',
        borderRadius: '0.5rem',
        sectionSpacing: '2rem',
      },
      banner_image_url: '',
      agent_avatar_url: '',
      custom_css: '',
    });

    toast({
      title: 'Defaults Restored',
      description: 'Visual customization settings have been reset. Remember to save your changes.',
    });
  };

  const handleSave = async () => {
    console.log('💾 Save button clicked');
    console.log('Current username:', username);
    console.log('Current config:', config);
    
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Validate username
      if (!validateUsername(username)) {
        console.error('❌ Username validation failed');
        setSaving(false);
        return;
      }

      console.log('✓ Username validated');

      // Check if username is already taken
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', user.id)
        .maybeSingle();

      if (existingProfile) {
        console.error('❌ Username already taken');
        setUsernameError('Username is already taken');
        setSaving(false);
        return;
      }

      console.log('✓ Username available');

      // Update profile username
      console.log('📝 Updating profile...');
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: username,
        });

      if (profileError) {
        console.error('❌ Profile update error:', profileError);
        throw profileError;
      }

      console.log('✓ Profile updated');

      // Update hip configuration
      console.log('📝 Updating hip configuration...');
      const { error } = await supabase
        .from('hip_configurations')
        .upsert({
          user_id: user.id,
          ...config,
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('❌ Config update error:', error);
        throw error;
      }

      console.log('✅ Configuration saved successfully!');

      toast({
        title: 'Success!',
        description: config.is_public 
          ? `Your hIP is now live at /hip/${username}` 
          : 'Your hIP configuration has been saved.',
      });

      // Reload to show updated status
      setTimeout(() => {
        console.log('🔄 Reloading page...');
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('❌ Save error:', error);
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
          {config.is_public && username && (
            <Card className="border-sage bg-sage/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sage">🌐 Your hIP is Public</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Share your link: <span className="font-mono text-sage">/hip/{username}</span>
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/hip/${username}`)}
                  >
                    View Live Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Username</CardTitle>
              <CardDescription>Your unique URL identifier</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="your-username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                className={usernameError ? 'border-destructive' : ''}
              />
              {usernameError ? (
                <p className="text-sm text-destructive">{usernameError}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your page will be available at: /hip/{username || 'your-username'}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className={config.is_public ? 'border-sage' : ''}>
            <CardHeader>
              <CardTitle>Visibility Settings</CardTitle>
              <CardDescription>
                {!username || usernameError 
                  ? '⚠️ Set a valid username before publishing' 
                  : 'Control who can see your hIP'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public">Make Profile Public</Label>
                  <p className="text-sm text-muted-foreground">
                    {config.is_public 
                      ? '✓ Your hIP is public (remember to save!)' 
                      : 'Your hIP is currently private'}
                  </p>
                </div>
                <Switch
                  id="public"
                  checked={config.is_public}
                  onCheckedChange={(checked) => setConfig({ ...config, is_public: checked })}
                  disabled={!username || !!usernameError}
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
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="suggested-venues">Show Suggested Venues</Label>
                  <p className="text-sm text-muted-foreground">Display venue recommendations section</p>
                </div>
                <Switch
                  id="suggested-venues"
                  checked={config.show_suggested_venues}
                  onCheckedChange={(checked) => setConfig({ ...config, show_suggested_venues: checked })}
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

          {/* Visual Customization */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Visual Customization
                  </CardTitle>
                  <CardDescription>Upload images and customize your page theme</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRestoreDefaults}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Restore Defaults
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Banner Image Upload */}
              <ImageUploadField
                label="Banner Image"
                description="Upload a banner image for your HIP page (recommended: 1200x300px)"
                bucket="hip-banners"
                currentImageUrl={config.banner_image_url}
                onImageUploaded={(url) => setConfig({ ...config, banner_image_url: url })}
                onImageRemoved={() => setConfig({ ...config, banner_image_url: '' })}
              />

              {/* Agent Avatar Upload */}
              <ImageUploadField
                label="Agent Avatar"
                description="Upload a profile picture for your assistant (recommended: 400x400px)"
                bucket="hip-avatars"
                currentImageUrl={config.agent_avatar_url}
                onImageUploaded={(url) => setConfig({ ...config, agent_avatar_url: url })}
                onImageRemoved={() => setConfig({ ...config, agent_avatar_url: '' })}
              />

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-4">Theme Colors</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bg-color">Background Color</Label>
                    <Input
                      id="bg-color"
                      type="color"
                      value={config.custom_theme.backgroundColor.includes('var') ? '#1a1a1a' : config.custom_theme.backgroundColor}
                      onChange={(e) => setConfig({
                        ...config,
                        custom_theme: { ...config.custom_theme, backgroundColor: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-bg-color">Card Background</Label>
                    <Input
                      id="card-bg-color"
                      type="color"
                      value={config.custom_theme.cardBackground.includes('var') ? '#2a2a2a' : config.custom_theme.cardBackground}
                      onChange={(e) => setConfig({
                        ...config,
                        custom_theme: { ...config.custom_theme, cardBackground: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="text-color">Text Color</Label>
                    <Input
                      id="text-color"
                      type="color"
                      value={config.custom_theme.textColor.includes('var') ? '#ffffff' : config.custom_theme.textColor}
                      onChange={(e) => setConfig({
                        ...config,
                        custom_theme: { ...config.custom_theme, textColor: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="border-color">Border Color</Label>
                    <Input
                      id="border-color"
                      type="color"
                      value={config.custom_theme.borderColor.includes('var') ? '#3a3a3a' : config.custom_theme.borderColor}
                      onChange={(e) => setConfig({
                        ...config,
                        custom_theme: { ...config.custom_theme, borderColor: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-4">Layout Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="border-radius">Border Radius</Label>
                    <Select
                      value={config.custom_theme.borderRadius}
                      onValueChange={(value) => setConfig({
                        ...config,
                        custom_theme: { ...config.custom_theme, borderRadius: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">None (0px)</SelectItem>
                        <SelectItem value="0.25rem">Small (4px)</SelectItem>
                        <SelectItem value="0.5rem">Medium (8px)</SelectItem>
                        <SelectItem value="0.75rem">Large (12px)</SelectItem>
                        <SelectItem value="1rem">Extra Large (16px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section-spacing">Section Spacing</Label>
                    <Select
                      value={config.custom_theme.sectionSpacing}
                      onValueChange={(value) => setConfig({
                        ...config,
                        custom_theme: { ...config.custom_theme, sectionSpacing: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1rem">Compact</SelectItem>
                        <SelectItem value="1.5rem">Comfortable</SelectItem>
                        <SelectItem value="2rem">Spacious</SelectItem>
                        <SelectItem value="3rem">Airy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="custom-css">Custom CSS (Advanced)</Label>
                  <Textarea
                    id="custom-css"
                    placeholder=".custom-class { color: red; }"
                    value={config.custom_css}
                    onChange={(e) => setConfig({ ...config, custom_css: e.target.value })}
                    rows={5}
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-muted-foreground">
                    Add custom CSS to further customize your page appearance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Advanced Features
              </CardTitle>
              <CardDescription>Configure intelligent scheduling and assistant behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {/* Calendar Features */}
                <AccordionItem value="calendar">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Calendar Features
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Intelligent Alerts</Label>
                        <p className="text-sm text-muted-foreground">Show contextual warnings about time slots</p>
                      </div>
                      <Switch
                        checked={config.show_intelligent_alerts}
                        onCheckedChange={(checked) => setConfig({ ...config, show_intelligent_alerts: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Calendar Integration</Label>
                        <p className="text-sm text-muted-foreground">Prompt users to connect Google Calendar</p>
                      </div>
                      <Switch
                        checked={config.enable_calendar_integration}
                        onCheckedChange={(checked) => setConfig({ ...config, enable_calendar_integration: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Smart Scheduling</Label>
                        <p className="text-sm text-muted-foreground">AI-powered scheduling suggestions</p>
                      </div>
                      <Switch
                        checked={config.show_smart_scheduling}
                        onCheckedChange={(checked) => setConfig({ ...config, show_smart_scheduling: checked })}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Meeting Flow */}
                <AccordionItem value="meeting">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Meeting Flow
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Meeting Scheduling</Label>
                        <p className="text-sm text-muted-foreground">Allow visitors to schedule meetings</p>
                      </div>
                      <Switch
                        checked={config.enable_meeting_scheduling}
                        onCheckedChange={(checked) => setConfig({ ...config, enable_meeting_scheduling: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Require Meeting Purpose</Label>
                        <p className="text-sm text-muted-foreground">Ask for meeting context before scheduling</p>
                      </div>
                      <Switch
                        checked={config.require_meeting_purpose}
                        onCheckedChange={(checked) => setConfig({ ...config, require_meeting_purpose: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Meeting Reminders</Label>
                        <p className="text-sm text-muted-foreground">Offer reminder setup options</p>
                      </div>
                      <Switch
                        checked={config.enable_meeting_reminders}
                        onCheckedChange={(checked) => setConfig({ ...config, enable_meeting_reminders: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Collect Guest Email</Label>
                        <p className="text-sm text-muted-foreground">Request visitor email for invitations</p>
                      </div>
                      <Switch
                        checked={config.collect_guest_email}
                        onCheckedChange={(checked) => setConfig({ ...config, collect_guest_email: checked })}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Assistant Behavior */}
                <AccordionItem value="assistant">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Assistant Behavior
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Interaction Level</Label>
                      <Select
                        value={config.assistant_interaction_level}
                        onValueChange={(value) => setConfig({ ...config, assistant_interaction_level: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic - Simple responses</SelectItem>
                          <SelectItem value="enhanced">Enhanced - Contextual assistance</SelectItem>
                          <SelectItem value="full">Full - Complete automation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Interactive Buttons</Label>
                        <p className="text-sm text-muted-foreground">Show action buttons in chat</p>
                      </div>
                      <Switch
                        checked={config.enable_interactive_buttons}
                        onCheckedChange={(checked) => setConfig({ ...config, enable_interactive_buttons: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Calendar Connection Flow</Label>
                        <p className="text-sm text-muted-foreground">Allow Google Calendar SSO in chat</p>
                      </div>
                      <Switch
                        checked={config.enable_calendar_connection_flow}
                        onCheckedChange={(checked) => setConfig({ ...config, enable_calendar_connection_flow: checked })}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Meeting Preferences */}
                <AccordionItem value="preferences">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Meeting Preferences
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-3">
                      <Label>Preferred Meeting Types</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="in-person"
                            checked={config.preferred_meeting_types.includes('in-person')}
                            onCheckedChange={(checked) => {
                              const types = checked
                                ? [...config.preferred_meeting_types, 'in-person']
                                : config.preferred_meeting_types.filter((t: string) => t !== 'in-person');
                              setConfig({ ...config, preferred_meeting_types: types });
                            }}
                          />
                          <label htmlFor="in-person" className="text-sm">In-Person Meetings</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="virtual"
                            checked={config.preferred_meeting_types.includes('virtual')}
                            onCheckedChange={(checked) => {
                              const types = checked
                                ? [...config.preferred_meeting_types, 'virtual']
                                : config.preferred_meeting_types.filter((t: string) => t !== 'virtual');
                              setConfig({ ...config, preferred_meeting_types: types });
                            }}
                          />
                          <label htmlFor="virtual" className="text-sm">Virtual Meetings</label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Virtual Platforms</Label>
                      <div className="space-y-2">
                        {['zoom', 'teams', 'meet', 'whatsapp'].map((platform) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <Checkbox
                              id={platform}
                              checked={config.virtual_platforms.includes(platform)}
                              onCheckedChange={(checked) => {
                                const platforms = checked
                                  ? [...config.virtual_platforms, platform]
                                  : config.virtual_platforms.filter((p: string) => p !== platform);
                                setConfig({ ...config, virtual_platforms: platforms });
                              }}
                            />
                            <label htmlFor={platform} className="text-sm capitalize">{platform}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={saving || !!usernameError} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
            {username && (
              <Button 
                variant="outline" 
                onClick={() => navigate(`/hip/${username}`)}
                className="flex-1"
              >
                Preview
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigureHIP;
