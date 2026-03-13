"use client";

import { memo, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

// Componente de contador animado
const AnimatedCounter = ({ target, suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            
            // Animación del contador con GSAP
            const obj = { value: 0 };
            gsap.to(obj, {
              value: target,
              duration: duration,
              ease: "power2.out",
              onUpdate: () => {
                setCount(Math.floor(obj.value));
              }
            });
          }
        });
      },
      { threshold: 0.5 } // Se activa cuando el 50% del elemento es visible
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={counterRef} className="text-2xl font-bold text-yellow-300">
      {count}{suffix}
    </span>
  );
};

const HeroContent = memo(function HeroContent() {
  const contentRef = useRef(null);
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Crear timeline para los elementos internos
    const tl = gsap.timeline();

    // Subtítulo
    tl.fromTo(subtitleRef.current,
      { 
        opacity: 0,
        y: 30,
        rotateX: -15
      },
      { 
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        ease: "power3.out"
      }
    );

    // Título
    tl.fromTo(titleRef.current,
      { 
        opacity: 0,
        scale: 0.8,
        y: 50
      },
      { 
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)"
      },
      "-=0.4"
    );

    // Descripción
    tl.fromTo(descriptionRef.current,
      { 
        opacity: 0,
        x: -30
      },
      { 
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out"
      },
      "-=0.6"
    );

    // Botones
    tl.fromTo(buttonsRef.current,
      { 
        opacity: 0,
        scale: 0.5,
        y: 40
      },
      { 
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      },
      "-=0.4"
    );

    // Estadísticas (solo la entrada, los números se animan con el contador)
    tl.fromTo(statsRef.current,
      { 
        opacity: 0,
        y: 30
      },
      { 
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      },
      "-=0.3"
    );

    // Animación hover para los botones
    const buttons = buttonsRef.current.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        });
      });
      
      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={contentRef} className="text-white space-y-4 md:space-y-6">
      {/* Subtítulo */}
      <span 
        ref={subtitleRef}
        className="inline-block text-yellow-300 font-semibold text-base md:text-lg tracking-wider uppercase"
      >
        ✦ Desarrollador Web Freelance
      </span>
      
      {/* Título principal */}
      <h1 
        ref={titleRef}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
      >
        Creando experiencias
        <span className="block text-yellow-300">digitales únicas</span>
      </h1>
      
      {/* Descripción */}
      <p 
        ref={descriptionRef}
        className="text-base md:text-lg text-gray-300 max-w-lg leading-relaxed"
      >
        Transformo ideas en aplicaciones web modernas y escalables 
        utilizando las tecnologías más avanzadas del mercado.
      </p>
      
      {/* Botones */}
      <div 
        ref={buttonsRef}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4"
      >
        <button className="group bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all shadow-lg flex items-center justify-center">
          Ver proyectos
          <FontAwesomeIcon icon={faArrowRight} className="ml-2 group-hover:translate-x-2 transition-transform" />
        </button>
        
        <button className="border-2 border-white/30 hover:border-white/50 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all backdrop-blur-sm hover:bg-white/10">
          Cotizar proyecto
        </button>
      </div>
      
      {/* Estadísticas con contador animado */}
      <div 
        ref={statsRef}
        className="grid grid-cols-3 gap-4 pt-6 sm:pt-8"
      >
        <div className="text-center sm:text-left hover:scale-110 transition-transform duration-300">
          <div className="text-2xl sm:text-3xl font-bold text-yellow-300">
            <AnimatedCounter target={50} suffix="+" duration={5} />
          </div>
          <div className="text-xs sm:text-sm text-gray-400">Proyectos Completados</div>
        </div>
        
        <div className="text-center sm:text-left hover:scale-110 transition-transform duration-300">
          <div className="text-2xl sm:text-3xl font-bold text-yellow-300">
            <AnimatedCounter target={30} suffix="+" duration={5} />
          </div>
          <div className="text-xs sm:text-sm text-gray-400">Clientes Satisfechos</div>
        </div>
        
        <div className="text-center sm:text-left hover:scale-110 transition-transform duration-300">
          <div className="text-2xl sm:text-3xl font-bold text-yellow-300">
            <AnimatedCounter target={5} suffix=" años" duration={5} />
          </div>
          <div className="text-xs sm:text-sm text-gray-400">Experiencia</div>
        </div>
      </div>
    </div>
  );
});

export default HeroContent;