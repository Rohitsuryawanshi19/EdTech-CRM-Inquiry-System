import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ShieldCheck, LogOut, LayoutDashboard, SendHorizontal } from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, admin, logout, currentView, setCurrentView, setIsLoginModalOpen } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#080B13]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow">
              <div className="w-full h-full bg-[#0d1322] rounded-[15px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#080B13]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 font-['Space_Grotesk']">
                K12 HUNAR
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-wider">
                CRM
              </span>
            </div>
            <p className="text-xs text-slate-400 tracking-wide font-medium">EdTech Inquiry Management System</p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
          <button
            onClick={() => {
              setCurrentView('home');
              const el = document.getElementById('inquiry-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              currentView === 'home'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Inquiry Form
          </button>
          
          <button
            onClick={() => {
              setCurrentView('home');
              const el = document.getElementById('programs-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-full text-xs font-semibold tracking-wide text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            Categories & Programs
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all ${
                currentView === 'admin'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                  : 'text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              CRM Dashboard
            </button>
          )}
        </nav>

        {/* Right CTA / Admin Auth Status */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-200">{admin?.name || 'Administrator'}</span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Custom JWT Active
                </span>
              </div>
              <button
                onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-600/20 text-brand-300 border border-brand-500/30 hover:bg-brand-600/30 transition-all flex items-center gap-1.5"
              >
                {currentView === 'admin' ? (
                  <>
                    <SendHorizontal className="w-3.5 h-3.5" />
                    Public Form
                  </>
                ) : (
                  <>
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </>
                )}
              </button>
              <button
                onClick={logout}
                title="Log out from Admin"
                className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
              Admin Portal Login
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
