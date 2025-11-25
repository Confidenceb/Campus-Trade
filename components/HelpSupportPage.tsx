
import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, ShieldCheck, Mail, MessageCircle, AlertTriangle, Moon, Sun } from 'lucide-react';
import { Button } from './Button';
import { FAQS } from '../constants';

interface HelpSupportPageProps {
  onBack: () => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

export const HelpSupportPage: React.FC<HelpSupportPageProps> = ({ onBack, isDarkMode, toggleTheme }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
         <div className="flex items-center">
             <Button variant="ghost" size="sm" onClick={onBack} className="mr-4 dark:text-gray-300 dark:hover:bg-gray-700">
                <ArrowLeft className="w-5 h-5 mr-1" /> Back
             </Button>
             <h1 className="text-xl font-bold">Help & Support</h1>
         </div>
         {toggleTheme && (
            <button onClick={toggleTheme} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
            </button>
         )}
      </div>

      <div className="max-w-3xl mx-auto w-full p-4 md:p-8 space-y-8">
        
        {/* Safety First Banner */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
           <div className="flex items-start gap-4">
              <div className="bg-orange-100 dark:bg-orange-800 p-3 rounded-full shrink-0">
                 <ShieldCheck className="w-6 h-6 text-orange-600 dark:text-orange-200" />
              </div>
              <div>
                 <h2 className="text-lg font-bold text-orange-800 dark:text-orange-200 mb-2">Campus Safety Tips</h2>
                 <ul className="list-disc list-inside text-sm text-orange-700 dark:text-orange-300 space-y-1">
                    <li>Always meet in public campus locations (Library, Faculty, Senate).</li>
                    <li>Inspect the item thoroughly before confirming receipt.</li>
                    <li>Use the in-app Escrow payment for high-value items.</li>
                    <li>Report suspicious behavior immediately using the Report button.</li>
                 </ul>
              </div>
           </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
           <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold">Frequently Asked Questions</h2>
           </div>
           <div>
              {FAQS.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                   <button 
                     onClick={() => toggleFaq(index)}
                     className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                   >
                      <span className="font-medium">{faq.question}</span>
                      {openFaqIndex === index ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                   </button>
                   {openFaqIndex === index && (
                     <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed animate-in fade-in slide-in-from-top-1">
                        {faq.answer}
                     </div>
                   )}
                </div>
              ))}
           </div>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="bg-indigo-600 rounded-xl p-6 text-white text-center hover:bg-indigo-700 transition-colors cursor-pointer shadow-lg shadow-indigo-200 dark:shadow-none">
              <MessageCircle className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-bold mb-1">Live Chat Support</h3>
              <p className="text-indigo-200 text-sm">Talk to a support agent (9am - 5pm)</p>
           </div>
           
           <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer group">
              <Mail className="w-8 h-8 mx-auto mb-3 text-gray-400 group-hover:text-indigo-600" />
              <h3 className="font-bold mb-1 group-hover:text-indigo-600">Email Us</h3>
              <p className="text-gray-500 text-sm">help@campustrade.ng</p>
           </div>
        </div>

        {/* Dispute Resolution Teaser */}
        <div className="text-center py-4">
           <p className="text-sm text-gray-500 dark:text-gray-400">
              Need to resolve a conflict? <button className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Open a Dispute Ticket</button> via your Dashboard.
           </p>
        </div>

      </div>
    </div>
  );
};
