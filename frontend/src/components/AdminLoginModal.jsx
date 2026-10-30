import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

export const AdminLoginModal = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await login(email, password);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail('admin@k12hunar.com');
    setPassword('Admin@12345');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-[840px] bg-white rounded-[10px] border border-[#E2D9C8] shadow-[0_4px_24px_rgba(30,42,58,0.12)] overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Close Button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#556070] hover:text-[#1E2A3A] flex items-center justify-center border border-[#E2D9C8] transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Photo with dark overlay and one sentence (5 cols) */}
        <div className="hidden md:flex md:col-span-5 relative bg-[#1E2A3A] text-white p-8 flex-col justify-end overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80"
            alt="Classroom education"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="relative z-10 space-y-2">
            <span className="font-serif font-bold text-xl text-white block">
              K12 Hunar
            </span>
            <p className="text-xs text-white/90 leading-relaxed font-sans">
              Centralized admissions, talent scholarships and school inquiry management.
            </p>
          </div>
        </div>

        {/* Right Column: Plain white form card (7 cols) */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="font-serif font-bold text-2xl text-[#1E2A3A]">
              Admin sign in
            </h2>
            <p className="text-xs sm:text-sm text-[#556070] mt-1">
              Enter authorized administrator credentials to review inquiries.
            </p>
          </div>

          {/* Quick fill hint for reviewer */}
          <div className="mb-5 p-3 rounded-[8px] bg-[#F3ECE0] border border-[#E2D9C8] text-xs text-[#556070] flex items-center justify-between gap-2">
            <span className="truncate">Default: admin@k12hunar.com</span>
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              className="text-xs font-semibold text-[#1F5F4A] hover:underline flex-shrink-0"
            >
              Fill demo
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-[8px] bg-[#FDECEA] border border-[#B3261E]/30 text-[#B3261E] text-xs">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label" htmlFor="admin-email">
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@k12hunar.com"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="form-input"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in to portal'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginModal;
