import React from 'react';
import { ArrowRight, Sparkles, GraduationCap, Music } from 'lucide-react';

export const HeroSection = ({ onScrollToForm }) => {
  const handleScrollToPrograms = () => {
    const el = document.getElementById('programs');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden hero-ambient-bg border-b border-stone-200/80 dark:border-white/10 transition-colors">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column (7 cols): Heading, copy, CTA buttons */}
          <div className="lg:col-span-7">
            
            {/* Top Pill: ✨ Admissions & Inquiry Desk */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/25 dark:border-amber-400/20 text-amber-800 dark:text-amber-300 text-xs font-bold mb-6 shadow-sm backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Admissions & Inquiry Desk</span>
            </div>

            {/* Main Headline with right guidance gradient */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.85rem] font-black text-slate-900 dark:text-white tracking-[-0.03em] leading-[1.08] mb-6">
              Ask once.<br />
              Grow with the{' '}
              <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 dark:from-amber-300 dark:via-yellow-200 dark:to-amber-400 bg-clip-text text-transparent">
                right guidance.
              </span>
            </h1>

            {/* Subtitle paragraph */}
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg mb-8 leading-relaxed max-w-[520px]">
              Parents, students and schools can reach the K12 Hunar academic desk for scholarships, performing arts concerts, and student admissions—all unified in one place.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onScrollToForm}
                className="btn-hero-primary"
              >
                <span>Submit an inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleScrollToPrograms}
                className="btn-hero-secondary"
              >
                Explore categories
              </button>
            </div>

          </div>

          {/* Right Column (5 cols): Framed photo with 2 floating cards overlapping edges */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative max-w-[420px] mx-auto">
              
              {/* Floating Card 1 (Top-Left Edge Overlap with Gentle Float Animation) */}
              <div className="hero-floating-card animate-float-slow absolute -top-5 -left-4 sm:-left-6 z-20 px-4 py-3 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                    Scholarships
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Applications open
                  </p>
                </div>
              </div>

              {/* Framed Classroom Photo */}
              <div className="rounded-3xl border-2 border-stone-200/80 dark:border-white/15 overflow-hidden shadow-2xl bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80"
                  alt="Teacher guiding students raising their hands in classroom"
                  className="w-full h-[400px] sm:h-[440px] object-cover"
                  loading="eager"
                />
              </div>

              {/* Floating Card 2 (Bottom-Right Edge Overlap with Counter-Float Animation) */}
              <div className="hero-floating-card animate-float-reverse absolute -bottom-5 -right-4 sm:-right-6 z-20 px-4 py-3 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-300 flex items-center justify-center flex-shrink-0">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                    Concerts & Arts
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Showcase season
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
