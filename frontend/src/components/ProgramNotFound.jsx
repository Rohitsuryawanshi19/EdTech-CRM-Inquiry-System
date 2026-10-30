import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

export const ProgramNotFound = ({ onNavigateHome }) => {
  useEffect(() => {
    document.title = 'Program Not Found | K12 Hunar';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="py-24 px-4 sm:px-6">
      <div className="max-w-[560px] mx-auto text-center warm-card p-10 bg-white">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#D9552B] mb-2 block">
          404 · Notice
        </span>
        <h1 className="font-serif font-bold text-3xl text-[#1E2A3A] mb-4">
          Program not found
        </h1>
        <p className="text-sm text-[#556070] mb-8 leading-relaxed">
          The program page you requested does not exist or may have been updated. You can review all active education and admissions initiatives on our home directory.
        </p>
        <button
          onClick={onNavigateHome}
          className="btn-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to programs</span>
        </button>
      </div>
    </div>
  );
};

export default ProgramNotFound;
