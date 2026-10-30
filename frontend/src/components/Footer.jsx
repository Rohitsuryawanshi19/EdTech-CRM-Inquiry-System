import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react';

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
    <footer className="border-t border-stone-200/80 dark:border-white/10 bg-[#FAF7F2] dark:bg-[#080D14] pt-16 pb-12 text-sm text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-200/80 dark:border-white/10">
          
          {/* Logo & Description */}
          <div className="space-y-3">
            <div
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 p-[1px] group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0E1B2A] rounded-[11px] flex items-center justify-center text-amber-400">
                  <GraduationCap className="w-4 h-4" />
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
            <p className="text-xs sm:text-sm leading-relaxed max-w-[280px]">
              Supporting school students, parents, and partner institutions through scholarships, performing arts, and learning admissions.
            </p>
          </div>

          {/* Column 1: Programs */}
          <div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              Programs
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => handleProgramClick('scholarship')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Talent scholarships
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProgramClick('concert')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Annual school concerts
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProgramClick('admission')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Curriculum admissions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProgramClick('school-hub')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  School collaborations
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              Contact
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>Admissions office</li>
              <li>admissions@k12hunar.org</li>
              <li>+91 (0) 11 4050 8800</li>
              <li>Mon–Fri, 9:00 AM – 5:00 PM</li>
            </ul>
          </div>

          {/* Column 3: Administration */}
          <div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              Staff & admin
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
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
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} K12 Hunar. All rights reserved.</p>
          <p>Official Education Portal</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
