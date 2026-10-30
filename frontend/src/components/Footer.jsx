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
    <footer className="border-t border-white/10 dark:border-white/10 border-slate-200 bg-[#090D1A] dark:bg-[#090D1A] bg-slate-50 pt-16 pb-12 text-sm text-slate-400 dark:text-slate-400 text-slate-600 transition-colors">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10 dark:border-white/10 border-slate-200">
          
          {/* Logo & Description */}
          <div className="space-y-3">
            <div
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-[#0E1324] rounded-[11px] flex items-center justify-center text-cyan-300">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <span className="font-serif font-bold text-xl text-slate-100 dark:text-slate-100 text-slate-900 tracking-tight">
                K12 Hunar
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed max-w-[280px]">
              Supporting school students, parents, and partner institutions through scholarships, performing arts, and learning admissions.
            </p>
          </div>

          {/* Column 1: Programs */}
          <div>
            <h4 className="font-sans font-semibold text-xs text-slate-200 dark:text-slate-200 text-slate-800 uppercase tracking-wider mb-3">
              Programs
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => handleProgramClick('scholarship')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Talent scholarships
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProgramClick('concert')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Annual school concerts
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProgramClick('admission')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Curriculum admissions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProgramClick('school-hub')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  School collaborations
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h4 className="font-sans font-semibold text-xs text-slate-200 dark:text-slate-200 text-slate-800 uppercase tracking-wider mb-3">
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
            <h4 className="font-sans font-semibold text-xs text-slate-200 dark:text-slate-200 text-slate-800 uppercase tracking-wider mb-3">
              Staff & admin
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-cyan-400 font-semibold hover:underline"
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
