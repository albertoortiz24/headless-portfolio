"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faMapMarker, 
  faCalendar, 
  faBriefcase, 
  faGraduationCap,
  faDownload,
  faArrowRight,
  faEnvelope,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faLinkedin,
  faTwitter,
  faYoutube,
  faInstagram,
  faTiktok
} from '@fortawesome/free-brands-svg-icons';

const ExperienceModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      const tl = gsap.timeline();
      tl.fromTo(modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      ).fromTo(contentRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)' },
        '-=0.2'
      );
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(contentRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 30,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onClose
    });
    gsap.to(modalRef.current, {
      opacity: 0,
      duration: 0.3,
      delay: 0.2,
      onComplete: () => {
        if (onClose) onClose();
      }
    });
  };

  if (!isOpen) return null;

  // Redes sociales
  const socialLinks = [
    { icon: faGithub, url: "https://github.com/albertoortiz24", label: "GitHub", color: "hover:text-white" },
    { icon: faLinkedin, url: "https://linkedin.com/in/alberto-ortiz-ponce", label: "LinkedIn", color: "hover:text-blue-400" },
    { icon: faTwitter, url: "https://twitter.com/", label: "Twitter", color: "hover:text-blue-300" },
    { icon: faYoutube, url: "https://youtube.com/", label: "YouTube", color: "hover:text-red-500" },
    { icon: faInstagram, url: "https://instagram.com/", label: "Instagram", color: "hover:text-pink-400" },
    { icon: faTiktok, url: "https://tiktok.com/", label: "TikTok", color: "hover:text-white" }
  ];

  // Línea de tiempo de experiencia laboral
  const timeline = [
    {
      periodo: "Enero 2024 – Actualidad",
      titulo: "Desarrollador Web Full Stack",
      empresa: "Post Marketing Boutique",
      ubicacion: "Remoto",
      descripcion: [
        "Arquitectura de soluciones Headless WordPress utilizando Next.js y Astro",
        "Desarrollo de temas de WordPress a medida con ACF y estructuras PHP personalizadas",
        "Creación de widgets personalizados de Elementor para agencias de diseño",
        "Mejora de Core Web Vitals en un 40% mediante optimización avanzada"
      ]
    },
    {
      periodo: "Junio 2023 – Enero 2024",
      titulo: "Desarrollador Web",
      empresa: "Comarka",
      ubicacion: "Remoto",
      descripcion: [
        "Desarrollo de plataformas E-commerce con WooCommerce",
        "Creación de plugins a medida y bloques de Gutenberg",
        "Integración de APIs de terceros para pasarelas de pago"
      ]
    },
    {
      periodo: "Enero 2023 – Junio 2023",
      titulo: "Analista de Software",
      empresa: "Cdigital",
      ubicacion: "Puebla, México",
      descripcion: [
        "Análisis y resolución de errores críticos en bases de datos",
        "Desarrollo de scripts de automatización para flujos de trabajo"
      ]
    },
    {
      periodo: "Diciembre 2021 – Diciembre 2022",
      titulo: "Ingeniero en Sistemas",
      empresa: "BPO Centers",
      ubicacion: "Puebla, México",
      descripcion: [
        "Desarrollo de sistema de inventario y gestión de horarios para +500 usuarios",
        "Liderazgo del equipo de soporte técnico e infraestructura"
      ]
    }
  ];

  // Educación
  const education = [
    {
      titulo: "Bootcamp Full Stack JS",
      institucion: "Bedu Tech",
      periodo: "2019",
      descripcion: "Formación intensiva en desarrollo web full stack"
    },
    {
      titulo: "Ingeniería en Sistemas Computacionales",
      institucion: "UTH / UTJ",
      periodo: "2019",
      descripcion: "Formación profesional en sistemas computacionales"
    }
  ];

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      style={{ opacity: 0 }}
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-2xl shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con botón cerrar */}
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 p-4 flex justify-end">
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center hover:rotate-90"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          
          {/* Perfil - Sección superior */}
          <div className="flex flex-col md:flex-row gap-6 mb-8 pb-8 border-b border-white/10">
            {/* Foto de perfil */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl">
                <Image
                  src="https://greenyellow-vulture-916371.hostingersite.com/wp-content/uploads/2026/03/1560114608019.jpg"
                  alt="Mario Ortiz"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Información personal */}
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Mario Alberto Ortiz Ponce
              </h2>
              <p className="text-yellow-400 text-lg mb-3">
                Desarrollador Web Full Stack | Especialista en Headless y WordPress
              </p>
              
              <div className="flex flex-wrap gap-4 text-gray-300 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 text-yellow-400" />
                  <span>31 años</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarker} className="w-4 h-4 text-yellow-400" />
                  <span>Hermosillo, Sonora, México</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBriefcase} className="w-4 h-4 text-yellow-400" />
                  <span>+3 años de experiencia</span>
                </div>
              </div>

              {/* Redes sociales */}
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all hover:scale-110 hover:bg-white/20 ${social.color}`}
                    aria-label={social.label}
                  >
                    <FontAwesomeIcon icon={social.icon} className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Perfil Profesional */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-yellow-400"></span>
              Perfil Profesional
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Desarrollador Web Full Stack orientado a resultados con más de 3 años de experiencia en 
              soluciones web de alto rendimiento. Experto en desarrollo WordPress a medida y 
              arquitecturas Headless utilizando Next.js y Astro. Especialista en cerrar la brecha entre la 
              lógica de backend compleja y los constructores visuales mediante el desarrollo de widgets 
              personalizados para Elementor y soluciones híbridas basadas en ACF y creación de plugins en 
              PHP. Trayectoria comprobada en e-commerce, optimización de rendimiento y SEO técnico.
            </p>
          </div>

          {/* Experiencia Técnica */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-yellow-400"></span>
              Experiencia Técnica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-yellow-400 font-semibold mb-2">Frontend Moderno</h4>
                <p className="text-gray-300 text-sm">React, Next.js, Astro, JavaScript (ES6+), TypeScript, HTML5, CSS3, Bootstrap, Tailwind CSS</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-yellow-400 font-semibold mb-2">WordPress Avanzado</h4>
                <p className="text-gray-300 text-sm">Temas a medida, Child Themes, Custom Post Types (CPT), ACF (Advanced Custom Fields)</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-yellow-400 font-semibold mb-2">Backend y Bases de Datos</h4>
                <p className="text-gray-300 text-sm">PHP, Node.js, Express.js, MySQL, MongoDB</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-yellow-400 font-semibold mb-2">DevOps y Diseño</h4>
                <p className="text-gray-300 text-sm">cPanel/WHM, Core Web Vitals, Figma, UX/UI, Responsive Design</p>
              </div>
            </div>
          </div>

          {/* Línea de tiempo de experiencia */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-yellow-400"></span>
              Experiencia Laboral
            </h3>
            <div className="space-y-6">
              {timeline.map((exp, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-yellow-400/50">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-yellow-400"></div>
                  <div className="mb-2">
                    <span className="text-yellow-400 text-sm font-medium">{exp.periodo}</span>
                    <h4 className="text-white text-xl font-bold mt-1">{exp.titulo}</h4>
                    <p className="text-gray-400 text-sm">{exp.empresa} • {exp.ubicacion}</p>
                  </div>
                  <ul className="space-y-2 mt-3">
                    {exp.descripcion.map((item, idx) => (
                      <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Educación */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-yellow-400"></span>
              Educación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {education.map((edu, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-white font-bold">{edu.titulo}</h4>
                  <p className="text-yellow-400 text-sm">{edu.institucion}</p>
                  <p className="text-gray-400 text-xs mt-1">{edu.periodo}</p>
                  <p className="text-gray-300 text-sm mt-2">{edu.descripcion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-white/10">
            <a
              href="/cv-mario-ortiz.pdf"
              download
              className="group bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-3 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              Descargar mi CV
              <FontAwesomeIcon icon={faDownload} className="group-hover:translate-y-1 transition-transform" />
            </a>
            
            <Link
              href="/cotizar"
              onClick={handleClose}
              className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 border-2 border-white/20 hover:border-yellow-400/50 flex items-center justify-center gap-2"
            >
              Cotizar proyecto
              <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceModal;