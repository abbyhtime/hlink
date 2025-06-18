
import { useState, useEffect } from 'react';
import { User, Linkedin, Building2, Mail, Send, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useNavigate, useParams } from 'react-router-dom';

const JoinSession = () => {
  const navigate = useNavigate();
  const { sessionCode } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Load participant count for social proof
  useEffect(() => {
    const loadParticipantCount = () => {
      const participants = JSON.parse(localStorage.getItem('session-participants') || '[]');
      setParticipantCount(participants.length);
    };
    
    loadParticipantCount();
    const interval = setInterval(loadParticipantCount, 2000);
    return () => clearInterval(interval);
  }, []);

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'name':
        if (value.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email';
        } else {
          delete newErrors.email;
        }
        break;
      case 'company':
        if (value.length < 2) {
          newErrors.company = 'Company name must be at least 2 characters';
        } else {
          delete newErrors.company;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    validateField(field, value);
  };

  const getProgress = () => {
    const fields = [formData.name, formData.email, formData.company];
    const filledFields = fields.filter(field => field.trim().length > 0).length;
    return (filledFields / fields.length) * 100;
  };

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
        phone: '', // Optional field
        linkedinUrl: '', // Optional field
        joinedAt: new Date(),
        sessionCode
      };
      
      // Store in localStorage for now
      const existingParticipants = JSON.parse(localStorage.getItem('session-participants') || '[]');
      localStorage.setItem('session-participants', JSON.stringify([...existingParticipants, participant]));
      
      // Navigate to live session
      navigate('/live-session');
    }, 500);
  };

  const connectLinkedIn = () => {
    // Simulate LinkedIn connection (in real app, this would use LinkedIn API)
    setFormData({
      name: 'John Doe',
      email: 'john.doe@company.com',
      company: 'Tech Innovations Inc.'
    });
  };

  const skipToSession = () => {
    const minimalParticipant = {
      id: Date.now().toString(),
      name: 'Anonymous User',
      email: '',
      company: 'Guest',
      phone: '',
      linkedinUrl: '',
      joinedAt: new Date(),
      sessionCode
    };
    
    const existingParticipants = JSON.parse(localStorage.getItem('session-participants') || '[]');
    localStorage.setItem('session-participants', JSON.stringify([...existingParticipants, minimalParticipant]));
    
    navigate('/live-session');
  };

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(71,158,125,0.1),transparent_70%)]" />
      
      <div className="relative z-10 max-w-md mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-6 pt-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 rounded-xl bg-mintGreen/20 animate-pulse">
              <Zap className="w-6 h-6 text-mintGreen" />
            </div>
            <h1 className="text-2xl font-bold text-lightGray">Quick Join</h1>
          </div>
          
          <div className="glass-card p-4 mb-4">
            <p className="text-lightGray/70 text-sm mb-2">Session Code</p>
            <p className="text-mintGreen text-lg font-mono font-bold">{sessionCode || 'HTM-2024-001'}</p>
            
            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-2 mt-3 text-xs">
              <Users className="w-3 h-3 text-mintGreen" />
              <span className="text-lightGray/70">
                {participantCount === 0 ? 'Be the first to join!' : `${participantCount} already joined`}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-lightGray/50 mb-2">
              <span>Complete your profile</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <Progress 
              value={getProgress()} 
              className="h-2 bg-charcoal/50 border border-lightGray/20" 
            />
          </div>
        </div>

        {/* Form */}
        <div className="glass-card p-6">
          {/* LinkedIn Quick Fill */}
          <div className="mb-6">
            <Button 
              type="button"
              onClick={connectLinkedIn}
              className="w-full bg-blue-600/90 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl 
                         shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105
                         backdrop-blur-sm border border-blue-600/30"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              Auto-fill from LinkedIn
            </Button>
            
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-lightGray/20"></div>
              <span className="px-3 text-xs text-lightGray/50">or fill manually</span>
              <div className="flex-1 h-px bg-lightGray/20"></div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mintGreen" />
              <Input
                type="text"
                placeholder="Full Name *"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className={`pl-10 bg-charcoal/50 border-lightGray/20 text-lightGray placeholder:text-lightGray/50 focus:border-mintGreen rounded-xl transition-all duration-200 ${
                  errors.name ? 'border-red-500 animate-shake' : formData.name ? 'border-mintGreen' : ''
                }`}
                autoFocus
                required
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1 animate-fade-in">{errors.name}</p>
              )}
            </div>
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mintGreen" />
              <Input
                type="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className={`pl-10 bg-charcoal/50 border-lightGray/20 text-lightGray placeholder:text-lightGray/50 focus:border-mintGreen rounded-xl transition-all duration-200 ${
                  errors.email ? 'border-red-500 animate-shake' : formData.email ? 'border-mintGreen' : ''
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 animate-fade-in">{errors.email}</p>
              )}
            </div>
            
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mintGreen" />
              <Input
                type="text"
                placeholder="Company *"
                value={formData.company}
                onChange={(e) => handleFieldChange('company', e.target.value)}
                className={`pl-10 bg-charcoal/50 border-lightGray/20 text-lightGray placeholder:text-lightGray/50 focus:border-mintGreen rounded-xl transition-all duration-200 ${
                  errors.company ? 'border-red-500 animate-shake' : formData.company ? 'border-mintGreen' : ''
                }`}
                required
              />
              {errors.company && (
                <p className="text-red-400 text-xs mt-1 animate-fade-in">{errors.company}</p>
              )}
            </div>
            
            <div className="space-y-3 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting || Object.keys(errors).length > 0}
                className="w-full glass-button text-lg py-4 relative overflow-hidden group"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    Join Session
                  </>
                )}
              </Button>
              
              <Button 
                type="button" 
                onClick={skipToSession}
                className="w-full bg-lightGray/10 hover:bg-lightGray/20 text-lightGray/70 font-medium px-6 py-3 rounded-xl 
                           shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105
                           backdrop-blur-sm border border-lightGray/20"
              >
                Skip for now
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinSession;
