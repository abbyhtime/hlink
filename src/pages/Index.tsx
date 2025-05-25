
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import AddContactForm from '@/components/AddContactForm';
import RecentContacts from '@/components/RecentContacts';
import QuickActions from '@/components/QuickActions';

const Index = () => {
  return (
    <div className="min-h-screen bg-charcoal">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(71,158,125,0.1),transparent_70%)]" />
      
      <div className="relative z-10 max-w-md mx-auto">
        <Header />
        <StatsCard />
        <AddContactForm />
        <QuickActions />
        <RecentContacts />
        
        {/* Bottom padding for mobile scroll */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default Index;
