"use client";

import { useEffect, useRef, useState } from 'react';
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
  faCertificate,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faLinkedin,
  faTwitter,
  faYoutube,
  faInstagram,
  faTiktok
} from '@fortawesome/free-brands-svg-icons';
import { getExperiencia } from '@/lib/wordpress';

const ExperienceModal = ({ isOpen, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  // Datos por defecto (tus datos actuales)
  const defaultData = {
    nombre: "Mario Alberto Ortiz Ponce",
    titulo: "Desarrollador Web Full Stack | Especialista en Headless y WordPress",
    edad: 31,
    ubicacion: "Hermosillo, Sonora, México",
    experiencia: "+3 años",
    foto: "https://greenyellow-vulture-916371.hostingersite.com/wp-content/uploads/2026/03/1560114608019.jpg",
    redes: {
      github: "https://github.com/albertoortiz24",
      linkedin: "https://linkedin.com/in/alberto-ortiz-ponce",
      twitter: "",
      youtube: "",
      instagram: "",
      tiktok: ""
    },
    perfil_profesional: "Desarrollador Web Full Stack orientado a resultados con más de 3 años de experiencia en soluciones web de alto rendimiento. Experto en desarrollo WordPress a medida y arquitecturas Headless utilizando Next.js y Astro. Especialista en cerrar la brecha entre la lógica de backend compleja y los constructores visuales mediante el desarrollo de widgets personalizados para Elementor y soluciones híbridas basadas en ACF y creación de plugins en PHP. Trayectoria comprobada en e-commerce, optimización de rendimiento y SEO técnico.",
    experiencia_tecnica: [
      { categoria: "Frontend Moderno", contenido: "React, Next.js, Astro, JavaScript (ES6+), TypeScript, HTML5, CSS3, Bootstrap, Tailwind CSS" },
      { categoria: "WordPress Avanzado", contenido: "Temas a medida, Child Themes, Custom Post Types (CPT), ACF (Advanced Custom Fields)" },
      { categoria: "Backend y Bases de Datos", contenido: "PHP, Node.js, Express.js, MySQL, MongoDB" },
      { categoria: "DevOps y Diseño", contenido: "cPanel/WHM, Core Web Vitals, Figma, UX/UI, Responsive Design" }
    ],
    experiencia_laboral: [
      {
        periodo: "Enero 2024 – Actualidad",
        titulo: "Desarrollador Web Full Stack",
        empresa: "Post Marketing Boutique",
        ubicacion: "Remoto",
        descripcion: "Arquitectura de soluciones Headless WordPress utilizando Next.js y Astro\nDesarrollo de temas de WordPress a medida con ACF y estructuras PHP personalizadas\nCreación de widgets personalizados de Elementor para agencias de diseño\nMejora de Core Web Vitals en un 40% mediante optimización avanzada"
      },
      {
        periodo: "Junio 2023 – Enero 2024",
        titulo: "Desarrollador Web",
        empresa: "Comarka",
        ubicacion: "Remoto",
        descripcion: "Desarrollo de plataformas E-commerce con WooCommerce\nCreación de plugins a medida y bloques de Gutenberg\nIntegración de APIs de terceros para pasarelas de pago"
      },
      {
        periodo: "Enero 2023 – Junio 2023",
        titulo: "Analista de Software",
        empresa: "Cdigital",
        ubicacion: "Puebla, México",
        descripcion: "Análisis y resolución de errores críticos en bases de datos\nDesarrollo de scripts de automatización para flujos de trabajo"
      },
      {
        periodo: "Diciembre 2021 – Diciembre 2022",
        titulo: "Ingeniero en Sistemas",
        empresa: "BPO Centers",
        ubicacion: "Puebla, México",
        descripcion: "Desarrollo de sistema de inventario y gestión de horarios para +500 usuarios\nLiderazgo del equipo de soporte técnico e infraestructura"
      }
    ],
    educacion: [
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
    ],
    certificados: [],
    cv_url: "/cv-mario-ortiz.pdf",
    cotizar_url: "/cotizar"
  };

  // Cargar datos desde WordPress y combinar con defaults
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const wpData = await getExperiencia();
        // Combinar datos de WordPress con defaults (los campos vacíos se mantienen con default)
        setData({
          ...defaultData,
          ...wpData,
          // Para arrays, combinar si existen
          experiencia_tecnica: wpData.experiencia_tecnica?.length ? wpData.experiencia_tecnica : defaultData.experiencia_tecnica,
          experiencia_laboral: wpData.experiencia_laboral?.length ? wpData.experiencia_laboral : defaultData.experiencia_laboral,
          educacion: wpData.educacion?.length ? wpData.educacion : defaultData.educacion,
          certificados: wpData.certificados?.length ? wpData.certificados : defaultData.certificados,
          redes: { ...defaultData.redes, ...wpData.redes }
        });
      } catch (error) {
        console.error('Error loading experiencia:', error);
        setData(defaultData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }
  if (!data) return null;

  // Mapeo de íconos de redes sociales
  const iconMap = {
    github: faGithub,
    linkedin: faLinkedin,
    twitter: faTwitter,
    youtube: faYoutube,
    instagram: faInstagram,
    tiktok: faTiktok
  };

  // Redes sociales (solo las que tienen URL)
  const socialLinks = data.redes ? Object.entries(data.redes)
    .filter(([_, url]) => url && url.trim() !== '')
    .map(([key, url]) => ({
      icon: iconMap[key],
      url: url,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: `hover:text-${key === 'github' ? 'white' : key === 'linkedin' ? 'blue-400' : key === 'twitter' ? 'blue-300' : key === 'youtube' ? 'red-500' : key === 'instagram' ? 'pink-400' : 'white'}`
    })) : [];

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
                {data.foto ? (
                  <Image src={data.foto} alt={data.nombre} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-purple-500 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">{data.nombre?.charAt(0) || 'M'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Información personal */}
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{data.nombre}</h2>
              <p className="text-yellow-400 text-lg mb-3">{data.titulo}</p>
              
              <div className="flex flex-wrap gap-4 text-gray-300 text-sm mb-4">
                {data.edad && (
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 text-yellow-400" />
                    <span>{data.edad} años</span>
                  </div>
                )}
                {data.ubicacion && (
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarker} className="w-4 h-4 text-yellow-400" />
                    <span>{data.ubicacion}</span>
                  </div>
                )}
                {data.experiencia && (
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faBriefcase} className="w-4 h-4 text-yellow-400" />
                    <span>{data.experiencia} de experiencia</span>
                  </div>
                )}
              </div>

              {/* Redes sociales */}
              {socialLinks.length > 0 && (
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
              )}
            </div>
          </div>

          {/* Perfil Profesional */}
          {data.perfil_profesional && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-yellow-400"></span>
                Perfil Profesional
              </h3>
              <p className="text-gray-300 leading-relaxed">{data.perfil_profesional}</p>
            </div>
          )}

          {/* Experiencia Técnica */}
          {data.experiencia_tecnica && data.experiencia_tecnica.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-yellow-400"></span>
                Experiencia Técnica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.experiencia_tecnica.map((cat, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-yellow-400 font-semibold mb-2">{cat.categoria}</h4>
                    <p className="text-gray-300 text-sm">{cat.contenido}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experiencia Laboral */}
          {data.experiencia_laboral && data.experiencia_laboral.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-yellow-400"></span>
                Experiencia Laboral
              </h3>
              <div className="space-y-6">
                {data.experiencia_laboral.map((exp, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-yellow-400/50">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-yellow-400"></div>
                    <div className="mb-2">
                      <span className="text-yellow-400 text-sm font-medium">{exp.periodo}</span>
                      <h4 className="text-white text-xl font-bold mt-1">{exp.titulo}</h4>
                      <p className="text-gray-400 text-sm">{exp.empresa} • {exp.ubicacion}</p>
                    </div>
                    <ul className="space-y-2 mt-3">
                      {exp.descripcion.split('\n').map((item, idx) => (
                        item.trim() && (
                          <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Educación */}
          {data.educacion && data.educacion.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-yellow-400"></span>
                Educación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.educacion.map((edu, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-bold">{edu.titulo}</h4>
                    <p className="text-yellow-400 text-sm">{edu.institucion}</p>
                    <p className="text-gray-400 text-xs mt-1">{edu.periodo}</p>
                    {edu.descripcion && <p className="text-gray-300 text-sm mt-2">{edu.descripcion}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificados */}
          {data.certificados && data.certificados.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-yellow-400"></span>
                Certificados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.certificados.map((cert, index) => (
                  <a
                    key={index}
                    href={cert.url || '#'}
                    target={cert.url ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="group bg-white/5 rounded-lg p-4 border border-white/10 hover:border-yellow-400/50 transition-all hover:scale-105"
                  >
                    <div className="flex items-start gap-3">
                      {cert.imagen ? (
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image src={cert.imagen} alt={cert.titulo} fill className="object-contain" />
                        </div>
                      ) : (
                        <FontAwesomeIcon icon={faCertificate} className="w-8 h-8 text-yellow-400" />
                      )}
                      <div className="flex-1">
                        <h4 className="text-white font-bold group-hover:text-yellow-300 transition">{cert.titulo}</h4>
                        <p className="text-gray-400 text-sm">{cert.institucion}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {cert.fecha_inicio && new Date(cert.fecha_inicio).getFullYear()} - 
                          {cert.en_proceso ? 'En proceso' : (cert.fecha_fin ? new Date(cert.fecha_fin).getFullYear() : '')}
                        </p>
                        {cert.descripcion && <p className="text-gray-300 text-sm mt-2">{cert.descripcion}</p>}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-white/10">
            {data.cv_url && (
              <a
                href={data.cv_url}
                download
                className="group bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-3 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                Descargar mi CV
                <FontAwesomeIcon icon={faDownload} className="group-hover:translate-y-1 transition-transform" />
              </a>
            )}
            
            <Link
              href={data.cotizar_url || '/cotizar'}
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