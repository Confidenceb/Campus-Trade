import React, { useState, useMemo } from 'react';
import { MOCK_LISTINGS } from './constants';
import { Listing, ListingType, Category } from './types';
import { ListingCard } from './components/ListingCard';
import { ListingModal } from './components/ListingModal';
import { Button } from './components/Button';
import { Plus, Search, SlidersHorizontal, GraduationCap, ShoppingBag, Repeat, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ListingType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);

  const handleAddListing = (newListingData: Omit<Listing, 'id' | 'createdAt'>) => {
    const newListing: Listing = {
      ...newListingData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      // Ensure rent fields are consistent if not rent type
      rentPrice: newListingData.type === ListingType.RENT ? newListingData.rentPrice : undefined,
      rentDuration: newListingData.type === ListingType.RENT ? newListingData.rentDuration : undefined,
      // Ensure swap fields consistent
      swapRequest: newListingData.type === ListingType.SWAP ? newListingData.swapRequest : undefined,
      // Ensure buy fields consistent
      price: newListingData.type === ListingType.BUY ? newListingData.price : undefined,
    };
    setListings(prev => [newListing, ...prev]);
  };

  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      // Filter by Tab (Type)
      if (activeTab !== 'ALL' && listing.type !== activeTab) return false;
      
      // Filter by Category
      if (selectedCategory !== 'ALL' && listing.category !== selectedCategory) return false;

      // Filter by Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = listing.title.toLowerCase().includes(q);
        const matchDesc = listing.description.toLowerCase().includes(q);
        const matchCat = listing.category.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }

      return true;
    });
  }, [listings, activeTab, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
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

            <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-indigo-200">
              <Plus className="w-5 h-5 mr-1.5" />
              List Item
            </Button>
          </div>
        </div>
        
        {/* Mobile Search Bar (visible only on small screens) */}
        <div className="md:hidden px-4 pb-3">
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
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
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
               <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-white text-indigo-900 rounded-full hover:bg-indigo-50 transition text-sm font-bold">Sell Now</button>
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
                   { id: ListingType.BUY, label: 'Buy', icon: ShoppingBag },
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
               {/* Mobile Category dropdown could go here, hiding for simplicity in this demo */}
            </div>

            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
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

      <ListingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddListing} 
      />
    </div>
  );
};

export default App;
