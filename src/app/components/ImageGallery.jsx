"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const ImageGallery = ({ destacada, imagenes = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('next');
  const imageRef = useRef(null);
  
  const allImages = [destacada, ...(imagenes || []).filter(img => img)];
  
  // Auto-play cada 3 segundos
  useEffect(() => {
    if (allImages.length <= 1) return;
    
    const interval = setInterval(() => {
      if (!isAnimating) {
        setDirection('next');
        handleTransition('next');
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [allImages.length, isAnimating]);

  const handleTransition = (dir) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection(dir);
    
    // Pequeño delay para la animación
    setTimeout(() => {
      if (dir === 'next') {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
      }
      
      // Resetear animación después del cambio
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 300);
  };

  const nextSlide = () => {
    if (!isAnimating) {
      setDirection('next');
      handleTransition('next');
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setDirection('prev');
      handleTransition('prev');
    }
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setDirection(index > currentIndex ? 'next' : 'prev');
    
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 300);
  };

  if (!allImages.length) return null;

  return (
    <div className="space-y-4">
      {/* Imagen principal con carrusel */}
      <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden group">
        {/* Contenedor con efecto de deslizamiento */}
        <div 
          ref={imageRef}
          className="relative w-full h-full"
          style={{
            transform: `translateX(${isAnimating ? (direction === 'next' ? '-100%' : '100%') : '0'})`,
            transition: isAnimating ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        >
          <Image
            src={allImages[currentIndex]}
            alt={`Imagen ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Flechas de navegación */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed`}
              aria-label="Imagen anterior"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed`}
              aria-label="Imagen siguiente"
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5" />
            </button>
          </>
        )}
        
        {/* Indicadores de posición */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                disabled={isAnimating}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'w-8 bg-yellow-400' 
                    : 'w-2 bg-white/50 hover:bg-white/80 hover:scale-110'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={`Ir a imagen ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              disabled={isAnimating}
              className={`relative h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                idx === currentIndex 
                  ? 'ring-2 ring-yellow-400 scale-105 shadow-lg shadow-yellow-400/30' 
                  : 'opacity-60 hover:opacity-100 hover:scale-105'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
              aria-label={`Seleccionar imagen ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 20vw, 150px"
              />
              
              {/* Overlay en miniatura activa */}
              {idx === currentIndex && (
                <div className="absolute inset-0 bg-yellow-400/20 border-2 border-yellow-400 rounded-lg"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;