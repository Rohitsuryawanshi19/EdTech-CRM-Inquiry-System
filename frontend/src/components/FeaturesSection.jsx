import React from 'react';

const PROGRAMS = [
  {
    category: 'Scholarship',
    slug: 'talent-scholarship',
    tint: '#E8A317',
    tintBg: '#FFF8E6',
    topBorder: 'border-t-[#E8A317]',
    title: 'National Talent Scholarship',
    description: 'Need and merit-based financial aid for promising students in academics, STEM, and creative arts.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'Concert',
    slug: 'annual-hunar-concert',
    tint: '#D9552B',
    tintBg: '#FDF2EE',
    topBorder: 'border-t-[#D9552B]',
    title: 'Annual Inter-School Concert',
    description: 'Stage opportunities and musical competitions uniting schools, youth bands, and choir ensembles nationwide.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'Admission',
    slug: 'curriculum-admissions',
    tint: '#1F5F4A',
    tintBg: '#EAF4EF',
    topBorder: 'border-t-[#1F5F4A]',
    title: 'Curriculum & Program Admissions',
    description: 'Admissions guidance, seat availability queries, and counseling for our integrated K-12 learning modules.',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'School Hub',
    formCategory: 'General Query',
    slug: 'school-collaborations',
    tint: '#2F5D8A',
    tintBg: '#EEF4F9',
    topBorder: 'border-t-[#2F5D8A]',
    title: 'School Hub Partnerships',
    description: 'Institutional tie-ups, workshop hosting requests, and teacher enrichment programs for partner schools.',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  },
];

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

export const FeaturesSection = () => {
  const handleCardClick = (categoryName) => {
    const targetCategory = categoryName === 'School Hub' ? 'General Query' : categoryName;
    const url = new URL(window.location.href);
    url.searchParams.set('category', targetCategory);
    window.history.pushState({}, '', url);

    // Scroll to inquiry section
    const el = document.getElementById('inquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Trigger a custom event so InquiryForm syncs if already mounted
      window.dispatchEvent(new Event('categoryChange'));
    }
  };

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
              Select a program to learn more or send a direct question to the coordinating team.
            </p>
          </div>

          {/* 2x2 Grid (1-col on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROGRAMS.map((prog, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(prog.category)}
                className={`warm-card rounded-[10px] overflow-hidden border-t-4 ${prog.topBorder} cursor-pointer group transition-transform hover:-translate-y-0.5`}
              >
                {/* 16:10 Photo */}
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#F3ECE0]">
                  <img
                    src={prog.imageUrl}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Tint Tag */}
                  <span
                    className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-[999px] mb-3"
                    style={{ backgroundColor: prog.tintBg, color: prog.tint }}
                  >
                    {prog.category}
                  </span>

                  <h3 className="font-serif font-bold text-lg text-[#1E2A3A] mb-2 group-hover:text-[#1F5F4A] transition-colors">
                    {prog.title}
                  </h3>

                  <p className="text-sm text-[#556070] line-clamp-2 mb-4 leading-relaxed">
                    {prog.description}
                  </p>

                  <span className="text-sm font-semibold text-[#1F5F4A] group-hover:underline inline-flex items-center gap-1">
                    View details &rarr;
                  </span>
                </div>
              </div>
            ))}
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

          {/* 3 Steps connected with thin line */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Desktop connecting line */}
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
