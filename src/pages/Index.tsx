
import Header from '@/components/Header';
import ContactForm from '@/components/ContactForm';
import QuickActions from '@/components/QuickActions';
import { Button } from '@/components/ui/button';
import { MessageCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(71,158,125,0.1),transparent_70%)]" />
      
      <div className="relative z-10 max-w-md mx-auto">
        <Header />
        <ContactForm />
        <QuickActions />
        
        {/* New Feature Links */}
        <div className="px-6 mt-6 space-y-3">
          <Button
            onClick={() => navigate('/assistant')}
            variant="outline"
            className="w-full bg-lightGray/5 border-lightGray/20 text-lightGray hover:bg-lightGray/10 hover:border-mintGreen/50"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            AI Scheduling Assistant
          </Button>
          
          <Button
            onClick={() => navigate('/contacts')}
            variant="outline"
            className="w-full bg-lightGray/5 border-lightGray/20 text-lightGray hover:bg-lightGray/10 hover:border-mintGreen/50"
          >
            <Shield className="w-4 h-4 mr-2" />
            Contact Privacy Demo
          </Button>
        </div>
        
        {/* Bottom padding for mobile scroll */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default Index;
