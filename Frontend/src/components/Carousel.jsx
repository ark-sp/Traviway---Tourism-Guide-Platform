import { useState, useEffect, useCallback } from "react";

const Carousel = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const mockImages = [
      '/images/homepage1.jpg', // Make sure these files exist in public/images
      '/images/homepage2.jpg',
      '/images/homepage3.jpg'
    ];
    setImages(mockImages);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(goToNext, 3000);
    return () => clearInterval(interval);
  }, [goToNext, images.length]);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-xl mb-8" style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Adjusted aspect ratio to lower height */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)`, height: "300px" }}
      >
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Slide ${idx + 1}`}
            className="w-full object-cover flex-shrink-0"
            style={{ height: "300px" }}
          />
        ))}
      </div>

      {/* Navigation Buttons - smaller */}
      <button
        onClick={goToPrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gradient-to-r from-gray-800 to-gray-900 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity focus:outline-none"
        aria-label="Previous Slide"
        style={{ fontSize: "0.6rem", minWidth: "18px", minHeight: "18px" }}
      >
        &#10094;
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gradient-to-r from-gray-800 to-gray-900 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity focus:outline-none"
        aria-label="Next Slide"
        style={{ fontSize: "0.6rem", minWidth: "18px", minHeight: "18px" }}
      >
        &#10095;
      </button>

      {/* Dots - smaller size and customized colors */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
          style={{ fontSize: "0.4rem" }}
      >
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-4 h-1 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full focus:outline-none ${
              currentIndex === idx ? 'bg-blue-600' : 'bg-gray-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
            style={{ transition: "background-color 0.3s "}}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
