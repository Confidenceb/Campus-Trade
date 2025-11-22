import React, { useState, useEffect } from 'react';
import { X, User, MapPin, Shield, MessageCircle, CheckCircle, Phone, AlertCircle, ChevronRight, Heart, Flag, AlertTriangle } from 'lucide-react';
import { Listing, ListingType, User as UserType } from '../types';
import { Button } from './Button';

interface ProductDetailsModalProps {
  listing: Listing | null;
  currentUser: UserType | null;
  onClose: () => void;
  onVerifyNeeded: () => void;
  onViewSeller: (sellerName: string) => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onReport?: (id: string) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  listing, 
  currentUser,
  onClose, 
  onVerifyNeeded,
  onViewSeller,
  isSaved = false,
  onToggleSave,
  onReport
}) => {
  const [showContactInfo, setShowContactInfo] = useState(false);

  useEffect(() => {
    setShowContactInfo(false);
  }, [listing]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (listing) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [listing, onClose]);

  if (!listing) return null;

  const handleContactClick = () => {
    if (currentUser?.isVerified) {
      setShowContactInfo(true);
    } else {
      onVerifyNeeded();
    }
  };

  const handleWhatsAppClick = () => {
    if (listing.whatsappNumber) {
        const message = `Hi, I saw your listing "${listing.title}" on CampusTrade. Is it still available?`;
        window.open(`https://wa.me/${listing.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const handleReport = () => {
    if (confirm("Are you sure you want to report this item as suspicious?")) {
        if (onReport) onReport(listing.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden flex flex-col md:flex-row min-h-[500px]" onClick={e => e.stopPropagation()}>
        
        {/* Image Side */}
        <div className="w-full md:w-1/2 bg-gray-100 relative group h-64 md:h-auto">
          <img 
            src={listing.imageUrl} 
            alt={listing.title} 
            className="w-full h-full object-cover absolute inset-0"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 md:hidden z-10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
             <div className="flex gap-2">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full">
                  {listing.type}
                </span>
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-full">
                  {listing.condition}
                </span>
             </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="w-full md:w-1/2 flex flex-col relative bg-white">
          {/* Header Actions */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            {onToggleSave && (
                <button 
                    onClick={() => onToggleSave(listing.id)}
                    className={`p-2 rounded-full transition-colors ${isSaved ? 'bg-pink-50 text-pink-600' : 'text-gray-400 hover:bg-gray-100'}`}
                    title="Save Item"
                >
                    <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                </button>
            )}
            <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full hidden md:block"
            >
                <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 md:p-8 flex-grow overflow-y-auto custom-scrollbar">
             <div className="mb-6 mt-4 md:mt-0">
                <h4 className="text-sm font-semibold text-indigo-600 mb-1 uppercase tracking-wide">{listing.category}</h4>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">{listing.title}</h2>
                
                <div className="mt-3">
                  {listing.type === ListingType.BUY && (
                    <span className="text-3xl font-bold text-gray-900">₦{listing.price?.toLocaleString()}</span>
                  )}
                  {listing.type === ListingType.RENT && (
                    <div className="flex flex-col">
                       <span className="text-3xl font-bold text-orange-600">₦{listing.rentPrice?.toLocaleString()}</span>
                       <span className="text-sm text-gray-500 font-medium">per {listing.rentDuration}</span>
                    </div>
                  )}
                  {listing.type === ListingType.SWAP && (
                    <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg inline-block">
                       <span className="text-sm text-purple-800 font-medium">Swap for: </span>
                       <span className="text-base font-bold text-purple-900">{listing.swapRequest}</span>
                    </div>
                  )}
                </div>
             </div>

             <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
                </div>

                {/* Seller Info Card */}
                <div 
                  className="bg-gray-50 rounded-xl p-4 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors group"
                  onClick={() => onViewSeller(listing.sellerName)}
                >
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-900 flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        Seller Info
                      </h3>
                      <span className="flex items-center text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                        <Shield className="w-3 h-3 mr-1" /> Verified Student
                      </span>
                   </div>
                   
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg border-2 border-white shadow-sm">
                            {listing.sellerName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{listing.sellerName}</p>
                            <p className="text-xs text-gray-500 flex items-center mt-0.5">
                              <MapPin className="w-3 h-3 mr-1" /> Unilag Campus
                            </p>
                          </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                   </div>
                </div>

                {/* Safety Tips */}
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-orange-800 flex items-center mb-2">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Safety Tips
                    </h4>
                    <ul className="text-xs text-orange-700 space-y-1 list-disc list-inside">
                        <li>Meet in open, populated places on campus (e.g., Senate Building, Faculty, Jaja).</li>
                        <li>Check the item thoroughly before paying.</li>
                        <li>Avoid paying in advance for items you haven't seen.</li>
                    </ul>
                </div>
             </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
             {showContactInfo ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <p className="text-xs font-bold text-emerald-700 uppercase mb-2 flex items-center">
                            <Phone className="w-3 h-3 mr-1" /> Seller Contact
                        </p>
                        <p className="text-xl font-bold text-gray-900 selection:bg-emerald-200 selection:text-emerald-900">
                            {listing.contactInfo}
                        </p>
                    </div>
                    
                    {listing.whatsappNumber && (
                        <Button onClick={handleWhatsAppClick} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm">
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Chat on WhatsApp
                        </Button>
                    )}
                </div>
             ) : (
               <div className="flex flex-col gap-2">
                 <Button onClick={handleContactClick} className="w-full shadow-lg shadow-indigo-200 relative overflow-hidden" size="lg">
                   <span className="relative z-10 flex items-center">
                      <Phone className="w-5 h-5 mr-2" />
                      Contact Seller
                   </span>
                 </Button>
                 {!currentUser?.isVerified && (
                    <p className="text-center text-[10px] text-orange-500 flex items-center justify-center mt-1">
                      <AlertCircle className="w-3 h-3 mr-1" /> Verification required to view contact
                    </p>
                 )}
               </div>
             )}
             
             <div className="flex justify-between items-center mt-4">
                 <p className="text-center text-xs text-gray-400 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" /> Safe Trade Guarantee
                 </p>
                 <button onClick={handleReport} className="text-xs text-gray-400 hover:text-red-600 flex items-center transition-colors">
                    <Flag className="w-3 h-3 mr-1" /> Report Item
                 </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};