import React from 'react';

const HeroBanner = () => {
  return (
    <div
      className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('https://incredibleindia.org/content/dam/incredible-india-v2/hero-desktop/desktopBannerv2.jpg')` }}
      aria-label="Incredible India Hero Banner"
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-white font-extrabold text-4xl md:text-6xl drop-shadow-lg leading-tight">
          Discover Incredible India
        </h1>
        <p className="mt-6 text-lg md:text-2xl text-white max-w-xl mx-auto drop-shadow-md">
          Land of rich culture, heritage and vibrant experiences waiting to be explored.
        </p>
      </div>
    </div>
  );
};

export default HeroBanner;
