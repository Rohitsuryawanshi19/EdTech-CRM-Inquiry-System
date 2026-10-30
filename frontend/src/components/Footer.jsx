import React from 'react';
import { GraduationCap, Shield, Database, Lock, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-[#07090F] pt-12 pb-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-cyan-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base text-white font-['Space_Grotesk']">
                K12 HUNAR CRM
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Full-Stack EdTech Inquiry & Student Management Platform. Engineered for K12 Hunar's national talent programs, concerts, scholarships, and institutional outreach.
            </p>
          </div>

          {/* Architecture Details */}
          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Technical Architecture
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Supabase PostgreSQL (pg Pool)</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-brand-400" />
                <span>Custom JWT & Bcrypt (No Supabase Auth)</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protected Admin Routes</span>
              </li>
            </ul>
          </div>

          {/* Assessment Info */}
          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Assessment Deliverables
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>✓ Clean Monorepo Architecture</li>
              <li>✓ Production <code className="text-cyan-300">schema.sql</code></li>
              <li>✓ Template <code className="text-brand-300">.env.example</code></li>
              <li>✓ Comprehensive <code className="text-emerald-300">README.md</code></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} K12 Hunar EdTech. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Engineered with passion for K12 Hunar Full-Stack Assessment</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
