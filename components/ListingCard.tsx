import React from 'react';
import { Listing, ListingType } from '../types';
import { MessageCircle, Repeat, Clock, Tag, User } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const getBadgeColor = (type: ListingType) => {
    switch (type) {
      case ListingType.BUY: return 'bg-blue-100 text-blue-800';
      case ListingType.SWAP: return 'bg-purple-100 text-purple-800';
      case ListingType.RENT: return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPrice = () => {
    switch (listing.type) {
      case ListingType.BUY:
        return <span className="text-lg font-bold text-gray-900">₦{listing.price?.toLocaleString()}</span>;
      case ListingType.SWAP:
        return (
          <div className="flex items-center text-sm font-medium text-purple-700">
            <Repeat className="w-4 h-4 mr-1" />
            Swap for: {listing.swapRequest}
          </div>
        );
      case ListingType.RENT:
        return (
          <div className="flex items-center text-lg font-bold text-orange-700">
            <Clock className="w-4 h-4 mr-1" />
            ₦{listing.rentPrice?.toLocaleString()} <span className="text-xs font-normal text-gray-500 ml-1">/{listing.rentDuration}</span>
          </div>
        );
    }
  };

  const handleContact = () => {
    alert(`Contact ${listing.sellerName} at: ${listing.contactInfo}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-gray-200 group">
        <img 
          src={listing.imageUrl} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getBadgeColor(listing.type)}`}>
            {listing.type}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-gray-500 flex items-center bg-gray-50 px-2 py-1 rounded">
            <Tag className="w-3 h-3 mr-1" /> {listing.category}
          </span>
          <span className="text-xs text-gray-400">{listing.condition}</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{listing.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{listing.description}</p>

        <div className="mt-auto">
          <div className="mb-4">
            {renderPrice()}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500">
              <User className="w-3 h-3 mr-1" />
              {listing.sellerName}
            </div>
            <button 
              onClick={handleContact}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
