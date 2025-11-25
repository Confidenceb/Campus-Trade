
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_LISTINGS, MOCK_NOTIFICATIONS, MOCK_REVIEWS, MOCK_CONVERSATIONS } from './constants';
import { Listing, ListingType, Category, User, ListingStatus, Notification, Conversation } from './types';
import { ListingCard } from './components/ListingCard';
import { ListingModal } from './components/ListingModal';
import { AuthPage } from './components/AuthPage';
import { KYCModal } from './components/KYCModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ProfilePage } from './components/ProfilePage';
import { DashboardModal } from './components/DashboardModal';
import { ReportModal } from './components/ReportModal';
import { NotificationDropdown } from './components/NotificationDropdown';
import { ChatInterface } from './components/ChatInterface';
import { HelpSupportPage } from './components/HelpSupportPage';
import { Button } from './components/Button';
import { Footer } from './components/Footer';
import { Plus, Search, SlidersHorizontal, GraduationCap, ShoppingBag, User as UserIcon, ShieldCheck, LayoutDashboard, Bell, Zap, MessageCircle, HelpCircle, Moon, Sun, Download, ChevronRight, AlertCircle, LogOut } from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // App State
  const [currentView, setCurrentView] = useState<'HOME' | 'CHAT' | 'PROFILE' | 'HELP'>('HOME');
  const [activeTab, setActiveTab] = useState<ListingType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  
  // Initialize dark mode from localStorage or system preference immediately to prevent flash
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const manualDarkMode = localStorage.getItem('campustrade_darkmode_manual');
    if (manualDarkMode !== null) {
      return manualDarkMode === 'true';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  
  // Modal States
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [reportingListingId, setReportingListingId] = useState<string | null>(null);
  
  // Chat State
  const [targetConversationId, setTargetConversationId] = useState<string | null>(null);
  
  // Profile State
  const [viewingProfileUser, setViewingProfileUser] = useState<User | null>(null);

  // Restore user from localStorage on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('campustrade_user');
    const manualDarkMode = localStorage.getItem('campustrade_darkmode_manual');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('campustrade_user');
      }
    }
    
    // Simulate PWA install prompt availability
    setTimeout(() => {
        setShowInstallPrompt(true);
    }, 5000);
    
    // Done loading
    setIsLoading(false);
  }, []);

  // Apply Dark Mode to HTML root (but don't save to localStorage here)
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      // Save manual preference to localStorage
      localStorage.setItem('campustrade_darkmode_manual', newMode.toString());
  };

  const handleLogin = (userData: Omit<User, 'id' | 'isVerified' | 'savedListingIds' | 'notifications' | 'rating' | 'reviews' | 'conversations'>) => {
    const newUser = {
      id: 'user-' + Date.now(),
      isVerified: false,
      savedListingIds: [],
      notifications: MOCK_NOTIFICATIONS,
      rating: 5.0,
      reviews: [],
      conversations: MOCK_CONVERSATIONS,
      referralCode: userData.name.substring(0, 4).toUpperCase() + '24',
      ...userData
    };
    setUser(newUser);
    localStorage.setItem('campustrade_user', JSON.stringify(newUser));
  };

  const handleVerifyKYC = () => {
    if (user) {
      const updatedUser = { ...user, isVerified: true };
      setUser(updatedUser);
      localStorage.setItem('campustrade_user', JSON.stringify(updatedUser));
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
    setIsKYCModalOpen(true);
  };

  const handleViewSeller = (sellerName: string) => {
    const mockSeller: User = {
      id: 'seller-' + Math.random(),
      name: sellerName,
      email: `${sellerName.toLowerCase().split(' ')[0]}@student.unilag.edu.ng`,
      university: 'Unilag',
      isVerified: true,
      savedListingIds: [],
      username: sellerName.toLowerCase().replace(/\s/g, ''),
      course: 'Computer Science',
      level: '300',
      bio: `Hi, I'm ${sellerName}. I sell mostly electronics and textbooks. Meet me at Science facade.`,
      rating: 4.5 + (Math.random() * 0.5),
      reviews: MOCK_REVIEWS
    };
    setViewingProfileUser(mockSeller);
    setCurrentView('PROFILE');
    setSelectedListing(null); // Close modal if open
  };

  const handleViewMyProfile = () => {
      if (user) {
        setViewingProfileUser(user);
        setCurrentView('PROFILE');
      }
  };

  const handleAddListing = (newListingData: Omit<Listing, 'id' | 'createdAt' | 'status'>) => {
    const newListing: Listing = {
      ...newListingData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      status: ListingStatus.AVAILABLE,
      sellerName: user?.name || newListingData.sellerName,
      university: user?.university || 'Unilag',
      rentPrice: newListingData.type === ListingType.RENT ? newListingData.rentPrice : undefined,
      rentDuration: newListingData.type === ListingType.RENT ? newListingData.rentDuration : undefined,
      swapRequest: newListingData.type === ListingType.SWAP ? newListingData.swapRequest : undefined,
      price: newListingData.type === ListingType.BUY ? newListingData.price : undefined,
    };
    setListings([newListing, ...listings]);
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
    
    const updatedUser = { ...user, savedListingIds: newSavedIds };
    setUser(updatedUser);
    localStorage.setItem('campustrade_user', JSON.stringify(updatedUser));
  };

  const handleReportListing = (id: string) => {
    setReportingListingId(id);
    setIsReportModalOpen(true);
  };

  const handleSubmitReport = (reason: string, details: string) => {
      console.log(`Reported listing ${reportingListingId}: ${reason} - ${details}`);
      setReportingListingId(null);
  };

  const handleStartChat = (listing: Listing) => {
    // Check if conversation already exists
    const existingConv = conversations.find(c => c.listingId === listing.id && c.participants.includes(listing.sellerName)); // Simple check mock
    
    if (existingConv) {
        setTargetConversationId(existingConv.id);
    } else {
        // Create new mock conversation
        const newConvId = 'new-' + Date.now();
        const newConv: Conversation = {
            id: newConvId,
            listingId: listing.id,
            listingTitle: listing.title,
            listingImage: listing.imageUrl,
            participants: [user!.id, listing.sellerName],
            otherUserName: listing.sellerName,
            otherUserUniversity: listing.university,
            lastMessage: 'Started new chat',
            lastMessageDate: new Date(),
            unreadCount: 0,
            messages: []
        };
        setConversations([newConv, ...conversations]);
        setTargetConversationId(newConvId);
    }
    
    setSelectedListing(null);
    setCurrentView('CHAT');
  };

  const handleOpenDashboardChat = (conversationId: string) => {
    setTargetConversationId(conversationId);
    setIsDashboardOpen(false);
    setCurrentView('CHAT');
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('campustrade_user', JSON.stringify(updatedUser));
    setViewingProfileUser(updatedUser); // Update view if looking at self
  };

  const handleLogout = () => {
    localStorage.removeItem('campustrade_user');
    setUser(null);
    setCurrentView('HOME');
  };

  const featuredListings = useMemo(() => listings.filter(l => l.isFeatured), [listings]);

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

  // Show loading spinner while checking localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading CampusTrade...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // Render Logic
  const renderView = () => {
    if (currentView === 'CHAT') {
      return (
          <ChatInterface 
              currentUser={user}
              conversations={conversations}
              activeConversationId={targetConversationId}
              onBackToHome={() => setCurrentView('HOME')}
              isDarkMode={isDarkMode}
              toggleTheme={toggleDarkMode}
          />
      );
    }

    if (currentView === 'PROFILE' && viewingProfileUser) {
      return (
          <ProfilePage 
              user={viewingProfileUser}
              isEditable={viewingProfileUser.id === user.id}
              onBack={() => setCurrentView('HOME')}
              onSave={handleUpdateProfile}
              onVerify={handleVerifyNeeded}
              isDarkMode={isDarkMode}
              toggleTheme={toggleDarkMode}
          />
      );
    }

    if (currentView === 'HELP') {
        return (
          <HelpSupportPage 
            onBack={() => setCurrentView('HOME')} 
            isDarkMode={isDarkMode}
            toggleTheme={toggleDarkMode}
          />
        );
    }

    // HOME VIEW
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans text-gray-900 dark:text-white transition-colors duration-200">
        {/* Navigation */}
        <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center cursor-pointer" onClick={() => {
                setActiveTab('ALL');
                setSelectedCategory('ALL');
                setSearchQuery('');
                setCurrentView('HOME');
              }}>
                <div className="bg-indigo-600 p-1.5 rounded-lg mr-2 shadow-md shadow-indigo-200 dark:shadow-none">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">CampusTrade</h1>
                  <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Student Marketplace</p>
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
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-full leading-5 bg-gray-50 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm dark:text-white"
                    placeholder="Search for textbooks, gadgets, lab coats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                 {/* Dark Mode Toggle */}
                 <button onClick={toggleDarkMode} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
                 </button>

                 <button 
                  onClick={() => setCurrentView('HELP')}
                  className="hidden md:flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Help & Support"
                 >
                   <HelpCircle className="w-6 h-6" />
                 </button>

                 <button 
                  onClick={() => setCurrentView('CHAT')}
                  className="hidden md:flex items-center text-gray-600 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Messages"
                 >
                   <MessageCircle className="w-6 h-6" />
                 </button>

                 <button 
                  onClick={() => setIsDashboardOpen(true)}
                  className="hidden md:flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 font-medium text-sm transition-colors"
                 >
                   <LayoutDashboard className="w-5 h-5 mr-1" /> Dashboard
                 </button>
                 
                 <div className="relative">
                   <button 
                     className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative transition-colors"
                     onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                   >
                     <Bell className="w-6 h-6" />
                     {unreadNotifications > 0 && (
                       <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800 animate-pulse" />
                     )}
                   </button>
                   <NotificationDropdown 
                      isOpen={isNotificationOpen} 
                      onClose={() => setIsNotificationOpen(false)}
                      notifications={notifications}
                      onMarkAsRead={(id) => setNotifications(notifications.map(n => n.id === id ? {...n, isRead: true} : n))}
                   />
                 </div>

                 <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

                 <div 
                   className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1.5 rounded-lg transition-colors"
                   onClick={handleViewMyProfile}
                 >
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-700">
                      {user.name.charAt(0)}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">{user.name}</p>
                      <p className="text-[10px] text-gray-400">{user.university}</p>
                    </div>
                 </div>

                 <button 
                   onClick={handleLogout}
                   className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                   title="Logout"
                 >
                   <LogOut className="w-5 h-5" />
                 </button>
                  
                 <Button 
                  onClick={handleAddListingClick} 
                  size="sm" 
                  className="hidden md:flex ml-2 shadow-lg shadow-indigo-200 dark:shadow-none"
                 >
                  <Plus className="w-4 h-4 mr-1" /> List Item
                </Button>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Mobile Search Bar */}
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex gap-2 sticky top-16 z-30">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg leading-5 bg-gray-50 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm dark:text-white"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
               onClick={() => setCurrentView('CHAT')}
               className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg"
            >
               <MessageCircle className="w-6 h-6" />
            </button>
        </div>

        {/* Hero Stats Section */}
        <div className="bg-indigo-700 dark:bg-indigo-900 text-white py-12 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
             <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
             <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Buy, Sell & Swap on Campus</h2>
             <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-10">
               The safest way to trade with fellow students. Join thousands of students across campuses saving money today.
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
                   <div className="text-xs text-indigo-200">AI Monitored</div>
                </div>
             </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
          
          {/* PWA Install Prompt (Simulated) */}
          {showInstallPrompt && (
             <div className="mb-6 bg-indigo-600 text-white p-4 rounded-xl flex items-center justify-between shadow-lg">
                <div className="flex items-center">
                   <div className="bg-white/20 p-2 rounded-lg mr-3">
                      <Download className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="font-bold">Install CampusTrade App</p>
                      <p className="text-xs text-indigo-100">Add to home screen for better experience.</p>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => setShowInstallPrompt(false)} className="px-3 py-1 text-xs hover:bg-white/10 rounded">Later</button>
                   <button className="px-3 py-1 bg-white text-indigo-600 font-bold text-xs rounded shadow-sm">Install</button>
                </div>
             </div>
          )}

          {/* Verification Banner */}
          {!user.isVerified && (
            <div className="mb-8 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldCheck className="w-24 h-24 text-orange-600" />
               </div>
               <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-orange-900 dark:text-orange-100 mb-1 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Verify Your Account
                    </h3>
                    <p className="text-sm text-orange-800 dark:text-orange-200 max-w-xl">
                      Get the "Verified Student" badge to unlock selling, renting, and secure chats. It takes less than 2 minutes using your School ID.
                    </p>
                  </div>
                  <Button onClick={handleVerifyNeeded} className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm shrink-0 whitespace-nowrap">
                     Verify Now
                  </Button>
               </div>
            </div>
          )}

          {/* Featured Listings Section */}
          {featuredListings.length > 0 && searchQuery === '' && activeTab === 'ALL' && selectedCategory === 'ALL' && (
             <div className="mb-10">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                   <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-2" /> Featured Items
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {featuredListings.map(listing => (
                      <ListingCard key={listing.id} listing={listing} onClick={() => setSelectedListing(listing)} />
                   ))}
                </div>
             </div>
          )}

          {/* Category Filter Scroll */}
          <div className="flex overflow-x-auto pb-4 mb-6 gap-2 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              <button 
                onClick={() => setSelectedCategory('ALL')}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  selectedCategory === 'ALL' 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto max-w-full">
               <button 
                  onClick={() => setActiveTab('ALL')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'ALL' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
               >
                 All
               </button>
               <button 
                  onClick={() => setActiveTab(ListingType.BUY)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === ListingType.BUY ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
               >
                 Buy
               </button>
               <button 
                  onClick={() => setActiveTab(ListingType.SWAP)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === ListingType.SWAP ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
               >
                 Swap
               </button>
               <button 
                  onClick={() => setActiveTab(ListingType.RENT)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === ListingType.RENT ? 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
               >
                 Rent
               </button>
            </div>
          </div>

          {/* Listings Grid */}
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                 <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No items found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">We couldn't find matches for your search filters.</p>
              <Button variant="outline" onClick={() => {
                 setSearchQuery('');
                 setSelectedCategory('ALL');
                 setActiveTab('ALL');
              }} className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">Clear Filters</Button>
            </div>
          )}
          
          {/* How it works Section */}
          <div className="mt-24 mb-12">
             <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How It Works</h2>
                <p className="text-gray-500 dark:text-gray-400">Trading on campus has never been easier</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 text-center hover:shadow-lg transition-shadow">
                   <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4 text-xl font-bold">1</div>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">List or Browse</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400">Post an item you don't need or find something you do. It takes seconds.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 text-center hover:shadow-lg transition-shadow">
                   <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mx-auto mb-4 text-xl font-bold">2</div>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Chat Securely</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400">Connect with verified students via our in-app chat. AI monitors keep it safe.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 text-center hover:shadow-lg transition-shadow">
                   <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-4 text-xl font-bold">3</div>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Safe Handover</h3>
                   <p className="text-sm text-gray-500 dark:text-gray-400">Meet on campus or use our Escrow service for secure payment holding.</p>
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
      </div>
    );
  };

  return (
    <div className="h-full">
      {renderView()}

      {/* Global Modals - Rendered regardless of view */}
      <ListingModal 
        isOpen={isListModalOpen} 
        onClose={() => setIsListModalOpen(false)} 
        onSubmit={handleAddListing} 
      />
      
      <KYCModal
        isOpen={isKYCModalOpen}
        onClose={() => setIsKYCModalOpen(false)}
        onVerify={handleVerifyKYC}
        user={user}
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
        onChat={handleStartChat}
        canClose={!isKYCModalOpen}
        isDarkMode={isDarkMode}
        toggleTheme={toggleDarkMode}
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
        onOpenChat={handleOpenDashboardChat}
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
