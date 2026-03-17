"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { getProyectosDestacados, getCategoriasProyectos } from '@/lib/wordpress';

// Registrar plugins de GSAP
gsap.registerPlugin(ScrollTrigger);

const GridProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalProyectos, setTotalProyectos] = useState(0);
  
  const gridRef = useRef(null);
  const cardsRef = useRef([]);
  const tituloRef = useRef(null);
  const filtrosRef = useRef(null);
  const botonesRef = useRef(null);

  // Cargar proyectos y categorías
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [proyectosData, categoriasData] = await Promise.all([
          getProyectosDestacados(categoriaActiva),
          getCategoriasProyectos()
        ]);
        
        setProyectos(proyectosData.proyectos || []);
        setTotalProyectos(proyectosData.total || 0);
        setCategorias(categoriasData || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoriaActiva]);

  // Animaciones GSAP
  useEffect(() => {
    if (loading || proyectos.length === 0) return;

    const ctx = gsap.context(() => {
      // Timeline principal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });

      // Animación del título
      tl.fromTo(tituloRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      // Animación de los filtros
      tl.fromTo(filtrosRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      );

      // Animación de las cards (efecto escalera)
      tl.fromTo(cardsRef.current,
        { 
          opacity: 0,
          y: 60,
          scale: 0.9
        },
        { 
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.2)'
        },
        '-=0.2'
      );

      // Animación de los botones inferiores
      tl.fromTo(botonesRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '+=0.2'
      );

      // Animaciones hover para las cards
      cardsRef.current.forEach((card) => {
        if (!card) return;
        
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            y: -10,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            duration: 0.3,
            ease: 'power2.out'
          });
          
          // Animar la imagen dentro de la card
          const img = card.querySelector('.project-image');
          if (img) {
            gsap.to(img, {
              scale: 1.1,
              duration: 0.5,
              ease: 'power2.out'
            });
          }
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            duration: 0.3,
            ease: 'power2.out'
          });
          
          const img = card.querySelector('.project-image');
          if (img) {
            gsap.to(img, {
              scale: 1,
              duration: 0.5,
              ease: 'power2.out'
            });
          }
        });
      });
    }, gridRef);

    return () => ctx.revert();
  }, [loading, proyectos]);

  const cambiarCategoria = (slug) => {
    setCategoriaActiva(slug === categoriaActiva ? '' : slug);
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-12 bg-white/10 rounded w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-white/5 rounded w-2/3 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-white/10 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={gridRef} className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-purple-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Título de la sección */}
        <div ref={tituloRef} className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Proyectos Destacados
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Una selección de los mejores trabajos que he realizado para diferentes clientes
          </p>
        </div>

        {/* Filtros de categorías */}
        {categorias.length > 0 && (
          <div ref={filtrosRef} className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12">
            <button
              onClick={() => cambiarCategoria('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                categoriaActiva === ''
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => cambiarCategoria(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categoriaActiva === cat.slug
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {cat.nombre} ({cat.contador})
              </button>
            ))}
          </div>
        )}

        {/* Grid de proyectos 3x3 */}
        {proyectos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {proyectos.slice(0, 9).map((proyecto, index) => (
              <div
                key={proyecto.id}
                ref={el => cardsRef.current[index] = el}
                className="group relative bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-yellow-400/50 transition-all"
              >
                {/* Imagen del proyecto */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                  {proyecto.imagen_destacada ? (
                    <Image
                      src={proyecto.imagen_destacada}
                      alt={proyecto.titulo}
                      fill
                      className="project-image object-cover transition-transform"
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
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
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
                        className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1"
                      >
                        Ir al sitio
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3" />
                      </a>
                    )}
                    
                    <Link
                      href={`/proyectos/${proyecto.slug}`}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1"
                    >
                      Ver más
                      <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            No hay proyectos disponibles en esta categoría
          </div>
        )}

        {/* Botones inferiores (Ver más proyectos y Cotizar) */}
        <div ref={botonesRef} className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link
            href="/proyectos"
            className="group bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            Ver más proyectos
            <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-2 transition-transform" />
          </Link>
          
          <Link
            href="/cotizar"
            className="border-2 border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all backdrop-blur-sm hover:bg-white/10 flex items-center justify-center"
          >
            Cotizar proyecto
          </Link>
        </div>

        {/* Contador de proyectos (opcional) */}
        {totalProyectos > 0 && (
          <div className="text-center mt-8">
            <span className="text-sm text-gray-400">
              Mostrando {Math.min(proyectos.length, 9)} de {totalProyectos} proyectos
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default GridProyectos;