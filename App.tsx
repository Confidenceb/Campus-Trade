
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_LISTINGS, MOCK_NOTIFICATIONS, MOCK_REVIEWS, MOCK_CONVERSATIONS } from './constants';
import { Listing, ListingType, Category, User, ListingStatus, Notification, Conversation } from './types';
import { ListingCard } from './components/ListingCard';
import { ListingModal } from './components/ListingModal';
import { AuthPage } from './components/AuthPage';
import { KYCModal } from './components/KYCModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ProfileModal } from './components/ProfileModal';
import { DashboardModal } from './components/DashboardModal';
import { ReportModal } from './components/ReportModal';
import { NotificationDropdown } from './components/NotificationDropdown';
import { ChatModal } from './components/ChatModal';
import { Button } from './components/Button';
import { Footer } from './components/Footer';
import { Plus, Search, SlidersHorizontal, GraduationCap, ShoppingBag, Repeat, Clock, LogOut, User as UserIcon, ShieldCheck, LayoutDashboard, Bell, Zap, Inbox } from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  
  // App State
  const [activeTab, setActiveTab] = useState<ListingType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  
  // Modal States
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [reportingListingId, setReportingListingId] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<{ isOpen: boolean; recipient: string; listing?: Listing; conversationId?: string } | null>(null);
  
  // Profile States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewingSeller, setViewingSeller] = useState<User | null>(null);

  const handleLogin = (name: string, email: string) => {
    setUser({
      id: 'user-123',
      name,
      email,
      isVerified: false,
      savedListingIds: [],
      username: name.toLowerCase().replace(/\s/g, ''),
      bio: "I'm a student at Unilag.",
      notifications: MOCK_NOTIFICATIONS,
      rating: 5.0,
      reviews: [],
      conversations: MOCK_CONVERSATIONS
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleVerifyKYC = () => {
    if (user) {
      setUser({ ...user, isVerified: true });
      setIsKYCModalOpen(false);
    }
  };

  const handleAddListingClick = () => {
    if (!user?.isVerified) {
      setIsKYCModalOpen(true);
    } else {
      setIsListModalOpen(true);
    }
  };

  const handleVerifyNeeded = () => {
    // KYC modal opens on top of other modals
    setIsKYCModalOpen(true);
  };

  const handleViewSeller = (sellerName: string) => {
    // Simulate fetching seller data with mock trust stats
    const mockSeller: User = {
      id: 'seller-' + Math.random(),
      name: sellerName,
      email: `${sellerName.toLowerCase().split(' ')[0]}@student.unilag.edu.ng`,
      isVerified: true,
      savedListingIds: [],
      username: sellerName.toLowerCase().replace(/\s/g, ''),
      course: 'Computer Science',
      level: '300',
      bio: `Hi, I'm ${sellerName}. I sell mostly electronics and textbooks. Meet me at Science facade.`,
      rating: 4.5 + (Math.random() * 0.5),
      reviews: MOCK_REVIEWS
    };
    setViewingSeller(mockSeller);
  };

  const handleAddListing = (newListingData: Omit<Listing, 'id' | 'createdAt' | 'status'>) => {
    const newListing: Listing = {
      ...newListingData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      status: ListingStatus.AVAILABLE,
      sellerName: user?.name || newListingData.sellerName,
      rentPrice: newListingData.type === ListingType.RENT ? newListingData.rentPrice : undefined,
      rentDuration: newListingData.type === ListingType.RENT ? newListingData.rentDuration : undefined,
      swapRequest: newListingData.type === ListingType.SWAP ? newListingData.swapRequest : undefined,
      price: newListingData.type === ListingType.BUY ? newListingData.price : undefined,
    };
    setListings([newListing, ...listings]);
    // Add success notification
    setNotifications([{
        id: Date.now().toString(),
        type: 'success',
        title: 'Listing Created',
        message: `Your listing "${newListing.title}" is now live.`,
        isRead: false,
        date: new Date()
    }, ...notifications]);
  };

  const handleDeleteListing = (id: string) => {
    setListings(listings.filter(l => l.id !== id));
  };

  const handleMarkAsSold = (id: string) => {
    setListings(listings.map(l => l.id === id ? { ...l, status: ListingStatus.SOLD } : l));
  };

  const handleToggleSave = (id: string) => {
    if (!user) return;
    const isSaved = user.savedListingIds.includes(id);
    const newSavedIds = isSaved 
        ? user.savedListingIds.filter(sid => sid !== id)
        : [...user.savedListingIds, id];
    
    setUser({ ...user, savedListingIds: newSavedIds });
  };

  const handleReportListing = (id: string) => {
    setReportingListingId(id);
    setIsReportModalOpen(true);
  };

  const handleSubmitReport = (reason: string, details: string) => {
      console.log(`Reported listing ${reportingListingId}: ${reason} - ${details}`);
      setReportingListingId(null);
      // In a real app, send to backend
  };

  const handleChatOpen = (listing: Listing) => {
    setActiveChat({
      isOpen: true,
      recipient: listing.sellerName,
      listing: listing
    });
  };

  const handleOpenConversation = (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      setActiveChat({
        isOpen: true,
        recipient: conv.otherUserName,
        conversationId: conv.id
      });
      setIsDashboardOpen(false); // Close dashboard if opening from there
    }
  };

  const handleSendMessage = (text: string) => {
     console.log("Message sent:", text);
     // Here you would update the conversation state or send to backend
  };

  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      const matchesTab = activeTab === 'ALL' || listing.type === activeTab;
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           listing.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || listing.category === selectedCategory;
      return matchesTab && matchesSearch && matchesCategory;
    });
  }, [listings, activeTab, searchQuery, selectedCategory]);

  const myActiveListings = useMemo(() => {
      return user ? listings.filter(l => l.sellerName === user.name) : [];
  }, [listings, user]);

  const mySavedListings = useMemo(() => {
      return user ? listings.filter(l => user.savedListingIds.includes(l.id)) : [];
  }, [listings, user]);

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => {
              setActiveTab('ALL');
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}>
              <div className="bg-indigo-600 p-1.5 rounded-lg mr-2 shadow-md shadow-indigo-200">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">CampusTrade</h1>
                <p className="text--[10px] text-indigo-600 font-bold uppercase tracking-wider">Unilag Edition</p>
              </div>
            </div>
            
            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8 items-center">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Search for textbooks, gadgets, lab coats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
               <button 
                onClick={() => setIsDashboardOpen(true)}
                className="hidden md:flex items-center text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors"
               >
                 <LayoutDashboard className="w-5 h-5 mr-1" /> Dashboard
               </button>
               
               <div className="relative">
                 <button 
                   className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors"
                   onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                 >
                   <Bell className="w-6 h-6" />
                   {unreadNotifications > 0 && (
                     <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                   )}
                 </button>
                 <NotificationDropdown 
                    isOpen={isNotificationOpen} 
                    onClose={() => setIsNotificationOpen(false)}
                    notifications={notifications}
                    onMarkAsRead={(id) => setNotifications(notifications.map(n => n.id === id ? {...n, isRead: true} : n))}
                 />
               </div>

               <div className="h-8 w-px bg-gray-200 mx-2"></div>

               <div 
                 className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
                 onClick={() => setIsProfileModalOpen(true)}
               >
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-900 leading-none">{user.name}</p>
                    {user.isVerified ? (
                      <p className="text-[10px] text-emerald-600 font-medium flex items-center mt-0.5">
                        <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified
                      </p>
                    ) : (
                      <p className="text-[10px] text-orange-500 font-medium flex items-center mt-0.5">
                        Unverified
                      </p>
                    )}
                  </div>
               </div>
               
               <Button 
                onClick={handleAddListingClick} 
                size="sm" 
                className="hidden md:flex ml-2 shadow-lg shadow-indigo-200"
               >
                <Plus className="w-4 h-4 mr-1" /> List Item
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Search Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
              placeholder="Search Unilag market..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
      </div>

      {/* Hero Stats Section */}
      <div className="bg-indigo-700 text-white py-12 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
           <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
           <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Buy, Sell & Swap on Campus</h2>
           <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-10">
             The safest way to trade with fellow Unilag students. Join 5,000+ students saving money today.
           </p>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                 <ShoppingBag className="w-8 h-8 text-indigo-300 mx-auto mb-2" />
                 <div className="text-2xl font-bold">1.2k+</div>
                 <div className="text-xs text-indigo-200">Items Listed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                 <UserIcon className="w-8 h-8 text-emerald-300 mx-auto mb-2" />
                 <div className="text-2xl font-bold">5k+</div>
                 <div className="text-xs text-indigo-200">Active Students</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                 <Zap className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                 <div className="text-2xl font-bold">Avg 2h</div>
                 <div className="text-xs text-indigo-200">Sale Time</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                 <ShieldCheck className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                 <div className="text-2xl font-bold">100%</div>
                 <div className="text-xs text-indigo-200">Verified Users</div>
              </div>
           </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        
        {/* Category Filter Scroll */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <button 
              onClick={() => setSelectedCategory('ALL')}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                selectedCategory === 'ALL' 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              All Items
            </button>
            {Object.values(Category).map(cat => (
               <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  selectedCategory === cat 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex bg-gray-100 p-1 rounded-xl">
             <button 
                onClick={() => setActiveTab('ALL')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'ALL' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               All
             </button>
             <button 
                onClick={() => setActiveTab(ListingType.BUY)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === ListingType.BUY ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               Buy
             </button>
             <button 
                onClick={() => setActiveTab(ListingType.SWAP)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === ListingType.SWAP ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               Swap
             </button>
             <button 
                onClick={() => setActiveTab(ListingType.RENT)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === ListingType.RENT ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               Rent
             </button>
          </div>
          
          <button className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600">
            <SlidersHorizontal className="w-4 h-4 mr-1" /> Filter
          </button>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard 
                key={listing.id} 
                listing={listing} 
                onClick={() => setSelectedListing(listing)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
               <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500 mb-6">We couldn't find matches for your search filters.</p>
            <Button variant="outline" onClick={() => {
               setSearchQuery('');
               setSelectedCategory('ALL');
               setActiveTab('ALL');
            }}>Clear Filters</Button>
          </div>
        )}
        
        {/* How it works Section */}
        <div className="mt-24 mb-12">
           <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
              <p className="text-gray-500">Trading on campus has never been easier</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center hover:shadow-lg transition-shadow">
                 <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mx-auto mb-4 text-xl font-bold">1</div>
                 <h3 className="text-lg font-bold text-gray-900 mb-2">List or Browse</h3>
                 <p className="text-sm text-gray-500">Post an item you don't need or find something you do. It takes seconds.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center hover:shadow-lg transition-shadow">
                 <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mx-auto mb-4 text-xl font-bold">2</div>
                 <h3 className="text-lg font-bold text-gray-900 mb-2">Chat Securely</h3>
                 <p className="text-sm text-gray-500">Connect with verified students via our in-app chat. No need to share numbers.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center hover:shadow-lg transition-shadow">
                 <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mx-auto mb-4 text-xl font-bold">3</div>
                 <h3 className="text-lg font-bold text-gray-900 mb-2">Safe Handover</h3>
                 <p className="text-sm text-gray-500">Meet on campus or use our Escrow service for secure payment holding.</p>
              </div>
           </div>
        </div>

      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Mobile FAB */}
      <button 
        onClick={handleAddListingClick}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 z-30"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Modals */}
      <ListingModal 
        isOpen={isListModalOpen} 
        onClose={() => setIsListModalOpen(false)} 
        onSubmit={handleAddListing} 
      />
      
      <KYCModal
        isOpen={isKYCModalOpen}
        onClose={() => setIsKYCModalOpen(false)}
        onVerify={handleVerifyKYC}
      />

      <ProductDetailsModal
        listing={selectedListing}
        currentUser={user}
        onClose={() => setSelectedListing(null)}
        onVerifyNeeded={handleVerifyNeeded}
        onViewSeller={handleViewSeller}
        isSaved={selectedListing ? user.savedListingIds.includes(selectedListing.id) : false}
        onToggleSave={handleToggleSave}
        onReport={handleReportListing}
        onChat={handleChatOpen}
        canClose={!isKYCModalOpen && !activeChat}
      />

      <DashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        currentUser={user}
        myListings={myActiveListings}
        savedListings={mySavedListings}
        conversations={conversations}
        onDeleteListing={handleDeleteListing}
        onMarkAsSold={handleMarkAsSold}
        onOpenChat={handleOpenConversation}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleSubmitReport}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        isEditable={true}
        onSave={handleUpdateProfile}
      />

      {viewingSeller && (
        <ProfileModal
          isOpen={!!viewingSeller}
          onClose={() => setViewingSeller(null)}
          user={viewingSeller}
          isEditable={false}
        />
      )}

      {activeChat && (
        <ChatModal
          isOpen={activeChat.isOpen}
          onClose={() => setActiveChat(null)}
          recipientName={activeChat.recipient}
          listing={activeChat.listing}
          currentUser={user}
          existingMessages={activeChat.conversationId ? conversations.find(c => c.id === activeChat.conversationId)?.messages : []}
          onSendMessage={handleSendMessage}
        />
      )}

    </div>
  );
};

export default App;
