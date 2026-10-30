import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { isAuthenticated, logout, currentView, setCurrentView, setIsLoginModalOpen } = useAuth();

  const handleNavClick = (targetId) => {
    setCurrentView('home');
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E2D9C8]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Simple Wordmark Logo */}
        <div 
          onClick={() => setCurrentView('home')}
          className="cursor-pointer select-none"
        >
          <span className="font-serif font-bold text-2xl text-[#1E2A3A] tracking-tight">
            K12 Hunar
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNavClick('programs')}
            className="text-sm font-medium text-[#556070] hover:text-[#1E2A3A] transition-colors"
          >
            Programs
          </button>
          
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="text-sm font-medium text-[#556070] hover:text-[#1E2A3A] transition-colors"
          >
            How it works
          </button>

          <button
            onClick={() => handleNavClick('inquiry')}
            className="text-sm font-medium text-[#556070] hover:text-[#1E2A3A] transition-colors"
          >
            Inquiry form
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`text-sm font-medium transition-colors ${
                currentView === 'admin' ? 'text-[#1F5F4A] font-semibold' : 'text-[#556070] hover:text-[#1E2A3A]'
              }`}
            >
              CRM portal
            </button>
          )}
        </nav>

        {/* Right plain text link */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
                className="text-sm font-medium text-[#1F5F4A] hover:underline"
              >
                {currentView === 'admin' ? 'Public site' : 'Admin portal'}
              </button>
              <button
                onClick={logout}
                className="text-sm font-medium text-[#556070] hover:text-[#B3261E] transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-sm font-medium text-[#556070] hover:text-[#1E2A3A] transition-colors underline-offset-4 hover:underline"
            >
              Admin login
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
