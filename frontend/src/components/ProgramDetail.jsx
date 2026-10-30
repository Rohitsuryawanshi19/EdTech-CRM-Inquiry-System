import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, ChevronDown, X } from 'lucide-react';
import { programs } from '../data/programs';
import ImageWithFallback from './ImageWithFallback';

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
    <article className="min-h-screen bg-[#FBF7F0] text-[#1E2A3A]">
      
      {/* 1. Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="border-b border-[#E2D9C8] bg-white py-3">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 flex items-center gap-2 text-xs text-[#556070]">
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-[#1E2A3A] transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('/#programs')}
            className="hover:text-[#1E2A3A] transition-colors"
          >
            Programs
          </button>
          <span>/</span>
          <span className="text-[#1E2A3A] font-semibold truncate">
            {program.name}
          </span>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="py-12 sm:py-16 border-b border-[#E2D9C8]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7">
              <span
                className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-[999px] mb-4"
                style={{ backgroundColor: program.tintBg, color: program.tint }}
              >
                {program.category}
              </span>

              <h1 className="font-serif font-bold text-[#1E2A3A] mb-4 text-balance">
                {program.name}
              </h1>

              <p className="text-lg text-[#556070] mb-8 leading-relaxed">
                {program.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={handleInquireClick}
                  className="btn-primary"
                >
                  Inquire about this program
                </button>
                <button
                  onClick={() => onNavigate('/#programs')}
                  className="btn-secondary"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to programs</span>
                </button>
              </div>
            </div>

            {/* Right Column (5 cols) with 12px offset border */}
            <div className="lg:col-span-5">
              <div className="relative max-w-[460px] mx-auto lg:max-w-none">
                <div
                  className="absolute inset-0 translate-x-3 translate-y-3 rounded-[10px] border-2 border-[#E2D9C8] pointer-events-none"
                  aria-hidden="true"
                />
                <ImageWithFallback
                  src={program.heroImage}
                  fallbackImage={fallbackSet.hero}
                  programName={program.name}
                  alt={`${program.name} representative classroom photo`}
                  className="relative z-10 w-full rounded-[10px] object-cover border border-[#E2D9C8]"
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
      <section className="bg-white border-b border-[#E2D9C8] py-8">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#E2D9C8]">
            {program.facts.map((fact, index) => (
              <div key={index} className="pt-4 sm:pt-0 sm:px-4 first:sm:pl-0">
                <span className="block text-xs font-medium uppercase tracking-wider text-[#556070] mb-1">
                  {fact.label}
                </span>
                <span className="block font-serif font-bold text-base text-[#1E2A3A]">
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Overview & Highlights Section */}
      <section className="py-14 sm:py-16 border-b border-[#E2D9C8]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Overview (7 cols) */}
            <div className="lg:col-span-7">
              <h2 className="font-serif font-bold text-2xl text-[#1E2A3A] mb-4">
                Program overview
              </h2>
              <div className="space-y-4 text-base text-[#556070] leading-relaxed">
                {program.overview.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Highlights Checklist (5 cols) */}
            <div className="lg:col-span-5">
              <div className="warm-card p-6 sm:p-7 bg-[#F3ECE0]/60">
                <h3 className="font-serif font-bold text-lg text-[#1E2A3A] mb-4">
                  Key highlights
                </h3>
                <ul className="space-y-3">
                  {program.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#1E2A3A]">
                      <div className="w-5 h-5 rounded-[999px] bg-[#E0F0E8] text-[#1F5F4A] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="leading-snug">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. How It Works (Numbered steps) */}
      <section className="py-14 sm:py-16 border-b border-[#E2D9C8] bg-white">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <h2 className="font-serif font-bold text-2xl text-[#1E2A3A] mb-2">
              Application & enrollment process
            </h2>
            <p className="text-sm text-[#556070]">
              From first question to finalized student participation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {program.steps.map((st, idx) => (
              <div key={idx} className="p-5 rounded-[10px] bg-[#FBF7F0] border border-[#E2D9C8]">
                <div className="w-8 h-8 rounded-[999px] bg-white border border-[#E2D9C8] text-[#1E2A3A] font-serif font-bold text-xs flex items-center justify-center mb-3">
                  0{idx + 1}
                </div>
                <h3 className="font-serif font-bold text-sm text-[#1E2A3A] mb-1.5">
                  {st.title}
                </h3>
                <p className="text-xs text-[#556070] leading-relaxed">
                  {st.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Photo Gallery (Mosaic: 1 large + 2 small) with Lightbox */}
      <section className="py-14 sm:py-16 border-b border-[#E2D9C8]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h2 className="font-serif font-bold text-2xl text-[#1E2A3A] mb-2">
              Photo gallery
            </h2>
            <p className="text-sm text-[#556070]">
              Scenes from past workshops, rehearsals, and orientation sessions. Click to enlarge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Large 1st Image (7 cols) */}
            <div className="md:col-span-7 cursor-pointer group">
              <ImageWithFallback
                src={program.gallery[0]?.src}
                fallbackImage={fallbackSet.g1}
                programName={program.name}
                alt={program.gallery[0]?.alt}
                onClick={() => setLightboxImage(program.gallery[0])}
                className="w-full h-[320px] sm:h-[380px] object-cover rounded-[10px] border border-[#E2D9C8] transition-transform group-hover:scale-[1.01]"
                aspectRatio="16/10"
              />
            </div>

            {/* 2 Smaller Images (5 cols, stacked) */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="flex-1 cursor-pointer group">
                <ImageWithFallback
                  src={program.gallery[1]?.src}
                  fallbackImage={fallbackSet.g2}
                  programName={program.name}
                  alt={program.gallery[1]?.alt}
                  onClick={() => setLightboxImage(program.gallery[1])}
                  className="w-full h-[152px] sm:h-[182px] object-cover rounded-[10px] border border-[#E2D9C8] transition-transform group-hover:scale-[1.01]"
                  aspectRatio="16/10"
                />
              </div>
              <div className="flex-1 cursor-pointer group">
                <ImageWithFallback
                  src={program.gallery[2]?.src}
                  fallbackImage={fallbackSet.g3}
                  programName={program.name}
                  alt={program.gallery[2]?.alt}
                  onClick={() => setLightboxImage(program.gallery[2])}
                  className="w-full h-[152px] sm:h-[182px] object-cover rounded-[10px] border border-[#E2D9C8] transition-transform group-hover:scale-[1.01]"
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
            className="relative max-w-4xl w-full bg-white rounded-[10px] p-2 overflow-hidden"
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
              className="w-full max-h-[80vh] object-contain rounded-[8px]"
              aspectRatio="auto"
            />
            {lightboxImage.alt && (
              <p className="text-xs text-[#556070] text-center pt-2 px-2">
                {lightboxImage.alt}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 7. FAQ Accessible Accordion (One open at a time) */}
      <section className="py-14 sm:py-16 border-b border-[#E2D9C8] bg-white">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="font-serif font-bold text-2xl text-[#1E2A3A] mb-2">
              Frequently asked questions
            </h2>
            <p className="text-sm text-[#556070]">
              Common answers for parents, school heads, and student applicants.
            </p>
          </div>

          <div className="divide-y divide-[#E2D9C8] border-y border-[#E2D9C8]">
            {program.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 group"
                  >
                    <span className="font-serif font-semibold text-base text-[#1E2A3A] group-hover:text-[#1F5F4A] transition-colors">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#556070] flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#1F5F4A]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pt-3 pb-1 text-sm text-[#556070] leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Bottom CTA Band in Program Tint (Solid, not gradient) */}
      <section
        className="py-12 px-4 sm:px-6 text-white text-center"
        style={{ backgroundColor: program.tint }}
      >
        <div className="max-w-[700px] mx-auto">
          <h2 className="font-serif font-bold text-2xl text-white mb-2">
            Still have questions about this program?
          </h2>
          <p className="text-sm text-white/90 mb-6 max-w-[500px] mx-auto leading-relaxed">
            Send an inquiry directly to the {program.name} coordinating team. We reply within 24–48 hours.
          </p>
          <button
            onClick={handleInquireClick}
            className="px-6 py-3 rounded-[8px] bg-white text-[#1E2A3A] font-semibold text-sm hover:bg-[#F3ECE0] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
          >
            Inquire about {program.name}
          </button>
        </div>
      </section>

      {/* 9. Other Programs Row (3 remaining cards with lift + zoom) */}
      <section className="py-16 sm:py-20 border-b border-[#E2D9C8] bg-[#FBF7F0]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <h2 className="font-serif font-bold text-2xl text-[#1E2A3A] mb-2">
              Other programs we support
            </h2>
            <p className="text-sm text-[#556070]">
              Explore additional educational pathways, concerts, and institutional collaborations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherPrograms.map((other, idx) => {
              const otherFallback = PHOTO_FALLBACKS[other.slug]?.card;
              return (
                <div
                  key={idx}
                  onClick={() => onNavigate(`/programs/${other.slug}`)}
                  className={`warm-card rounded-[10px] overflow-hidden border-t-4 ${other.topBorder} cursor-pointer group transition-transform hover:-translate-y-1 bg-white`}
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#F3ECE0]">
                    <ImageWithFallback
                      src={other.cardImage}
                      fallbackImage={otherFallback}
                      programName={other.name}
                      alt={other.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <span
                      className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-[999px] mb-2.5"
                      style={{ backgroundColor: other.tintBg, color: other.tint }}
                    >
                      {other.category}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#1E2A3A] mb-2 group-hover:text-[#1F5F4A] transition-colors">
                      {other.name}
                    </h3>
                    <p className="text-xs text-[#556070] line-clamp-2 mb-3 leading-relaxed">
                      {other.description || other.tagline}
                    </p>
                    <span className="text-xs font-semibold text-[#1F5F4A] group-hover:underline inline-flex items-center gap-1">
                      View details &rarr;
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
