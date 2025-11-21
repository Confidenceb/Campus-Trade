import React, { useState } from 'react';
import { X, Wand2, Upload } from 'lucide-react';
import { Listing, ListingType, Category, Condition } from '../types';
import { Button } from './Button';
import { generateListingDescription } from '../services/gemini';

interface ListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (listing: Omit<Listing, 'id' | 'createdAt'>) => void;
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
    imageUrl: `https://picsum.photos/seed/${Math.random()}/400/300` // Random seed for placeholder
  });

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
    // Basic validation
    if (!formData.title || !formData.description || !formData.sellerName || !formData.contactInfo) {
      alert("Please fill all required fields");
      return;
    }

    onSubmit(formData as Omit<Listing, 'id' | 'createdAt'>);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">List Item on Unilag Market</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Type Selection */}
          <div className="grid grid-cols-3 gap-4">
            {Object.values(ListingType).map((type) => (
              <label key={type} className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${formData.type === type ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold shadow-sm' : 'hover:bg-gray-50 text-gray-600 border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="type" 
                  value={type} 
                  checked={formData.type === type} 
                  onChange={handleChange} 
                  className="hidden" 
                />
                {type}
              </label>
            ))}
          </div>

          {/* Core Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Casio Calculator"
                className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
               <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                {Object.values(Condition).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            {/* Dynamic Pricing Fields */}
            <div>
              {formData.type === ListingType.BUY && (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full rounded-lg border px-3 py-2" />
                </>
              )}
              {formData.type === ListingType.SWAP && (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What do you want? *</label>
                  <input type="text" name="swapRequest" placeholder="e.g. iPhone 7" value={formData.swapRequest} onChange={handleChange} className="w-full rounded-lg border px-3 py-2" />
                </>
              )}
              {formData.type === ListingType.RENT && (
                <div className="flex gap-2">
                   <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate (₦) *</label>
                    <input type="number" name="rentPrice" value={formData.rentPrice} onChange={handleChange} className="w-full rounded-lg border px-3 py-2" />
                   </div>
                   <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Per</label>
                    <select name="rentDuration" value={formData.rentDuration} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 bg-white">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
              <input type="text" name="sellerName" value={formData.sellerName} onChange={handleChange} className="w-full rounded-lg border-gray-300 border px-3 py-2 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info (Phone/Email) *</label>
              <input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} className="w-full rounded-lg border-gray-300 border px-3 py-2 bg-white" />
            </div>
          </div>

          {/* Image Upload Mock */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
             <input type="file" className="hidden" id="img-upload" />
             <label htmlFor="img-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Click to upload an image (Optional)</p>
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
