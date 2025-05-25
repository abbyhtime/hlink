
import { useState, useEffect } from 'react';
import { QrCode, Users, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const QRDisplay = () => {
  const navigate = useNavigate();
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionCode] = useState('HTM-2024-001');

  // Check session state on component mount
  useEffect(() => {
    const isActive = localStorage.getItem('qr-session-active') === 'true';
    setSessionActive(isActive);
  }, []);

  // Generate dummy participants when session starts
  useEffect(() => {
    if (!sessionActive) return;

    const dummyParticipants = [
      { id: '1', name: 'Sarah Chen', email: 's.chen@techcorp.com', company: 'TechCorp', phone: '+1 (555) 123-4567', linkedinUrl: 'https://linkedin.com/in/sarahchen', joinedAt: new Date() },
      { id: '2', name: 'Michael Rodriguez', email: 'm.rodriguez@startup.io', company: 'StartupIO', phone: '+1 (555) 234-5678', linkedinUrl: 'https://linkedin.com/in/michaelr', joinedAt: new Date() },
      { id: '3', name: 'Emily Watson', email: 'e.watson@innovate.com', company: 'Innovate Labs', phone: '+1 (555) 345-6789', linkedinUrl: 'https://linkedin.com/in/emilywatson', joinedAt: new Date() },
      { id: '4', name: 'David Park', email: 'd.park@techflow.com', company: 'TechFlow Solutions', phone: '+1 (555) 456-7890', linkedinUrl: 'https://linkedin.com/in/davidpark', joinedAt: new Date() },
      { id: '5', name: 'Lisa Thompson', email: 'l.thompson@nexus.co', company: 'Nexus Digital', phone: '+1 (555) 567-8901', linkedinUrl: 'https://linkedin.com/in/lisathompson', joinedAt: new Date() },
      { id: '6', name: 'Alex Kim', email: 'a.kim@cloudtech.io', company: 'CloudTech Inc', phone: '+1 (555) 678-9012', linkedinUrl: 'https://linkedin.com/in/alexkim', joinedAt: new Date() },
      { id: '7', name: 'Rachel Green', email: 'r.green@dataflow.com', company: 'DataFlow Systems', phone: '+1 (555) 789-0123', linkedinUrl: 'https://linkedin.com/in/rachelgreen', joinedAt: new Date() },
      { id: '8', name: 'James Wilson', email: 'j.wilson@hypertech.net', company: 'HyperTech Networks', phone: '+1 (555) 890-1234', linkedinUrl: 'https://linkedin.com/in/jameswilson', joinedAt: new Date() }
    ];

    // Clear existing participants and add dummy ones at random intervals
    localStorage.removeItem('session-participants');
    
    let participantIndex = 0;
    const addParticipant = () => {
      if (participantIndex < Math.min(dummyParticipants.length, 8) && localStorage.getItem('qr-session-active') === 'true') {
        const existingParticipants = JSON.parse(localStorage.getItem('session-participants') || '[]');
        const newParticipant = { ...dummyParticipants[participantIndex], joinedAt: new Date() };
        localStorage.setItem('session-participants', JSON.stringify([...existingParticipants, newParticipant]));
        participantIndex++;
        
        // Schedule next participant
        if (participantIndex < Math.min(dummyParticipants.length, 8)) {
          setTimeout(addParticipant, Math.random() * 5000 + 2000); // Random interval between 2-7 seconds
        }
      }
    };

    // Start adding participants after a short delay
    setTimeout(addParticipant, 2000);
  }, [sessionActive]);

  const startSession = () => {
    setSessionActive(true);
    localStorage.setItem('qr-session-active', 'true');
    localStorage.setItem('qr-session-started', 'true');
    console.log('Starting QR session:', sessionCode);
  };

  const endSession = () => {
    setSessionActive(false);
    localStorage.removeItem('qr-session-active');
    localStorage.removeItem('qr-session-started');
    localStorage.removeItem('session-participants');
    console.log('Ending QR session');
  };

  const viewLiveSession = () => {
    navigate('/live-session');
  };

  // QR code URL that points to the join session page
  const qrCodeUrl = `${window.location.origin}/join/${sessionCode}`;

  return (
    <div className="space-y-6">
      {/* QR Code Display */}
      <div className="flex flex-col items-center space-y-4">
        <div className="w-48 h-48 bg-white rounded-2xl p-4 shadow-xl">
          <div className="w-full h-full bg-charcoal rounded-xl flex items-center justify-center relative">
            <QrCode className="w-32 h-32 text-lightGray" />
            {sessionActive && (
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-xs text-lightGray/70 text-center break-all">
                  {qrCodeUrl}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-lightGray font-semibold">Session Code</p>
          <p className="text-mintGreen text-lg font-mono">{sessionCode}</p>
          {sessionActive && (
            <p className="text-lightGray/50 text-xs mt-1">QR code links to join form</p>
          )}
        </div>
      </div>

      {/* Session Status */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${sessionActive ? 'bg-green-500' : 'bg-gray-500'}`} />
            <span className="text-lightGray text-sm">
              {sessionActive ? 'Session Active' : 'Session Inactive'}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-lightGray/70 text-sm">
            <Users className="w-4 h-4" />
            <span>{JSON.parse(localStorage.getItem('session-participants') || '[]').length} joined</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-lightGray/70 text-sm mb-4">
          <Clock className="w-4 h-4" />
          <span>{sessionActive ? 'Scan QR to join networking session' : 'Start session to activate QR code'}</span>
        </div>

        <div className="space-y-3">
          {!sessionActive ? (
            <Button 
              onClick={startSession}
              className="w-full glass-button"
            >
              Start QR Session
            </Button>
          ) : (
            <>
              <Button 
                onClick={viewLiveSession}
                className="w-full glass-button mb-3"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Live Session
              </Button>
              <Button 
                onClick={endSession}
                className="w-full bg-red-600/90 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl 
                           shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105
                           backdrop-blur-sm border border-red-600/30"
              >
                End QR Session
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRDisplay;
