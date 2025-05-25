
import { useState, useEffect } from 'react';
import { Users, Wifi, X, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Participant {
  id: string;
  name: string;
  email: string;
  company: string;
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

  // Simulate participants joining (in real app, this would be real-time data)
  useEffect(() => {
    if (!isActive || !sessionStarted) return;

    const mockParticipants = [
      { id: '1', name: 'Sarah Chen', email: 's.chen@techcorp.com', company: 'TechCorp', joinedAt: new Date() },
      { id: '2', name: 'Michael Rodriguez', email: 'm.rodriguez@startup.io', company: 'StartupIO', joinedAt: new Date() },
    ];

    // Simulate real-time joining
    let index = 0;
    const interval = setInterval(() => {
      if (index < mockParticipants.length && isActive) {
        setParticipants(prev => [...prev, mockParticipants[index]]);
        index++;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, sessionStarted]);

  const endSession = () => {
    setIsActive(false);
    setSessionStarted(false);
    localStorage.removeItem('qr-session-active');
    localStorage.removeItem('qr-session-started');
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
              .filter(participant => participant && participant.name) // Add safety filter
              .map((participant, index) => (
                <div 
                  key={participant.id}
                  className="glass-card p-4 animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mintGreen to-mintGreen/70 flex items-center justify-center text-white font-bold text-lg">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lightGray text-lg">{participant.name}</h3>
                      <p className="text-mintGreen text-sm">{participant.company}</p>
                      <p className="text-lightGray/50 text-xs">{participant.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="w-3 h-3 rounded-full bg-green-500 mb-1" />
                      <span className="text-xs text-lightGray/50">Online</span>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* End Session Button */}
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
      </div>
    </div>
  );
};

export default LiveSession;
