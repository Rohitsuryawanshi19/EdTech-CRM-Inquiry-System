import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PublicInquiryForm from './components/PublicInquiryForm';
import FeaturesSection from './components/FeaturesSection';
import ProgramDetail from './components/ProgramDetail';
import ProgramNotFound from './components/ProgramNotFound';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import Footer from './components/Footer';
import { getProgramBySlug } from './data/programs';
import { Lock, ArrowLeft } from 'lucide-react';

const AppContent = () => {
  const { currentView, setCurrentView, isAuthenticated, setIsLoginModalOpen } = useAuth();
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  // Sync state with browser URL navigation
  const handleLocationChange = useCallback(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [handleLocationChange]);

  // Unified router navigation helper
  const navigate = (to) => {
    try {
      window.history.pushState({}, '', to);
      setCurrentPath(window.location.pathname);

      // Handle hash scrolling if navigating to /#inquiry or /#programs
      if (to.includes('#')) {
        const hash = to.split('#')[1];
        if (to.startsWith('/?') || to.startsWith('/#') || to === '#inquiry' || to === '#programs') {
          setCurrentView('home');
        }
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }

      // If category parameter changed, dispatch event for InquiryForm
      if (to.includes('category=')) {
        window.dispatchEvent(new Event('categoryChange'));
      }
    } catch (e) {
      console.warn('Navigation error:', e);
    }
  };

  const handleScrollToForm = () => {
    if (currentPath !== '/') {
      navigate('/#inquiry');
    } else {
      setCurrentView('home');
      setTimeout(() => {
        const formEl = document.getElementById('inquiry');
        if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  // Check if current route matches /programs/:slug
  const programRouteMatch = currentPath.match(/^\/programs\/([^\/]+)\/?$/);
  const programSlug = programRouteMatch ? programRouteMatch[1] : null;

  // Render Main Content
  const renderContent = () => {
    // 1. Admin CRM Dashboard view
    if (currentView === 'admin') {
      if (isAuthenticated) {
        return <AdminDashboard />;
      }
      return (
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
              onClick={() => {
                setCurrentView('home');
                navigate('/');
              }}
              className="btn-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Site
            </button>
          </div>
        </div>
      );
    }

    // 2. Program Details Route: /programs/:slug
    if (programSlug) {
      const programData = getProgramBySlug(programSlug);
      if (!programData) {
        return <ProgramNotFound onNavigateHome={() => navigate('/')} />;
      }
      return <ProgramDetail program={programData} onNavigate={navigate} />;
    }

    // 3. Default Home Page Route
    return (
      <>
        <HeroSection onScrollToForm={handleScrollToForm} />
        <FeaturesSection onNavigate={navigate} />
        <PublicInquiryForm />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF7F0] text-[#1E2A3A]">
      <Navbar onNavigate={navigate} />
      {/* 200ms page route transition fade */}
      <main key={`${currentPath}-${currentView}`} className="flex-1 page-transition">
        {renderContent()}
      </main>
      <AdminLoginModal />
      <Footer onNavigate={navigate} />
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
