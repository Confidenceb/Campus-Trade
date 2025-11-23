
import React, { useState } from 'react';
import { GraduationCap, ArrowRight, User as UserIcon, BookOpen, Building2, Phone, Hash, Mail } from 'lucide-react';
import { Button } from './Button';
import { User } from '../types';

interface AuthPageProps {
  onLogin: (user: Omit<User, 'id' | 'isVerified' | 'savedListingIds' | 'notifications' | 'rating' | 'reviews' | 'conversations'>) => void;
}

const UNIVERSITIES = [
  "Unilag (University of Lagos)",
  "LASU (Lagos State University)",
  "Yabatech (Yaba College of Tech)",
  "LUTH (Lagos University Teaching Hospital)",
  "Other"
];

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // For multi-step signup
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    username: '',
    university: 'Unilag (University of Lagos)',
    matricNumber: '',
    course: '',
    level: '',
    phoneNumber: '',
    bio: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      onLogin({
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
        university: formData.university.split(' ')[0], // Extract Short name
        username: formData.username || formData.email.split('@')[0],
        matricNumber: formData.matricNumber,
        course: formData.course,
        level: formData.level,
        phoneNumber: formData.phoneNumber,
        bio: formData.bio || "Student on CampusTrade."
      });
      setIsLoading(false);
    }, 1500);
  };

  const inputClass = "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <div className="bg-indigo-600 p-3 rounded-xl shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
          {isLogin ? 'Welcome back' : 'Join CampusTrade'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          The ultimate marketplace for <span className="font-semibold text-indigo-600">Students</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
          
          <form className="space-y-5" onSubmit={isLogin ? handleSubmit : (step === 3 ? handleSubmit : handleNextStep)}>
            
            {/* LOGIN FORM */}
            {isLogin && (
              <>
                <div>
                  <label htmlFor="email" className={labelClass}>Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="student@school.edu.ng"
                  />
                </div>
                <div>
                  <label htmlFor="password" className={labelClass}>Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="••••••••"
                  />
                </div>
              </>
            )}

            {/* SIGN UP - STEP 1: Basics */}
            {!isLogin && step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                 <div>
                  <label className={labelClass}>Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      placeholder="e.g. David Oluwaseun"
                    />
                  </div>
                </div>
                <div>
                   <label className={labelClass}>Institution</label>
                   <select 
                      name="university" 
                      value={formData.university} 
                      onChange={handleChange}
                      className={inputClass}
                   >
                      {UNIVERSITIES.map(uni => <option key={uni} value={uni}>{uni}</option>)}
                   </select>
                </div>
                <div>
                  <label className={labelClass}>Matric Number</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      name="matricNumber"
                      type="text"
                      required
                      value={formData.matricNumber}
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      placeholder="e.g. 190407022"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <div className="relative">
                     <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                     <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      placeholder="you@school.edu.ng"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SIGN UP - STEP 2: Academic & Contact */}
            {!isLogin && step === 2 && (
               <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                  <div>
                    <label className={labelClass}>Username (Nickname)</label>
                    <input
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="e.g. CampusPlug"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Course of Study</label>
                    <div className="relative">
                       <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                       <input
                        name="course"
                        type="text"
                        required
                        value={formData.course}
                        onChange={handleChange}
                        className={`${inputClass} pl-10`}
                        placeholder="e.g. Computer Science"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className={labelClass}>Level</label>
                        <select name="level" value={formData.level} onChange={handleChange} className={inputClass} required>
                           <option value="">Select</option>
                           <option value="100">100</option>
                           <option value="200">200</option>
                           <option value="300">300</option>
                           <option value="400">400</option>
                           <option value="500">500</option>
                           <option value="Postgrad">Postgrad</option>
                        </select>
                     </div>
                     <div>
                        <label className={labelClass}>Phone Number</label>
                        <input
                          name="phoneNumber"
                          type="tel"
                          required
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="080..."
                        />
                     </div>
                  </div>
                  <div>
                    <label className={labelClass}>Password</label>
                    <input
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
               </div>
            )}

            {/* SIGN UP - STEP 3: Bio (Optional) */}
            {!isLogin && step === 3 && (
               <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                  <div className="text-center">
                     <h3 className="text-lg font-medium text-gray-900">Almost Done!</h3>
                     <p className="text-sm text-gray-500">Add a bio so people trust you more.</p>
                  </div>
                  <div>
                    <label className={labelClass}>Bio (Optional)</label>
                    <textarea
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Hi, I'm a student at Unilag. I sell textbooks and gadgets..."
                    />
                  </div>
               </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4"
                isLoading={isLoading}
              >
                {isLogin ? 'Sign In' : (step === 3 ? 'Complete Registration' : 'Next Step')} 
                {(!isLogin && step < 3) && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isLogin ? 'New to CampusTrade?' : 'Already have an account?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setStep(1);
                }}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                {isLogin ? 'Create a new account' : 'Sign in instead'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
