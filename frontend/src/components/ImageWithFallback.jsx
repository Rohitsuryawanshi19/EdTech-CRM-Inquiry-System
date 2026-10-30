import React, { useState } from 'react';

/**
 * ImageWithFallback — Displays local image path or gracefully displays
 * a neutral --paper-2 background block with program name on error (zero broken icons).
 */
export const ImageWithFallback = ({
  src,
  alt = '',
  programName = '',
  className = '',
  aspectRatio = '16/10',
  width = 800,
  height = 500,
  fallbackImage = '',
  onClick,
}) => {
  const [hasError, setHasError] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);

  const handleError = () => {
    if (fallbackImage && !triedFallback) {
      setTriedFallback(true);
    } else {
      setHasError(true);
    }
  };

  const imageSource = triedFallback ? fallbackImage : (src || fallbackImage);

  if (hasError || !imageSource) {
    return (
      <div
        className={`w-full bg-[#F3ECE0] border border-[#E2D9C8] flex flex-col items-center justify-center text-center p-6 select-none ${className}`}
        style={{ aspectRatio }}
      >
        <div className="w-10 h-10 rounded-full bg-[#E2D9C8] text-[#556070] flex items-center justify-center font-serif text-sm font-bold mb-2">
          {programName ? programName.charAt(0) : 'K'}
        </div>
        <p className="font-serif font-bold text-sm text-[#1E2A3A] mb-1">
          {programName || 'K12 Hunar Program'}
        </p>
        <span className="text-xs text-[#556070]">Official Program Documentation</span>
      </div>
    );
  }

  return (
    <img
      src={imageSource}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      onError={handleError}
      onClick={onClick}
      className={className}
      style={{ aspectRatio }}
    />
  );
};

export default ImageWithFallback;
