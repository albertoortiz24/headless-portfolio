"use client";

import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faCalendar, 
  faTag,
  faShare,
  faBookmark,
  faArrowRight,
  faHashtag,
  faClock,
  faFire,
  faChevronRight,
  faBars,
  faBookOpen,
  faTableList,
  faList
} from '@fortawesome/free-solid-svg-icons';
import { getNoticiaBySlug, getNoticiasRelacionadas, getNoticiasRecientes, getNoticiasMasVistas } from '@/lib/wordpress';

gsap.registerPlugin(ScrollTrigger);

const SingleNoticiaPage = ({ params }) => {
  const { slug } = React.use(params);
  
  const [noticia, setNoticia] = useState(null);
  const [relacionadas, setRelacionadas] = useState([]);
  const [recientes, setRecientes] = useState([]);
  const [masVistas, setMasVistas] = useState([]);
  const [indice, setIndice] = useState([]);
  const [activeHeading, setActiveHeading] = useState('');
  const [loading, setLoading] = useState(true);
  const [showIndicePop, setShowIndicePop] = useState(false);
  const [showFloatingIndice, setShowFloatingIndice] = useState(false);
  const [showFloatingTooltip, setShowFloatingTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [processedContent, setProcessedContent] = useState('');
  
  const contentRef = useRef(null);
  const sidebarRef = useRef(null);
  const imageRef = useRef(null);
  const tituloRef = useRef(null);
  const indiceDesktopRef = useRef(null);
  const floatingIndiceRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [noticiaData, relacionadasData, recientesData, masVistasData] = await Promise.all([
          getNoticiaBySlug(slug),
          getNoticiasRelacionadas(slug),
          getNoticiasRecientes(),
          getNoticiasMasVistas()
        ]);
        setNoticia(noticiaData);
        setRelacionadas(relacionadasData);
        setRecientes(recientesData);
        setMasVistas(masVistasData);
      } catch (error) {
        console.error('Error loading noticia:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // Procesar HTML y extraer índice
  useEffect(() => {
    if (noticia && noticia.contenido && mounted && !loading) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = noticia.contenido;
      
      const headings = tempDiv.querySelectorAll('h3');
      const indices = [];
      
      headings.forEach((heading, index) => {
        const id = `heading-${index}-${heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}`;
        heading.id = id;
        indices.push({
          id: id,
          text: heading.textContent,
        });
      });
      
      setProcessedContent(tempDiv.innerHTML);
      setIndice(indices);
    }
  }, [noticia, mounted, loading]);

  // ScrollSpy y control del índice flotante
  useEffect(() => {
    if (indice.length === 0 || !mounted) return;

    const checkIndiceVisibility = () => {
      if (indiceDesktopRef.current) {
        const rect = indiceDesktopRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setShowFloatingIndice(!isVisible && window.scrollY > 300);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -80px 0px' }
    );

    setTimeout(() => {
      indice.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) observer.observe(element);
      });
    }, 200);

    window.addEventListener('scroll', checkIndiceVisibility);
    checkIndiceVisibility();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkIndiceVisibility);
    };
  }, [indice, mounted]);

  // Animación de entrada
  useEffect(() => {
    if (loading || !noticia || !mounted) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo(imageRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
      ).fromTo(tituloRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      ).fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.2'
      ).fromTo(sidebarRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.2'
      );
    });

    return () => ctx.revert();
  }, [loading, noticia, mounted]);

  // Scroll a heading específico
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setShowFloatingTooltip(false);
      setShowIndicePop(false);
    }
  };

  // Truncar texto
  const truncateText = (text, maxLength = 35) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (!mounted || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-white/10 rounded-2xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-white/10 rounded"></div>
              <div className="h-64 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!noticia) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Noticia no encontrada</h1>
          <Link href="/blog" className="text-yellow-400 hover:text-yellow-300">
            Volver al blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Botón volver */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors mb-6 group"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al blog
        </Link>

        {/* PRIMERA SECCIÓN: Dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Imagen destacada */}
          <div 
            ref={imageRef}
            className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl"
          >
            {noticia.imagen ? (
              <Image
                src={noticia.imagen}
                alt={noticia.titulo}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-6xl font-bold">{noticia.titulo.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Título e Índice */}
          <div ref={tituloRef} className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/20 text-yellow-300 text-sm rounded-full">
                  <FontAwesomeIcon icon={faTag} className="w-3 h-3" />
                  {noticia.categoria}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-full">
                  <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
                  {noticia.fecha}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-full">
                  <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                  {Math.ceil(noticia.contenido?.length / 1000) || 5} min lectura
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {noticia.titulo}
              </h1>
            </div>

            {/* Índice Desktop */}
            {indice.length > 0 && (
              <div ref={indiceDesktopRef} className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
                  <FontAwesomeIcon icon={faHashtag} className="w-4 h-4" />
                  Contenido del artículo
                </h4>
                <ul className="space-y-2">
                  {indice.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollToHeading(item.id)}
                        className={`group flex items-center gap-2 w-full text-left transition-all hover:translate-x-1 ${
                          activeHeading === item.id 
                            ? 'text-yellow-400' 
                            : 'text-gray-400 hover:text-yellow-300'
                        }`}
                      >
                        <FontAwesomeIcon 
                          icon={faChevronRight} 
                          className={`w-3 h-3 transition-all ${
                            activeHeading === item.id ? 'text-yellow-400' : 'text-gray-500'
                          }`} 
                        />
                        <span className="text-sm font-medium">{item.text}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Publicidad */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <h4 className="text-white font-bold mb-4">Publicidad</h4>
              <div className="bg-white/10 rounded-lg p-6">
                <p className="text-gray-400 text-sm">Espacio publicitario</p>
                <p className="text-gray-500 text-xs mt-2">300x250</p>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="lg:col-span-7">
            <div 
              ref={contentRef}
              className="prose prose-invert prose-lg max-w-none"
            >
              <div 
                dangerouslySetInnerHTML={{ __html: processedContent || noticia.contenido }}
                className="text-gray-300 leading-relaxed"
              />
            </div>
          </div>

          {/* Últimas noticias y Más vistas */}
          <div ref={sidebarRef} className="lg:col-span-3 space-y-6">
            
            {recientes.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                  Últimas noticias
                </h4>
                <ul className="space-y-3">
                  {recientes.slice(0, 5).map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/blog/${item.slug}`}
                        className="group flex gap-3 hover:bg-white/5 rounded-lg p-2 transition-all"
                      >
                        <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                          {item.imagen ? (
                            <Image src={item.imagen} alt={item.titulo} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-purple-500/30 flex items-center justify-center">
                              <span className="text-white text-xs">{item.titulo.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-white text-sm font-medium line-clamp-2 group-hover:text-yellow-300 transition">
                            {item.titulo}
                          </h5>
                          <p className="text-gray-500 text-xs mt-1">{item.fecha}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {masVistas.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                  <FontAwesomeIcon icon={faFire} className="w-4 h-4 text-orange-400" />
                  Más vistas
                </h4>
                <ul className="space-y-3">
                  {masVistas.slice(0, 5).map((item, idx) => (
                    <li key={item.id}>
                      <Link
                        href={`/blog/${item.slug}`}
                        className="group flex gap-3 hover:bg-white/5 rounded-lg p-2 transition-all"
                      >
                        <div className="w-6 text-yellow-400 font-bold text-sm">#{idx + 1}</div>
                        <div className="flex-1">
                          <h5 className="text-white text-sm font-medium line-clamp-2 group-hover:text-yellow-300 transition">
                            {item.titulo}
                          </h5>
                          <p className="text-gray-500 text-xs mt-1">{item.fecha}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Noticias relacionadas */}
        {relacionadas.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
              Noticias relacionadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relacionadas.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-yellow-400/50 transition-all hover:scale-105"
                >
                  <div className="relative h-48 overflow-hidden">
                    {rel.imagen ? (
                      <Image
                        src={rel.imagen}
                        alt={rel.titulo}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">{rel.titulo.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs text-yellow-400">{rel.categoria}</span>
                      <span className="text-xs text-gray-400">{rel.fecha}</span>
                    </div>
                    <h3 className="text-white font-bold mb-2 line-clamp-2 group-hover:text-yellow-300 transition">
                      {rel.titulo}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2">{rel.descripcion}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ÍNDICE FLOTANTE LATERAL DESKTOP */}
        {indice.length > 0 && showFloatingIndice && (
          <div 
            ref={floatingIndiceRef}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
            onMouseEnter={() => setShowFloatingTooltip(true)}
            onMouseLeave={() => setShowFloatingTooltip(false)}
          >
            <div className="flex items-center">
              <div className="w-4 h-full"></div>
              <div className="flex flex-col gap-4 pr-4">
                {indice.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToHeading(item.id)}
                    className={`block w-8 h-1 rounded-full transition-all duration-300 ${
                      activeHeading === item.id 
                        ? 'bg-yellow-400' 
                        : 'bg-white/40 hover:bg-yellow-400/70'
                    }`}
                    aria-label={`Ir a: ${item.text}`}
                  />
                ))}
              </div>
              {showFloatingTooltip && (
                <div 
                  className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 min-w-[280px] max-w-[320px] shadow-2xl border border-white/20 z-50 animate-fade-in-right ml-2"
                  onMouseEnter={() => setShowFloatingTooltip(true)}
                  onMouseLeave={() => setShowFloatingTooltip(false)}
                >
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                    <FontAwesomeIcon icon={faBars} className="w-4 h-4 text-yellow-400" />
                    <h4 className="text-white font-bold text-sm uppercase tracking-wider">Secciones del artículo</h4>
                  </div>
                  <ul className="space-y-2 max-h-64 overflow-y-auto" style={{ overflowX: 'hidden' }}>
                    {indice.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            scrollToHeading(item.id);
                            setShowFloatingTooltip(false);
                          }}
                          className={`w-full text-left text-sm py-1.5 px-2 rounded-lg transition-all hover:translate-x-1 truncate ${
                            activeHeading === item.id 
                              ? 'text-yellow-400 bg-yellow-400/10' 
                              : 'text-gray-300 hover:text-yellow-300 hover:bg-white/5'
                          }`}
                          style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {truncateText(item.text, 35)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ÍNDICE FLOTANTE MÓVIL */}
        {indice.length > 0 && (
          <div 
            className="fixed bottom-6 right-6 z-50 lg:hidden"
            onMouseEnter={() => setShowIndicePop(true)}
            onMouseLeave={() => setShowIndicePop(false)}
          >
            <div className="relative">
              <button className="w-12 h-12 rounded-full bg-yellow-400 text-gray-900 shadow-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faList} className="w-5 h-5" />
              </button>
              {activeHeading && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              )}
            </div>
            
            {showIndicePop && (
              <div className="absolute bottom-14 right-0 w-72 bg-gray-900 rounded-xl shadow-2xl border border-white/20 p-3 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                  <FontAwesomeIcon icon={faBars} className="w-4 h-4 text-yellow-400" />
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider">Secciones del artículo</h4>
                </div>
                <ul className="space-y-2 max-h-64 overflow-y-auto" style={{ overflowX: 'hidden' }}>
                  {indice.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          scrollToHeading(item.id);
                          setShowIndicePop(false);
                        }}
                        className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-all hover:translate-x-1 truncate ${
                          activeHeading === item.id 
                            ? 'text-yellow-400 bg-yellow-400/10' 
                            : 'text-gray-300 hover:text-yellow-300 hover:bg-white/5'
                        }`}
                        style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {truncateText(item.text, 30)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Animaciones */}
      <style jsx>{`
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.25s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.25s ease-out forwards;
        }
      `}</style>
    </main>
  );
};

export default SingleNoticiaPage;