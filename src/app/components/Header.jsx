"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const overlayRef = useRef(null);
  const menuItemsRef = useRef([]);
  const logoRef = useRef(null);
  const navButtonsRef = useRef([]);
  const hamburgerRef = useRef(null);

  // Detectar scroll para cambiar estilo del header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animación de entrada del header
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(headerRef.current,
      { 
        y: -100,
        opacity: 0
      },
      { 
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      }
    );

    tl.fromTo(logoRef.current,
      { 
        scale: 0,
        rotation: -180
      },
      { 
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      },
      "-=0.5"
    );

    tl.fromTo(navButtonsRef.current,
      { 
        opacity: 0,
        y: -20,
        stagger: 0.1
      },
      { 
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      },
      "-=0.3"
    );

    return () => {
      tl.kill();
    };
  }, []);

  // Efecto al hacer scroll
  useEffect(() => {
    gsap.to(headerRef.current, {
      backgroundColor: isScrolled ? 'rgba(17, 24, 39, 0.95)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(8px)' : 'blur(0px)',
      boxShadow: isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none',
      duration: 0.3,
      ease: "power2.out"
    });
  }, [isScrolled]);

  // Animación del menú hamburguesa
  useEffect(() => {
    if (isOpen) {
      // Abrir menú
      gsap.to(overlayRef.current, {
        opacity: 1,
        display: 'block',
        duration: 0.3,
        ease: "power2.in"
      });

      gsap.to(menuRef.current, {
        x: '0%',
        duration: 0.5,
        ease: "power3.out"
      });

      gsap.fromTo(menuItemsRef.current,
        { 
          opacity: 0,
          x: 50,
          stagger: 0.1
        },
        { 
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "back.out(1.2)"
        }
      );

      // Animar líneas del hamburguesa a X
      gsap.to('.hamburger-line-1', {
        rotate: 45,
        y: 8,
        duration: 0.3,
        ease: "power2.out"
      });

      gsap.to('.hamburger-line-2', {
        opacity: 0,
        duration: 0.2
      });

      gsap.to('.hamburger-line-3', {
        rotate: -45,
        y: -8,
        duration: 0.3,
        ease: "power2.out"
      });

    } else {
      // Cerrar menú
      gsap.to(overlayRef.current, {
        opacity: 0,
        display: 'none',
        duration: 0.3,
        ease: "power2.out"
      });

      gsap.to(menuRef.current, {
        x: '100%',
        duration: 0.5,
        ease: "power3.in"
      });

      // Animar X a líneas de hamburguesa
      gsap.to('.hamburger-line-1', {
        rotate: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });

      gsap.to('.hamburger-line-2', {
        opacity: 1,
        duration: 0.2,
        delay: 0.1
      });

      gsap.to('.hamburger-line-3', {
        rotate: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Array de items del menú
  const menuItems = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Experiencia', href: '#experiencia' },
    { name: 'Proyectos', href: '#proyectos' },
    { name: 'Cotiza', href: '#cotiza', isSpecial: true }
  ];

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4 px-4 sm:px-6 lg:px-8"
        style={{ 
          backgroundColor: 'transparent',
          backdropFilter: 'blur(0px)'
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - Izquierda */}
          <Link 
            href="/" 
            ref={logoRef}
            className="relative w-12 h-12 md:w-60 md:h-15 rounded-full overflow-hidden border-2 border-yellow-400 hover:border-yellow-300 transition-all transform hover:scale-110"
          >
            <Image
              src="https://greenyellow-vulture-916371.hostingersite.com/wp-content/uploads/2025/07/cropped-bg-sinfondo.png"
              alt="Logo"
              fill
              className="object-cover"
              priority
            />
          </Link>

          {/* Navegación Desktop - Derecha */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                ref={el => navButtonsRef.current[index] = el}
                className={`text-white font-medium transition-all hover:text-yellow-300 relative group ${
                  item.isSpecial ? 'bg-yellow-400 text-gray-900 px-6 py-2 rounded-full hover:bg-yellow-300 hover:scale-105' : ''
                }`}
              >
                {item.name}
                {!item.isSpecial && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Botón Hamburguesa - Móvil */}
          <button
            ref={hamburgerRef}
            onClick={toggleMenu}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none z-50"
            aria-label="Menú"
          >
            <span className="hamburger-line-1 w-8 h-0.5 bg-white transition-all"></span>
            <span className="hamburger-line-2 w-8 h-0.5 bg-white transition-all"></span>
            <span className="hamburger-line-3 w-8 h-0.5 bg-white transition-all"></span>
          </button>
        </div>
      </header>

      {/* Overlay oscuro */}
      <div
        ref={overlayRef}
        onClick={closeMenu}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 hidden md:hidden"
        style={{ opacity: 0, display: 'none' }}
      ></div>

      {/* Menú móvil (3/4 de la pantalla, derecha a izquierda) */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 w-3/4 h-full bg-gradient-to-br from-gray-900 to-purple-900 z-40 md:hidden shadow-2xl"
        style={{ transform: 'translateX(100%)' }}
      >
        <div className="flex flex-col h-full pt-24 px-8">
          {/* Logo en menú móvil */}
          <div className="flex justify-center mb-12">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-yellow-400">
              <Image
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Items del menú móvil */}
          <nav className="flex flex-col space-y-6">
            {menuItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                ref={el => menuItemsRef.current[index] = el}
                onClick={closeMenu}
                className={`text-2xl font-bold text-white hover:text-yellow-300 transition-all transform hover:translate-x-4 ${
                  item.isSpecial ? 'bg-yellow-400 text-gray-900 px-6 py-3 rounded-full text-center hover:bg-yellow-300' : ''
                }`}
                style={{ opacity: 0 }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Redes sociales o info adicional en móvil */}
          <div className="mt-auto pb-12">
            <p className="text-gray-400 text-center text-sm">
              © 2024 - Desarrollador Web
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;