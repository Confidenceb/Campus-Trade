
import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, BookOpen, Hash, Building2, Phone, Mail, Edit2, Save, Star, ThumbsUp, MapPin } from 'lucide-react';
import { User as UserType } from '../types';
import { Button } from './Button';

interface ProfilePageProps {
  user: UserType;
  isEditable?: boolean;
  onBack: () => void;
  onSave?: (updatedUser: UserType) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ 
  user, 
  isEditable = false, 
  onBack,
  onSave 
}) => {
  const [formData, setFormData] = useState<UserType>(user);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    setIsEditing(false);
  };

  const inputClass = "w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900 transition-shadow";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5";

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-5 h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300/50'}`} 
          />
        ))}
        <span className="ml-2 text-lg font-bold text-white">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar / Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30 flex items-center">
         <Button variant="ghost" size="sm" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-5 h-5 mr-1" /> Back
         </Button>
         <h1 className="text-xl font-bold text-gray-900">
            {isEditable ? "My Profile" : "Seller Profile"}
         </h1>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto w-full p-4 md:p-8 flex-grow">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
            
            {/* Left Sidebar / Header Info */}
            <div className="w-full md:w-1/3 bg-indigo-700 p-8 text-white flex flex-col items-center text-center md:items-start md:text-left relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 left-10 w-20 h-20 bg-purple-500 rounded-full blur-xl"></div>
                </div>

                <div className="relative z-10 w-full">
                    <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-indigo-700 border-4 border-white/30 shadow-2xl mb-6 mx-auto md:mx-0">
                    {formData.name.charAt(0)}
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-1">{formData.name}</h2>
                    <p className="text-indigo-200 text-sm mb-4 font-medium flex items-center justify-center md:justify-start">
                       <MapPin className="w-4 h-4 mr-1" /> {formData.university}
                    </p>

                    <div className="mb-6 flex justify-center md:justify-start">
                        {renderStars(formData.rating || 0)}
                    </div>

                    {formData.isVerified && (
                    <div className="inline-flex items-center px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full backdrop-blur-sm">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Verified Student</span>
                    </div>
                    )}
                </div>
            </div>

            {/* Right Content */}
            <div className="w-full md:w-2/3 flex flex-col">
                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button 
                        onClick={() => setActiveTab('about')}
                        className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${activeTab === 'about' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Profile Details
                    </button>
                    <button 
                        onClick={() => setActiveTab('reviews')}
                        className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${activeTab === 'reviews' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Reviews ({formData.reviews?.length || 0})
                    </button>
                </div>

                <div className="p-6 md:p-8 flex-grow bg-gray-50/30">
                     {activeTab === 'about' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {isEditable && !isEditing && (
                                <div className="flex justify-end mb-6">
                                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                    <Edit2 className="w-4 h-4 mr-2" /> Edit Details
                                </Button>
                                </div>
                            )}

                            <form onSubmit={handleSave} className="space-y-6">
                                {/* Bio Section */}
                                <div>
                                    <label className={labelClass}>Bio</label>
                                    {isEditing ? (
                                        <textarea
                                        value={formData.bio || ''}
                                        onChange={e => setFormData({...formData, bio: e.target.value})}
                                        className={inputClass}
                                        rows={4}
                                        placeholder="Tell others about yourself..."
                                        />
                                    ) : (
                                        <p className="text-gray-700 text-sm leading-relaxed bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                          "{formData.bio || "No bio added yet."}"
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name Field */}
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
                                            <div className="flex items-center text-gray-900 font-medium bg-white p-3 rounded-lg border border-gray-100">
                                                <User className="w-4 h-4 mr-3 text-gray-400" />
                                                {formData.name}
                                            </div>
                                        )}
                                    </div>

                                    {/* Username */}
                                    <div>
                                        <label className={labelClass}>Username</label>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                value={formData.username || ''} 
                                                onChange={e => setFormData({...formData, username: e.target.value})} 
                                                className={inputClass}
                                                placeholder="e.g. CampusPlug"
                                            />
                                        ) : (
                                            <div className="flex items-center text-gray-900 font-medium bg-white p-3 rounded-lg border border-gray-100">
                                                <Hash className="w-4 h-4 mr-3 text-gray-400" />
                                                @{formData.username || '-'}
                                            </div>
                                        )}
                                    </div>

                                    {/* Course */}
                                    <div>
                                        <label className={labelClass}>Course</label>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                value={formData.course || ''} 
                                                onChange={e => setFormData({...formData, course: e.target.value})} 
                                                className={inputClass}
                                            />
                                        ) : (
                                            <div className="flex items-center text-gray-900 font-medium bg-white p-3 rounded-lg border border-gray-100">
                                                <BookOpen className="w-4 h-4 mr-3 text-gray-400" />
                                                {formData.course || '-'}
                                            </div>
                                        )}
                                    </div>

                                    {/* Level */}
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
                                            <div className="flex items-center text-gray-900 font-medium bg-white p-3 rounded-lg border border-gray-100">
                                                <Building2 className="w-4 h-4 mr-3 text-gray-400" />
                                                {formData.level ? `${formData.level} Lvl` : '-'}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Email */}
                                    <div>
                                        <label className={labelClass}>Email</label>
                                        <div className="flex items-center text-gray-900 font-medium bg-white p-3 rounded-lg border border-gray-100 overflow-hidden">
                                            <Mail className="w-4 h-4 mr-3 text-gray-400 shrink-0" />
                                            <span className="truncate">{formData.email}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Phone (Only visible to user or if public logic added) */}
                                    <div>
                                        <label className={labelClass}>Phone</label>
                                        {isEditing ? (
                                            <input 
                                                type="tel" 
                                                value={formData.phoneNumber || ''} 
                                                onChange={e => setFormData({...formData, phoneNumber: e.target.value})} 
                                                className={inputClass}
                                            />
                                        ) : (
                                            <div className="flex items-center text-gray-900 font-medium bg-white p-3 rounded-lg border border-gray-100">
                                                <Phone className="w-4 h-4 mr-3 text-gray-400" />
                                                {isEditable ? (formData.phoneNumber || 'Not set') : 'Hidden for safety'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {isEditable && (
                                    <div className="mt-2 text-xs text-gray-400 text-center">
                                        Matric Number: {formData.matricNumber || 'Not verified'}
                                    </div>
                                )}

                                {isEditing && (
                                <div className="flex gap-4 pt-6">
                                    <Button type="button" variant="ghost" className="flex-1" onClick={() => {
                                        setFormData(user);
                                        setIsEditing(false);
                                    }}>Cancel</Button>
                                    <Button type="submit" className="flex-1">
                                        <Save className="w-4 h-4 mr-2" /> Save Profile
                                    </Button>
                                </div>
                                )}
                            </form>
                        </div>
                     )}

                     {activeTab === 'reviews' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             {formData.reviews && formData.reviews.length > 0 ? (
                                formData.reviews.map(review => (
                                <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <span className="font-bold text-gray-900 block">{review.reviewerName}</span>
                                            <span className="text-xs text-gray-400">{review.date.toLocaleDateString()}</span>
                                        </div>
                                        <div className="bg-yellow-50 px-2 py-1 rounded-lg">
                                            <div className="flex items-center">
                                                <span className="font-bold text-yellow-700 mr-1">{review.rating}</span>
                                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">"{review.comment}"</p>
                                </div>
                                ))
                            ) : (
                                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ThumbsUp className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <h3 className="text-gray-900 font-medium mb-1">No reviews yet</h3>
                                    <p className="text-gray-500 text-sm">Once trades are completed, reviews will appear here.</p>
                                </div>
                            )}
                        </div>
                     )}
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};
