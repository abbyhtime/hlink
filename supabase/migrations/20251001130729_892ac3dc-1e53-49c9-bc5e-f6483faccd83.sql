-- Add new configuration columns to hip_configurations table
ALTER TABLE public.hip_configurations
ADD COLUMN IF NOT EXISTS show_intelligent_alerts boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_suggested_venues boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_calendar_integration boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_smart_scheduling boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_meeting_scheduling boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS require_meeting_purpose boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_meeting_reminders boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS collect_guest_email boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS assistant_interaction_level text DEFAULT 'enhanced' CHECK (assistant_interaction_level IN ('basic', 'enhanced', 'full')),
ADD COLUMN IF NOT EXISTS enable_interactive_buttons boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_calendar_connection_flow boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS preferred_meeting_types jsonb DEFAULT '["in-person", "virtual"]'::jsonb,
ADD COLUMN IF NOT EXISTS venue_recommendations jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS virtual_platforms jsonb DEFAULT '["zoom", "teams", "meet"]'::jsonb;

COMMENT ON COLUMN public.hip_configurations.show_intelligent_alerts IS 'Enable contextual time slot warnings';
COMMENT ON COLUMN public.hip_configurations.show_suggested_venues IS 'Show venue recommendations section';
COMMENT ON COLUMN public.hip_configurations.enable_calendar_integration IS 'Allow Google Calendar connection prompts';
COMMENT ON COLUMN public.hip_configurations.show_smart_scheduling IS 'Enable AI-powered scheduling suggestions';
COMMENT ON COLUMN public.hip_configurations.enable_meeting_scheduling IS 'Allow actual meeting booking';
COMMENT ON COLUMN public.hip_configurations.require_meeting_purpose IS 'Ask for meeting context/purpose';
COMMENT ON COLUMN public.hip_configurations.enable_meeting_reminders IS 'Offer reminder setup options';
COMMENT ON COLUMN public.hip_configurations.collect_guest_email IS 'Ask for visitor email for invitations';
COMMENT ON COLUMN public.hip_configurations.assistant_interaction_level IS 'Controls chat assistant interaction level (basic/enhanced/full)';
COMMENT ON COLUMN public.hip_configurations.enable_interactive_buttons IS 'Show action buttons within chat messages';
COMMENT ON COLUMN public.hip_configurations.enable_calendar_connection_flow IS 'Allow in-chat calendar connection';
COMMENT ON COLUMN public.hip_configurations.preferred_meeting_types IS 'Preferred meeting types array';
COMMENT ON COLUMN public.hip_configurations.venue_recommendations IS 'Custom venue suggestions';
COMMENT ON COLUMN public.hip_configurations.virtual_platforms IS 'Preferred virtual meeting platforms';