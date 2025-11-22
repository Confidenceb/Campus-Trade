import React, { useState, useEffect } from 'react';
import { X, User, BookOpen, Hash, Building2, Phone, Mail, Edit2, Save, Star, ThumbsUp } from 'lucide-react';
import { User as UserType } from '../types';
import { Button } from './Button';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  isEditable?: boolean;
  onSave?: (updatedUser: UserType) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  isEditable = false, 
  onSave 
}) => {
  const [formData, setFormData] = useState<UserType>(user);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');

  useEffect(() => {
    setFormData(user);
  }, [user]);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    setIsEditing(false);
  };

  const inputClass = "w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900";
  const labelClass = "block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1";

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-2 text-sm font-bold text-white">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-8 relative shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-indigo-700 border-4 border-white/30 shadow-lg shrink-0">
              {formData.name.charAt(0)}
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">{formData.name}</h2>
              <p className="text-indigo-100 text-sm flex items-center mb-1">
                @{formData.username || formData.name.toLowerCase().replace(/\s/g, '')}
              </p>
              {renderStars(formData.rating || 0)}
              {formData.isVerified && (
                <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/30 rounded text-[10px] font-bold uppercase tracking-wider text-emerald-100">
                  Verified Student
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${activeTab === 'about' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-700'}`}
          >
            About
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${activeTab === 'reviews' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Reviews ({formData.reviews?.length || 0})
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar h-full">
          {activeTab === 'about' ? (
            <>
              {isEditable && !isEditing ? (
                <div className="flex justify-end mb-4">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                  </Button>
                </div>
              ) : null}

              <form onSubmit={handleSave} className="space-y-5">
                
                {/* Bio Section */}
                <div>
                  <label className={labelClass}>Bio</label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio || ''}
                      onChange={e => setFormData({...formData, bio: e.target.value})}
                      className={inputClass}
                      rows={3}
                      placeholder="Tell others about yourself..."
                    />
                  ) : (
                    <p className="text-gray-700 text-sm italic leading-relaxed">
                      {formData.bio || "No bio added yet."}
                    </p>
                  )}
                </div>

                <div className="h-px bg-gray-100 w-full my-2"></div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        className={inputClass}
                      />
                    ) : (
                      <div className="flex items-center text-gray-900 font-medium">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        {formData.name}
                      </div>
                    )}
                  </div>

                  <div>
                     <label className={labelClass}>Nickname / Username</label>
                     {isEditing ? (
                       <input 
                         type="text" 
                         value={formData.username || ''} 
                         onChange={e => setFormData({...formData, username: e.target.value})} 
                         className={inputClass}
                         placeholder="e.g. CampusPlug"
                       />
                     ) : (
                       <div className="flex items-center text-gray-900 font-medium">
                         <Hash className="w-4 h-4 mr-2 text-gray-400" />
                         @{formData.username || '-'}
                       </div>
                     )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Course</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={formData.course || ''} 
                          onChange={e => setFormData({...formData, course: e.target.value})} 
                          className={inputClass}
                          placeholder="e.g. Comp Sci"
                        />
                      ) : (
                        <div className="flex items-center text-gray-900 font-medium">
                          <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                          {formData.course || '-'}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>Level</label>
                      {isEditing ? (
                        <select 
                          value={formData.level || ''} 
                          onChange={e => setFormData({...formData, level: e.target.value})} 
                          className={inputClass}
                        >
                          <option value="">Select</option>
                          <option value="100">100</option>
                          <option value="200">200</option>
                          <option value="300">300</option>
                          <option value="400">400</option>
                          <option value="500">500</option>
                        </select>
                      ) : (
                        <div className="flex items-center text-gray-900 font-medium">
                          <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                          {formData.level ? `${formData.level} Lvl` : '-'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                     <label className={labelClass}>Contact Info</label>
                     <div className="space-y-2">
                        <div className="flex items-center text-gray-900 font-medium">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {formData.email}
                        </div>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={formData.phoneNumber || ''} 
                            onChange={e => setFormData({...formData, phoneNumber: e.target.value})} 
                            className={inputClass}
                            placeholder="e.g. 08123456789"
                          />
                        ) : (
                          <div className="flex items-center text-gray-900 font-medium">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {formData.phoneNumber || 'No phone added'}
                          </div>
                        )}
                     </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="ghost" className="flex-1" onClick={() => {
                      setFormData(user); // Reset
                      setIsEditing(false);
                    }}>Cancel</Button>
                    <Button type="submit" className="flex-1">
                      <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </>
          ) : (
            <div className="space-y-4">
               {formData.reviews && formData.reviews.length > 0 ? (
                 formData.reviews.map(review => (
                   <div key={review.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                     <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm text-gray-900">{review.reviewerName}</span>
                        <span className="text-[10px] text-gray-400">{review.date.toLocaleDateString()}</span>
                     </div>
                     <div className="flex items-center mb-2">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                       ))}
                     </div>
                     <p className="text-sm text-gray-600 italic">"{review.comment}"</p>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-10">
                   <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                     <ThumbsUp className="w-6 h-6 text-gray-400" />
                   </div>
                   <p className="text-gray-500 text-sm">No reviews yet.</p>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};