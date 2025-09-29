
import { useState, useEffect } from 'react';
import { Users, Wifi, X, QrCode, UserPlus, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Participant {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  linkedinUrl?: string;
  joinedAt: Date;
}

// Privacy protection utility functions
const protectPrivateInfo = (participant: Participant, isAdminView: boolean) => {
  if (isAdminView) {
    return participant; // Show all details for admin
  }
  
  // User view - protect sensitive information
  const nameParts = participant.name.split(' ');
  const firstName = nameParts[0];
  const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] + '.' : '';
  
  return {
    ...participant,
    name: `${firstName} ${lastInitial}`,
    email: '••••••@••••.com',
    phone: participant.phone ? '•••-•••-••••' : undefined
  };
};

const LiveSession = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [sessionCode] = useState('HTM-2024-001');
  const [isActive, setIsActive] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [buttonStates, setButtonStates] = useState<{[key: string]: {addContact: boolean, invite: boolean}}>({});

  // Determine if this is admin view (default) or user view
  const isAdminView = searchParams.get('view') !== 'user';

  // Check if session was started from localStorage
  useEffect(() => {
    const sessionActive = localStorage.getItem('qr-session-active') === 'true';
    const sessionWasStarted = localStorage.getItem('qr-session-started') === 'true';
    
    setIsActive(sessionActive);
    setSessionStarted(sessionWasStarted);
    
    console.log('Session active:', sessionActive, 'Session started:', sessionWasStarted);
  }, []);

  // Load participants from localStorage and update in real-time
  useEffect(() => {
    if (!sessionStarted) return;

    const loadParticipants = () => {
      const storedParticipants = JSON.parse(localStorage.getItem('session-participants') || '[]');
      setParticipants(storedParticipants.map((p: any) => ({
        ...p,
        joinedAt: new Date(p.joinedAt)
      })));
    };

    // Initial load
    loadParticipants();

    // Set up interval to check for updates
    const interval = setInterval(loadParticipants, 1000);

    return () => clearInterval(interval);
  }, [sessionStarted]);

  const endSession = () => {
    setIsActive(false);
    setSessionStarted(false);
    localStorage.removeItem('qr-session-active');
    localStorage.removeItem('qr-session-started');
    localStorage.removeItem('session-participants');
    setParticipants([]);
    console.log('Ending live session');
    navigate('/');
  };

  const startSession = () => {
    setIsActive(true);
    setSessionStarted(true);
    localStorage.setItem('qr-session-active', 'true');
    localStorage.setItem('qr-session-started', 'true');
    console.log('Starting live session');
  };

  // Action handlers for participant interactions
  const handleAddContact = (participant: Participant) => {
    console.log('Adding contact:', participant.name);
    
    // Update button state to disabled
    setButtonStates(prev => ({
      ...prev,
      [participant.id]: { ...prev[participant.id], addContact: true }
    }));
    
    // Show toast notification
    toast({
      title: "Request sent",
      description: `Contact request sent to ${participant.name.split(' ')[0]}`,
    });
  };

  const handleInviteToHTime = (participant: Participant) => {
    console.log('Inviting to hTime:', participant.name);
    
    // Update button state to disabled
    setButtonStates(prev => ({
      ...prev,
      [participant.id]: { ...prev[participant.id], invite: true }
    }));
    
    // Show toast notification
    toast({
      title: "Invitation sent",
      description: `hTime invitation sent to ${participant.name.split(' ')[0]}`,
    });
  };

  // Show "No Session Initiated" state if no session has been started
  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-charcoal">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(71,158,125,0.1),transparent_70%)]" />
        
        <div className="relative z-10 max-w-2xl mx-auto p-6">
          <div className="text-center pt-20">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="p-4 rounded-xl bg-lightGray/10">
                <QrCode className="w-8 h-8 text-lightGray/50" />
              </div>
              <h1 className="text-3xl font-bold text-lightGray/70">HTIME Live</h1>
              {!isAdminView && (
                <Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500/30">
                  User View
                </Badge>
              )}
            </div>
            
            <div className="glass-card p-8 mb-8">
              <div className="w-16 h-16 rounded-full bg-lightGray/10 flex items-center justify-center mx-auto mb-6">
                <Wifi className="w-8 h-8 text-lightGray/30" />
              </div>
              
              <h2 className="text-xl font-semibold text-lightGray/70 mb-4">No Live Session Initiated</h2>
              <p className="text-lightGray/50 mb-6">
                Start a QR session from the main page to begin connecting with participants.
              </p>
              
              <div className="space-y-3">
                {isAdminView && (
                  <Button 
                    onClick={startSession}
                    className="w-full glass-button text-lg py-4"
                  >
                    <QrCode className="w-5 h-5 mr-2" />
                    Start QR Session
                  </Button>
                )}
                
                <Button 
                  onClick={() => navigate('/')}
                  className="w-full bg-lightGray/10 hover:bg-lightGray/20 text-lightGray/70 font-semibold px-6 py-3 rounded-xl 
                             shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105
                             backdrop-blur-sm border border-lightGray/20"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(71,158,125,0.1),transparent_70%)]" />
      
      <div className="relative z-10 max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 rounded-xl bg-mintGreen/20">
              <Wifi className="w-6 h-6 text-mintGreen" />
            </div>
            <h1 className="text-3xl font-bold text-lightGray">HTIME Live</h1>
            {!isAdminView && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                User View
              </Badge>
            )}
          </div>
          
          <div className="glass-card p-4 mb-6">
            <p className="text-lightGray/70 text-sm mb-2">Session Code</p>
            <p className="text-mintGreen text-xl font-mono font-bold">{sessionCode}</p>
            <div className="flex items-center justify-center space-x-2 mt-3">
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-lightGray/70 text-sm">
                {isActive ? 'Session Active' : 'Session Ended'}
              </span>
            </div>
          </div>
        </div>

        {/* Participants Count */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-center space-x-3">
            <Users className="w-6 h-6 text-mintGreen" />
            <span className="text-2xl font-bold text-lightGray">{participants.length}</span>
            <span className="text-lightGray/70">participants joined</span>
          </div>
        </div>

        {/* Participants List */}
        <div className="space-y-3 mb-8">
          {participants.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Users className="w-12 h-12 text-lightGray/30 mx-auto mb-4" />
              <p className="text-lightGray/70">Waiting for participants to join...</p>
              <p className="text-lightGray/50 text-sm mt-2">Share the QR code for people to scan</p>
            </div>
          ) : (
            participants
              .filter(participant => participant && participant.name)
              .map((participant, index) => {
                const displayParticipant = protectPrivateInfo(participant, isAdminView);
                const participantButtonState = buttonStates[participant.id] || { addContact: false, invite: false };
                
                return (
                  <div 
                    key={participant.id}
                    className="glass-card p-5 animate-fade-in"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mintGreen to-mintGreen/70 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {displayParticipant.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lightGray text-lg">{displayParticipant.name}</h3>
                            <p className="text-mintGreen text-sm">{displayParticipant.company}</p>
                            <p className="text-lightGray/50 text-xs">{displayParticipant.email}</p>
                            {displayParticipant.phone && (
                              <p className="text-lightGray/50 text-xs">{displayParticipant.phone}</p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="w-3 h-3 rounded-full bg-green-500 mb-1" />
                            <span className="text-xs text-lightGray/50">Online</span>
                          </div>
                        </div>
                        
                        {/* Enhanced Action Buttons - 2x1 Mobile-Friendly Grid */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <Button
                            onClick={() => handleAddContact(participant)}
                            disabled={participantButtonState.addContact}
                            className="bg-mintGreen hover:bg-mintGreen/90 disabled:bg-mintGreen/30 
                                     text-white disabled:text-white/60 border-0 font-medium 
                                     px-4 py-3 h-auto rounded-lg text-sm
                                     transition-all duration-200 transform hover:scale-105 active:scale-95
                                     shadow-lg hover:shadow-xl disabled:hover:scale-100 disabled:cursor-not-allowed"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            {participantButtonState.addContact ? 'Request Sent' : 'Add Contact'}
                          </Button>
                          
                          <Button
                            onClick={() => handleInviteToHTime(participant)}
                            disabled={participantButtonState.invite}
                            className="bg-white hover:bg-gray-50 disabled:bg-gray-100 
                                     text-gray-800 disabled:text-gray-400 border border-gray-200 disabled:border-gray-200
                                     font-medium px-4 py-3 h-auto rounded-lg text-sm
                                     transition-all duration-200 transform hover:scale-105 active:scale-95
                                     shadow-lg hover:shadow-xl disabled:hover:scale-100 disabled:cursor-not-allowed"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            {participantButtonState.invite ? 'Invited' : 'Invite to hTime'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>

        {/* Control Buttons - Only show for admin view */}
        {isAdminView && (
          <>
            {isActive && (
              <Button 
                onClick={endSession}
                className="w-full bg-red-600/90 hover:bg-red-600 text-white font-semibold px-6 py-4 rounded-xl 
                           shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105
                           backdrop-blur-sm border border-red-600/30 text-lg"
              >
                <X className="w-5 h-5 mr-2" />
                End Session
              </Button>
            )}
            
            {!isActive && (
              <Button 
                onClick={() => navigate('/')}
                className="w-full glass-button text-lg py-4"
              >
                Back to Home
              </Button>
            )}
          </>
        )}

        {/* User view navigation */}
        {!isAdminView && (
          <Button 
            onClick={() => navigate('/')}
            className="w-full glass-button text-lg py-4"
          >
            Back to Home
          </Button>
        )}
      </div>
    </div>
  );
};

export default LiveSession;
