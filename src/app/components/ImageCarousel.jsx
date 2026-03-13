"use client";

import { useState, useEffect, useCallback, memo, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

const images = [
  {
    id: 1,
    url: "https://greenyellow-vulture-916371.hostingersite.com/wp-content/uploads/2026/03/back-view-woman-lokking-laptop-mock-up-scaled.jpg",
    title: "Desarrollo Web",
    description: "Aplicaciones modernas y escalables"
  },
  {
    id: 2,
    url: "https://greenyellow-vulture-916371.hostingersite.com/wp-content/uploads/2026/03/Diseno-sin-titulo-scaled.png",
    title: "UI/UX Design",
    description: "Interfaces intuitivas y atractivas"
  },
  {
    id: 3,
    url: "https://greenyellow-vulture-916371.hostingersite.com/wp-content/uploads/2026/03/Diseno-sin-titulo-6-scaled.png",
    title: "Mobile First",
    description: "Diseño responsive para todos los dispositivos"
  },
  {
    id: 4,
    url: "https://greenyellow-vulture-916371.hostingersite.com/wp-content/uploads/2026/03/Diseno-sin-titulo-7-scaled.png",
    title: "Optimización SEO",
    description: "Mejor posicionamiento en buscadores"
  }
];

const ImageCarousel = memo(function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const slideRefs = useRef([]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    // Animación de entrada del carrusel
    gsap.fromTo(carouselRef.current,
      { 
        opacity: 0,
        scale: 0.9,
        rotationY: 30
      },
      { 
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 1.5,
        ease: "power3.out"
      }
    );

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  useEffect(() => {
    // Animación cuando cambia el slide
    gsap.fromTo(slideRefs.current[currentIndex],
      { 
        opacity: 0.5,
        scale: 0.95
      },
      { 
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      }
    );
  }, [currentIndex]);

  return (
    <div 
      ref={carouselRef}
      className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl group"
      style={{ perspective: '1000px' }}
    >
      {/* Contenedor del carrusel horizontal */}
      <div 
        className="relative w-full h-full flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((image, index) => (
          <div 
            key={image.id}
            ref={el => slideRefs.current[index] = el}
            className="relative w-full h-full flex-shrink-0"
          >
            <div className="relative w-full h-full">
              <Image
                src={image.url}
                alt={image.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Texto con animación */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full transition-transform duration-500 group-hover:translate-y-0">
                <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                <p className="text-gray-200">{image.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Botones de navegación con animación hover */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-30"
        aria-label="Anterior"
        onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.2, duration: 0.3 })}
        onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-30"
        aria-label="Siguiente"
        onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.2, duration: 0.3 })}
        onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Indicadores con animación */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 h-2 bg-yellow-400 rounded-full' 
                : 'w-2 h-2 bg-white/50 hover:bg-white/80 rounded-full hover:scale-125'
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});

export default ImageCarousel;