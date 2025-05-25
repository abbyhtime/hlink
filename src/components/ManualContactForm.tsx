
import { useState } from 'react';
import { User, Linkedin, Building2, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ManualContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    linkedinUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding contact:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      linkedinUrl: ''
    });
  };

  return (
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
      
      <div className="flex space-x-3 pt-4">
        <Button 
          type="submit" 
          className="flex-1 glass-button"
        >
          Add Contact
        </Button>
        <Button 
          type="button" 
          className="flex-1 bg-blue-600/90 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl 
                     shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105
                     backdrop-blur-sm border border-blue-600/30"
        >
          <Linkedin className="w-4 h-4 mr-2" />
          Connect
        </Button>
      </div>
    </form>
  );
};

export default ManualContactForm;
