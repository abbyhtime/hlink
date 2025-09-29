
import { useState, useEffect } from 'react';
import { Users, Wifi, X, QrCode, UserPlus, Send, Calendar, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Participant {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  linkedinUrl?: string;
  joinedAt: Date;
}

const LiveSession = () => {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [sessionCode] = useState('HTM-2024-001');
  const [isActive, setIsActive] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

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
    // This will require Supabase integration for backend logic
  };

  const handleInviteToHTime = (participant: Participant) => {
    console.log('Inviting to hTime:', participant.name);
    // This will require Supabase integration for user detection and invitations
  };

  const handleScheduleMeeting = (participant: Participant) => {
    console.log('Scheduling meeting with:', participant.name);
    // This will require integration with calendar/scheduling system
  };

  const handleLinkedInConnect = (participant: Participant) => {
    if (participant.linkedinUrl) {
      window.open(participant.linkedinUrl, '_blank');
    }
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
                <Button 
                  onClick={startSession}
                  className="w-full glass-button text-lg py-4"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Start QR Session
                </Button>
                
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
              .map((participant, index) => (
                <div 
                  key={participant.id}
                  className="glass-card p-5 animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mintGreen to-mintGreen/70 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lightGray text-lg">{participant.name}</h3>
                          <p className="text-mintGreen text-sm">{participant.company}</p>
                          <p className="text-lightGray/50 text-xs">{participant.email}</p>
                          {participant.phone && (
                            <p className="text-lightGray/50 text-xs">{participant.phone}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="w-3 h-3 rounded-full bg-green-500 mb-1" />
                          <span className="text-xs text-lightGray/50">Online</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button
                          onClick={() => handleAddContact(participant)}
                          size="sm"
                          className="bg-mintGreen/20 hover:bg-mintGreen/30 text-mintGreen border border-mintGreen/30 
                                   hover:border-mintGreen/50 text-xs px-3 py-1.5 h-auto font-medium"
                        >
                          <UserPlus className="w-3 h-3 mr-1.5" />
                          Add Contact
                        </Button>
                        
                        <Button
                          onClick={() => handleInviteToHTime(participant)}
                          size="sm"
                          variant="outline"
                          className="text-lightGray/70 border-lightGray/30 hover:bg-lightGray/10 
                                   hover:text-lightGray text-xs px-3 py-1.5 h-auto font-medium"
                        >
                          <Send className="w-3 h-3 mr-1.5" />
                          Invite to hTime
                        </Button>
                        
                        <Button
                          onClick={() => handleScheduleMeeting(participant)}
                          size="sm"
                          variant="outline"
                          className="text-lightGray/70 border-lightGray/30 hover:bg-lightGray/10 
                                   hover:text-lightGray text-xs px-3 py-1.5 h-auto font-medium"
                        >
                          <Calendar className="w-3 h-3 mr-1.5" />
                          Schedule
                        </Button>
                        
                        {participant.linkedinUrl && (
                          <Button
                            onClick={() => handleLinkedInConnect(participant)}
                            size="sm"
                            variant="outline"
                            className="text-blue-400 border-blue-400/30 hover:bg-blue-400/10 
                                     hover:text-blue-300 text-xs px-3 py-1.5 h-auto font-medium"
                          >
                            <Linkedin className="w-3 h-3 mr-1.5" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Control Buttons - Only show if this is the host view */}
        {window.location.pathname === '/live-session' && (
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
      </div>
    </div>
  );
};

export default LiveSession;
