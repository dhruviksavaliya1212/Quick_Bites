import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const Header = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = [
    assets.header,
    assets.header2,
    assets.header3,
    assets.header4,
    assets.header5,
  ];

  const spanTexts = [
    "for Your Taste",
    "for Great Flavors",
    "for Your Cravings",
    "for Unique Delights",
    "for Best Experience",
  ];

  // Function to handle synchronized transitions for images and words
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      // Wait for the transition effect to complete
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 1000); // Matches the CSS transition duration
    }, 3000); // Total display duration for each image/word

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div>
      <div className="bg-orange-600 md:h-[80vh] rounded-lg mt-5 flex flex-col md:flex-row justify-between items-center shadow-lg shadow-zinc-500">
        {/* Left Side */}
        <div className="px-6 py-10 max-md:py-10 relative md:w-[50%] flex flex-col items-center">
          <p className="text-4xl sm:text-5xl md:text-3xl lg:text-5xl font-semibold text-zinc-100">
            Desire{" "}
            <span
              className={`bg-[#4C281A] text-orange-300 px-6 py-1 text-2xl sm:text-3xl md:text-2xl lg:text-3xl rounded-full md:ml-2 -rotate-12 inline-block shadow-sm shadow-zinc-300 transition-all duration-1000 transform ${
                isTransitioning ? "scale-0 opacity-0" : "scale-100 opacity-100"
              }`}
            >
              {words[currentIndex % words.length]}
            </span>
          </p>
          <p className="mt-5 text-zinc-300 text-sm font-normal text-center">
          Satisfy your hunger with flavors that excite your taste buds and warm your heart.Taste the magic, feel the love, and make every meal a memory worth savoring."Explore a world of taste that’s bold, exciting, and utterly irresistible."
          </p>
          <button className="px-8 py-2 bg-zinc-200 text-orange-500 mt-5 rounded-full text-md font-semibold shadow-md shadow-zinc-800">
            Order Now
          </button>
        </div>

        {/* Right Side (Image with Slide-In Effect) */}
        <div className="overflow-hidden flex sm:w-[70%] md:w-[45%] lg:w-[40%] items-center justify-center relative">
          <img
            src={images[currentIndex]}
            alt="Header Image"
            className={`transition-all duration-1000 ease-in-out transform ${
              isTransitioning ? "opacity-0 scale-90" : "opacity-100 scale-100"
            } sm:w-[26rem] lg:w-[30rem]`}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
