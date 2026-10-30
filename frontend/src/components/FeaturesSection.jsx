import React from 'react';
import { programs } from '../data/programs';
import ImageWithFallback from './ImageWithFallback';

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
  return (
    <>
      {/* 1. Programs Section */}
      <section id="programs" className="py-16 sm:py-20 border-b border-[#E2D9C8]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          
          <div className="mb-12">
            <h2 className="font-serif font-bold text-3xl text-[#1E2A3A] mb-2">
              Programs we support
            </h2>
            <p className="text-sm sm:text-base text-[#556070]">
              Select a program to view full curriculum facts, key highlights, and application steps.
            </p>
          </div>

          {/* 2x2 Grid (1-col on mobile) with lift + zoom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((prog, index) => {
              const fallbackUrl = PHOTO_CARD_FALLBACKS[prog.slug];
              return (
                <div
                  key={index}
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate(`/programs/${prog.slug}`);
                    }
                  }}
                  className={`warm-card rounded-[10px] overflow-hidden border-t-4 ${prog.topBorder} cursor-pointer group transition-transform hover:-translate-y-1 bg-white`}
                >
                  {/* 16:10 Photo with smooth zoom */}
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#F3ECE0]">
                    <ImageWithFallback
                      src={prog.cardImage}
                      fallbackImage={fallbackUrl}
                      programName={prog.name}
                      alt={prog.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <span
                      className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-[999px] mb-3"
                      style={{ backgroundColor: prog.tintBg, color: prog.tint }}
                    >
                      {prog.category}
                    </span>

                    <h3 className="font-serif font-bold text-lg text-[#1E2A3A] mb-2 group-hover:text-[#1F5F4A] transition-colors">
                      {prog.name}
                    </h3>

                    <p className="text-sm text-[#556070] line-clamp-2 mb-4 leading-relaxed">
                      {prog.overview[0] || prog.tagline}
                    </p>

                    <span className="text-sm font-semibold text-[#1F5F4A] group-hover:underline inline-flex items-center gap-1">
                      View details &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 border-b border-[#E2D9C8] bg-[#F3ECE0]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
          
          <div className="mb-12">
            <h2 className="font-serif font-bold text-3xl text-[#1E2A3A] mb-2">
              How it works
            </h2>
            <p className="text-sm sm:text-base text-[#556070]">
              A straightforward process from inquiry submission to direct counselor follow-up.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              className="hidden md:block absolute top-6 left-12 right-12 h-[1px] bg-[#E2D9C8] -z-0" 
              aria-hidden="true"
            />

            {STEPS.map((item, idx) => (
              <div key={idx} className="relative z-10">
                <div className="w-12 h-12 rounded-[999px] bg-white border border-[#E2D9C8] text-[#1E2A3A] font-serif font-bold text-base flex items-center justify-center mb-4 shadow-[0_1px_2px_rgba(30,42,58,0.06)]">
                  {item.step}
                </div>
                <h3 className="font-serif font-bold text-base text-[#1E2A3A] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#556070] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default FeaturesSection;
