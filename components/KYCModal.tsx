import React, { useState, useEffect } from 'react';
import { ShieldCheck, Upload, X } from 'lucide-react';
import { Button } from './Button';

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
}

export const KYCModal: React.FC<KYCModalProps> = ({ isOpen, onClose, onVerify }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    matricNumber: '',
    faculty: '',
    level: '',
  });

  // Handle Escape key
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.matricNumber || !formData.faculty) return;

    setIsLoading(true);
    // Simulate verification process
    setTimeout(() => {
      setIsLoading(false);
      onVerify();
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-indigo-600 px-6 py-8 text-center relative">
           <button onClick={onClose} className="absolute top-4 right-4 text-indigo-200 hover:text-white">
             <X className="w-6 h-6" />
           </button>
           <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
             <ShieldCheck className="w-8 h-8 text-white" />
           </div>
           <h2 className="text-2xl font-bold text-white">Student Verification</h2>
           <p className="text-indigo-100 mt-2 text-sm">To ensure a safe marketplace, we need to verify you are a Unilag student.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matric Number</label>
            <input 
              type="text" 
              name="matricNumber"
              value={formData.matricNumber}
              onChange={handleChange}
              placeholder="e.g. 1904070..." 
              className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900" 
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                <select 
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Science">Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Arts">Arts</option>
                  <option value="Social Sciences">Social Sciences</option>
                  <option value="Law">Law</option>
                  <option value="Education">Education</option>
                  <option value="Management">Management Sciences</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select 
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900"
                >
                   <option value="100">100</option>
                   <option value="200">200</option>
                   <option value="300">300</option>
                   <option value="400">400</option>
                   <option value="500">500</option>
                </select>
             </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors bg-white">
             <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
             <p className="text-sm text-gray-500">Upload Student ID Card (Optional for now)</p>
          </div>

          <div className="pt-2">
             <Button type="submit" className="w-full" isLoading={isLoading}>
               Verify & Continue
             </Button>
             <p className="text-xs text-center text-gray-400 mt-3">
               By verifying, you agree to our Terms of Service regarding safe trading on campus.
             </p>
          </div>
        </form>
      </div>
    </div>
  );
};