"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const TechCarousel = ({ tecnologias }) => {
  const carouselRef = useRef(null);

  useEffect(() => {
    if (!carouselRef.current || tecnologias.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.to(carouselRef.current, {
        x: -((tecnologias.length * 120) + (tecnologias.length * 16)),
        duration: 30,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (x) => {
            const value = parseFloat(x);
            if (value <= -((tecnologias.length * 120) + (tecnologias.length * 16))) {
              return "0px";
            }
            return `${value}px`;
          }
        }
      });
    });

    return () => ctx.revert();
  }, [tecnologias]);

  if (tecnologias.length === 0) return null;

  return (
    <div className="relative overflow-hidden py-8">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
      
      <div 
        ref={carouselRef}
        className="flex gap-4"
        style={{ width: 'fit-content' }}
      >
        {[...tecnologias, ...tecnologias, ...tecnologias].map((tec, index) => (
          <div
            key={`${tec}-${index}`}
            className="flex-shrink-0 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20"
          >
            <span className="text-white font-medium">{tec}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechCarousel;