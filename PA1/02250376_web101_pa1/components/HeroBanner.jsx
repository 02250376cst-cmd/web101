"use client";
import { useState, useEffect } from "react";

// HeroBanner - auto-rotating promotional banner like Amazon's hero carousel
const slides = [
  { id: 1, bg: "bg-blue-100", text: "Big Spring Sale", sub: "Save on thousands of items", cta: "Shop now" },
  { id: 2, bg: "bg-yellow-100", text: "New Arrivals in Electronics", sub: "Latest gadgets at great prices", cta: "Explore" },
  { id: 3, bg: "bg-green-100", text: "Free Delivery on Orders", sub: "For Prime members every day", cta: "Try Prime" },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  // Auto-advance the slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer); // cleanup on unmount
  }, []);

  const slide = slides[current];

  return (
    <div className={`relative ${slide.bg} h-64 md:h-80 flex items-center justify-center text-center transition-all duration-500`}>
      <div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">{slide.text}</h1>
        <p className="text-gray-600 mt-2 text-lg">{slide.sub}</p>
        <button className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded-full">
          {slide.cta}
        </button>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full ${i === current ? "bg-gray-800" : "bg-gray-400"}`}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}
        className="absolute left-4 text-2xl bg-white bg-opacity-60 rounded-full px-2 hover:bg-opacity-90"
      >
        ‹
      </button>
      <button
        onClick={() => setCurrent((current + 1) % slides.length)}
        className="absolute right-4 text-2xl bg-white bg-opacity-60 rounded-full px-2 hover:bg-opacity-90"
      >
        ›
      </button>
    </div>
  );
}