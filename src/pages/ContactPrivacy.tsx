import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, Shield, User, Settings, Phone, Mail, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  company: string;
  role: string;
  avatar: string;
  isHTimeUser: boolean;
  privacyLevel: 'public' | 'protected' | 'private';
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    company: 'TechCorp Inc.',
    role: 'Product Manager',
    avatar: '👩‍💼',
    isHTimeUser: true,
    privacyLevel: 'protected'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'm.rodriguez@startup.io',
    phone: '+1 (555) 987-6543',
    location: 'Austin, TX',
    company: 'StartupIO',
    role: 'CTO',
    avatar: '👨‍💻',
    isHTimeUser: false,
    privacyLevel: 'private'
  },
  {
    id: '3',
    name: 'Emily Johnson',
    email: 'emily@consulting.com',
    phone: '+1 (555) 456-7890',
    location: 'New York, NY',
    company: 'Global Consulting',
    role: 'Senior Consultant',
    avatar: '👩‍💼',
    isHTimeUser: true,
    privacyLevel: 'public'
  }
];

const ContactPrivacy = () => {
  const [viewMode, setViewMode] = useState<'admin' | 'user'>('user');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const maskData = (data: string, visibleChars: number = 3): string => {
    if (data.length <= visibleChars) return '*'.repeat(data.length);
    return data.substring(0, visibleChars) + '*'.repeat(data.length - visibleChars);
  };

  const maskEmail = (email: string): string => {
    const [local, domain] = email.split('@');
    return maskData(local, 2) + '@' + maskData(domain, 2);
  };

  const maskPhone = (phone: string): string => {
    return phone.replace(/\d(?=\d{4})/g, '*');
  };

  const getPrivacyColor = (level: string) => {
    switch (level) {
      case 'public': return 'text-green-400 bg-green-400/10';
      case 'protected': return 'text-yellow-400 bg-yellow-400/10';
      case 'private': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const shouldBlurData = (contact: Contact) => {
    if (viewMode === 'admin') return false;
    return contact.privacyLevel === 'private' || 
           (contact.privacyLevel === 'protected' && !contact.isHTimeUser);
  };

  return (
    <div className="min-h-screen bg-charcoal text-lightGray">
      {/* Header */}
      <div className="bg-charcoal/95 backdrop-blur-sm border-b border-lightGray/10 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-mintGreen/20 rounded-lg">
                <Shield className="w-6 h-6 text-mintGreen" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-lightGray">Contact Privacy Demo</h1>
                <p className="text-sm text-lightGray/70">See how hTime protects contact information</p>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-lightGray/70">View as:</span>
              <div className="flex items-center gap-2">
                <User className={cn("w-4 h-4", viewMode === 'user' ? "text-mintGreen" : "text-lightGray/50")} />
                <Switch
                  checked={viewMode === 'admin'}
                  onCheckedChange={(checked) => setViewMode(checked ? 'admin' : 'user')}
                  className="data-[state=checked]:bg-mintGreen"
                />
                <Settings className={cn("w-4 h-4", viewMode === 'admin' ? "text-mintGreen" : "text-lightGray/50")} />
              </div>
              <span className="text-sm font-medium text-mintGreen">
                {viewMode === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Info Banner */}
        <div className="mb-6 p-4 bg-lightGray/5 border border-lightGray/10 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-mintGreen/20 rounded-lg mt-1">
              <Eye className="w-4 h-4 text-mintGreen" />
            </div>
            <div>
              <h3 className="font-semibold text-lightGray mb-2">Privacy Protection System</h3>
              <p className="text-sm text-lightGray/70 mb-2">
                hTime automatically protects contact information based on user preferences and relationships.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="text-green-400 bg-green-400/10 border-green-400/20">
                  Public: Full access for all hTime users
                </Badge>
                <Badge className="text-yellow-400 bg-yellow-400/10 border-yellow-400/20">
                  Protected: Limited access, full for connections
                </Badge>
                <Badge className="text-red-400 bg-red-400/10 border-red-400/20">
                  Private: Masked data, admin access only
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockContacts.map((contact) => {
            const isBlurred = shouldBlurData(contact);
            
            return (
              <Card
                key={contact.id}
                className="bg-lightGray/5 border-lightGray/10 hover:border-mintGreen/30 transition-all cursor-pointer"
                onClick={() => setSelectedContact(contact)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{contact.avatar}</div>
                      <div>
                        <h3 className="font-semibold text-lightGray">
                          {isBlurred ? maskData(contact.name, 4) : contact.name}
                        </h3>
                        <p className="text-sm text-lightGray/70">
                          {isBlurred ? maskData(contact.role, 3) : contact.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={getPrivacyColor(contact.privacyLevel)}>
                        {contact.privacyLevel}
                      </Badge>
                      {contact.isHTimeUser && (
                        <Badge className="text-mintGreen bg-mintGreen/10 border-mintGreen/20 text-xs">
                          hTime User
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-lightGray/50" />
                      <span className="text-lightGray/70">
                        {isBlurred ? maskEmail(contact.email) : contact.email}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-lightGray/50" />
                      <span className="text-lightGray/70">
                        {isBlurred ? maskPhone(contact.phone) : contact.phone}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-lightGray/50" />
                      <span className="text-lightGray/70">
                        {isBlurred ? maskData(contact.location, 6) : contact.location}
                      </span>
                    </div>
                  </div>

                  {/* Privacy Indicator */}
                  <div className="mt-4 pt-4 border-t border-lightGray/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-lightGray/50">
                        {isBlurred ? "Data Protected" : "Full Access"}
                      </span>
                      {isBlurred ? (
                        <EyeOff className="w-4 h-4 text-lightGray/50" />
                      ) : (
                        <Eye className="w-4 h-4 text-mintGreen" />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Selected Contact Detail */}
        {selectedContact && (
          <div className="mt-8">
            <Card className="bg-lightGray/5 border-lightGray/10">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-lightGray mb-4">
                  Privacy Details: {selectedContact.name}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-lightGray mb-2">Current View ({viewMode})</h4>
                    <div className="space-y-2 text-sm">
                      <div>Name: {shouldBlurData(selectedContact) ? maskData(selectedContact.name, 4) : selectedContact.name}</div>
                      <div>Email: {shouldBlurData(selectedContact) ? maskEmail(selectedContact.email) : selectedContact.email}</div>
                      <div>Phone: {shouldBlurData(selectedContact) ? maskPhone(selectedContact.phone) : selectedContact.phone}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-lightGray mb-2">Privacy Settings</h4>
                    <div className="space-y-2 text-sm">
                      <div>Level: <Badge className={getPrivacyColor(selectedContact.privacyLevel)}>{selectedContact.privacyLevel}</Badge></div>
                      <div>hTime User: {selectedContact.isHTimeUser ? "Yes" : "No"}</div>
                      <div>Data Protected: {shouldBlurData(selectedContact) ? "Yes" : "No"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPrivacy;