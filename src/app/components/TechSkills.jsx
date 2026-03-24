"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ProgressBar from './ProgressBar';
import ExperienceModal from './ExperienceModal';
import { getSkills } from '@/lib/wordpress';

gsap.registerPlugin(ScrollTrigger);

const TechSkills = () => {
  const [activeTab, setActiveTab] = useState('stack');
  const [modalOpen, setModalOpen] = useState(false);
  const [stackSkills, setStackSkills] = useState([]);
  const [learningSkills, setLearningSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const tabsRef = useRef(null);
  const progressRef = useRef(null);
  const buttonsRef = useRef(null);

  // Cargar skills desde WordPress
  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const data = await getSkills();
        setStackSkills(data.stack || []);
        setLearningSkills(data.learning || []);
      } catch (error) {
        console.error('Error loading skills:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const currentSkills = activeTab === 'stack' ? stackSkills : learningSkills;

  useEffect(() => {
    if (loading) return;

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
      ).fromTo(tabsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      ).fromTo(progressRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.2'
      ).fromTo(buttonsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '+=0.2'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse text-center">
            <div className="h-12 bg-white/10 rounded w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-white/5 rounded w-2/3 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-white/10 rounded-xl"></div>
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
        
        {/* Título */}
        <div ref={titleRef} className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Tecnologías que domino
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Mi stack tecnológico actual y las herramientas que estoy aprendiendo para seguir creciendo
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-purple-500 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Tabs */}
        <div ref={tabsRef} className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('stack')}
            className={`px-8 py-3 rounded-full text-lg font-semibold transition-all transform hover:scale-105 ${
              activeTab === 'stack'
                ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Mi Stack <span className="text-sm opacity-70">({stackSkills.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('learning')}
            className={`px-8 py-3 rounded-full text-lg font-semibold transition-all transform hover:scale-105 ${
              activeTab === 'learning'
                ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            En Proceso <span className="text-sm opacity-70">({learningSkills.length})</span>
          </button>
        </div>

            {/* Progress Bars */}
        <div ref={progressRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {currentSkills.length > 0 ? (
            currentSkills.map((skill) => (
            <ProgressBar
                key={skill.id}
                skill={skill.nombre}
                percentage={skill.porcentaje}
                color={skill.color}
                logo={skill.logo}  // ← PASAMOS EL LOGO
            />
            ))
        ) : (
            <div className="col-span-2 text-center text-gray-400 py-12">
            No hay habilidades registradas en esta categoría.
            <br />
            <span className="text-sm">Agrégalas desde el panel de WordPress</span>
            </div>
        )}
        </div>
        {/* Botones de acción */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center mt-16">
          <button
            onClick={() => setModalOpen(true)}
            className="group bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            Ver más sobre mi experiencia
            <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-2 transition-transform" />
          </button>
          
          <Link
            href="/cotizar"
            className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 border-2 border-white/20 hover:border-yellow-400/50 flex items-center justify-center gap-2"
          >
            Cotizar proyecto
            <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Modal de Experiencia */}
      <ExperienceModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
};

export default TechSkills;