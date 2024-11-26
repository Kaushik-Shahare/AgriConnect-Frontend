import React, { useState, useEffect } from "react";

const Carousel = () => {
  const images = ["/images/home-banner.jpg", "/images/home-banner2.jpeg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  // Automatically rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const goToPrevious = () => {
    setIsSliding(true);
    setTimeout(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
      setIsSliding(false);
    }, 500); // Match duration to transition time
  };

  const goToNext = () => {
    setIsSliding(true);
    setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
      setIsSliding(false);
    }, 500); // Match duration to transition time
  };

  return (
    <div className="relative flex flex-col items-center gap-4 border border-black rounded-lg shadow-lg h-60 w-full overflow-hidden">
      {/* Image display with animation */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
              index === activeIndex
                ? "translate-x-0"
                : index > activeIndex
                ? "translate-x-full"
                : "-translate-x-full"
            }`}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded-full"
        onClick={goToPrevious}
      >
        ‹
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded-full"
        onClick={goToNext}
      >
        ›
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 flex gap-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === activeIndex ? "bg-gray-800" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
