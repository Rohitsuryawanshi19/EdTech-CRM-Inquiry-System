import React from 'react';
import { Award, Music, BookOpen, School, Sparkles, CheckCircle } from 'lucide-react';

const PROGRAM_CARDS = [
  {
    category: 'Scholarship',
    badge: 'Merit & Need Based',
    title: 'National Hunar Talent Scholarship',
    description:
      'Funding up to 100% tuition for exceptional students excelling in STEM, creative arts, robotics, and academic olympiads.',
    imageUrl:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    tags: ['Grades 6-12', 'Up to 100% Waiver', 'Annual Exam'],
    accentColor: 'from-amber-500/20 to-orange-500/5',
    borderColor: 'group-hover:border-amber-500/50',
    icon: Award,
    iconColor: 'text-amber-400',
  },
  {
    category: 'Concert',
    badge: 'Cultural & Performing Arts',
    title: 'Annual Inter-School Hunar Concert',
    description:
      'A massive national stage celebrating musical prodigies, theatrical performance, and inter-school artistic collaborations.',
    imageUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    tags: ['Music & Dance', '150+ Schools', 'Celebrity Jury'],
    accentColor: 'from-fuchsia-500/20 to-pink-500/5',
    borderColor: 'group-hover:border-fuchsia-500/50',
    icon: Music,
    iconColor: 'text-fuchsia-400',
  },
  {
    category: 'Admission',
    badge: 'Academic Enrollment',
    title: 'Next-Gen K12 Curriculum Admissions',
    description:
      'Personalized learning pathways integrating AI literacy, competitive exam prep, and holistic development mentorship.',
    imageUrl:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    tags: ['Direct Intake', 'Counselling Session', 'Hybrid Modules'],
    accentColor: 'from-cyan-500/20 to-blue-500/5',
    borderColor: 'group-hover:border-cyan-500/50',
    icon: BookOpen,
    iconColor: 'text-cyan-400',
  },
  {
    category: 'School Query',
    badge: 'Institutional Tie-ups',
    title: 'School Hub & Institutional Partnerships',
    description:
      'Empowering K-12 partner schools with advanced labs, certified educator training programs, and co-branded youth events.',
    imageUrl:
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    tags: ['Institutional MoU', 'Lab Setup', 'Teacher Training'],
    accentColor: 'from-emerald-500/20 to-teal-500/5',
    borderColor: 'group-hover:border-emerald-500/50',
    icon: School,
    iconColor: 'text-emerald-400',
  },
];

export const FeaturesSection = () => {
  return (
    <section id="programs-section" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Core Focus Areas
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Programs Supported by K12 Hunar CRM
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Every submitted inquiry is routed to domain-specialist officers for fast track resolution and transparent tracking.
          </p>
        </div>

        {/* 4 Program Cards with images & hover animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROGRAM_CARDS.map((prog, index) => {
            const Icon = prog.icon;
            return (
              <div
                key={index}
                className={`glass-card rounded-3xl overflow-hidden group border border-white/5 ${prog.borderColor} transition-all duration-300 flex flex-col`}
              >
                {/* Image Header with Zoom effect */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={prog.imageUrl}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1322] via-[#0d1322]/40 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${prog.iconColor}`} />
                    <span>{prog.category}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider block mb-1">
                      {prog.badge}
                    </span>
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {prog.description}
                    </p>
                  </div>

                  {/* Feature Tags */}
                  <div className="pt-4 border-t border-white/5 flex flex-wrap gap-1.5">
                    {prog.tags.map((tag, tIndex) => (
                      <span
                        key={tIndex}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/5 flex items-center gap-1 font-medium"
                      >
                        <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                        {tag}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
