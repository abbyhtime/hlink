
import { useState, useEffect } from 'react';
import { Users, Wifi, X } from 'lucide-react';
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
  const [isActive, setIsActive] = useState(true);

  // Simulate participants joining (in real app, this would be real-time data)
  useEffect(() => {
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
  }, [isActive]);

  const endSession = () => {
    setIsActive(false);
    console.log('Ending live session');
    navigate('/');
  };

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
            participants.map((participant, index) => (
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
