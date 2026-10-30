import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, GraduationCap } from 'lucide-react';

export const Navbar = ({ onNavigate }) => {
  const { isAuthenticated, logout, currentView, setCurrentView, setIsLoginModalOpen } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleNavClick = (targetId) => {
    setCurrentView('home');
    if (onNavigate) {
      onNavigate(`/#${targetId}`);
    } else {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const handleLogoClick = () => {
    setCurrentView('home');
    if (onNavigate) {
      onNavigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 dark:bg-[#0A0F16]/90 border-b border-stone-200/80 dark:border-white/10 backdrop-blur-md transition-colors">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Wordmark */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 p-[1px] shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0E1B2A] rounded-[15px] flex items-center justify-center text-amber-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xl text-amber-600 dark:text-amber-400 tracking-tight">
              K12
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-bold">:</span>
            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
              EdTech CRM & Inquiry System
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          <button
            onClick={() => handleNavClick('programs')}
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            Programs
          </button>
          
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            How it works
          </button>

          <button
            onClick={() => handleNavClick('inquiry')}
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            Inquiry desk
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`text-sm font-bold transition-colors ${
                currentView === 'admin'
                  ? 'text-amber-600 dark:text-amber-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-amber-600'
              }`}
            >
              CRM portal
            </button>
          )}
        </nav>

        {/* Right Actions: Theme Toggle + Admin Login */}
        <div className="flex items-center gap-3">
          
          {/* Light / Dark Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 shadow-sm transition-all hover:scale-105 active:scale-95"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
                className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all"
              >
                {currentView === 'admin' ? 'Public site' : 'Admin portal'}
              </button>
              <button
                onClick={logout}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-xs font-bold px-4 py-2.5 rounded-full text-slate-800 dark:text-slate-100 bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/25 dark:border-amber-400/20 hover:bg-amber-500/20 transition-all hover:scale-105 active:scale-95 shadow-sm"
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
