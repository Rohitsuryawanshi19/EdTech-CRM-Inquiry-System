import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PublicInquiryForm from './components/PublicInquiryForm';
import FeaturesSection from './components/FeaturesSection';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
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
    <div className="min-h-screen flex flex-col bg-[#FBF7F0] text-[#1E2A3A]">
      {/* Navigation Header */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'admin' ? (
          isAuthenticated ? (
            <AdminDashboard />
          ) : (
            /* Protected Route Notice */
            <div className="py-20 px-4 text-center max-w-[480px] mx-auto my-12 bg-white border border-[#E2D9C8] rounded-[10px] shadow-[0_1px_2px_rgba(30,42,58,0.06),0_4px_12px_rgba(30,42,58,0.05)] p-8">
              <div className="w-12 h-12 rounded-[8px] bg-[#F3ECE0] text-[#1F5F4A] flex items-center justify-center mx-auto mb-4 border border-[#E2D9C8]">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold font-serif text-[#1E2A3A] mb-2">Restricted Access</h2>
              <p className="text-sm text-[#556070] mb-6 leading-relaxed">
                This administration view requires authorized K12 Hunar credentials.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="btn-primary"
                >
                  Log In
                </button>
                <button
                  onClick={() => setCurrentView('home')}
                  className="btn-secondary"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to Site
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

      {/* Admin Login Modal */}
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
