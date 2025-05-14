import React, { useState, useEffect } from "react";

const Carousel = () => {
  // const images = ["/images/home-banner.jpg", "/images/home-banner2.jpeg"];
  const images = [
    "/images/home-banner.jpg",
    "/images/home-banner.jpg",
    "/images/home-banner.jpg",
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  // Automatically rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const goToPrevious = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative flex items-center justify-center h-60 md:h-80 w-full overflow-hidden border border-gray-300 rounded-lg shadow-lg bg-gray-100">
      {/* Image Display */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out \
              ${index === activeIndex ? "opacity-100 z-10 scale-105 animate-carousel-in" : "opacity-0 z-0 scale-95"}`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover rounded-lg shadow-xl transition-transform duration-700"
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-125 hover:shadow-blue-400/50 border-2 border-white/20"
        aria-label="Previous Slide"
      >
        ‹
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-125 hover:shadow-blue-400/50 border-2 border-white/20"
        aria-label="Next Slide"
      >
        ›
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 flex gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex ? "bg-blue-600 scale-125" : "bg-gray-400"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
