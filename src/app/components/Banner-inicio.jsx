"use client";

import { memo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import HeroContent from './HeroContent';
import ImageCarousel from './ImageCarousel';

const BannerInicio = memo(function BannerInicio() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const carouselRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    // Timeline principal
    const tl = gsap.timeline();

    // Animación del fondo gradiente
    tl.fromTo(bgRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power2.inOut" }
    );

    // Animación del texto (columna izquierda)
    tl.fromTo(textRef.current,
      { 
        opacity: 0,
        x: -100,
        scale: 0.9
      },
      { 
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.2)"
      },
      "-=0.8" // Se solapa con la animación anterior
    );

    // Animación del carrusel (columna derecha)
    tl.fromTo(carouselRef.current,
      { 
        opacity: 0,
        x: 100,
        rotationY: 15,
        scale: 0.8
      },
      { 
        opacity: 1,
        x: 0,
        rotationY: 0,
        scale: 1,
        duration: 1.4,
        ease: "elastic.out(1, 0.5)"
      },
      "-=1"
    );

    // Animación de elementos flotantes (opcional)
    gsap.to('.floating-element', {
      y: 20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-hidden"
    >
      {/* Elementos flotantes decorativos */}
      <div ref={bgRef} className="absolute inset-0 overflow-hidden">
        <div className="floating-element absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl"></div>
        <div className="floating-element absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl" style={{ animationDelay: '1s' }}></div>
        <div className="floating-element absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full mt-20">
          
          {/* Columna Izquierda - Texto */}
          <div 
            ref={textRef}
            className="relative z-20 order-1 lg:order-1"
          >
            <HeroContent />
          </div>
          
          {/* Columna Derecha - Carrusel */}
          <div 
            ref={carouselRef}
            className="relative z-10 order-2 lg:order-2 h-[50vh] lg:h-[80vh] flex justify-end"
          >
            <div className="w-full lg:w-3/4 h-full">
              <ImageCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default BannerInicio;