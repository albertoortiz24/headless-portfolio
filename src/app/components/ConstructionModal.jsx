"use client";

import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faHardHat, 
  faTools, 
  faBriefcase,
  faEye,
  faCheckCircle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

const ConstructionModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasClosed, setHasClosed] = useState(false);

  useEffect(() => {
    // Verificar si ya se cerró antes (usando localStorage)
    const modalClosed = localStorage.getItem('constructionModalClosed');
    if (!modalClosed) {
      // Mostrar modal después de 1 segundo
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Animación GSAP
        const modal = document.querySelector('.construction-modal');
        if (modal) {
          gsap.fromTo(modal,
            { opacity: 0, scale: 0.9, y: 30 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)' }
          );
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    gsap.to('.construction-modal', {
      opacity: 0,
      scale: 0.9,
      y: 30,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setIsOpen(false);
        localStorage.setItem('constructionModalClosed', 'true');
        setHasClosed(true);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="construction-modal relative max-w-2xl w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        
        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center hover:rotate-90 z-10"
        >
          <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-white" />
        </button>
        
        {/* Contenido */}
        <div className="p-6 md:p-8">
          
          {/* Icono principal */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-yellow-400/20 flex items-center justify-center animate-pulse">
                <FontAwesomeIcon icon={faHardHat} className="w-10 h-10 text-yellow-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                <FontAwesomeIcon icon={faTools} className="w-4 h-4 text-gray-900" />
              </div>
            </div>
          </div>
          
          {/* Título */}
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
            🚧 Sitio en remodelación 🚧
          </h2>
          
          {/* Mensaje principal */}
          <p className="text-gray-300 text-center mb-6 leading-relaxed">
            Estamos trabajando en una nueva versión de este sitio para ofrecerte una experiencia 
            más moderna, rápida y con contenido actualizado.
          </p>
          
          {/* Información para reclutadores y clientes */}
          <div className="bg-white/5 rounded-xl p-5 mb-6 border border-white/10">
            <p className="text-yellow-400 font-semibold text-center mb-3">
              👷‍♂️ ¿Eres reclutador o cliente potencial?
            </p>
            <p className="text-gray-300 text-sm text-center">
              Aunque el sitio está en proceso de mejora, la estructura y funcionalidad ya están implementadas.
              Puedes navegar y explorar:
            </p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-yellow-400" />
                <span>Proyectos destacados</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-yellow-400" />
                <span>Portafolio de trabajos</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-yellow-400" />
                <span>Skills y tecnologías</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-yellow-400" />
                <span>Testimonios de clientes</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-yellow-400" />
                <span>Blog y noticias</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-yellow-400" />
                <span>Formulario de contacto</span>
              </div>
            </div>
          </div>
          
          {/* Mensaje final */}
          <p className="text-gray-400 text-center text-sm mb-6 italic">
            "La estructura ya está casi lista. Próximamente contenido completo."
          </p>
          
          {/* Botón de acción */}
          <div className="flex justify-center">
            <button
              onClick={handleClose}
              className="group bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              Entendido, explorar sitio
              <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Nota adicional */}
          <p className="text-gray-500 text-center text-xs mt-4">
            Este mensaje solo se mostrará una vez. Puedes cerrarlo para navegar normalmente.
          </p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ConstructionModal;