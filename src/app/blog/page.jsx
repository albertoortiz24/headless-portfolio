"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faArrowRight, 
  faCalendar, 
  faTag,
  faTh,
  faList,
  faChevronRight,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { getAllNoticiasBlog, getCategoriasNoticias } from '@/lib/wordpress';

gsap.registerPlugin(ScrollTrigger);

const BlogPage = () => {
  const [noticias, setNoticias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const sidebarRef = useRef(null);
  const sidebarItemsRef = useRef([]);
  const gridRef = useRef(null);
  const cardsRef = useRef([]);
  const searchRef = useRef(null);

  // DECLARAR noticiasFiltradas ANTES de los useEffect que la usan
  const noticiasFiltradas = noticias.filter(noticia => {
    const matchesCategoria = categoriaActiva === '' || noticia.categoria === categoriaActiva;
    const matchesSearch = noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          noticia.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategoria && matchesSearch;
  });

  // Cargar noticias y categorías
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [noticiasData, categoriasData] = await Promise.all([
          getAllNoticiasBlog(),
          getCategoriasNoticias()
        ]);
        setNoticias(noticiasData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error loading blog data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Animación de entrada
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo(searchRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      ).fromTo(sidebarRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      ).fromTo(gridRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      );
    });

    return () => ctx.revert();
  }, [loading]);

  // Animación de cards al cambiar vista o filtro
  useEffect(() => {
    if (loading || noticiasFiltradas.length === 0) return;

    gsap.fromTo(cardsRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(1.2)' }
    );
  }, [noticiasFiltradas, viewMode, categoriaActiva, searchTerm, loading]);

  // Animación hover de categorías
  const handleCategoryHover = (index, isEnter) => {
    const item = sidebarItemsRef.current[index];
    if (!item) return;
    
    const textSpan = item.querySelector('.category-text');
    const iconSpan = item.querySelector('.category-icon');
    
    if (isEnter) {
      gsap.to(item, {
        x: 8,
        duration: 0.3,
        ease: 'power2.out'
      });
      if (textSpan) {
        gsap.to(textSpan, {
          x: 8,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
      if (iconSpan) {
        gsap.to(iconSpan, {
          rotation: 90,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    } else {
      gsap.to(item, {
        x: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
      if (textSpan) {
        gsap.to(textSpan, {
          x: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
      if (iconSpan) {
        gsap.to(iconSpan, {
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (!sidebarOpen) {
      gsap.fromTo(sidebarRef.current,
        { x: -300, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-12 bg-white/10 rounded w-96 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1 h-64 bg-white/10 rounded-xl"></div>
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-80 bg-white/10 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Blog
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Noticias, artículos y recursos sobre desarrollo web, WordPress y tecnologías modernas
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-purple-500 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Buscador y controles */}
        <div ref={searchRef} className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Buscar noticias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 px-5 py-3 pl-12 rounded-xl border border-white/20 focus:border-yellow-400/50 focus:outline-none transition-all"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={toggleSidebar}
              className="lg:hidden bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl transition-all"
            >
              <FontAwesomeIcon icon={faTag} className="w-5 h-5" />
              <span className="ml-2">Categorías</span>
            </button>

            <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-yellow-400 text-gray-900' : 'text-white hover:bg-white/20'}`}
              >
                <FontAwesomeIcon icon={faTh} className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-yellow-400 text-gray-900' : 'text-white hover:bg-white/20'}`}
              >
                <FontAwesomeIcon icon={faList} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar categorías - Desktop */}
          <aside 
            ref={sidebarRef}
            className="hidden lg:block lg:col-span-1 bg-white/5 backdrop-blur-sm rounded-2xl p-6 h-fit sticky top-24 border border-white/10"
          >
            <h3 className="text-white font-bold text-lg mb-4 pb-2 border-b border-white/10">Categorías</h3>
            <ul className="space-y-2">
              <li
                ref={el => sidebarItemsRef.current[0] = el}
                className={`category-item cursor-pointer transition-all ${categoriaActiva === '' ? 'text-yellow-400' : 'text-gray-400'}`}
                onClick={() => setCategoriaActiva('')}
                onMouseEnter={() => handleCategoryHover(0, true)}
                onMouseLeave={() => handleCategoryHover(0, false)}
              >
                <div className="flex items-center gap-2 py-2">
                  <FontAwesomeIcon icon={faChevronRight} className="category-icon w-4 h-4 transition-transform" />
                  <span className="category-text">Todas las noticias</span>
                  <span className="ml-auto text-xs text-gray-500">{noticias.length}</span>
                </div>
              </li>
              {categorias.map((cat, index) => (
                <li
                  key={cat.id}
                  ref={el => sidebarItemsRef.current[index + 1] = el}
                  className={`category-item cursor-pointer transition-all ${categoriaActiva === cat.nombre ? 'text-yellow-400' : 'text-gray-400'}`}
                  onClick={() => setCategoriaActiva(cat.nombre)}
                  onMouseEnter={() => handleCategoryHover(index + 1, true)}
                  onMouseLeave={() => handleCategoryHover(index + 1, false)}
                >
                  <div className="flex items-center gap-2 py-2">
                    <FontAwesomeIcon icon={faChevronRight} className="category-icon w-4 h-4 transition-transform" />
                    <span className="category-text">{cat.nombre}</span>
                    <span className="ml-auto text-xs text-gray-500">{cat.contador}</span>
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {/* Sidebar móvil */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/70" onClick={toggleSidebar}></div>
              <aside 
                className="absolute left-0 top-0 bottom-0 w-80 bg-gradient-to-br from-gray-900 to-purple-900 shadow-2xl rounded-r-2xl p-6 border-r border-white/20 z-10"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-bold text-xl">Categorías</h3>
                  <button onClick={toggleSidebar} className="text-white/70 hover:text-white">
                    <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                  </button>
                </div>
                <ul className="space-y-3">
                  <li
                    className={`cursor-pointer py-2 px-3 rounded-lg transition-all ${categoriaActiva === '' ? 'bg-yellow-400/20 text-yellow-400' : 'text-gray-300 hover:bg-white/10'}`}
                    onClick={() => { setCategoriaActiva(''); toggleSidebar(); }}
                  >
                    <div className="flex items-center justify-between">
                      <span>Todas las noticias</span>
                      <span className="text-xs text-gray-500">{noticias.length}</span>
                    </div>
                  </li>
                  {categorias.map((cat) => (
                    <li
                      key={cat.id}
                      className={`cursor-pointer py-2 px-3 rounded-lg transition-all ${categoriaActiva === cat.nombre ? 'bg-yellow-400/20 text-yellow-400' : 'text-gray-300 hover:bg-white/10'}`}
                      onClick={() => { setCategoriaActiva(cat.nombre); toggleSidebar(); }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{cat.nombre}</span>
                        <span className="text-xs text-gray-500">{cat.contador}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          )}

          {/* Grid de noticias */}
          <div ref={gridRef} className="lg:col-span-3">
            {noticiasFiltradas.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {noticiasFiltradas.map((noticia, index) => (
                  <div
                    key={noticia.id}
                    ref={el => cardsRef.current[index] = el}
                    className={`group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-yellow-400/50 transition-all hover:shadow-xl hover:shadow-yellow-400/10 ${
                      viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                    }`}
                  >
                    {/* Imagen */}
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'sm:w-48 h-48 flex-shrink-0' : 'h-48'}`}>
                      {noticia.imagen ? (
                        <Image
                          src={noticia.imagen}
                          alt={noticia.titulo}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white text-4xl font-bold">{noticia.titulo.charAt(0)}</span>
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="p-5 flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 text-xs text-yellow-400">
                          <FontAwesomeIcon icon={faTag} className="w-3 h-3" />
                          {noticia.categoria}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                          <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
                          {noticia.fecha}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-300 transition">
                        {noticia.titulo}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                        {noticia.descripcion}
                      </p>
                      <Link
                        href={`/blog/${noticia.slug}`}
                        className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-medium transition-all group/btn"
                      >
                        Leer más
                        <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">No se encontraron noticias</p>
                <button
                  onClick={() => { setSearchTerm(''); setCategoriaActiva(''); }}
                  className="mt-4 text-yellow-400 hover:text-yellow-300 transition"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogPage;