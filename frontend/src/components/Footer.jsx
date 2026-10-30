import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Footer = ({ onNavigate }) => {
  const { setIsLoginModalOpen, setCurrentView } = useAuth();

  const handleProgramClick = (slug) => {
    setCurrentView('home');
    if (onNavigate) {
      onNavigate(`/programs/${slug}`);
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
    <footer className="border-t border-[#E2D9C8] bg-[#F3ECE0] pt-14 pb-12 text-sm text-[#556070]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#E2D9C8]">
          
          {/* Logo & Description */}
          <div className="space-y-3">
            <span
              onClick={handleLogoClick}
              className="font-serif font-bold text-2xl text-[#1E2A3A] tracking-tight block cursor-pointer select-none"
            >
              K12 Hunar
            </span>
            <p className="text-xs sm:text-sm text-[#556070] leading-relaxed max-w-[280px]">
              Supporting school students, parents, and partner institutions through scholarships, performing arts, and learning admissions.
            </p>
          </div>

          {/* Column 1: Programs */}
          <div>
            <h4 className="font-sans font-semibold text-xs text-[#1E2A3A] uppercase tracking-wider mb-3">
              Programs
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#556070]">
              <li>
                <button
                  onClick={() => handleProgramClick('scholarship')}
                  className="hover:text-[#1E2A3A] transition-colors"
                >
                  Talent scholarships
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProgramClick('concert')}
                  className="hover:text-[#1E2A3A] transition-colors"
                >
                  Annual school concerts
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProgramClick('admission')}
                  className="hover:text-[#1E2A3A] transition-colors"
                >
                  Curriculum admissions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProgramClick('school-hub')}
                  className="hover:text-[#1E2A3A] transition-colors"
                >
                  School collaborations
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h4 className="font-sans font-semibold text-xs text-[#1E2A3A] uppercase tracking-wider mb-3">
              Contact
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#556070]">
              <li>Admissions office</li>
              <li>admissions@k12hunar.org</li>
              <li>+91 (0) 11 4050 8800</li>
              <li>Mon–Fri, 9:00 AM – 5:00 PM</li>
            </ul>
          </div>

          {/* Column 3: Administration */}
          <div>
            <h4 className="font-sans font-semibold text-xs text-[#1E2A3A] uppercase tracking-wider mb-3">
              Staff & admin
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#556070]">
              <li>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-[#1F5F4A] font-semibold hover:underline"
                >
                  Staff login &rarr;
                </button>
              </li>
              <li>Counselor portal access</li>
              <li>Inquiry review desk</li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#556070]">
          <p>© {new Date().getFullYear()} K12 Hunar. All rights reserved.</p>
          <p>Official Education Portal</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
