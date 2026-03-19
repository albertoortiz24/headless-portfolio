"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { getProyectosDestacados, getCategoriasProyectos } from '@/lib/wordpress';

gsap.registerPlugin(ScrollTrigger);

const ProyectosPage = () => {
  const [proyectos, setProyectos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('');
  const [cargandoCategoria, setCargandoCategoria] = useState(false);
  const [totalProyectos, setTotalProyectos] = useState(0);
  
  const gridRef = useRef(null);
  const cardsRef = useRef([]);
  const gridContainerRef = useRef(null);
  const animationRef = useRef(null);

  // Cargar proyectos y categorías
  useEffect(() => {
    let isActive = true;
    
    const fetchData = async () => {
      setCargandoCategoria(true);
      
      // 1. ANIMAR SALIDA DE CARDS ACTUALES
      const cardsSalientes = cardsRef.current.filter(card => card);
      if (cardsSalientes.length > 0) {
        await gsap.to(cardsSalientes, {
          opacity: 0,
          y: 20,
          scale: 0.95,
          duration: 0.2,
          stagger: 0.02,
          ease: 'power2.in',
          overwrite: true
        });
      }

      // 2. LIMPIAR REFS DE CARDS
      cardsRef.current = [];

      try {
        const [proyectosData, categoriasData] = await Promise.all([
          getProyectosDestacados(categoriaActiva),
          getCategoriasProyectos()
        ]);
        
        if (isActive) {
          setProyectos(proyectosData.proyectos || []);
          setTotalProyectos(proyectosData.total || 0);
          setCategorias(categoriasData || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        if (isActive) {
          setCargandoCategoria(false);
        }
      }
    };

    if (categoriaActiva !== undefined) {
      fetchData();
    }

    return () => {
      isActive = false;
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [categoriaActiva]);

  // ANIMACIÓN DE ENTRADA DE NUEVAS CARDS
  useEffect(() => {
    if (proyectos.length === 0) {
      setCargandoCategoria(false);
      return;
    }

    const timer = setTimeout(() => {
      const nuevasCards = cardsRef.current.filter(card => card);
      
      if (nuevasCards.length > 0) {
        gsap.set(nuevasCards, {
          opacity: 0,
          y: 40,
          scale: 0.95
        });

        animationRef.current = gsap.to(nuevasCards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: 'back.out(1.2)',
          onComplete: () => {
            setCargandoCategoria(false);
            animationRef.current = null;
          }
        });
      } else {
        setCargandoCategoria(false);
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [proyectos]);

  // ANIMACIÓN DE ENTRADA INICIAL (SOLO UNA VEZ)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });

      // Solo animamos el grid container, no los elementos individuales
      tl.fromTo(gridContainerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }, gridRef);

    return () => ctx.revert();
  }, []); // ← Array vacío = solo una vez

  const cambiarCategoria = useCallback((slug) => {
    if (cargandoCategoria) return;
    
    const nuevaCategoria = slug === categoriaActiva ? '' : slug;
    setCategoriaActiva(nuevaCategoria);
  }, [categoriaActiva, cargandoCategoria]);

  // Efecto hover para las cards
  const handleCardHover = useCallback((card, isEnter) => {
    if (!card || cargandoCategoria) return;
    
    gsap.to(card, {
      scale: isEnter ? 1.05 : 1,
      y: isEnter ? -10 : 0,
      boxShadow: isEnter 
        ? '0 20px 40px rgba(0,0,0,0.3)' 
        : '0 4px 6px rgba(0,0,0,0.1)',
      duration: 0.3,
      ease: 'power2.out',
      overwrite: true
    });
    
    const img = card.querySelector('.project-image');
    if (img) {
      gsap.to(img, {
        scale: isEnter ? 1.1 : 1,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [cargandoCategoria]);

  return (
    <section ref={gridRef} className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-purple-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero de la página - ESTÁTICO, no se anima en cambios de categoría */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Todos los Proyectos
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explora mi portafolio completo de trabajos realizados para diferentes clientes y sectores
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-purple-500 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Filtros de categorías - ESTÁTICOS, no se animan en cambios de categoría */}
        {categorias.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 md:mb-16">
            <button
              onClick={() => cambiarCategoria('')}
              disabled={cargandoCategoria}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                categoriaActiva === ''
                  ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/30'
                  : 'bg-white/10 text-white hover:bg-white/20'
              } ${cargandoCategoria ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => cambiarCategoria(cat.slug)}
                disabled={cargandoCategoria}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                  categoriaActiva === cat.slug
                    ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/30'
                    : 'bg-white/10 text-white hover:bg-white/20'
                } ${cargandoCategoria ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {cat.nombre} ({cat.contador})
              </button>
            ))}
          </div>
        )}

        {/* Grid de proyectos - SOLO ESTO SE ANIMA */}
        <div 
          ref={gridContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[400px]"
        >
          {proyectos.length > 0 ? (
            proyectos.map((proyecto, index) => (
              <div
                key={proyecto.id}
                ref={el => cardsRef.current[index] = el}
                className="group relative bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-yellow-400/50 transition-all"
                style={{ opacity: 0 }}
                onMouseEnter={(e) => handleCardHover(e.currentTarget, true)}
                onMouseLeave={(e) => handleCardHover(e.currentTarget, false)}
              >
                {/* Imagen del proyecto */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                  {proyecto.imagen_destacada ? (
                    <Image
                      src={proyecto.imagen_destacada}
                      alt={proyecto.titulo}
                      fill
                      className="project-image object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">{proyecto.titulo[0]}</span>
                    </div>
                  )}
                  
                  {/* Overlay con categorías */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {proyecto.categorias?.map((cat) => (
                      <span
                        key={cat.id || cat.slug}
                        className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full"
                      >
                        {cat.nombre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contenido de la card */}
                <div className="p-4 md:p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-1">
                    {proyecto.titulo}
                  </h3>
                  
                  <p className="text-gray-300 text-sm md:text-base mb-4 line-clamp-2">
                    {proyecto.descripcion_corta || 'Descripción breve del proyecto...'}
                  </p>

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    {proyecto.url_sitio && (
                      <a
                        href={proyecto.url_sitio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-2 px-3 rounded-lg text-sm font-medium transition-all transform hover:scale-105 flex items-center justify-center gap-1"
                      >
                        Ir al sitio
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3" />
                      </a>
                    )}
                    
                    <Link
                      href={`/proyectos/${proyecto.slug}`}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all transform hover:scale-105 flex items-center justify-center gap-1"
                    >
                      Ver más
                      <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-400 py-12">
              No hay proyectos disponibles en esta categoría
            </div>
          )}
        </div>

        {/* Botones inferiores - ESTÁTICOS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-16">
          <Link
            href="/cotizar"
            className="group bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
          >
            Cotizar proyecto
            <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-2 transition-transform" />
          </Link>
          
          <Link
            href="/"
            className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 border-2 border-white/20 hover:border-yellow-400/50 flex items-center justify-center gap-2"
          >
            Volver al inicio
          </Link>
        </div>

        {/* Contador - ESTÁTICO */}
        {totalProyectos > 0 && (
          <div className="text-center mt-8">
            <span className="text-sm text-gray-400">
              Mostrando {proyectos.length} de {totalProyectos} proyectos
              {categoriaActiva && ` en la categoría "${categorias.find(c => c.slug === categoriaActiva)?.nombre}"`}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProyectosPage;