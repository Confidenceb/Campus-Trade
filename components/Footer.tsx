import React from 'react';
import { GraduationCap, Heart, ShieldCheck, Mail, Twitter, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CampusTrade</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              The #1 student marketplace for Unilag. Buy, sell, swap, and rent safely within your campus community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Browse Items</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Sell an Item</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Rent Equipment</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Student Swap</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Support & Safety</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Safety Tips</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Report a Scam</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
             <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Connect</h3>
             <div className="flex gap-4 mb-4">
               <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                 <Twitter className="w-5 h-5" />
               </a>
               <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-indigo-100 hover:text-pink-600 transition-colors">
                 <Instagram className="w-5 h-5" />
               </a>
               <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                 <Mail className="w-5 h-5" />
               </a>
             </div>
             <div className="flex items-center gap-2 text-sm text-gray-500">
               <ShieldCheck className="w-4 h-4 text-emerald-600" />
               <span>Verified Student Only</span>
             </div>
          </div>

        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} CampusTrade Unilag. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center">
            Made with <Heart className="w-3 h-3 text-red-500 mx-1" /> for Akokites
          </p>
        </div>
      </div>
    </footer>
  );
};