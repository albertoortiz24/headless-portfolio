"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TechCard = ({ tech, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        delay: index * 0.05,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
        }
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="group bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-yellow-400/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/10"
    >
      <div className="relative w-12 h-12 mb-3 mx-auto">
        {tech.icon && (
          <FontAwesomeIcon 
            icon={tech.icon} 
            className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform"
          />
        )}
      </div>
      <h4 className="text-white font-bold text-center">{tech.name}</h4>
    </div>
  );
};

export default TechCard;