"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const categories = [
  {
    title: "Fashion",
    href: "/categories/fashion",
    image: "/clothes.jpg",
  },
  {
    title: "Home & Living",
    href: "/categories/home-living",
    image: "/utensils.jpg",
  },
  {
    title: "Beauty & Health",
    href: "/categories/beauty-health",
    image: "/beauty.jpg",
  },
  {
    title: "Sports & Outdoors",
    href: "/categories/sports-outdoors",
    image: "/sports.jpg",
  },
  {
    title: "Electronics",
    href: "/categories/electronics",
    image: "/electronics.jpg",
  },
];

const CategoryCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const router = useRouter();

  const nextSlide = () => {
    setProgress(0);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
  };

  const prevSlide = () => {
    setProgress(0);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? categories.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleCategory = (category, e) => {
    e.preventDefault();
    console.log(category);
    router.push(`/search?q=${encodeURIComponent(category)}`);
  };

  return (
    <div className="flex-col mt-8 p-4 bg-green-100 rounded-lg shadow-sm">
      <h3 className="px-4 text-2xl font-semibold text-gray-800 mb-4">
        Recommended to you
      </h3>

      <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-800 p-3 rounded-full z-10 hover:bg-opacity-100 shadow-md transition-all"
        >
          &#10094;
        </button>

        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {categories.map((category, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 flex flex-col items-center justify-center p-4"
              onClick={(e) => handleCategory(category.title, e)}
            >
              <div className="relative w-full h-64 overflow-hidden rounded-lg shadow-md">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-30 transition-all"></div>
              </div>

              <a
                href={category.href}
                className="mt-4 text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                {category.title}
              </a>
            </div>
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-800 p-3 rounded-full z-10 hover:bg-opacity-100 shadow-md transition-all"
        >
          &#10095;
        </button>
      </div>

      <div className="relative w-20 h-1 mx-auto mt-3 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-50 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CategoryCarousel;
