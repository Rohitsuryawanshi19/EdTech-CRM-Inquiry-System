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
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#090D1A]/90 border-b border-slate-200 dark:border-white/10 backdrop-blur-md transition-colors">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Wordmark */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px] shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0E1324] rounded-[11px] flex items-center justify-center text-cyan-300">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <span className="font-serif font-bold text-xl text-slate-900 dark:text-slate-100 tracking-tight">
            K12 Hunar
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          <button
            onClick={() => handleNavClick('programs')}
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Programs
          </button>
          
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            How it works
          </button>

          <button
            onClick={() => handleNavClick('inquiry')}
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Inquiry desk
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`text-sm font-medium transition-colors ${
                currentView === 'admin'
                  ? 'text-cyan-500 dark:text-cyan-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
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
            className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-105"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
              >
                {currentView === 'admin' ? 'Public site' : 'Admin portal'}
              </button>
              <button
                onClick={logout}
                className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-xs font-semibold px-4 py-2 rounded-full text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
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
