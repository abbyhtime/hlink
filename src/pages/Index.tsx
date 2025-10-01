import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import ContactForm from '@/components/ContactForm';
import QuickActions from '@/components/QuickActions';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasAgent, setHasAgent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAgent = async () => {
      if (user) {
        const { data: agent } = await supabase
          .from('executive_agents')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        setHasAgent(!!agent);
      }
      setLoading(false);
    };

    checkAgent();
  }, [user]);

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
                      ? 'Use your assistant internally or publish it as a public hIP (hTime Inquiry Page) for others to interact with'
                      : 'Get your AI-powered executive assistant. Use it privately for scheduling or publish it as a public inquiry page'
                    }
                  </p>
                  <Button 
                    onClick={() => {
                      if (!user) {
                        navigate('/auth');
                      } else {
                        navigate(hasAgent ? '/my-assistant' : '/claim-assistant');
                      }
                    }}
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
