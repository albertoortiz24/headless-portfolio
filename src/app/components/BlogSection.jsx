"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChevronDown, faCalendar, faTag } from '@fortawesome/free-solid-svg-icons';

gsap.registerPlugin(ScrollTrigger);

const BlogSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const accordionRef = useRef(null);
  const imageRef = useRef(null);
  const buttonRef = useRef(null);

  // Datos de ejemplo
  const posts = [
    {
      id: 1,
      titulo: "Cómo optimizar Core Web Vitals en WordPress",
      descripcion: "Aprende las mejores prácticas para mejorar los puntajes de Core Web Vitals en WordPress. Descubre técnicas de optimización de imágenes, caché, y renderizado crítico que pueden aumentar tu puntuación en un 40%.",
      categoria: "Optimización",
      fecha: "15 Marzo 2024",
      imagen: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 2,
      titulo: "Headless WordPress: Ventajas y Casos de Uso",
      descripcion: "Explora por qué cada vez más empresas están adoptando arquitecturas headless con WordPress. Ventajas en rendimiento, seguridad, y flexibilidad para desarrolladores frontend.",
      categoria: "Headless CMS",
      fecha: "10 Marzo 2024",
      imagen: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 3,
      titulo: "Next.js 15: Novedades y Mejoras de Rendimiento",
      descripcion: "Un análisis detallado de las nuevas características de Next.js 15, incluyendo mejoras en el compilador, optimizaciones de imágenes y nuevas APIs para desarrollo más eficiente.",
      categoria: "Next.js",
      fecha: "5 Marzo 2024",
      imagen: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    }
  ];

  // Animación inicial
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });

      tl.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      ).fromTo(accordionRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      ).fromTo(imageRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      ).fromTo(buttonRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '+=0.2'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animación de cambio de imagen
  const cambiarImagen = (index) => {
    if (isAnimating || index === activeIndex) return;
    
    setIsAnimating(true);
    
    gsap.to(imageRef.current, {
      opacity: 0,
      x: -30,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setActiveIndex(index);
        
        setTimeout(() => {
          gsap.fromTo(imageRef.current,
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', onComplete: () => {
              setIsAnimating(false);
            }}
          );
        }, 50);
      }
    });
  };

  // Manejar clic en acordeón
  const handleAccordionClick = (index) => {
    if (isAnimating) return;
    
    cambiarImagen(index);
    
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach((item, i) => {
      const content = item.querySelector('.accordion-content');
      const icon = item.querySelector('.accordion-icon');
      
      if (i === index) {
        if (content) {
          gsap.to(content, {
            height: 'auto',
            duration: 0.4,
            ease: 'power2.out',
            onStart: () => {
              content.style.display = 'block';
            }
          });
          gsap.to(icon, {
            rotate: 180,
            duration: 0.3
          });
        }
      } else {
        if (content && content.style.display !== 'none') {
          gsap.to(content, {
            height: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
              content.style.display = 'none';
            }
          });
          gsap.to(icon, {
            rotate: 0,
            duration: 0.3
          });
        }
      }
    });
  };

  // Abrir el primer acordeón por defecto
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstItem = document.querySelector('.accordion-item');
      if (firstItem) {
        const content = firstItem.querySelector('.accordion-content');
        const icon = firstItem.querySelector('.accordion-icon');
        if (content) {
          content.style.display = 'block';
          gsap.set(content, { height: 'auto' });
          gsap.set(icon, { rotate: 180 });
        }
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Contenedor de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* COLUMNA IZQUIERDA - Acordeones con padding */}
          <div ref={accordionRef} className="p-6 md:p-8 lg:p-12">
            <h2 ref={titleRef} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 md:mb-12">
              Nuestras Noticias
            </h2>
            
            <div className="space-y-4">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className={`accordion-item bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 transition-all duration-300 ${
                    activeIndex === index ? 'border-yellow-400/50 shadow-lg shadow-yellow-400/20' : 'hover:border-white/20'
                  }`}
                >
                  <button
                    onClick={() => handleAccordionClick(index)}
                    className="w-full px-5 py-4 flex justify-between items-center text-left group"
                  >
                    <span className={`text-lg md:text-xl font-semibold transition-colors ${
                      activeIndex === index ? 'text-yellow-400' : 'text-white group-hover:text-yellow-300'
                    }`}>
                      {post.titulo}
                    </span>
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`accordion-icon w-5 h-5 transition-all duration-300 ${
                        activeIndex === index ? 'text-yellow-400 rotate-180' : 'text-gray-400'
                      }`}
                    />
                  </button>
                  
                  <div 
                    className="accordion-content overflow-hidden"
                    style={{ display: 'none', height: 0 }}
                  >
                    <div className="px-5 pb-5">
                      <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
                        {post.descripcion}
                      </p>
                      {/* Botón Ver más */}
                      <Link
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-medium transition-all group/btn"
                      >
                        Ver más
                        <FontAwesomeIcon 
                          icon={faArrowRight} 
                          className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" 
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* COLUMNA DERECHA - Imagen totalmente pegada al borde derecho */}
          <div className="relative flex justify-end -mr-[calc((100vw-100%)/2)] lg:-mr-[calc((100vw-1280px)/2)]">
            <div 
              ref={imageRef}
              className="relative w-full lg:w-[calc(100%+2rem)] h-[400px] md:h-[500px] lg:h-[550px] rounded-l-2xl overflow-hidden shadow-2xl"
            >
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    activeIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={post.imagen}
                    alt={post.titulo}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Overlay gradiente para legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Información de la imagen */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="flex flex-wrap gap-3 mb-3">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/20 backdrop-blur-sm text-yellow-300 text-sm rounded-full">
                        <FontAwesomeIcon icon={faTag} className="w-3 h-3" />
                        {post.categoria}
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm text-gray-300 text-sm rounded-full">
                        <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
                        {post.fecha}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Botón centrado */}
        <div ref={buttonRef} className="flex justify-center mt-12 md:mt-16">
          <Link
            href="/blog"
            className="group bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            Ver todas las noticias
            <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;