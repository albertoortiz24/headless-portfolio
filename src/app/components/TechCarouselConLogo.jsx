"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

const TechCarouselConLogos = ({ tecnologias = [] }) => {
  const carouselRef = useRef(null);
  const [duplicatedTechs, setDuplicatedTechs] = useState([]);

  useEffect(() => {
    if (!tecnologias || tecnologias.length === 0) return;

    // Duplicamos muchas veces para asegurar efecto infinito
    const duplicados = [
      ...tecnologias,
      ...tecnologias,
      ...tecnologias,
      ...tecnologias,
      ...tecnologias
    ];
    setDuplicatedTechs(duplicados);
  }, [tecnologias]);

  useEffect(() => {
    if (!carouselRef.current || duplicatedTechs.length === 0) return;

    const ctx = gsap.context(() => {
      // Calcular ancho de un conjunto completo
      const itemWidth = 200; // Ancho aproximado de cada tarjeta
      const gap = 32; // gap-8 = 32px
      const totalWidth = (itemWidth + gap) * tecnologias.length;

      // Animación infinita y continua
      gsap.to(carouselRef.current, {
        x: -totalWidth,
        duration: 25, // Velocidad constante
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (x) => {
            const value = parseFloat(x);
            // Cuando llegamos al final, reiniciamos instantáneamente
            if (value <= -totalWidth) {
              return "0px";
            }
            return `${value}px`;
          }
        }
      });
    }, carouselRef);

    return () => ctx.revert();
  }, [duplicatedTechs, tecnologias.length]);

  if (!tecnologias || tecnologias.length === 0) return null;

  return (
    <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden py-12 bg-gradient-to-r from-transparent via-transparent to-transparent">
      {/* Gradientes laterales más sutiles para mejor efecto */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-transparent to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-transparent via-transparent to-transparent z-10"></div>
      
      {/* Contenedor del carrusel */}
      <div className="relative overflow-hidden py-12">
        <div 
          ref={carouselRef}
          className="flex gap-8"
          style={{ 
            width: 'fit-content',
            willChange: 'transform'
          }}
        >
          {duplicatedTechs.map((tech, index) => (
            <div
              key={`${tech.nombre}-${index}`}
              className="flex-shrink-0 w-48 group cursor-pointer"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/10">
                {/* Logo */}
                <div className="relative w-full h-16 mb-4 flex items-center justify-center">
                  {tech.logo ? (
                    <Image
                      src={tech.logo}
                      alt={tech.nombre}
                      width={80}
                      height={80}
                      className="object-contain transition-all duration-300"
                      style={{
                        filter: 'brightness(0.9)',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {tech.nombre?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Nombre */}
                <p className="text-center text-white/90 font-medium group-hover:text-yellow-300 transition-colors">
                  {tech.nombre}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Indicador sutil de movimiento (opcional) */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-yellow-400/50 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default TechCarouselConLogos;