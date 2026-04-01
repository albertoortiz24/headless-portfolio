"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { getMarcas, getImageUrl } from '@/lib/wordpress';

const Marcas = () => {
  const [data, setData] = useState({ marcas: [], contador: 50 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const carrusel1Ref = useRef(null);
  const carrusel2Ref = useRef(null);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contadorRef = useRef(null);

  // Cargar datos desde WordPress
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getMarcas();
        setData(result);
        setError(null);
      } catch (err) {
        setError('Error al cargar marcas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Si no hay marcas, mostrar un array vacío
  const marcas = data.marcas.length > 0 ? data.marcas : [];
  
  // Duplicar marcas para efecto infinito (si hay marcas)
  const marcasDuplicadas = marcas.length > 0 
    ? [...marcas, ...marcas, ...marcas, ...marcas]
    : [];

  useEffect(() => {
    // No iniciar animaciones si no hay marcas
    if (marcasDuplicadas.length === 0) return;

    const ctx = gsap.context(() => {
      // Animación de entrada
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(titleRef.current,
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animación del contador
      if (contadorRef.current) {
        gsap.fromTo(contadorRef.current,
          { innerText: 0 },
          {
            innerText: data.contador,
            duration: 2,
            ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: contadorRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Configurar carruseles (solo si hay marcas)
      if (marcas.length > 0 && carrusel1Ref.current && carrusel2Ref.current) {
        const items = carrusel1Ref.current.children;
        if (items.length === 0) return;
        
        const itemWidth = items[0]?.offsetWidth || 176;
        const gap = 32;
        const totalWidth = (itemWidth + gap) * marcas.length;
        const duracion = 40;

        gsap.set(carrusel1Ref.current, { x: 0 });
        gsap.set(carrusel2Ref.current, { x: -totalWidth });

        gsap.to(carrusel1Ref.current, {
          x: -totalWidth,
          duration: duracion,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: (x) => {
              const valor = parseFloat(x);
              return valor <= -totalWidth ? "0px" : `${valor}px`;
            }
          }
        });

        gsap.to(carrusel2Ref.current, {
          x: 0,
          duration: duracion,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: (x) => {
              const valor = parseFloat(x);
              return valor >= 0 ? `-${totalWidth}px` : `${valor}px`;
            }
          }
        });
      }
    });

    return () => ctx.revert();
  }, [marcas, data.contador, marcasDuplicadas.length]);

  // Si está cargando, mostrar skeleton
  if (loading) {
    return (
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-white/10 rounded w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-white/5 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 md:py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-hidden w-full"
    >
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-0">
        {/* Título */}
        <div ref={titleRef} className="text-center mb-12 md:mb-16 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Marcas que confían en mí
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            He tenido el privilegio de trabajar con empresas increíbles 
            ayudándolas a alcanzar sus objetivos digitales
          </p>
        </div>

        {/* Mostrar mensaje si no hay marcas */}
        {marcas.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No hay marcas disponibles en este momento
          </div>
        ) : (
          <>
            {/* Carrusel Superior */}
            <div className="relative w-full mb-8 overflow-hidden py-4">
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
              
              <div 
                ref={carrusel1Ref}
                className="flex gap-8"
                style={{ width: 'fit-content', willChange: 'transform' }}
              >
                {marcasDuplicadas.map((marca, index) => (
                  <div
                    key={`top-${marca.id}-${index}`}
                    className="flex-shrink-0 w-32 sm:w-36 md:w-40 lg:w-44 group cursor-pointer"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/10">
                      {marca.logo_url ? (
                        <div className="relative w-full h-12 sm:h-14 md:h-16 mb-3">
                          <Image
                            src={getImageUrl(marca.logo_url)}
                            alt={marca.nombre}
                            fill
                            className="object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-all duration-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-12 sm:h-14 md:h-16 mb-3 bg-gray-700/50 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Sin logo</span>
                        </div>
                      )}
                      <p className="text-xs sm:text-sm text-center text-gray-400 group-hover:text-yellow-300 transition-colors">
                        {marca.nombre}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carrusel Inferior */}
            <div className="relative w-full overflow-hidden py-4">
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
              
              <div 
                ref={carrusel2Ref}
                className="flex gap-8"
                style={{ width: 'fit-content', willChange: 'transform' }}
              >
                {marcasDuplicadas.map((marca, index) => (
                  <div
                    key={`bottom-${marca.id}-${index}`}
                    className="flex-shrink-0 w-32 sm:w-36 md:w-40 lg:w-44 group cursor-pointer"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-400/10">
                      {marca.logo_url ? (
                        <div className="relative w-full h-12 sm:h-14 md:h-16 mb-3">
                          <Image
                            src={getImageUrl(marca.logo_url)}
                            alt={marca.nombre}
                            fill
                            className="object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-all duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-12 sm:h-14 md:h-16 mb-3 bg-gray-700/50 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Sin logo</span>
                        </div>
                      )}
                      <p className="text-xs sm:text-sm text-center text-gray-400 group-hover:text-purple-300 transition-colors">
                        {marca.nombre}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Contador */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <span 
              ref={contadorRef}
              className="text-2xl font-bold text-yellow-400 tabular-nums"
            >
              {/*data.contador*/}
              
            </span>
            <span className="text-gray-300">marcas satisfechas</span>
          </div>
          {marcas.length > 0 && (
            <p className="text-sm text-gray-400 mt-2">
              ({marcas.length} marcas activas)
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Marcas;