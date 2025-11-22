import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_LISTINGS, MOCK_NOTIFICATIONS, MOCK_REVIEWS } from './constants';
import { Listing, ListingType, Category, User, ListingStatus, Notification } from './types';
import { ListingCard } from './components/ListingCard';
import { ListingModal } from './components/ListingModal';
import { AuthPage } from './components/AuthPage';
import { KYCModal } from './components/KYCModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ProfileModal } from './components/ProfileModal';
import { DashboardModal } from './components/DashboardModal';
import { ReportModal } from './components/ReportModal';
import { NotificationDropdown } from './components/NotificationDropdown';
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
  
  // Modal States
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [reportingListingId, setReportingListingId] = useState<string | null>(null);
  
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
      reviews: []
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
    setSelectedListing(null);
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
    setListings(prev => [newListing, ...prev]);
    
    // Add a notification for the user
    const newNotif: Notification = {
        id: Date.now().toString(),
        title: 'Listing Posted',
        message: `Your item "${newListing.title}" is now live!`,
        type: 'success',
        isRead: false,
        date: new Date()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleDeleteListing = (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
        setListings(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleMarkAsSold = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: ListingStatus.SOLD } : l));
  };

  const handleToggleSave = (id: string) => {
    if (!user) return;
    const isSaved = user.savedListingIds.includes(id);
    const newSavedIds = isSaved 
        ? user.savedListingIds.filter(sid => sid !== id)
        : [...user.savedListingIds, id];
    
    setUser({ ...user, savedListingIds: newSavedIds });
  };

  const handleInitiateReport = (id: string) => {
    setReportingListingId(id);
    setIsReportModalOpen(true);
  };

  const handleSubmitReport = (reason: string, details: string) => {
    console.log(`Reported listing ${reportingListingId}: ${reason} - ${details}`);
    // In real app, send to backend
    alert("Report submitted successfully. Our moderation team will review it shortly.");
    setReportingListingId(null);
    if (selectedListing?.id === reportingListingId) {
        setSelectedListing(null);
    }
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      if (activeTab !== 'ALL' && listing.type !== activeTab) return false;
      if (selectedCategory !== 'ALL' && listing.category !== selectedCategory) return false;
      // Filter out SOLD items from main view, but keep in dashboard
      if (listing.status !== ListingStatus.AVAILABLE) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return listing.title.toLowerCase().includes(q) || 
               listing.description.toLowerCase().includes(q) ||
               listing.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [listings, activeTab, selectedCategory, searchQuery]);

  const myListings = useMemo(() => {
    return listings.filter(l => l.sellerName === user?.name);
  }, [listings, user]);

  const savedListings = useMemo(() => {
    return listings.filter(l => user?.savedListingIds.includes(l.id));
  }, [listings, user]);

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setActiveTab('ALL'); setSelectedCategory('ALL');}}>
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">CampusTrade</h1>
                <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider leading-none">Unilag Edition</p>
              </div>
            </div>
            
            <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                placeholder="Search for textbooks, lab coats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                  )}
                </button>
                <NotificationDropdown 
                  isOpen={isNotificationOpen} 
                  onClose={() => setIsNotificationOpen(false)}
                  notifications={notifications}
                  onMarkAsRead={handleMarkNotificationRead}
                />
              </div>

              <div className="hidden sm:flex flex-col items-end mr-2 cursor-pointer" onClick={() => setIsProfileModalOpen(true)}>
                 <span className="text-xs font-bold text-gray-900 hover:text-indigo-600 transition-colors">{user.name}</span>
                 {user.isVerified ? (
                   <span className="text-[10px] text-emerald-600 font-medium flex items-center">
                     <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                   </span>
                 ) : (
                   <button onClick={(e) => { e.stopPropagation(); setIsKYCModalOpen(true); }} className="text-[10px] text-orange-500 font-medium hover:underline">
                     Verify Account
                   </button>
                 )}
              </div>
              
              <button 
                onClick={() => setIsDashboardOpen(true)}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
                title="Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>

              <Button onClick={handleAddListingClick} className="shadow-lg shadow-indigo-200 hidden sm:flex">
                <Plus className="w-5 h-5 mr-1.5" />
                List Item
              </Button>
              
              {/* Mobile Profile Button / Logout */}
               <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 hover:text-red-600">
                 <LogOut className="w-5 h-5" />
               </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Search & Action Bar */}
        <div className="md:hidden px-4 pb-3 space-y-3">
           <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddListingClick} className="flex-1 shadow-sm">
                <Plus className="w-5 h-5 mr-1.5" />
                List Item
              </Button>
              <Button variant="outline" onClick={() => setIsDashboardOpen(true)}>
                <LayoutDashboard className="w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={() => setIsProfileModalOpen(true)}>
                <UserIcon className="w-5 h-5" />
              </Button>
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        
        {/* New Engaging Hero Section */}
        <div className="relative bg-indigo-900 rounded-3xl overflow-hidden mb-12 text-white shadow-2xl">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-900/90 to-transparent"></div>
           
           <div className="relative z-10 px-8 py-12 sm:py-16 sm:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-800/50 border border-indigo-700 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
                  <Zap className="w-3 h-3 mr-1 text-yellow-400" /> Exclusive to Unilag
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
                  The Smart Way to <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-emerald-400">Buy, Sell & Swap</span>
                </h1>
                <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
                  Join thousands of Akokites trading textbooks, gadgets, and hostel essentials safely. Save money, reduce waste, and connect with your campus community.
                </p>
                <div className="flex flex-wrap gap-4">
                   <button onClick={() => setActiveTab(ListingType.BUY)} className="px-6 py-3 bg-white text-indigo-900 rounded-lg font-bold shadow-lg hover:bg-indigo-50 transition transform hover:-translate-y-0.5">
                     Browse Marketplace
                   </button>
                   <button onClick={handleAddListingClick} className="px-6 py-3 bg-indigo-600 border border-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-700 transition">
                     Sell Your Stuff
                   </button>
                </div>
              </div>
              
              {/* Trust Stats */}
              <div className="grid grid-cols-2 gap-4 lg:gap-6 w-full lg:w-auto">
                 <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-sm hover:bg-white/20 transition">
                    <p className="text-2xl font-bold text-white">2.5k+</p>
                    <p className="text-xs text-indigo-200 uppercase tracking-wide">Active Students</p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-sm hover:bg-white/20 transition">
                    <p className="text-2xl font-bold text-white">500+</p>
                    <p className="text-xs text-indigo-200 uppercase tracking-wide">Items Listed</p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-sm hover:bg-white/20 transition col-span-2 md:col-span-1">
                    <p className="text-2xl font-bold text-white">98%</p>
                    <p className="text-xs text-indigo-200 uppercase tracking-wide">Safe Trades</p>
                 </div>
              </div>
           </div>
        </div>

        {/* How it Works / Features */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Buy & Save</h3>
              <p className="text-sm text-gray-500">Find affordable textbooks, electronics, and hostel gear sold by fellow students.</p>
           </div>
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                <Repeat className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Student Swap</h3>
              <p className="text-sm text-gray-500">Trade items you don't need for the ones you do. Save cash and reduce waste.</p>
           </div>
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Short-Term Rentals</h3>
              <p className="text-sm text-gray-500">Need a lab coat or calculator for just one day? Rent it for a fraction of the cost.</p>
           </div>
        </div>

        {/* Tabs & Filtering */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex p-1 bg-gray-200 rounded-xl">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'ALL' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All Listings
            </button>
            <button
              onClick={() => setActiveTab(ListingType.BUY)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === ListingType.BUY ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setActiveTab(ListingType.SWAP)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === ListingType.SWAP ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Swap
            </button>
            <button
              onClick={() => setActiveTab(ListingType.RENT)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === ListingType.RENT ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Rent
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
             <SlidersHorizontal className="w-4 h-4 text-gray-500" />
             <select 
               className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2"
               value={selectedCategory}
               onChange={(e) => setSelectedCategory(e.target.value as Category)}
             >
               <option value="ALL">All Categories</option>
               {Object.values(Category).map(c => (
                 <option key={c} value={c}>{c}</option>
               ))}
             </select>
          </div>
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
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
             <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <Inbox className="w-8 h-8 text-indigo-400" />
             </div>
             <h3 className="text-lg font-medium text-gray-900">No listings found</h3>
             <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
             <Button onClick={() => {setSearchQuery(''); setActiveTab('ALL'); setSelectedCategory('ALL');}}>
               Clear Filters
             </Button>
          </div>
        )}

      </main>

      <Footer />

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
        onReport={handleInitiateReport}
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

      <DashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        currentUser={user}
        myListings={myListings}
        savedListings={savedListings}
        onDeleteListing={handleDeleteListing}
        onMarkAsSold={handleMarkAsSold}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleSubmitReport}
      />

    </div>
  );
};

export default App;