import React, { useState, useMemo } from 'react';
import { MOCK_LISTINGS } from './constants';
import { Listing, ListingType, Category, User, ListingStatus } from './types';
import { ListingCard } from './components/ListingCard';
import { ListingModal } from './components/ListingModal';
import { AuthPage } from './components/AuthPage';
import { KYCModal } from './components/KYCModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ProfileModal } from './components/ProfileModal';
import { DashboardModal } from './components/DashboardModal';
import { Button } from './components/Button';
import { Footer } from './components/Footer';
import { Plus, Search, SlidersHorizontal, GraduationCap, ShoppingBag, Repeat, Clock, LogOut, User as UserIcon, ShieldCheck, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  
  // App State
  const [activeTab, setActiveTab] = useState<ListingType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  
  // Modal States
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  
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
      bio: "I'm a student at Unilag."
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
    const mockSeller: User = {
      id: 'seller-' + Math.random(),
      name: sellerName,
      email: `${sellerName.toLowerCase().split(' ')[0]}@student.unilag.edu.ng`,
      isVerified: true,
      savedListingIds: [],
      username: sellerName.toLowerCase().replace(/\s/g, ''),
      course: 'Computer Science',
      level: '300',
      bio: `Hi, I'm ${sellerName}. I sell mostly electronics and textbooks. Meet me at Science facade.`
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

  const handleReportListing = (id: string) => {
    alert(`Listing ${id} reported for review. Thank you for keeping Unilag safe!`);
    setSelectedListing(null);
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
        
        {/* Hero / Welcome */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 sm:p-10 mb-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-2xl"></div>
          
          <div className="relative z-10 max-w-2xl">
             <h2 className="text-3xl sm:text-4xl font-bold mb-4">The Unilag Marketplace</h2>
             <p className="text-indigo-100 text-lg mb-6">
               Buy cheap essentials, swap what you don't need, or rent gear for your next practical. 
               Safe, fast, and strictly for students.
             </p>
             <div className="flex flex-wrap gap-3">
               <button onClick={() => setActiveTab(ListingType.BUY)} className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition text-sm font-medium">Browse Store</button>
               <button onClick={handleAddListingClick} className="px-4 py-2 bg-white text-indigo-900 rounded-full hover:bg-indigo-50 transition text-sm font-bold">Sell Now</button>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            
            {/* Filter Group: Type */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Market Type</h3>
              <div className="space-y-1">
                 {[
                   { id: 'ALL', label: 'All Items', icon: SlidersHorizontal },
                   { id: ListingType.BUY, label: 'For Sale', icon: ShoppingBag }, // Label change for display
                   { id: ListingType.SWAP, label: 'Swap', icon: Repeat },
                   { id: ListingType.RENT, label: 'Rent', icon: Clock },
                 ].map((tab) => (
                   <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                       activeTab === tab.id 
                         ? 'bg-indigo-50 text-indigo-700' 
                         : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                     }`}
                   >
                     <tab.icon className={`w-4 h-4 mr-3 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                     {tab.label}
                   </button>
                 ))}
              </div>
            </div>

            {/* Filter Group: Categories */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categories</h3>
              <div className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <button
                   onClick={() => setSelectedCategory('ALL')}
                   className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === 'ALL' ? 'font-semibold text-indigo-700 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  All Categories
                </button>
                {Object.values(Category).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat 
                        ? 'font-semibold text-indigo-700 bg-indigo-50' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-bold text-gray-900">
                 {activeTab === 'ALL' ? 'All Listings' : `${activeTab === ListingType.BUY ? 'For Sale' : activeTab === ListingType.SWAP ? 'Swap Offers' : 'For Rent'}`}
                 <span className="ml-2 text-sm font-normal text-gray-500">({filteredListings.length})</span>
               </h2>
            </div>

            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map(listing => (
                  <ListingCard 
                    key={listing.id} 
                    listing={listing} 
                    onClick={() => setSelectedListing(listing)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No items found</h3>
                <p className="text-gray-500 max-w-xs mx-auto mb-6">
                  We couldn't find any listings matching your filters. Try adjusting your search or category.
                </p>
                <Button onClick={() => { setActiveTab('ALL'); setSelectedCategory('ALL'); setSearchQuery(''); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

        </div>
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
        onReport={handleReportListing}
      />

      <DashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        currentUser={user}
        myListings={myListings}
        savedListings={savedListings}
        onDeleteListing={handleDeleteListing}
        onMarkAsSold={handleMarkAsSold}
      />

      {/* My Profile */}
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        isEditable={true}
        onSave={handleUpdateProfile}
      />

      {/* Seller Profile (Read-only) */}
      {viewingSeller && (
        <ProfileModal 
          isOpen={!!viewingSeller}
          onClose={() => setViewingSeller(null)}
          user={viewingSeller}
          isEditable={false}
        />
      )}
    </div>
  );
};

export default App;