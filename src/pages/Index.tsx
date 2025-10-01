
import Header from '@/components/Header';
import ContactForm from '@/components/ContactForm';
import QuickActions from '@/components/QuickActions';
import { Button } from '@/components/ui/button';
import { MessageCircle, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const [hasAgent, setHasAgent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Check if user has an agent
      const { data } = await supabase
        .from('executive_agents')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setHasAgent(!!data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(71,158,125,0.1),transparent_70%)]" />
      
      <div className="relative z-10 max-w-md mx-auto">
        <Header />
        <ContactForm />
        <QuickActions />
        
        {/* Agent CTA */}
        {!loading && (
          <div className="px-4 mt-8">
            <div className="bg-gradient-to-r from-sage/20 to-transparent rounded-lg p-6 border border-sage/30">
              <div className="flex items-start gap-4">
                <Sparkles className="h-6 w-6 text-sage mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {hasAgent ? 'Manage Your Executive Assistant' : 'Claim Your Executive Assistant'}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {hasAgent 
                      ? 'View your assistant settings and configure your public profile page'
                      : 'Create your AI-powered executive assistant to automate scheduling and manage meetings'
                    }
                  </p>
                  <Button 
                    onClick={() => navigate(hasAgent ? '/my-assistant' : '/claim-assistant')}
                    variant="default"
                  >
                    {hasAgent ? 'View Dashboard' : 'Get Started'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Bottom padding for mobile scroll */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default Index;
