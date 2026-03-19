"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';

const ProyectosSimilares = ({ proyectos }) => {
  const cardsRef = useRef([]);

  useEffect(() => {
    if (proyectos.length === 0) return;

    gsap.fromTo(cardsRef.current,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardsRef.current[0],
          start: 'top 80%',
        }
      }
    );
  }, [proyectos]);

  if (proyectos.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {proyectos.map((proyecto, index) => (
        <Link
          key={proyecto.id}
          href={`/proyectos/${proyecto.slug}`}
          ref={el => cardsRef.current[index] = el}
          className="group bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-yellow-400/50 transition-all hover:scale-105 hover:shadow-xl"
        >
          <div className="relative h-40 overflow-hidden">
            {proyecto.imagen_destacada ? (
              <Image
                src={proyecto.imagen_destacada}
                alt={proyecto.titulo}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
            )}
          </div>
          <div className="p-3">
            <h4 className="text-white font-bold text-sm line-clamp-1">{proyecto.titulo}</h4>
            <p className="text-gray-400 text-xs line-clamp-2 mt-1">{proyecto.descripcion_corta}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProyectosSimilares;