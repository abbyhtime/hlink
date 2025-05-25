
import { Users, Linkedin, Mail, Phone } from 'lucide-react';

const RecentContacts = () => {
  const contacts = [
    {
      id: 1,
      name: "Sarah Chen",
      company: "Tech Innovations Inc.",
      role: "Product Manager",
      avatar: "SC",
      connected: true
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      company: "Digital Solutions LLC",
      role: "Software Engineer",
      avatar: "MR",
      connected: false
    },
    {
      id: 3,
      name: "Emma Thompson",
      company: "Creative Agency Co.",
      role: "UX Designer",
      avatar: "ET",
      connected: true
    }
  ];

  return (
    <div className="mx-6 mb-8 animate-fade-in">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-lg bg-mintGreen/20">
          <Users className="w-5 h-5 text-mintGreen" />
        </div>
        <h2 className="text-lg font-semibold text-lightGray">Recent Contacts</h2>
      </div>
      
      <div className="space-y-3">
        {contacts.map((contact, index) => (
          <div 
            key={contact.id} 
            className="glass-card p-4 hover:bg-lightGray/15 transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mintGreen to-mintGreen/70 flex items-center justify-center text-white font-semibold text-sm">
                {contact.avatar}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-lightGray">{contact.name}</h3>
                <p className="text-sm text-lightGray/70">{contact.role}</p>
                <p className="text-xs text-lightGray/50">{contact.company}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                {contact.connected && (
                  <div className="p-2 rounded-lg bg-mintGreen/20">
                    <Linkedin className="w-4 h-4 text-mintGreen" />
                  </div>
                )}
                <button className="p-2 rounded-lg bg-lightGray/10 hover:bg-lightGray/20 transition-colors">
                  <Mail className="w-4 h-4 text-lightGray/70" />
                </button>
                <button className="p-2 rounded-lg bg-lightGray/10 hover:bg-lightGray/20 transition-colors">
                  <Phone className="w-4 h-4 text-lightGray/70" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentContacts;
