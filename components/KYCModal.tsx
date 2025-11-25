
import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, X, Camera, CheckCircle, Smartphone, Database, ScanFace, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { User } from '../types';

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  user?: User;
}

type KYCStep = 'INFO' | 'CAMERA' | 'PROCESSING' | 'SUCCESS';

export const KYCModal: React.FC<KYCModalProps> = ({ isOpen, onClose, onVerify, user }) => {
  const [step, setStep] = useState<KYCStep>('INFO');
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    matricNumber: user?.matricNumber || '',
    faculty: user?.course || '',
  });
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processStatus, setProcessStatus] = useState<string>('');
  
  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep('INFO');
      setCapturedImage(null);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.matricNumber || !formData.faculty) return;
    setStep('CAMERA');
  };

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCapturedImage(url);
    }
  };

  const startVerification = () => {
    setStep('PROCESSING');
    
    // Simulate complex biometric verification steps
    setProcessStatus('Scanning facial features...');
    setTimeout(() => {
        setProcessStatus('Accessing School Database...');
        setTimeout(() => {
            setProcessStatus('Matching Biometric Data...');
            setTimeout(() => {
                setProcessStatus('Identity Verified.');
                setStep('SUCCESS');
            }, 2000);
        }, 2000);
    }, 2000);
  };

  const handleFinalize = () => {
      onVerify();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-6 text-center relative shrink-0">
           {!['PROCESSING', 'SUCCESS'].includes(step) && (
             <button onClick={onClose} className="absolute top-4 right-4 text-indigo-200 hover:text-white">
               <X className="w-6 h-6" />
             </button>
           )}
           <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm border border-white/30">
             <ShieldCheck className="w-6 h-6 text-white" />
           </div>
           <h2 className="text-xl font-bold text-white">Identity Verification</h2>
           <p className="text-indigo-100 mt-1 text-sm">Step {step === 'INFO' ? '1' : step === 'CAMERA' ? '2' : '3'} of 3</p>
        </div>

        {/* Body Content */}
        <div className="p-6 md:p-8 flex-grow overflow-y-auto">
          
          {step === 'INFO' && (
             <form onSubmit={handleInfoSubmit} className="space-y-5 animate-in slide-in-from-right-8 duration-300">
                <div className="text-center mb-6">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Student Details</h3>
                    <p className="text-gray-500 text-sm">Confirm your academic information.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    placeholder="e.g. John Doe" 
                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 border px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white" 
                    required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matric Number</label>
                    <input 
                    type="text" 
                    name="matricNumber"
                    value={formData.matricNumber}
                    onChange={e => setFormData({...formData, matricNumber: e.target.value})}
                    placeholder="e.g. 1904070..." 
                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 border px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white" 
                    required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Faculty</label>
                    <select 
                    name="faculty"
                    value={formData.faculty}
                    onChange={e => setFormData({...formData, faculty: e.target.value})}
                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 border px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                    >
                    <option value="">Select Faculty...</option>
                    <option value="Science">Science</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Arts">Arts</option>
                    <option value="Social Sciences">Social Sciences</option>
                    <option value="Law">Law</option>
                    <option value="Education">Education</option>
                    <option value="Management">Management Sciences</option>
                    </select>
                </div>

                <div className="pt-4">
                    <Button type="submit" className="w-full py-3 text-base">Next Step</Button>
                </div>
             </form>
          )}

          {step === 'CAMERA' && (
              <div className="space-y-6 animate-in slide-in-from-right-8 duration-300 text-center">
                  <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">Facial Recognition</h3>
                      <p className="text-gray-500 text-sm">Take a selfie to match with your school ID.</p>
                  </div>

                  <div className="relative mx-auto w-64 h-64 bg-gray-100 dark:bg-gray-800 rounded-full border-4 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                      {capturedImage ? (
                          <img src={capturedImage} alt="Selfie" className="w-full h-full object-cover" />
                      ) : (
                          <div className="text-gray-400 flex flex-col items-center">
                              <ScanFace className="w-16 h-16 mb-2 opacity-50" />
                              <span className="text-xs">Front-facing camera</span>
                          </div>
                      )}
                      
                      {/* File Input Overlay */}
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="user" 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleCapture}
                      />
                  </div>

                  <div className="space-y-3">
                      {!capturedImage ? (
                          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg text-sm flex items-start text-left">
                             <Camera className="w-5 h-5 mr-2 shrink-0" />
                             <p>Tap the circle above to open your camera. Ensure good lighting and remove glasses/hats.</p>
                          </div>
                      ) : (
                          <div className="flex gap-3">
                              <Button variant="outline" onClick={() => setCapturedImage(null)} className="flex-1">Retake</Button>
                              <Button onClick={startVerification} className="flex-1">Verify Identity</Button>
                          </div>
                      )}
                      
                      {!capturedImage && (
                          <Button className="w-full relative pointer-events-none bg-gray-300 dark:bg-gray-700 text-gray-500">
                             Take Photo First
                          </Button>
                      )}
                  </div>
              </div>
          )}

          {step === 'PROCESSING' && (
              <div className="text-center py-8 animate-in zoom-in duration-300">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <Database className="absolute inset-0 m-auto text-indigo-600 dark:text-indigo-400 w-8 h-8 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verifying...</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium animate-pulse">{processStatus}</p>
                  <p className="text-gray-400 text-xs mt-8">Do not close this window.</p>
              </div>
          )}

          {step === 'SUCCESS' && (
              <div className="text-center py-4 animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification Successful</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8">
                      Your identity has been confirmed against the school database. You can now trade safely.
                  </p>
                  <Button onClick={handleFinalize} className="w-full py-3 text-lg bg-emerald-600 hover:bg-emerald-700">
                      Continue to Marketplace
                  </Button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};
