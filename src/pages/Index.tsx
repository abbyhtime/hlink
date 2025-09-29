
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
        
        
        {/* Bottom padding for mobile scroll */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default Index;
