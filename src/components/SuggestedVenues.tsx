import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      { name: 'Zoom', icon: Video, url: 'https://zoom.us' },
      { name: 'Google Meet', icon: Video, url: 'https://meet.google.com' },
      { name: 'Microsoft Teams', icon: Video, url: 'https://teams.microsoft.com' },
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
            <div className="space-y-2">
              {suggestedVenues['virtual'].map((platform) => {
                const Icon = platform.icon;
                return (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 border rounded-lg hover:bg-accent transition-colors"
                    style={{ 
                      borderColor: customTheme.borderColor,
                      borderRadius: customTheme.borderRadius,
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{platform.name}</span>
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
