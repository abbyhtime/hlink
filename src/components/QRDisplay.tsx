
import { useState } from 'react';
import { QrCode, Users, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const QRDisplay = () => {
  const navigate = useNavigate();
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionCode] = useState('HTM-2024-001');

  const startSession = () => {
    setSessionActive(true);
    console.log('Starting QR session:', sessionCode);
  };

  const endSession = () => {
    setSessionActive(false);
    console.log('Ending QR session');
  };

  const viewLiveSession = () => {
    navigate('/live-session');
  };

  return (
    <div className="space-y-6">
      {/* QR Code Display */}
      <div className="flex flex-col items-center space-y-4">
        <div className="w-48 h-48 bg-white rounded-2xl p-4 shadow-xl">
          <div className="w-full h-full bg-charcoal rounded-xl flex items-center justify-center">
            <QrCode className="w-32 h-32 text-lightGray" />
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-lightGray font-semibold">Session Code</p>
          <p className="text-mintGreen text-lg font-mono">{sessionCode}</p>
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
            <span>0 joined</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-lightGray/70 text-sm mb-4">
          <Clock className="w-4 h-4" />
          <span>Scan to join networking session</span>
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
