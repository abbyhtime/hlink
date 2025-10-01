import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import zoomLogo from '@/assets/zoom-logo.png';
import googleMeetLogo from '@/assets/google-meet-logo.png';
import teamsLogo from '@/assets/teams-logo.png';

interface SuggestedVenuesProps {
  config?: any;
}

const SuggestedVenues = ({ config }: SuggestedVenuesProps) => {
  const suggestedVenues = {
    'in-person': [
      { name: 'Starbucks Downtown', address: '123 Main St', mapsUrl: 'https://maps.google.com/?q=Starbucks+Downtown' },
      { name: 'WeWork Hub', address: '456 Tech Blvd', mapsUrl: 'https://maps.google.com/?q=WeWork+Hub' },
      { name: 'Local Coffee Co', address: '789 Park Ave', mapsUrl: 'https://maps.google.com/?q=Local+Coffee+Co' },
    ],
    'virtual': [
      { name: 'Zoom', logo: zoomLogo, url: 'https://zoom.us' },
      { name: 'Google Meet', logo: googleMeetLogo, url: 'https://meet.google.com' },
      { name: 'Microsoft Teams', logo: teamsLogo, url: 'https://teams.microsoft.com' },
    ],
  };

  if (!config?.show_suggested_venues) {
    return null;
  }

  const brandColors = config.brand_colors || { primary: '#479E7D', secondary: '#2A2A2A' };
  const customTheme = config.custom_theme || {};

  return (
    <Card
      style={{ 
        backgroundColor: customTheme.cardBackground,
        borderColor: customTheme.borderColor,
        borderRadius: customTheme.borderRadius,
      }}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" style={{ color: brandColors.primary }} />
          Suggested Venues
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {config?.preferred_meeting_types?.includes('in-person') && (
          <div>
            <h4 className="text-sm font-medium mb-2">In-Person Options</h4>
            <div className="space-y-2">
              {suggestedVenues['in-person'].map((venue) => (
                <a
                  key={venue.name}
                  href={venue.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border rounded-lg hover:bg-accent transition-colors"
                  style={{ 
                    borderColor: customTheme.borderColor,
                    borderRadius: customTheme.borderRadius,
                  }}
                >
                  <p className="font-medium">{venue.name}</p>
                  <p className="text-sm text-muted-foreground">{venue.address}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {config?.preferred_meeting_types?.includes('virtual') && (
          <div>
            <h4 className="text-sm font-medium mb-2">Virtual Options</h4>
            <div className="flex gap-4 justify-start">
              {suggestedVenues['virtual'].map((platform) => {
                return (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 border rounded-lg hover:bg-accent transition-colors"
                    style={{ 
                      borderColor: customTheme.borderColor,
                      borderRadius: customTheme.borderRadius,
                    }}
                    title={platform.name}
                  >
                    <img 
                      src={platform.logo} 
                      alt={platform.name}
                      className="h-10 w-10 object-contain"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestedVenues;
