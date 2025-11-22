import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ShieldAlert, Info } from 'lucide-react';
import { Listing, Message, User } from '../types';
import { Button } from './Button';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing?: Listing;
  recipientName: string;
  currentUser: User;
  existingMessages?: Message[];
  onSendMessage: (text: string) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  listing,
  recipientName,
  currentUser,
  existingMessages = [],
  onSendMessage
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(existingMessages);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Update local messages when prop changes
  useEffect(() => {
    setMessages(existingMessages);
  }, [existingMessages]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  // Content Moderation Logic
  const containsRestrictedContent = (text: string): boolean => {
    const lower = text.toLowerCase();
    
    // Phone numbers (simplified regex for Nigeria mobile/landlines)
    // Matches 080..., 090..., 081..., +234..., etc.
    const phoneRegex = /(\+?234|0)[789][01]\d{8}/;
    
    // Keywords suggesting off-platform deals
    const restrictedKeywords = [
      'whatsapp', 'call me', 'call my', 'dm me', 'phone number', 'telegram', 
      'send number', 'contact me on', 'outside the app', 'send money to'
    ];

    if (phoneRegex.test(text.replace(/\s/g, ''))) return true;
    if (restrictedKeywords.some(kw => lower.includes(kw))) return true;

    return false;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newMessage.trim()) return;

    if (containsRestrictedContent(newMessage)) {
      setErrorMsg("For your safety and to secure your transaction, please do not share phone numbers or try to communicate outside the app. All payments are held in escrow.");
      return;
    }

    const msg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, msg]);
    onSendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
              {recipientName.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{recipientName}</h3>
              <p className="text-xs text-green-600 flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span> Online
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Context Header (Product being discussed) */}
        {listing && (
          <div className="bg-gray-50 p-3 border-b border-gray-100 flex items-center gap-3">
             <img src={listing.imageUrl} alt={listing.title} className="w-10 h-10 rounded object-cover border border-gray-200" />
             <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase font-semibold">{listing.type}</p>
                <p className="text-sm font-medium text-gray-900 truncate">{listing.title}</p>
                <p className="text-xs font-bold text-indigo-600">
                   {listing.price ? `₦${listing.price.toLocaleString()}` : 
                    listing.rentPrice ? `₦${listing.rentPrice}/day` : 'Swap'}
                </p>
             </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          <div className="flex justify-center my-4">
             <div className="bg-yellow-50 border border-yellow-100 text-yellow-800 text-xs px-4 py-2 rounded-lg flex items-start max-w-xs">
               <Info className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
               <p>Keep all conversations inside CampusTrade. Payments made outside the app are not protected.</p>
             </div>
          </div>

          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  isMe 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
           {errorMsg && (
             <div className="mb-3 text-xs text-red-600 bg-red-50 p-2 rounded flex items-center animate-pulse">
               <ShieldAlert className="w-4 h-4 mr-2" />
               {errorMsg}
             </div>
           )}
           <form onSubmit={handleSend} className="flex items-end gap-2">
             <div className="relative flex-1">
               <textarea
                 value={newMessage}
                 onChange={(e) => setNewMessage(e.target.value)}
                 placeholder="Type a message..."
                 className="w-full rounded-xl border-gray-300 border pl-4 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 resize-none text-sm"
                 rows={1}
                 style={{ minHeight: '46px', maxHeight: '100px' }}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleSend(e);
                   }
                 }}
               />
             </div>
             <Button type="submit" disabled={!newMessage.trim()} className="rounded-xl h-[46px] w-[46px] p-0 flex items-center justify-center">
               <Send className="w-5 h-5 ml-0.5" />
             </Button>
           </form>
        </div>
      </div>
    </div>
  );
};