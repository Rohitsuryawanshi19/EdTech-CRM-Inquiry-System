import React from 'react';
import { Sparkles, ArrowRight, BookOpenCheck, Award, Music2, School } from 'lucide-react';

export const HeroSection = ({ onScrollToForm }) => {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden bg-grid-pattern">
      {/* Dynamic spatial glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-brand-600/20 via-cyan-500/15 to-violet-500/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-20 w-72 h-72 bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-8 animate-float shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>K12 Hunar Admissions & Scholarship Drive 2026-27</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-slate-400">Live Intake</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.12] mb-6">
          Empowering Young Talent with{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-cyan-400 to-indigo-300">
            Intelligent Inquiry CRM
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300/80 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Direct gateway for students, parents, and schools to connect with K12 Hunar. Inquire about national talent scholarships, annual music concerts, admissions, and educational partnerships.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={onScrollToForm}
            className="group px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all flex items-center gap-2.5 active:scale-95"
          >
            <span>Submit Public Inquiry</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#programs-section"
            className="px-6 py-3.5 rounded-2xl font-semibold text-sm text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all backdrop-blur-md"
          >
            Explore 4 Inquiry Streams
          </a>
        </div>

        {/* 4 Pillars Card Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="glass-card p-4 rounded-2xl flex items-center gap-3.5 text-left group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Stream 1</p>
              <h4 className="text-sm font-bold text-slate-100">Scholarships</h4>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-center gap-3.5 text-left group">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 transition-transform">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Stream 2</p>
              <h4 className="text-sm font-bold text-slate-100">Hunar Concerts</h4>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-center gap-3.5 text-left group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Stream 3</p>
              <h4 className="text-sm font-bold text-slate-100">Admissions</h4>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-center gap-3.5 text-left group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <School className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Stream 4</p>
              <h4 className="text-sm font-bold text-slate-100">School Queries</h4>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
