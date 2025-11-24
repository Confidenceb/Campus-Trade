
import React, { useState, useEffect } from 'react';
import { X, LayoutDashboard, Heart, List, Trash2, CheckCircle, Eye, MousePointer2, AlertCircle, MessageCircle, Gift, Scale, Copy } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'my_listings' | 'saved' | 'messages' | 'referrals' | 'disputes'>('my_listings');

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
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden transition-colors" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your listings, saved items, and rewards</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
            
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 p-4 shrink-0">
                <div className="space-y-1">
                    <button 
                        onClick={() => setActiveTab('my_listings')}
                        className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'my_listings' ? 'bg-white dark:bg-gray-800 shadow-sm text-indigo-700 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'}`}
                    >
                        <List className="w-4 h-4 mr-3" />
                        My Listings
                        <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">{myListings.length}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('saved')}
                        className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'saved' ? 'bg-white dark:bg-gray-800 shadow-sm text-indigo-700 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'}`}
                    >
                        <Heart className="w-4 h-4 mr-3" />
                        Saved Items
                        <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">{savedListings.length}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('messages')}
                        className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'messages' ? 'bg-white dark:bg-gray-800 shadow-sm text-indigo-700 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'}`}
                    >
                        <MessageCircle className="w-4 h-4 mr-3" />
                        Messages
                        <span className="ml-auto bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 py-0.5 px-2 rounded-full text-xs font-bold">{conversations.length}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('referrals')}
                        className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'referrals' ? 'bg-white dark:bg-gray-800 shadow-sm text-indigo-700 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'}`}
                    >
                        <Gift className="w-4 h-4 mr-3" />
                        Rewards & Coupons
                    </button>
                    <button 
                        onClick={() => setActiveTab('disputes')}
                        className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'disputes' ? 'bg-white dark:bg-gray-800 shadow-sm text-indigo-700 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'}`}
                    >
                        <Scale className="w-4 h-4 mr-3" />
                        Dispute Center
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-2">Overview</h3>
                    <div className="space-y-4 px-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 flex items-center"><Eye className="w-3 h-3 mr-2" /> Total Views</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-200">1,204</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 flex items-center"><MousePointer2 className="w-3 h-3 mr-2" /> Clicks</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-200">85</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 flex items-center"><CheckCircle className="w-3 h-3 mr-2" /> Items Sold</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-200">{myListings.filter(l => l.status === ListingStatus.SOLD).length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 dark:bg-gray-900">
                {activeTab === 'my_listings' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Active Listings</h3>
                        {myListings.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {myListings.map(listing => (
                                    <div key={listing.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center sm:items-start group">
                                        <img src={listing.imageUrl} alt={listing.title} className="w-20 h-20 object-cover rounded-lg bg-gray-100 dark:bg-gray-700" />
                                        
                                        <div className="flex-1 w-full text-center sm:text-left">
                                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                                <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">{listing.title}</h4>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${listing.status === ListingStatus.AVAILABLE ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                                                    {listing.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">{listing.description}</p>
                                            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                                {listing.price ? `₦${listing.price.toLocaleString()}` : listing.type}
                                            </p>
                                        </div>

                                        <div className="flex gap-2 w-full sm:w-auto justify-center">
                                            {listing.status === ListingStatus.AVAILABLE && (
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    onClick={() => onMarkAsSold(listing.id)}
                                                    className="flex-1 sm:flex-none whitespace-nowrap dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1" /> Mark Sold
                                                </Button>
                                            )}
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                onClick={() => onDeleteListing(listing.id)}
                                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 flex-1 sm:flex-none"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                <p className="text-gray-500 dark:text-gray-400">You haven't listed any items yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'saved' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Saved Items (Wishlist)</h3>
                         {savedListings.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedListings.map(listing => (
                                    <div key={listing.id} className="relative">
                                        <ListingCard listing={listing} onClick={() => {}} />
                                        {/* Overlay to prevent clicking card if needed, or just use it as display */}
                                        {listing.status !== ListingStatus.AVAILABLE && (
                                            <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center backdrop-blur-sm rounded-xl">
                                                <span className="bg-red-100 text-red-800 font-bold px-3 py-1 rounded-full text-sm transform -rotate-12 border-2 border-red-200">
                                                    {listing.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                <Heart className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                <p className="text-gray-500 dark:text-gray-400">No saved items yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Messages</h3>
                        {conversations.length > 0 ? (
                            <div className="space-y-3">
                                {conversations.map(conv => (
                                    <div 
                                        key={conv.id} 
                                        onClick={() => onOpenChat && onOpenChat(conv.id)}
                                        className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-all flex gap-4"
                                    >
                                        <img src={conv.listingImage} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-gray-900 dark:text-white">{conv.otherUserName}</h4>
                                                <span className="text-[10px] text-gray-400">{conv.lastMessageDate.toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">{conv.listingTitle}</p>
                                            <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
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
                             <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                <MessageCircle className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                <p className="text-gray-500 dark:text-gray-400">No messages yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'referrals' && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white text-center">
                            <Gift className="w-12 h-12 mx-auto mb-3" />
                            <h3 className="text-2xl font-bold mb-2">Invite Friends, Get Coupons!</h3>
                            <p className="text-indigo-100 mb-6">Earn discount coupons for every 3 friends that join CampusTrade using your code.</p>
                            
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 inline-flex items-center gap-3 border border-white/30">
                                <span className="font-mono text-lg font-bold tracking-wider">{currentUser.referralCode || `${currentUser.name.substring(0,4).toUpperCase()}2024`}</span>
                                <button className="p-1 hover:bg-white/20 rounded transition-colors" title="Copy Code">
                                    <Copy className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-8">Your Coupons</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl border-l-4 border-l-emerald-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">5% OFF Feature Listing</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Boost your item visibility for less.</p>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">ACTIVE</span>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                    <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">WELCOME5</code>
                                    <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Use Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'disputes' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                           <h3 className="text-lg font-bold text-gray-900 dark:text-white">Dispute Center</h3>
                           <Button size="sm">Open New Ticket</Button>
                        </div>
                        
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                            <Scale className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                            <p className="text-gray-500 dark:text-gray-400">You have no active disputes.</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">That's a good thing! Safe trading.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
