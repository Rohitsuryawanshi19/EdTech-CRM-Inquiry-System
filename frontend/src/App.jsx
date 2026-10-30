import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PublicInquiryForm from './components/PublicInquiryForm';
import FeaturesSection from './components/FeaturesSection';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer';
import { Lock, ArrowLeft } from 'lucide-react';

const AppContent = () => {
  const { currentView, setCurrentView, isAuthenticated, setIsLoginModalOpen } = useAuth();

  const handleScrollToForm = () => {
    setCurrentView('home');
    setTimeout(() => {
      const formEl = document.getElementById('inquiry-section');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B13] text-slate-100">
      {/* Interactive trailing spatial cursor */}
      <CustomCursor />

      {/* Main Glass Navigation Header */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'admin' ? (
          isAuthenticated ? (
            <AdminDashboard />
          ) : (
            /* Protected Route Guard UI if unauthenticated tries to view admin */
            <div className="py-24 px-4 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-5">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Protected Admin Route</h2>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                This dashboard is restricted to authorized K12 Hunar administrators. Custom JWT authentication is required to access inquiry records.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-lg shadow-brand-600/30 transition-all"
                >
                  Log In as Admin
                </button>
                <button
                  onClick={() => setCurrentView('home')}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Public Site
                </button>
              </div>
            </div>
          )
        ) : (
          /* Public Home Page */
          <>
            <HeroSection onScrollToForm={handleScrollToForm} />
            <PublicInquiryForm />
            <FeaturesSection />
          </>
        )}
      </main>

      {/* Custom JWT Login Modal */}
      <AdminLoginModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
