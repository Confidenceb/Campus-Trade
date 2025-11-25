import React, { useState, useEffect } from 'react';
import { X, Wand2, Upload } from 'lucide-react';
import { Listing, ListingType, Category, Condition } from '../types';
import { Button } from './Button';
import { generateListingDescription } from '../services/gemini';

interface ListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (listing: Omit<Listing, 'id' | 'createdAt' | 'status'>) => void;
}

export const ListingModal: React.FC<ListingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [formData, setFormData] = useState<Partial<Listing>>({
    type: ListingType.BUY,
    category: Category.OTHER,
    condition: Condition.GOOD,
    title: '',
    description: '',
    price: 0,
    rentPrice: 0,
    rentDuration: 'day',
    swapRequest: '',
    sellerName: '',
    contactInfo: '',
    imageUrl: `https://picsum.photos/seed/${Math.random()}/400/300`
  });

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.category || !formData.condition || !formData.type) {
      alert("Please fill in the Title, Category, and Condition first!");
      return;
    }
    setIsLoadingAI(true);
    const desc = await generateListingDescription(
      formData.title,
      formData.category || 'General',
      formData.condition || 'Good',
      formData.type
    );
    setFormData(prev => ({ ...prev, description: desc }));
    setIsLoadingAI(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.sellerName || !formData.contactInfo) {
      alert("Please fill all required fields");
      return;
    }

    onSubmit(formData as Omit<Listing, 'id' | 'createdAt' | 'status'>);
    onClose();
  };

  const inputBaseClass = "w-full rounded-lg border-gray-300 dark:border-gray-600 border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-shadow";

  // Tabs configuration
  const tabs = [
    { id: ListingType.BUY, label: 'Sell Item' },
    { id: ListingType.RENT, label: 'Rent Out' },
    { id: ListingType.SWAP, label: 'Swap' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl my-8 animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">List Item on Unilag Market</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Type Selection */}
          <div className="grid grid-cols-3 gap-4">
            {tabs.map((tab) => (
              <label key={tab.id} className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${formData.type === tab.id ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300 font-semibold shadow-sm ring-1 ring-indigo-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 dark:text-gray-300 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'}`}>
                <input 
                  type="radio" 
                  name="type" 
                  value={tab.id} 
                  checked={formData.type === tab.id} 
                  onChange={handleChange} 
                  className="hidden" 
                />
                {tab.label}
              </label>
            ))}
          </div>

          {/* Core Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Casio Calculator"
                className={inputBaseClass}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputBaseClass}
              >
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condition *</label>
               <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className={inputBaseClass}
              >
                {Object.values(Condition).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            {/* Dynamic Pricing Fields */}
            <div>
              {formData.type === ListingType.BUY && (
                <>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₦) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className={inputBaseClass} />
                </>
              )}
              {formData.type === ListingType.SWAP && (
                <>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">What do you want? *</label>
                  <input type="text" name="swapRequest" placeholder="e.g. iPhone 7" value={formData.swapRequest} onChange={handleChange} className={inputBaseClass} />
                </>
              )}
              {formData.type === ListingType.RENT && (
                <div className="flex gap-2">
                   <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rate (₦) *</label>
                    <input type="number" name="rentPrice" value={formData.rentPrice} onChange={handleChange} className={inputBaseClass} />
                   </div>
                   <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Per</label>
                    <select name="rentDuration" value={formData.rentDuration} onChange={handleChange} className={inputBaseClass}>
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                    </select>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Description with AI */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
              <span className="ml-2 text-xs text-gray-500 font-normal">Be detailed about the item.</span>
            </label>
            <div className="relative">
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your item..."
                className={inputBaseClass}
              />
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={isLoadingAI}
                className="absolute bottom-3 right-3 flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs rounded-md shadow-sm hover:shadow-md transition-all disabled:opacity-50"
              >
                {isLoadingAI ? (
                  <span className="animate-spin mr-1">✦</span>
                ) : (
                  <Wand2 className="w-3 h-3 mr-1.5" />
                )}
                AI Generate
              </button>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name *</label>
                <input type="text" name="sellerName" value={formData.sellerName} onChange={handleChange} className={inputBaseClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                <input type="text" name="contactInfo" placeholder="For system verification only" value={formData.contactInfo} onChange={handleChange} className={inputBaseClass} />
                <p className="text-[10px] text-gray-500 mt-1">Your phone number will NOT be shown publicly. It is for admin use only.</p>
              </div>
            </div>
          </div>

          {/* Image Upload Mock */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors bg-white">
             <input type="file" className="hidden" id="img-upload" />
             <label htmlFor="img-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload an image (Optional)</p>
                <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG (Max 5MB)</p>
             </label>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="mr-3">Cancel</Button>
            <Button type="submit" variant="primary">Post Listing</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
