import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from './Button';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('suspicious');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReason('suspicious');
      setDetails('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(reason, details);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <div className="bg-red-50 px-6 py-4 flex items-center justify-between border-b border-red-100">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-red-900">Report Item</h2>
          </div>
          <button onClick={onClose} className="text-red-400 hover:text-red-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Why are you reporting this?</label>
            <div className="space-y-2">
              {[
                { id: 'suspicious', label: 'Suspicious / Scam' },
                { id: 'inappropriate', label: 'Inappropriate Content' },
                { id: 'duplicate', label: 'Duplicate Listing' },
                { id: 'wrong_category', label: 'Wrong Category' },
                { id: 'other', label: 'Other' }
              ].map((opt) => (
                <label key={opt.id} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${reason === opt.id ? 'bg-red-50 border-red-500' : 'hover:bg-gray-50 border-gray-200'}`}>
                  <input
                    type="radio"
                    name="reason"
                    value={opt.id}
                    checked={reason === opt.id}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <span className={`ml-3 text-sm ${reason === opt.id ? 'font-medium text-red-700' : 'text-gray-700'}`}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details (Optional)</label>
            <textarea
              className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none text-sm"
              rows={3}
              placeholder="Please provide more context..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            ></textarea>
          </div>

          <div className="pt-2 flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500" isLoading={isSubmitting}>
              Submit Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};