"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ProgressBar = ({ skill, percentage, color = "from-yellow-400 to-yellow-500", logo = "" }) => {
  const [width, setWidth] = useState(0);
  const barRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: barRef.current,
        start: 'top 80%',
        onEnter: () => {
          setWidth(percentage);
        }
      });
    }, barRef);

    return () => ctx.revert();
  }, [percentage]);

  return (
    <div ref={barRef} className="group bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-yellow-400/50 transition-all hover:scale-105">
      <div className="flex items-center gap-3 mb-3">
        {/* Logo de la tecnología */}
        {logo && (
          <div className="relative w-10 h-10 flex-shrink-0 bg-white/10 rounded-lg p-1.5">
            <Image
              src={logo}
              alt={skill}
              fill
              className="object-contain p-1"
            />
          </div>
        )}
        
        {/* Nombre y porcentaje */}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium group-hover:text-yellow-300 transition-colors">
              {skill}
            </span>
            <span className="text-yellow-400 text-sm font-semibold">{percentage}%</span>
          </div>
        </div>
      </div>
      
      {/* Barra de progreso */}
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;