import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, ChevronDown, X } from 'lucide-react';
import { programs } from '../data/programs';
import ImageWithFallback from './ImageWithFallback';
import useScrollReveal from '../hooks/useScrollReveal';

// Curated unsplash fallbacks if local files are missing, ensuring high quality visuals
const PHOTO_FALLBACKS = {
  scholarship: {
    hero: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
    card: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    g1: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    g2: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
    g3: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
  },
  concert: {
    hero: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
    card: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    g1: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1000&q=80',
    g2: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    g3: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
  },
  admission: {
    hero: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
    card: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    g1: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
    g2: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
    g3: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80',
  },
  'school-hub': {
    hero: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80',
    card: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    g1: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
    g2: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
    g3: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
  },
};

export const ProgramDetail = ({ program, onNavigate }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);

  useScrollReveal(program.slug);

  // Sync title and scroll to top on mount
  useEffect(() => {
    document.title = `${program.name} | K12 Hunar`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [program]);

  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxImage(null);
      }
    };
    if (lightboxImage) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxImage]);

  const handleInquireClick = () => {
    onNavigate(`/?category=${program.category}#inquiry`);
  };

  const otherPrograms = programs.filter((p) => p.slug !== program.slug);
  const fallbackSet = PHOTO_FALLBACKS[program.slug] || {};

  return (
    <article className="min-h-screen bg-[var(--bg-color)] text-[var(--text-main)] transition-colors">
      
      {/* 1. Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B0F19] py-3.5 transition-colors">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-indigo-600 dark:hover:text-cyan-400 font-medium transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('/#programs')}
            className="hover:text-indigo-600 dark:hover:text-cyan-400 font-medium transition-colors"
          >
            Programs
          </button>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-bold truncate">
            {program.name}
          </span>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="py-14 sm:py-20 border-b border-slate-200 dark:border-white/10 hero-ambient-bg transition-colors">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 reveal">
              <span
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider"
                style={{ backgroundColor: `${program.tint}18`, color: program.tint }}
              >
                {program.category}
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-[-0.03em] leading-[1.08]">
                {program.name}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-xl">
                {program.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={handleInquireClick}
                  className="btn-hero-primary"
                >
                  Inquire about this program
                </button>
                <button
                  onClick={() => onNavigate('/#programs')}
                  className="btn-hero-secondary"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to programs</span>
                </button>
              </div>
            </div>

            {/* Right Column (5 cols) with offset border */}
            <div className="lg:col-span-5 reveal stagger-2">
              <div className="relative max-w-[460px] mx-auto lg:max-w-none">
                <div
                  className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border-2 border-slate-300 dark:border-white/15 pointer-events-none"
                  aria-hidden="true"
                />
                <ImageWithFallback
                  src={program.heroImage}
                  fallbackImage={fallbackSet.hero}
                  programName={program.name}
                  alt={`${program.name} representative classroom photo`}
                  className="relative z-10 w-full rounded-2xl object-cover border border-slate-200 dark:border-white/15 shadow-2xl"
                  aspectRatio="16/10"
                  width={800}
                  height={500}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Facts Strip (4 facts in a bordered row) */}
      <section className="bg-white dark:bg-[#0E1424] border-b border-slate-200 dark:border-white/10 py-8 transition-colors">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-white/10">
            {program.facts.map((fact, index) => (
              <div key={index} className="pt-4 sm:pt-0 sm:px-4 first:sm:pl-0 reveal stagger-1">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {fact.label}
                </span>
                <span className="block font-black text-base sm:text-lg text-slate-900 dark:text-white">
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Overview & Highlights Section */}
      <section className="py-16 sm:py-20 border-b border-slate-200 dark:border-white/10 transition-colors">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Overview (7 cols) */}
            <div className="lg:col-span-7 reveal">
              <h2 className="font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mb-4 tracking-[-0.02em]">
                Program overview
              </h2>
              <div className="space-y-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {program.overview.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Highlights Checklist (5 cols) */}
            <div className="lg:col-span-5 reveal stagger-2">
              <div className="p-7 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-lg">
                <h3 className="font-black text-lg text-slate-900 dark:text-white mb-4">
                  Key highlights
                </h3>
                <ul className="space-y-3.5">
                  {program.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="leading-snug font-medium">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. How It Works (Numbered steps) */}
      <section className="py-16 sm:py-20 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0E1424] transition-colors">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          <div className="mb-12 reveal">
            <h2 className="font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mb-2 tracking-[-0.02em]">
              Application & enrollment process
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              From first question to finalized student participation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {program.steps.map((st, idx) => {
              const stepStagger = `stagger-${idx + 1}`;
              return (
                <div key={idx} className={`p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm reveal ${stepStagger}`}>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400 font-extrabold text-sm flex items-center justify-center mb-4 border border-indigo-200 dark:border-cyan-500/20">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {st.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Photo Gallery (Mosaic: 1 large + 2 small) with Lightbox */}
      <section className="py-16 sm:py-20 border-b border-slate-200 dark:border-white/10 transition-colors">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          <div className="mb-10 reveal">
            <h2 className="font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mb-2 tracking-[-0.02em]">
              Photo gallery
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Scenes from past workshops, rehearsals, and orientation sessions. Click to enlarge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Large 1st Image (7 cols) */}
            <div className="md:col-span-7 cursor-pointer group reveal stagger-1">
              <ImageWithFallback
                src={program.gallery[0]?.src}
                fallbackImage={fallbackSet.g1}
                programName={program.name}
                alt={program.gallery[0]?.alt}
                onClick={() => setLightboxImage(program.gallery[0])}
                className="w-full h-[320px] sm:h-[380px] object-cover rounded-2xl border border-slate-200 dark:border-white/10 shadow-md transition-transform duration-300 group-hover:scale-[1.01]"
                aspectRatio="16/10"
              />
            </div>

            {/* 2 Smaller Images (5 cols, stacked) */}
            <div className="md:col-span-5 flex flex-col gap-5">
              <div className="flex-1 cursor-pointer group reveal stagger-2">
                <ImageWithFallback
                  src={program.gallery[1]?.src}
                  fallbackImage={fallbackSet.g2}
                  programName={program.name}
                  alt={program.gallery[1]?.alt}
                  onClick={() => setLightboxImage(program.gallery[1])}
                  className="w-full h-[152px] sm:h-[180px] object-cover rounded-2xl border border-slate-200 dark:border-white/10 shadow-md transition-transform duration-300 group-hover:scale-[1.01]"
                  aspectRatio="16/10"
                />
              </div>
              <div className="flex-1 cursor-pointer group reveal stagger-3">
                <ImageWithFallback
                  src={program.gallery[2]?.src}
                  fallbackImage={fallbackSet.g3}
                  programName={program.name}
                  alt={program.gallery[2]?.alt}
                  onClick={() => setLightboxImage(program.gallery[2])}
                  className="w-full h-[152px] sm:h-[180px] object-cover rounded-2xl border border-slate-200 dark:border-white/10 shadow-md transition-transform duration-300 group-hover:scale-[1.01]"
                  aspectRatio="16/10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-label="Enlarged image view"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white dark:bg-[#111827] rounded-2xl p-3 overflow-hidden border border-slate-200 dark:border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
            <ImageWithFallback
              src={lightboxImage.src}
              fallbackImage={fallbackSet.g1}
              programName={program.name}
              alt={lightboxImage.alt}
              className="w-full max-h-[80vh] object-contain rounded-xl"
              aspectRatio="auto"
            />
            {lightboxImage.alt && (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2 px-2 font-medium">
                {lightboxImage.alt}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 7. FAQ Accessible Accordion */}
      <section className="py-16 sm:py-20 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0E1424] transition-colors">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <div className="mb-12 text-center reveal">
            <h2 className="font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mb-2 tracking-[-0.02em]">
              Frequently asked questions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Common answers for parents, school heads, and student applicants.
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-white/10 border-y border-slate-200 dark:border-white/10 reveal">
            {program.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-4 sm:py-5">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 group"
                  >
                    <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-indigo-600 dark:text-cyan-400' : ''
                      }`}
                    />
                  </button>

                  {/* 250ms Grid Accordion Transition */}
                  <div className={`accordion-wrapper ${isOpen ? 'is-open' : ''}`}>
                    <div className="accordion-inner">
                      <div className="pt-3 pb-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Bottom CTA Band in Program Tint */}
      <section
        className="py-14 px-4 sm:px-6 text-white text-center shadow-inner"
        style={{ backgroundColor: program.tint }}
      >
        <div className="max-w-[700px] mx-auto">
          <h2 className="font-black text-2xl sm:text-3xl text-white mb-3 tracking-[-0.02em]">
            Still have questions about this program?
          </h2>
          <p className="text-base text-white/95 mb-8 max-w-[500px] mx-auto leading-relaxed">
            Send an inquiry directly to the {program.name} coordinating team. We reply within 24–48 hours.
          </p>
          <button
            onClick={handleInquireClick}
            className="px-8 py-3.5 rounded-full bg-white text-slate-900 font-extrabold text-sm hover:bg-slate-100 transition-all shadow-xl hover:scale-105 active:scale-100"
          >
            Inquire about {program.name}
          </button>
        </div>
      </section>

      {/* 9. Other Programs Row */}
      <section className="py-20 sm:py-24 border-b border-slate-200 dark:border-white/10 transition-colors">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          <div className="mb-12 reveal">
            <h2 className="font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mb-2 tracking-[-0.02em]">
              Other programs we support
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Explore additional educational pathways, concerts, and institutional collaborations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherPrograms.map((other, idx) => {
              const otherFallback = PHOTO_FALLBACKS[other.slug]?.card;
              const cardStagger = `stagger-${idx + 1}`;
              return (
                <div
                  key={idx}
                  onClick={() => onNavigate(`/programs/${other.slug}`)}
                  className={`rounded-2xl overflow-hidden border-t-4 ${other.topBorder} cursor-pointer group program-card bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300 reveal ${cardStagger}`}
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <ImageWithFallback
                      src={other.cardImage}
                      fallbackImage={otherFallback}
                      programName={other.name}
                      alt={other.name}
                      className="w-full h-full object-cover program-card-img"
                    />
                  </div>
                  <div className="p-6">
                    <span
                      className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2.5 uppercase tracking-wider"
                      style={{ backgroundColor: `${other.tint}18`, color: other.tint }}
                    >
                      {other.category}
                    </span>
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                      {other.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {other.description || other.tagline}
                    </p>
                    <span className="text-xs font-bold text-indigo-600 dark:text-cyan-400 inline-flex items-center gap-1">
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

    </article>
  );
};

export default ProgramDetail;
