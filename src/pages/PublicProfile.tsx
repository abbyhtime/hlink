import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar as CalendarIcon, MessageSquare } from 'lucide-react';
import CalendarView from '@/components/CalendarView';
import ChatInterface from '@/components/ChatInterface';
import SuggestedVenues from '@/components/SuggestedVenues';

const PublicProfile = () => {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [agent, setAgent] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  useEffect(() => {
    loadPublicProfile();
  }, [username]);

  // Force reload when component mounts to ensure fresh data
  useEffect(() => {
    const timer = setTimeout(() => {
      loadPublicProfile();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const loadPublicProfile = async () => {
    try {
      // Load profile by username or user_id
      let profileData = null;
      
      // Try to find by username first
      const { data: byUsername, error: usernameError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle();
      
      if (byUsername) {
        profileData = byUsername;
      } else {
        // If not found by username, try by user_id
        const { data: byId, error: idError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', username)
          .maybeSingle();
        
        profileData = byId;
      }

      if (!profileData) {
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Load hip configuration
      const { data: configData, error: configError } = await supabase
        .from('hip_configurations')
        .select('*')
        .eq('user_id', profileData.id)
        .eq('is_public', true)
        .maybeSingle();

      if (configError) throw configError;
      if (!configData) {
        setLoading(false);
        return;
      }

      setConfig(configData);

      // Load agent if chatbot is enabled
      if (configData.show_chatbot) {
        const { data: agentData, error: agentError } = await supabase
          .from('executive_agents')
          .select('*')
          .eq('user_id', profileData.id)
          .maybeSingle();

        if (agentError) throw agentError;
        setAgent(agentData);
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
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

  if (!profile || !config) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Profile not found or not public</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const brandColors = config.brand_colors || { primary: '#479E7D', secondary: '#2A2A2A' };
  const customTheme = config.custom_theme || {};
  const bannerUrl = config.banner_image_url;
  const avatarUrl = config.agent_avatar_url;

  return (
    <>
      {config.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: config.custom_css }} />
      )}
      <div 
        className="min-h-screen p-4"
        style={{ 
          backgroundColor: customTheme.backgroundColor || brandColors.secondary,
          color: customTheme.textColor,
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Banner Image */}
          {bannerUrl && (
            <div 
              className="mb-6 rounded-lg overflow-hidden"
              style={{ borderRadius: customTheme.borderRadius }}
            >
              <img
                src={bannerUrl}
                alt="Profile Banner"
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Header */}
          <Card 
            className="mb-6"
            style={{ 
              backgroundColor: customTheme.cardBackground,
              borderColor: customTheme.borderColor,
              borderRadius: customTheme.borderRadius,
            }}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                {avatarUrl && (
                  <img
                    src={avatarUrl}
                    alt={agent?.name || 'Assistant'}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <CardTitle className="text-3xl" style={{ color: brandColors.primary }}>
                    {agent?.name || 'Executive Assistant'}
                  </CardTitle>
                  {config.profile_description && (
                    <p className="text-muted-foreground mt-2">{config.profile_description}</p>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Main Content */}
          <div 
            className="grid gap-6 lg:grid-cols-2"
            style={{ gap: customTheme.sectionSpacing }}
          >
            <div 
              className="space-y-6"
              style={{ gap: customTheme.sectionSpacing }}
            >
              {/* Calendar Section */}
              {config.show_calendar && (
                <Card
                  style={{ 
                    backgroundColor: customTheme.cardBackground,
                    borderColor: customTheme.borderColor,
                    borderRadius: customTheme.borderRadius,
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" style={{ color: brandColors.primary }} />
                      Schedule a Meeting
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CalendarView 
                      config={config}
                      onTimeSlotSelect={(time) => {
                        setSelectedTimeSlot(time);
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Suggested Venues Section */}
              {config.show_suggested_venues && <SuggestedVenues config={config} />}
            </div>

            {/* Chatbot Section */}
            {config.show_chatbot && agent && (
              <Card 
                className="lg:sticky lg:top-4 h-fit"
                style={{ 
                  backgroundColor: customTheme.cardBackground,
                  borderColor: customTheme.borderColor,
                  borderRadius: customTheme.borderRadius,
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" style={{ color: brandColors.primary }} />
                    Chat with {agent.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[500px]">
                    <ChatInterface 
                      agentName={agent.name}
                      agentPersonality={agent.personality}
                      config={config}
                      onTimeSlotSelected={selectedTimeSlot}
                      onScheduleMeeting={(meetingData) => {
                        console.log('Meeting scheduled:', meetingData);
                        setSelectedTimeSlot(null);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicProfile;
