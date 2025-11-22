import React, { useState, useEffect } from 'react';
import { X, LayoutDashboard, Heart, List, Trash2, CheckCircle, Eye, MousePointer2, AlertCircle, MessageCircle } from 'lucide-react';
import { Listing, ListingStatus, User, Conversation } from '../types';
import { ListingCard } from './ListingCard';
import { Button } from './Button';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  myListings: Listing[];
  savedListings: Listing[];
  conversations?: Conversation[];
  onDeleteListing: (id: string) => void;
  onMarkAsSold: (id: string) => void;
  onOpenChat?: (conversationId: string) => void;
}

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  myListings,
  savedListings,
  conversations = [],
  onDeleteListing,
  onMarkAsSold,
  onOpenChat
}) => {
  const [activeTab, setActiveTab] = useState<'my_listings' | 'saved' | 'messages'>('my_listings');

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-sm text-gray-500">Manage your listings and saved items</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
            
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-4 shrink-0">
                <div className="space-y-1">
                    <button 
                        onClick={() => setActiveTab('my_listings')}
                        className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'my_listings' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-600 hover:bg-gray-200/50'}`}
                    >
                        <List className="w-4 h-4 mr-3" />
                        My Listings
                        <span className="ml-auto bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-xs">{myListings.length}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('saved')}
                        className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'saved' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-600 hover:bg-gray-200/50'}`}
                    >
                        <Heart className="w-4 h-4 mr-3" />
                        Saved Items
                        <span className="ml-auto bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-xs">{savedListings.length}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('messages')}
                        className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'messages' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-600 hover:bg-gray-200/50'}`}
                    >
                        <MessageCircle className="w-4 h-4 mr-3" />
                        Messages
                        <span className="ml-auto bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full text-xs font-bold">{conversations.length}</span>
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Overview</h3>
                    <div className="space-y-4 px-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center"><Eye className="w-3 h-3 mr-2" /> Total Views</span>
                            <span className="font-semibold text-gray-900">1,204</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center"><MousePointer2 className="w-3 h-3 mr-2" /> Clicks</span>
                            <span className="font-semibold text-gray-900">85</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center"><CheckCircle className="w-3 h-3 mr-2" /> Items Sold</span>
                            <span className="font-semibold text-gray-900">{myListings.filter(l => l.status === ListingStatus.SOLD).length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                {activeTab === 'my_listings' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">My Active Listings</h3>
                        {myListings.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {myListings.map(listing => (
                                    <div key={listing.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center sm:items-start group">
                                        <img src={listing.imageUrl} alt={listing.title} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                                        
                                        <div className="flex-1 w-full text-center sm:text-left">
                                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                                <h4 className="font-bold text-gray-900 line-clamp-1">{listing.title}</h4>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${listing.status === ListingStatus.AVAILABLE ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {listing.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-2 line-clamp-1">{listing.description}</p>
                                            <p className="text-sm font-semibold text-indigo-600">
                                                {listing.price ? `₦${listing.price.toLocaleString()}` : listing.type}
                                            </p>
                                        </div>

                                        <div className="flex gap-2 w-full sm:w-auto justify-center">
                                            {listing.status === ListingStatus.AVAILABLE && (
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    onClick={() => onMarkAsSold(listing.id)}
                                                    className="flex-1 sm:flex-none whitespace-nowrap"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1" /> Mark Sold
                                                </Button>
                                            )}
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                onClick={() => onDeleteListing(listing.id)}
                                                className="text-red-500 hover:bg-red-50 hover:text-red-600 flex-1 sm:flex-none"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500">You haven't listed any items yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'saved' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">Saved Items (Wishlist)</h3>
                         {savedListings.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedListings.map(listing => (
                                    <div key={listing.id} className="relative">
                                        <ListingCard listing={listing} onClick={() => {}} />
                                        {/* Overlay to prevent clicking card if needed, or just use it as display */}
                                        {listing.status !== ListingStatus.AVAILABLE && (
                                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm rounded-xl">
                                                <span className="bg-red-100 text-red-800 font-bold px-3 py-1 rounded-full text-sm transform -rotate-12 border-2 border-red-200">
                                                    {listing.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                <Heart className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-500">No saved items yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">Messages</h3>
                        {conversations.length > 0 ? (
                            <div className="space-y-3">
                                {conversations.map(conv => (
                                    <div 
                                        key={conv.id} 
                                        onClick={() => onOpenChat && onOpenChat(conv.id)}
                                        className="bg-white p-4 rounded-xl border border-gray-100 hover:bg-indigo-50 cursor-pointer transition-all flex gap-4"
                                    >
                                        <img src={conv.listingImage} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-gray-900">{conv.otherUserName}</h4>
                                                <span className="text-[10px] text-gray-400">{conv.lastMessageDate.toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 font-medium mb-0.5">{conv.listingTitle}</p>
                                            <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                                                {conv.lastMessage}
                                            </p>
                                        </div>
                                        {conv.unreadCount > 0 && (
                                            <div className="flex items-center">
                                                <span className="w-5 h-5 bg-indigo-600 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                                                    {conv.unreadCount}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-500">No messages yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};