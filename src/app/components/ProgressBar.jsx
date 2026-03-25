"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const getGradientStyle = (colorClass) => {
  const colorMap = {
    'from-cyan-400 to-blue-500': 'linear-gradient(to right, #22d3ee, #3b82f6)',
    'from-green-400 to-emerald-500': 'linear-gradient(to right, #4ade80, #10b981)',
    'from-gray-600 to-gray-800': 'linear-gradient(to right, #4b5563, #1f2937)',
    'from-blue-500 to-indigo-600': 'linear-gradient(to right, #3b82f6, #4f46e5)',
    'from-orange-500 to-red-500': 'linear-gradient(to right, #f97316, #ef4444)',
    'from-yellow-400 to-orange-500': 'linear-gradient(to right, #facc15, #f97316)',
    'from-purple-400 to-pink-500': 'linear-gradient(to right, #c084fc, #ec489a)',
    'from-indigo-500 to-purple-600': 'linear-gradient(to right, #6366f1, #9333ea)',
    'from-green-500 to-emerald-600': 'linear-gradient(to right, #22c55e, #059669)',
    'from-blue-400 to-indigo-500': 'linear-gradient(to right, #60a5fa, #6366f1)',
    'from-gray-500 to-gray-700': 'linear-gradient(to right, #6b7280, #374151)',
  };
  
  return colorMap[colorClass] || 'linear-gradient(to right, #fbbf24, #eab308)';
};
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
          className="h-full rounded-full transition-all duration-1000 ease-out"
  style={{
    width: `${width}%`,
    backgroundImage: getGradientStyle(color)
  }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;