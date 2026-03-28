"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight, 
  faArrowLeft, 
  faStar, 
  faStarHalfAlt,
  faGoogle,
  faTimes,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle as faGoogleBrand } from '@fortawesome/free-brands-svg-icons';

gsap.registerPlugin(ScrollTrigger);

const Testimonios = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false); // ← NUEVO: estado para hidratación
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const cardsRef = useRef([]);

  // Marcar que el componente está montado en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Testimonios propios (datos estáticos, no cambian)
  const testimonios = [
    {
      id: 1,
      nombre: "María González",
      cargo: "CEO, Agencia Digital",
      descripcion: "Excelente profesional, superó todas mis expectativas. El sitio web que desarrolló para mi agencia es increíblemente rápido y fácil de administrar. Sin duda lo recomiendo.",
      imagen: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5
    },
    {
      id: 2,
      nombre: "Carlos Rodríguez",
      cargo: "Fundador, TechStart",
      descripcion: "Trabajar con Mario fue una experiencia excelente. Entendió perfectamente nuestras necesidades y entregó un producto de alta calidad en tiempo récord. La comunicación fue excelente.",
      imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5
    },
    {
      id: 3,
      nombre: "Ana Martínez",
      cargo: "Marketing Manager",
      descripcion: "El sitio web que creó Mario ha mejorado significativamente nuestra presencia online. La optimización SEO que implementó nos ayudó a duplicar el tráfico orgánico. Muy recomendable.",
      imagen: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5
    },
    {
      id: 4,
      nombre: "Luis Fernández",
      cargo: "Dueño, Tienda Online",
      descripcion: "Mi tienda online nunca había funcionado tan bien. Mario optimizó cada detalle, desde la velocidad hasta la experiencia de compra. Las ventas aumentaron un 40% en el primer mes.",
      imagen: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5
    }
  ];

  // Reseñas de Google (datos estáticos, no cambian)
  const googleReviews = [
    {
      id: 1,
      nombre: "Laura Sánchez",
      rating: 5,
      texto: "Excelente servicio, muy profesional y atento a los detalles. Cumplió con todos los plazos establecidos.",
      fecha: "hace 2 semanas"
    },
    {
      id: 2,
      nombre: "Miguel Torres",
      rating: 5,
      texto: "Mario es un desarrollador excepcional. Su conocimiento en WordPress y Next.js es impresionante. 100% recomendado.",
      fecha: "hace 1 mes"
    },
    {
      id: 3,
      nombre: "Patricia López",
      rating: 5,
      texto: "Increíble trabajo, superó mis expectativas. El sitio web quedó exactamente como lo imaginaba y con un rendimiento excelente.",
      fecha: "hace 3 semanas"
    },
    {
      id: 4,
      nombre: "Roberto Díaz",
      rating: 5,
      texto: "Muy buen servicio, siempre disponible para resolver dudas. La calidad del código es impecable.",
      fecha: "hace 2 meses"
    },
    {
      id: 5,
      nombre: "Carmen Ruiz",
      rating: 5,
      texto: "El mejor desarrollador con el que he trabajado. Muy profesional y con gran atención al detalle.",
      fecha: "hace 1 semana"
    },
    {
      id: 6,
      nombre: "Javier Herrera",
      rating: 5,
      texto: "Excelente comunicación y resultados. El proyecto se entregó antes de lo esperado.",
      fecha: "hace 3 días"
    }
  ];

  // Carrusel automático
  useEffect(() => {
    if (!mounted) return; // ← No ejecutar hasta que esté montado
    
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isAnimating, mounted]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonios.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonios.length) % testimonios.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Animación de entrada
  useEffect(() => {
    if (!mounted) return; // ← No ejecutar hasta que esté montado
    
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [mounted]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={i <= rating ? faStar : i - rating === 0.5 ? faStarHalfAlt : faStar}
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-500'}`}
        />
      );
    }
    return stars;
  };

  // Mostrar skeleton mientras el componente no está montado (evita hidratación)
  if (!mounted) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-12 bg-white/10 rounded w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-white/5 rounded w-2/3 mx-auto mb-12"></div>
            <div className="h-64 bg-white/10 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-white/10 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Título de la sección */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Lo que dicen mis clientes
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            La satisfacción de mis clientes es mi mayor motivación
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-purple-500 mx-auto rounded-full mt-6"></div>
        </div>

        {/* CARRUSEL DE TESTIMONIOS */}
        <div className="relative w-full max-w-5xl mx-auto mb-16">
          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonios.map((testimonio) => (
                <div
                  key={testimonio.id}
                  className="w-full flex-shrink-0 p-6 md:p-10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex justify-center">
                      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl">
                        <Image
                          src={testimonio.imagen}
                          alt={testimonio.nombre}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-gray-300 text-lg md:text-xl italic mb-6 leading-relaxed">
                        "{testimonio.descripcion}"
                      </p>
                      <h4 className="text-white text-xl font-bold">{testimonio.nombre}</h4>
                      <p className="text-yellow-400 text-sm mb-2">{testimonio.cargo}</p>
                      <div className="flex gap-1 justify-center md:justify-start">
                        {renderStars(testimonio.rating)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 z-10"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 z-10"
            >
              <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {testimonios.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-8 bg-yellow-400' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RESEÑAS DE GOOGLE */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <FontAwesomeIcon icon={faGoogleBrand} className="w-8 h-8 text-white" />
            <h3 className="text-2xl md:text-3xl font-bold text-white">Reseñas de Google</h3>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} className="w-5 h-5 text-yellow-400" />
              ))}
              <span className="text-white ml-2">4.9 · 50+ reseñas</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {googleReviews.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-yellow-400/50 transition-all hover:scale-105"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FontAwesomeIcon icon={faGoogleBrand} className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">{review.nombre}</span>
                </div>
                <div className="flex gap-1 mb-3">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-300 text-sm mb-3 line-clamp-3">{review.texto}</p>
                <p className="text-gray-500 text-xs">{review.fecha}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="group bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            Ver más comentarios
            <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-2 transition-transform" />
          </button>
          
          <a
            href="https://g.page/r/CTU2MjUzMjg0ODk/review"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 border-2 border-white/20 hover:border-yellow-400/50 flex items-center justify-center gap-2"
          >
            Añadir comentario
            <FontAwesomeIcon icon={faGoogleBrand} className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-4xl w-full max-h-[85vh] bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faGoogleBrand} className="w-6 h-6 text-white" />
                <h3 className="text-white font-bold text-lg">Todas las reseñas de Google</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center hover:rotate-90"
              >
                <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {googleReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-yellow-400/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                          <span className="text-white font-bold">{review.nombre.charAt(0)}</span>
                        </div>
                        <span className="text-white font-medium">{review.nombre}</span>
                      </div>
                      <div className="flex gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{review.texto}</p>
                    <p className="text-gray-500 text-xs">{review.fecha}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-6 pt-4 border-t border-white/10">
                <a
                  href="https://g.page/r/CTU2MjUzMjg0ODk/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-all group"
                >
                  Ver más reseñas en Google
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Testimonios;