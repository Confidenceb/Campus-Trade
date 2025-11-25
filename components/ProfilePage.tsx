
import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, BookOpen, Hash, Building2, Phone, Mail, Edit2, Save, Star, ThumbsUp, MapPin, Camera, ShieldCheck, Sun, Moon } from 'lucide-react';
import { User as UserType } from '../types';
import { Button } from './Button';

interface ProfilePageProps {
  user: UserType;
  isEditable?: boolean;
  onBack: () => void;
  onSave?: (updatedUser: UserType) => void;
  onVerify?: () => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ 
  user, 
  isEditable = false, 
  onBack,
  onSave,
  onVerify,
  isDarkMode,
  toggleTheme
}) => {
  const [formData, setFormData] = useState<UserType>(user);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, avatarUrl: url }));
    }
  };

  const inputClass = "w-full rounded-lg border-gray-300 dark:border-gray-600 border px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors placeholder-gray-400 dark:placeholder-gray-400";
  const labelClass = "block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1";

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
          />
        ))}
        <span className="ml-2 text-sm font-bold text-gray-700 dark:text-white">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
       {/* Mobile Header */}
       <div className="md:hidden bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center">
             <Button variant="ghost" size="sm" onClick={onBack} className="mr-2 dark:text-gray-200">
                <ArrowLeft className="w-5 h-5" />
             </Button>
             <h1 className="font-bold text-lg text-gray-900 dark:text-white">Profile</h1>
          </div>
          {toggleTheme && (
            <button onClick={toggleTheme} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
            </button>
          )}
       </div>

       <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 flex flex-col md:flex-row gap-8">
          
          {/* Sidebar / Left Panel */}
          <div className="w-full md:w-80 shrink-0 space-y-6">
             {/* Desktop Back Button */}
             <div className="hidden md:flex justify-between items-center">
                <Button variant="ghost" onClick={onBack} className="pl-0 hover:bg-transparent dark:text-gray-300 dark:hover:text-white">
                   <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
                </Button>
                {toggleTheme && (
                    <button onClick={toggleTheme} className="p-2 text-gray-500 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-colors">
                        {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
                    </button>
                )}
             </div>

             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden p-6 text-center relative">
                 <div className="relative mx-auto w-32 h-32 mb-4 group">
                    <div className="w-32 h-32 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-4xl font-bold text-indigo-600 dark:text-indigo-300 overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                       {formData.avatarUrl ? (
                          <img src={formData.avatarUrl} alt={formData.name} className="w-full h-full object-cover" />
                       ) : (
                          formData.name.charAt(0)
                       )}
                    </div>
                    {isEditing && (
                       <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="w-8 h-8 text-white" />
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                       </label>
                    )}
                 </div>

                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{formData.name}</h2>
                 <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 flex items-center justify-center">
                    <MapPin className="w-3 h-3 mr-1" /> {formData.university}
                 </p>

                 <div className="flex justify-center mb-6">
                    {renderStars(formData.rating)}
                 </div>

                 <div className="space-y-3">
                    {formData.isVerified ? (
                       <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                          <ShieldCheck className="w-4 h-4 mr-2" /> Verified Student
                       </div>
                    ) : (
                       isEditable && (
                           <Button onClick={onVerify} className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-md">
                              Verify Identity
                           </Button>
                       )
                    )}

                    {isEditable && !isEditing && (
                       <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => setIsEditing(true)}>
                          <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                       </Button>
                    )}
                 </div>
             </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
             {/* Tabs */}
             <div className="flex border-b border-gray-100 dark:border-gray-700">
                <button 
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'details' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                  Profile Details
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'reviews' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                  Reviews ({formData.reviews?.length || 0})
                </button>
             </div>

             <div className="p-6 md:p-8">
                {activeTab === 'details' ? (
                   <div className="max-w-2xl">
                      {isEditable && !isEditing && (
                         <div className="flex justify-end mb-6">
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                               <Edit2 className="w-4 h-4 mr-2" /> Edit Details
                            </Button>
                         </div>
                      )}

                      <form onSubmit={handleSave} className="space-y-6">
                         
                         {/* Bio */}
                         <div>
                            <label className={labelClass}>BIO</label>
                            {isEditing ? (
                               <textarea
                                  value={formData.bio || ''}
                                  onChange={e => setFormData({...formData, bio: e.target.value})}
                                  className={inputClass}
                                  rows={4}
                                  placeholder="Tell others about yourself..."
                               />
                            ) : (
                               <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                  <p className="text-gray-700 dark:text-gray-300 text-sm italic leading-relaxed">
                                     "{formData.bio || "No bio added yet."}"
                                  </p>
                               </div>
                            )}
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                  <div className="flex items-center text-gray-900 dark:text-white font-medium p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                     <User className="w-4 h-4 mr-2 text-gray-400" />
                                     {formData.name}
                                  </div>
                               )}
                            </div>

                            <div>
                               <label className={labelClass}>Username</label>
                               {isEditing ? (
                                  <input 
                                     type="text" 
                                     value={formData.username || ''} 
                                     onChange={e => setFormData({...formData, username: e.target.value})} 
                                     className={inputClass}
                                  />
                               ) : (
                                  <div className="flex items-center text-gray-900 dark:text-white font-medium p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                     <Hash className="w-4 h-4 mr-2 text-gray-400" />
                                     @{formData.username || '-'}
                                  </div>
                               )}
                            </div>

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
                                  <div className="flex items-center text-gray-900 dark:text-white font-medium p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
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
                                  <div className="flex items-center text-gray-900 dark:text-white font-medium p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                     <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                                     {formData.level ? `${formData.level} Lvl` : '-'}
                                  </div>
                               )}
                            </div>

                            <div>
                               <label className={labelClass}>Email</label>
                               <div className="flex items-center text-gray-900 dark:text-white font-medium p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg cursor-not-allowed opacity-75">
                                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                  {formData.email}
                               </div>
                            </div>

                            <div>
                               <label className={labelClass}>Phone</label>
                               {isEditing ? (
                                  <input 
                                     type="text" 
                                     value={formData.phoneNumber || ''} 
                                     onChange={e => setFormData({...formData, phoneNumber: e.target.value})} 
                                     className={inputClass}
                                  />
                               ) : (
                                  <div className="flex items-center text-gray-900 dark:text-white font-medium p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                     <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                     {formData.phoneNumber || 'Not set'}
                                  </div>
                               )}
                            </div>
                         </div>
                         
                         {user.matricNumber && (
                             <div className="mt-4 text-center">
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                   Matric Number: {user.isVerified ? <span className="text-emerald-500 font-bold">Verified</span> : <span className="text-orange-500">Not verified</span>}
                                </p>
                             </div>
                         )}

                         {isEditing && (
                            <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                               <Button type="button" variant="ghost" className="flex-1 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => {
                                  setFormData(user);
                                  setIsEditing(false);
                               }}>Cancel</Button>
                               <Button type="submit" className="flex-1">
                                  <Save className="w-4 h-4 mr-2" /> Save Changes
                               </Button>
                            </div>
                         )}
                      </form>
                   </div>
                ) : (
                   <div className="space-y-6 max-w-2xl">
                      {formData.reviews && formData.reviews.length > 0 ? (
                         formData.reviews.map(review => (
                            <div key={review.id} className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                               <div className="flex justify-between items-start mb-2">
                                  <span className="font-bold text-sm text-gray-900 dark:text-white">{review.reviewerName}</span>
                                  <span className="text-[10px] text-gray-400 dark:text-gray-500">{review.date.toLocaleDateString()}</span>
                               </div>
                               <div className="flex items-center mb-3">
                                  {[...Array(5)].map((_, i) => (
                                     <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                                  ))}
                               </div>
                               <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{review.comment}"</p>
                            </div>
                         ))
                      ) : (
                         <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                               <ThumbsUp className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No reviews yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">When you trade, reviews will appear here.</p>
                         </div>
                      )}
                   </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};
