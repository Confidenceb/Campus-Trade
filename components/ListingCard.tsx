
import React from 'react';
import { Listing, ListingType } from '../types';
import { Clock, Tag, MapPin, Zap } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  const getBadgeColor = (type: ListingType) => {
    switch (type) {
      case ListingType.BUY: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case ListingType.SWAP: return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case ListingType.RENT: return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPrice = () => {
    switch (listing.type) {
      case ListingType.BUY:
        return <span className="text-lg font-bold text-gray-900 dark:text-white">₦{listing.price?.toLocaleString()}</span>;
      case ListingType.SWAP:
        return (
          <div className="flex items-center text-sm font-medium text-purple-700 dark:text-purple-300">
            Swap for: {listing.swapRequest}
          </div>
        );
      case ListingType.RENT:
        return (
          <div className="flex items-center text-lg font-bold text-orange-700 dark:text-orange-400">
            <Clock className="w-4 h-4 mr-1" />
            ₦{listing.rentPrice?.toLocaleString()} <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">/{listing.rentDuration}</span>
          </div>
        );
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full cursor-pointer group ${listing.isFeatured ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''}`}
    >
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img 
          src={listing.imageUrl} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getBadgeColor(listing.type)} shadow-sm`}>
            {listing.type}
          </span>
          {listing.isFeatured && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-yellow-400 text-yellow-900 shadow-sm flex items-center w-fit">
               <Zap className="w-3 h-3 mr-1 fill-current" /> Featured
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded border border-gray-100 dark:border-gray-600">
            <Tag className="w-3 h-3 mr-1" /> {listing.category}
          </span>
          <span className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded font-bold border border-indigo-100 dark:border-indigo-800 flex items-center">
            <MapPin className="w-3 h-3 mr-1" /> {listing.university}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{listing.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-grow">{listing.description}</p>

        <div className="mt-auto">
          <div className="mb-4">
            {renderPrice()}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
              <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-2 text-[10px] font-bold text-gray-600 dark:text-gray-300">
                {listing.sellerName.charAt(0)}
              </div>
              {listing.sellerName}
            </div>
            <button className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 flex items-center bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-full transition-colors">
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
