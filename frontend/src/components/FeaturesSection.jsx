import React from 'react';
import { programs } from '../data/programs';
import ImageWithFallback from './ImageWithFallback';
import useScrollReveal from '../hooks/useScrollReveal';

const STEPS = [
  {
    step: '01',
    title: 'Submit your query',
    description: 'Tell us who you are (parent, student or school) and what topic you are inquiring about.',
  },
  {
    step: '02',
    title: 'Counselor review',
    description: 'Our academic and admissions panel reviews your query within one to two working days.',
  },
  {
    step: '03',
    title: 'Direct response',
    description: 'A team officer contacts you directly via your provided email or phone number with next steps.',
  },
];

const PHOTO_CARD_FALLBACKS = {
  scholarship: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
  concert: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  admission: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  'school-hub': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
};

export const FeaturesSection = ({ onNavigate }) => {
  useScrollReveal();

  return (
    <>
      {/* 1. Programs Section */}
      <section id="programs" className="py-20 sm:py-28 border-b border-stone-200/80 dark:border-white/10 transition-colors">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          
          <div className="mb-14 reveal">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/25 dark:border-amber-400/20 text-amber-800 dark:text-amber-300 text-xs font-bold mb-4 uppercase tracking-wider">
              Educational Pathways
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-[-0.03em]">
              Programs we support
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
              Explore specialized academic scholarships, regional concert festivals, and seamless admission guidance.
            </p>
          </div>

          {/* 2x2 Grid with Interactive Card Pop-up & Image Zoom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((prog, index) => {
              const fallbackUrl = PHOTO_CARD_FALLBACKS[prog.slug];
              const staggerClass = `stagger-${index + 1}`;
              return (
                <div
                  key={index}
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate(`/programs/${prog.slug}`);
                    }
                  }}
                  className={`rounded-3xl overflow-hidden border-t-4 ${prog.topBorder} cursor-pointer group interactive-card bg-white dark:bg-[#121A26] border border-stone-200/90 dark:border-white/10 shadow-md reveal ${staggerClass}`}
                >
                  {/* 16:10 Photo with smooth zoom */}
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <ImageWithFallback
                      src={prog.cardImage}
                      fallbackImage={fallbackUrl}
                      programName={prog.name}
                      alt={prog.name}
                      className="w-full h-full object-cover program-card-img"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-7 sm:p-8">
                    <span
                      className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider"
                      style={{ backgroundColor: `${prog.tint}18`, color: prog.tint }}
                    >
                      {prog.category}
                    </span>

                    <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white mb-2.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {prog.name}
                    </h3>

                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 line-clamp-2 mb-6 leading-relaxed">
                      {prog.overview[0] || prog.tagline}
                    </p>

                    <span className="text-sm font-bold text-amber-700 dark:text-amber-300 inline-flex items-center gap-1.5 group-hover:translate-x-1.5 transition-all">
                      <span>View details</span>
                      <span className="program-card-arrow">&rarr;</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. How It Works Section */}
      <section id="how-it-works" className="py-20 sm:py-28 border-b border-stone-200/80 dark:border-white/10 bg-[#FAF7F2] dark:bg-[#0B1017] transition-colors">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          
          <div className="mb-14 reveal">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-200/70 dark:bg-white/5 border border-stone-300/80 dark:border-white/10 text-stone-700 dark:text-slate-300 text-xs font-bold mb-4 uppercase tracking-wider">
              Step by step
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-[-0.03em]">
              How it works
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
              A transparent, prompt response cycle designed for students, families, and partner schools.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              className="hidden md:block absolute top-8 left-12 right-12 h-[2px] bg-stone-200 dark:bg-white/10 -z-0" 
              aria-hidden="true"
            />

            {STEPS.map((item, idx) => {
              const stepStagger = `stagger-${idx + 1}`;
              return (
                <div key={idx} className={`relative z-10 p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#121A26] border border-stone-200/90 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 reveal ${stepStagger}`}>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/25 dark:border-amber-400/20 text-amber-700 dark:text-amber-300 font-black text-base flex items-center justify-center mb-5 shadow-sm">
                    {item.step}
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </>
  );
};

export default FeaturesSection;
