import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const Header = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const images = [
    assets.header,
    assets.header2,
    assets.header3,
    assets.header4,
    assets.header5,
  ];

  const words = ["Food", "Dinner", "Snacks", "Meals"];

  // Change images every 1500ms without delay (immediate start)
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1500);

    return () => clearInterval(imageInterval);
  }, [images.length]);

  // Change words every 1500ms without delay (immediate start)
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 1500);

    return () => clearInterval(wordInterval);
  }, [words.length]);

  return (
    <div>
      <div className="bg-orange-600 md:h-[80vh] rounded-lg mt-5 flex flex-col md:flex-row justify-between items-center shadow-lg shadow-zinc-500">
        {/* Left Side */}
        <div className="px-6 py-10 max-md:py-10 relative md:w-[50%] flex flex-col items-center">
          <p className="text-4xl sm:text-5xl md:text-3xl lg:text-5xl font-semibold text-zinc-100">
            Desire{" "}
            <span
              className={`bg-[#4C281A] text-orange-300 px-6 py-1 text-2xl sm:text-3xl md:text-2xl lg:text-3xl rounded-full md:ml-2 -rotate-12 inline-block shadow-sm shadow-zinc-300 transition-all duration-500 transform ${
                currentWordIndex % 2 === 0 ? "scale-0 opacity-0" : "scale-100 opacity-100"
              }`}
            >
              {words[currentWordIndex]}
            </span>
          </p>
          <p className="text-4xl sm:text-5xl md:text-3xl lg:text-5xl font-semibold text-zinc-100 mt-3">
            for Your Taste
          </p>
          <p className="mt-5 text-zinc-300 text-sm font-normal text-center">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto
            laborum consectetur culpa aliquam quasi enim aperiam! Laudantium,
            tempore, ducimus officia non aut illo nisi nesciunt
          </p>
          <button className="px-8 py-2 bg-zinc-200 text-orange-500 mt-5 rounded-full text-md font-semibold shadow-md shadow-zinc-800">
            Order Now
          </button>
        </div>

        {/* Right Side (Image) */}
        <div className="overflow-hidden flex sm:w-[70%] md:w-[45%] lg:w-[40%] items-center justify-center relative">
          <img
            src={images[currentImageIndex]}
            alt="Header Image"
            className={`transition-all duration-1000 ease-in-out transform ${
              currentImageIndex % 2 === 0 ? "scale-0 opacity-0" : "scale-100 opacity-100"
            } sm:w-[26rem] lg:w-[30rem]`}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
