import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, Shield, User, Settings, UserPlus, Send, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  joinedAt: Date;
  isHTimeUser: boolean;
  privacyLevel: 'public' | 'protected' | 'private';
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    role: 'Product Manager',
    joinedAt: new Date(Date.now() - 300000),
    isHTimeUser: true,
    privacyLevel: 'protected'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'm.rodriguez@startup.io',
    phone: '+1 (555) 987-6543',
    company: 'StartupIO',
    role: 'CTO',
    joinedAt: new Date(Date.now() - 600000),
    isHTimeUser: false,
    privacyLevel: 'private'
  },
  {
    id: '3',
    name: 'Emily Johnson',
    email: 'emily@consulting.com',
    phone: '+1 (555) 456-7890',
    company: 'Global Consulting',
    role: 'Senior Consultant',
    joinedAt: new Date(Date.now() - 900000),
    isHTimeUser: true,
    privacyLevel: 'public'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@fintech.com',
    phone: '+1 (555) 234-5678',
    company: 'FinTech Solutions',
    role: 'VP Engineering',
    joinedAt: new Date(Date.now() - 1200000),
    isHTimeUser: false,
    privacyLevel: 'private'
  }
];

const ContactPrivacy = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'admin' | 'user'>('user');
  const [buttonStates, setButtonStates] = useState<{[key: string]: {addContact: boolean, invite: boolean}}>({});

  // Privacy protection - blur all details including last names in user view
  const protectPrivateInfo = (contact: Contact) => {
    if (viewMode === 'admin') {
      return contact; // Show all details for admin
    }
    
    // User view - protect ALL sensitive information including last names
    const nameParts = contact.name.split(' ');
    const firstName = nameParts[0];
    const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] + '.' : '';
    
    return {
      ...contact,
      name: `${firstName} ${lastInitial}`, // Blur last name
      email: '••••••@••••.com',
      phone: '•••-•••-••••',
      company: '••••••••',
      role: '••••••••'
    };
  };

  const getPrivacyColor = (level: string) => {
    switch (level) {
      case 'public': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'protected': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'private': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const handleAddContact = (contact: Contact) => {
    if (!contact.isHTimeUser) return;
    
    setButtonStates(prev => ({
      ...prev,
      [contact.id]: { ...prev[contact.id], addContact: true }
    }));
    
    toast({
      title: "Request sent",
      description: `Contact request sent to ${contact.name.split(' ')[0]}`,
    });
  };

  const handleInviteToHTime = (contact: Contact) => {
    if (contact.isHTimeUser) return;
    
    setButtonStates(prev => ({
      ...prev,
      [contact.id]: { ...prev[contact.id], invite: true }
    }));
    
    toast({
      title: "Invitation sent",
      description: `hTime invitation sent to ${contact.name.split(' ')[0]}`,
    });
  };

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(71,158,125,0.1),transparent_70%)]" />
      
      <div className="relative z-10 max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="icon"
              className="text-lightGray hover:text-mintGreen hover:bg-lightGray/10 mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="p-3 rounded-xl bg-mintGreen/20">
              <Shield className="w-6 h-6 text-mintGreen" />
            </div>
            <h1 className="text-3xl font-bold text-lightGray">Contact Privacy</h1>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <User className={cn("w-4 h-4", viewMode === 'user' ? "text-mintGreen" : "text-lightGray/50")} />
            <Switch
              checked={viewMode === 'admin'}
              onCheckedChange={(checked) => setViewMode(checked ? 'admin' : 'user')}
              className="data-[state=checked]:bg-mintGreen"
            />
            <Settings className={cn("w-4 h-4", viewMode === 'admin' ? "text-mintGreen" : "text-lightGray/50")} />
            <span className="text-sm font-medium text-mintGreen ml-2">
              {viewMode === 'admin' ? 'Admin View' : 'User View'}
            </span>
          </div>

          {/* Info Banner */}
          <div className="glass-card p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-mintGreen/20 rounded-lg mt-1">
                <Eye className="w-4 h-4 text-mintGreen" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lightGray mb-2 text-sm">Privacy Protection System</h3>
                <p className="text-xs text-lightGray/70 mb-2">
                  hTime automatically protects contact information based on user preferences.
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge className="text-green-400 bg-green-400/10 border-green-400/20 text-xs px-2 py-0">
                    Public
                  </Badge>
                  <Badge className="text-yellow-400 bg-yellow-400/10 border-yellow-400/20 text-xs px-2 py-0">
                    Protected
                  </Badge>
                  <Badge className="text-red-400 bg-red-400/10 border-red-400/20 text-xs px-2 py-0">
                    Private
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Participants List */}
        <div className="space-y-3 mb-8">
          {mockContacts.map((contact, index) => {
            const displayContact = protectPrivateInfo(contact);
            const contactButtonState = buttonStates[contact.id] || { addContact: false, invite: false };
            
            return (
              <div 
                key={contact.id}
                className="glass-card p-5 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mintGreen to-mintGreen/70 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {displayContact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lightGray text-lg">{displayContact.name}</h3>
                        <p className="text-mintGreen text-sm">{displayContact.company}</p>
                        <p className="text-lightGray/50 text-xs">{displayContact.email}</p>
                        <p className="text-lightGray/50 text-xs">{displayContact.phone}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex flex-col items-end gap-1 mb-2">
                          <Badge className={getPrivacyColor(contact.privacyLevel)}>
                            {contact.privacyLevel}
                          </Badge>
                          {contact.isHTimeUser && (
                            <Badge className="text-mintGreen bg-mintGreen/10 border-mintGreen/20 text-xs">
                              hTime User
                            </Badge>
                          )}
                        </div>
                        <div className="w-3 h-3 rounded-full bg-green-500 mb-1 ml-auto" />
                        <span className="text-xs text-lightGray/50">Online</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Same 2x1 Grid as LiveSession */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <Button
                        onClick={() => handleAddContact(contact)}
                        disabled={!contact.isHTimeUser || contactButtonState.addContact}
                        className={`${
                          contact.isHTimeUser 
                            ? 'bg-mintGreen hover:bg-mintGreen/90 disabled:bg-mintGreen/30 text-white disabled:text-white/60' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        } border-0 font-medium px-4 py-3 h-auto rounded-lg text-sm
                           transition-all duration-200 transform hover:scale-105 active:scale-95
                           shadow-lg hover:shadow-xl disabled:hover:scale-100 disabled:cursor-not-allowed`}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        {contactButtonState.addContact ? 'Request Sent' : 'Add Contact'}
                      </Button>
                      
                      <Button
                        onClick={() => handleInviteToHTime(contact)}
                        disabled={contact.isHTimeUser || contactButtonState.invite}
                        className={`${
                          !contact.isHTimeUser
                            ? 'bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-800 disabled:text-gray-400 border border-gray-200 disabled:border-gray-200'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300'
                        } font-medium px-4 py-3 h-auto rounded-lg text-sm
                           transition-all duration-200 transform hover:scale-105 active:scale-95
                           shadow-lg hover:shadow-xl disabled:hover:scale-100 disabled:cursor-not-allowed`}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {contactButtonState.invite ? 'Invited' : 'Invite to hTime'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContactPrivacy;