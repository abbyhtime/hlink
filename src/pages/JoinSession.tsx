
import { useState } from 'react';
import { User, Linkedin, Building2, Mail, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useParams } from 'react-router-dom';

const JoinSession = () => {
  const navigate = useNavigate();
  const { sessionCode } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    linkedinUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('Submitting participant data:', formData);
    
    // Simulate submission delay
    setTimeout(() => {
      // Add participant to session (in real app, this would be an API call)
      const participant = {
        id: Date.now().toString(),
        ...formData,
        joinedAt: new Date(),
        sessionCode
      };
      
      // Store in localStorage for now
      const existingParticipants = JSON.parse(localStorage.getItem('session-participants') || '[]');
      localStorage.setItem('session-participants', JSON.stringify([...existingParticipants, participant]));
      
      // Navigate to live session
      navigate('/live-session');
    }, 1000);
  };

  const connectLinkedIn = () => {
    // Simulate LinkedIn connection (in real app, this would use LinkedIn API)
    setFormData({
      name: 'John Doe',
      email: 'john.doe@company.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Innovations Inc.',
      linkedinUrl: 'https://linkedin.com/in/johndoe'
    });
  };

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(71,158,125,0.1),transparent_70%)]" />
      
      <div className="relative z-10 max-w-md mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 rounded-xl bg-mintGreen/20">
              <User className="w-6 h-6 text-mintGreen" />
            </div>
            <h1 className="text-2xl font-bold text-lightGray">Join Session</h1>
          </div>
          
          <div className="glass-card p-4 mb-6">
            <p className="text-lightGray/70 text-sm mb-2">Session Code</p>
            <p className="text-mintGreen text-lg font-mono font-bold">{sessionCode || 'HTM-2024-001'}</p>
          </div>
        </div>

        {/* Form */}
        <div className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mintGreen" />
              <Input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10 bg-charcoal/50 border-lightGray/20 text-lightGray placeholder:text-lightGray/50 focus:border-mintGreen rounded-xl"
                required
              />
            </div>
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mintGreen" />
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 bg-charcoal/50 border-lightGray/20 text-lightGray placeholder:text-lightGray/50 focus:border-mintGreen rounded-xl"
                required
              />
            </div>
            
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mintGreen" />
              <Input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="pl-10 bg-charcoal/50 border-lightGray/20 text-lightGray placeholder:text-lightGray/50 focus:border-mintGreen rounded-xl"
              />
            </div>
            
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mintGreen" />
              <Input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="pl-10 bg-charcoal/50 border-lightGray/20 text-lightGray placeholder:text-lightGray/50 focus:border-mintGreen rounded-xl"
              />
            </div>
            
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mintGreen" />
              <Input
                type="url"
                placeholder="LinkedIn Profile URL"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="pl-10 bg-charcoal/50 border-lightGray/20 text-lightGray placeholder:text-lightGray/50 focus:border-mintGreen rounded-xl"
              />
            </div>
            
            <div className="space-y-3 pt-4">
              <Button 
                type="button"
                onClick={connectLinkedIn}
                className="w-full bg-blue-600/90 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl 
                           shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105
                           backdrop-blur-sm border border-blue-600/30"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                Connect LinkedIn
              </Button>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full glass-button"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit & Join Session'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinSession;
