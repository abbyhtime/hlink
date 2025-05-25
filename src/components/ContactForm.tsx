
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Edit } from 'lucide-react';
import QRDisplay from './QRDisplay';
import ManualContactForm from './ManualContactForm';

const ContactForm = () => {
  return (
    <div className="mx-6 mb-8 animate-slide-up">
      <div className="glass-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-lg bg-mintGreen/20">
            <QrCode className="w-5 h-5 text-mintGreen" />
          </div>
          <h2 className="text-lg font-semibold text-lightGray">Connect & Network</h2>
        </div>
        
        <Tabs defaultValue="qr" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-charcoal/50 border border-lightGray/20">
            <TabsTrigger 
              value="qr" 
              className="data-[state=active]:bg-mintGreen/20 data-[state=active]:text-mintGreen text-lightGray/70"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </TabsTrigger>
            <TabsTrigger 
              value="manual"
              className="data-[state=active]:bg-mintGreen/20 data-[state=active]:text-mintGreen text-lightGray/70"
            >
              <Edit className="w-4 h-4 mr-2" />
              Manual
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="qr" className="mt-6">
            <QRDisplay />
          </TabsContent>
          
          <TabsContent value="manual" className="mt-6">
            <ManualContactForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContactForm;
