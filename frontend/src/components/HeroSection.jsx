import React from 'react';

export const HeroSection = ({ onScrollToForm }) => {
  const handleScrollToPrograms = () => {
    const el = document.getElementById('programs');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-14 pb-14 sm:pt-20 sm:pb-20 border-b border-[#E2D9C8]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D9552B] mb-3">
              Scholarships · Concerts · Admissions
            </p>

            <h1 className="font-serif font-bold text-[#1E2A3A] mb-6 tracking-tight text-balance">
              Questions about scholarships, concerts or admissions? Ask us here.
            </h1>

            <p className="text-base sm:text-lg text-[#556070] mb-8 leading-relaxed max-w-[580px]">
              Parents, students and schools can send one inquiry and our team will reply by email or phone.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onScrollToForm}
                className="btn-primary"
              >
                Send an inquiry
              </button>

              <button
                onClick={handleScrollToPrograms}
                className="btn-secondary"
              >
                See our programs
              </button>
            </div>
          </div>

          {/* Right Column (5 cols) with 12px offset line border */}
          <div className="lg:col-span-5">
            <div className="relative max-w-[460px] mx-auto lg:max-w-none">
              {/* 2px --line outline shifted 12px behind */}
              <div 
                className="absolute inset-0 translate-x-3 translate-y-3 rounded-[10px] border-2 border-[#E2D9C8] pointer-events-none"
                aria-hidden="true"
              />
              
              {/* Main Real Photo */}
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=80"
                alt="Students collaborating in an educational classroom"
                className="relative z-10 w-full h-[360px] sm:h-[400px] object-cover rounded-[10px] border border-[#E2D9C8] bg-[#F3ECE0]"
                loading="eager"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
