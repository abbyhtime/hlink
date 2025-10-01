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

  const loadPublicProfile = async () => {
    try {
      setLoading(true);
      console.log('Loading profile for username:', username);
      
      // Step 1: Get the profile by username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('username', username)
        .maybeSingle();

      console.log('Profile query result:', { profileData, profileError });

      if (profileError) {
        console.error('Profile error:', profileError);
        setLoading(false);
        return;
      }

      if (!profileData) {
        console.log('No profile data found');
        setLoading(false);
        return;
      }

      // Step 2: Get the hip configuration for this user
      const { data: configData, error: configError } = await supabase
        .from('hip_configurations')
        .select('*')
        .eq('user_id', profileData.id)
        .eq('is_public', true)
        .maybeSingle();

      console.log('Config query result:', { configData, configError });

      if (configError) {
        console.error('Config error:', configError);
        setLoading(false);
        return;
      }

      if (!configData) {
        console.log('No public config found');
        setLoading(false);
        return;
      }

      // Step 3: Get the agent for this user
      const { data: agentData, error: agentError } = await supabase
        .from('executive_agents')
        .select('*')
        .eq('user_id', profileData.id)
        .maybeSingle();

      console.log('Agent query result:', { agentData, agentError });

      if (agentError) {
        console.error('Agent error:', agentError);
        // Don't return - agent is optional
      }

      console.log('Final data:', { profile: profileData, config: configData, agent: agentData });
      
      setProfile(profileData);
      setConfig(configData);
      setAgent(agentData);
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
                    {agent?.name || 'Personal Assistant'}
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
