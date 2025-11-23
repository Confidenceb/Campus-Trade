
import React, { useState, useEffect } from 'react';
import { X, User, MapPin, Shield, MessageCircle, CheckCircle, AlertCircle, ChevronRight, Heart, Flag, AlertTriangle, Star, Lock } from 'lucide-react';
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
  onChat?: (listing: Listing) => void;
  canClose?: boolean; 
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  listing, 
  currentUser,
  onClose, 
  onVerifyNeeded,
  onViewSeller,
  isSaved = false,
  onToggleSave,
  onReport,
  onChat,
  canClose = true
}) => {
  
  useEffect(() => {
    if (listing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [listing]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && canClose) onClose();
    };
    if (listing) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [listing, onClose, canClose]);

  if (!listing) return null;

  const handleChatClick = () => {
    if (currentUser?.isVerified) {
      if (onChat) onChat(listing);
    } else {
      onVerifyNeeded();
    }
  };

  const handleSecurePay = () => {
    if (!currentUser?.isVerified) {
        onVerifyNeeded();
        return;
    }
    alert("Secure Escrow Payment\n\nProceeding to secure checkout. Funds will be held until you receive the item.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm overflow-hidden" onClick={() => canClose && onClose()}>
      {/* Mobile: Full Screen, Desktop: Centered Modal */}
      <div className="bg-white md:rounded-2xl shadow-2xl w-full h-full md:h-auto md:max-h-[90vh] md:max-w-4xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-200 overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Image Side */}
        <div className="w-full md:w-1/2 bg-gray-900 relative group h-64 shrink-0 md:h-auto">
          {/* Close Button - Enhanced for Mobile Visibility */}
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white/90 text-gray-900 rounded-full hover:bg-white shadow-lg md:hidden z-50 focus:outline-none active:scale-95 transition-transform"
            aria-label="Close details"
          >
            <X className="w-6 h-6" />
          </button>

          <img 
            src={listing.imageUrl} 
            alt={listing.title} 
            className="w-full h-full object-contain md:object-cover bg-black"
          />
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10 pointer-events-none">
             <div className="flex gap-2">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                  {listing.type}
                </span>
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-full shadow-sm">
                  {listing.condition}
                </span>
             </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="w-full md:w-1/2 flex flex-col relative bg-white h-full overflow-hidden">
          {/* Desktop Header Actions */}
          <div className="hidden md:flex absolute top-4 right-4 gap-2 z-10">
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
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
            >
                <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 md:p-8 flex-grow overflow-y-auto custom-scrollbar">
             {/* Mobile Save Button (Top Right of content) */}
             <div className="md:hidden flex justify-end mb-2">
                 {onToggleSave && (
                    <button 
                        onClick={() => onToggleSave(listing.id)}
                        className={`p-2 rounded-full transition-colors ${isSaved ? 'bg-pink-50 text-pink-600' : 'bg-gray-50 text-gray-400'}`}
                    >
                        <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                )}
             </div>

             <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">{listing.category}</h4>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">{listing.university}</span>
                </div>
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
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">{listing.description}</p>
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
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="text-xs font-bold text-yellow-700">4.8</span>
                        </div>
                        <span className="flex items-center text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                          <Shield className="w-3 h-3 mr-1" /> Verified
                        </span>
                      </div>
                   </div>
                   
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg border-2 border-white shadow-sm">
                            {listing.sellerName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{listing.sellerName}</p>
                            <p className="text-xs text-gray-500 flex items-center mt-0.5">
                              <MapPin className="w-3 h-3 mr-1" /> {listing.university}
                            </p>
                          </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                   </div>
                </div>

                {/* Safety Tips */}
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-orange-800 flex items-center mb-2">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Secure Platform
                    </h4>
                    <p className="text-xs text-orange-700 leading-relaxed">
                        Payments are held in Escrow. Chats are AI monitored for your safety. Do not share phone numbers.
                    </p>
                </div>
             </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50/50 pb-8 md:pb-6">
             <div className="flex flex-col gap-3">
                 <div className="flex gap-3">
                    <Button onClick={handleChatClick} variant="outline" className="flex-1 border-gray-300 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Chat
                    </Button>
                    
                    <Button onClick={handleSecurePay} className="flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                        <Lock className="w-5 h-5 mr-2" />
                        {listing.type === ListingType.BUY ? 'Buy Now' : 'Make Offer'}
                    </Button>
                 </div>

                 {!currentUser?.isVerified && (
                    <p className="text-center text-[10px] text-orange-500 flex items-center justify-center mt-1">
                      <AlertCircle className="w-3 h-3 mr-1" /> Verification required
                    </p>
                 )}
             </div>
             
             <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200/50">
                 <p className="text-center text-xs text-gray-400 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-emerald-500" /> Buyer Protection Active
                 </p>
                 <button onClick={() => onReport && onReport(listing.id)} className="text-xs text-gray-400 hover:text-red-600 flex items-center transition-colors">
                    <Flag className="w-3 h-3 mr-1" /> Report Item
                 </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
