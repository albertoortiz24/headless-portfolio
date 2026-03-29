"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight, 
  faArrowLeft,
  faTimes,
  faCheck,
  faCode,
  faShoppingCart,
  faNewspaper,
  faBlog,
  faCloud,
  faBriefcase,
  faStar,
  faChevronLeft,
  faEdit,
  faSave
} from '@fortawesome/free-solid-svg-icons';

gsap.registerPlugin(ScrollTrigger);

const Cotizador = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false); // ✅ Nuevo estado para modo edición
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    presupuesto: 5000,
    plazo: '',
    caracteristicas: [],
    necesidades: '',
    paginas: '',
    idiomas: '',
    blog: '',
    productos: '',
    pasarelas: '',
    envios: '',
    cantidadExacta: null
  });
  const [cotizacion, setCotizacion] = useState(null);
  const [proyectosRelacionados, setProyectosRelacionados] = useState([]);
  const [trackingNumber, setTrackingNumber] = useState(null);
  
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const cotizacionRef = useRef(null);
  const formSectionRef = useRef(null);

  const servicios = [
    {
      id: 'corporate',
      titulo: 'Sitios Corporativos',
      icono: faBriefcase,
      descripcion: 'Sitios web profesionales para empresas, con diseño institucional y gestión de contenido.',
      descripcionCompleta: 'Desarrollamos sitios web corporativos que reflejan la identidad de tu empresa. Incluye diseño personalizado, gestión de contenido, optimización SEO, y panel de administración intuitivo. Ideal para empresas que buscan presencia digital profesional.',
      tecnologias: ['WordPress', 'Next.js', 'Tailwind CSS', 'PHP', 'MySQL'],
      precioBase: 3000,
      precioMin: 2000,
      precioMax: 8000,
      preguntas: [
        { id: 'paginas', pregunta: '¿Cuántas páginas necesita?', opciones: ['1-5 páginas', '6-10 páginas', '11-20 páginas', 'Más de 20'] },
        { id: 'idiomas', pregunta: '¿Necesita el sitio en varios idiomas?', opciones: ['Solo español', 'Bilingüe', 'Multilingüe'] },
        { id: 'blog', pregunta: '¿Incluirá sección de blog?', opciones: ['No', 'Sí, básico', 'Sí, avanzado'] }
      ]
    },
    {
      id: 'ecommerce',
      titulo: 'E-commerce',
      icono: faShoppingCart,
      descripcion: 'Tiendas online completas con carrito de compras, pasarelas de pago y gestión de inventario.',
      descripcionCompleta: 'Creamos tiendas online profesionales y escalables. Incluye catálogo de productos, carrito de compras, integración con múltiples pasarelas de pago (PayPal, Stripe, MercadoPago), gestión de inventario, cupones de descuento, y panel de administración completo.',
      tecnologias: ['WooCommerce', 'Shopify', 'Next.js', 'React', 'Node.js', 'Stripe API'],
      precioBase: 5000,
      precioMin: 3000,
      precioMax: 15000,
      preguntas: [
        { id: 'productos', pregunta: '¿Cuántos productos planea vender?', opciones: ['Menos de 50', '50-200', '200-500', 'Más de 500'] },
        { id: 'pasarelas', pregunta: '¿Qué pasarelas de pago necesita?', opciones: ['PayPal', 'Stripe', 'MercadoPago', 'Transferencia', 'Todas'] },
        { id: 'envios', pregunta: '¿Necesita integración con envíos?', opciones: ['No', 'Sí, básico', 'Sí, avanzado con tracking'] }
      ]
    },
    {
      id: 'landing',
      titulo: 'Landing Pages',
      icono: faStar,
      descripcion: 'Páginas de aterrizaje optimizadas para conversión y campañas publicitarias.',
      descripcionCompleta: 'Diseñamos landing pages de alta conversión para campañas específicas. Incluye copywriting optimizado, formularios de captura, integración con CRM, A/B testing, y análisis de métricas. Perfecto para lanzamientos de productos o campañas publicitarias.',
      tecnologias: ['Next.js', 'Tailwind CSS', 'HubSpot', 'Mailchimp', 'Google Analytics'],
      precioBase: 1500,
      precioMin: 800,
      precioMax: 4000,
      preguntas: [
        { id: 'objetivo', pregunta: '¿Cuál es el objetivo principal?', opciones: ['Captar leads', 'Vender producto', 'Registro a evento', 'Descarga de contenido'] },
        { id: 'integraciones', pregunta: '¿Necesita integración con CRM?', opciones: ['No', 'HubSpot', 'Salesforce', 'Mailchimp', 'Otro'] }
      ]
    },
    {
      id: 'blog',
      titulo: 'Blogs / Revistas Digitales',
      icono: faBlog,
      descripcion: 'Plataformas de contenido con diseño editorial moderno y experiencia de lectura optimizada.',
      descripcionCompleta: 'Desarrollamos blogs y revistas digitales con diseño editorial profesional. Incluye sistema de gestión de contenido avanzado, optimización SEO, integración con redes sociales, newsletter, y análisis de lectores.',
      tecnologias: ['WordPress', 'Ghost', 'Next.js', 'MDX', 'Algolia'],
      precioBase: 2000,
      precioMin: 1200,
      precioMax: 6000,
      preguntas: [
        { id: 'contenido', pregunta: '¿Qué tipo de contenido publicará?', opciones: ['Artículos', 'Videos', 'Podcasts', 'Contenido mixto'] },
        { id: 'autores', pregunta: '¿Múltiples autores?', opciones: ['Uno', '2-5', 'Más de 5'] }
      ]
    },
    {
      id: 'webapp',
      titulo: 'Aplicaciones Web SaaS',
      icono: faCloud,
      descripcion: 'Plataformas web con suscripción, dashboards y funcionalidades personalizadas.',
      descripcionCompleta: 'Desarrollamos aplicaciones web como servicio (SaaS) con arquitectura escalable. Incluye autenticación de usuarios, dashboards personalizados, suscripciones con Stripe, APIs, y panel de administración completo.',
      tecnologias: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'MongoDB', 'AWS', 'Stripe'],
      precioBase: 8000,
      precioMin: 5000,
      precioMax: 25000,
      preguntas: [
        { id: 'usuarios', pregunta: '¿Número estimado de usuarios?', opciones: ['<100', '100-1000', '1000-5000', '>5000'] },
        { id: 'funcionalidades', pregunta: '¿Funcionalidades principales?', opciones: ['CRUD básico', 'Dashboards', 'Reportes', 'API pública', 'Todas'] }
      ]
    },
    {
      id: 'portal',
      titulo: 'Portales de Noticias',
      icono: faNewspaper,
      descripcion: 'Plataformas de noticias con publicación rápida, categorías y gestión de anuncios.',
      descripcionCompleta: 'Creamos portales de noticias profesionales con sistema de publicación ágil, categorías, etiquetas, gestión de anuncios, suscripciones, y optimización para SEO y velocidad de carga.',
      tecnologias: ['WordPress', 'Next.js', 'Redis', 'ElasticSearch', 'Google Ad Manager'],
      precioBase: 3500,
      precioMin: 2000,
      precioMax: 10000,
      preguntas: [
        { id: 'noticias', pregunta: '¿Frecuencia de publicación?', opciones: ['Diaria', 'Semanal', 'Quincenal', 'Bajo demanda'] },
        { id: 'publicidad', pregunta: '¿Necesita gestión de anuncios?', opciones: ['No', 'Sí, básico', 'Sí, avanzado'] }
      ]
    }
  ];

  const proyectosEjemplo = [
    { id: 1, titulo: 'Tienda de Ropa Online', categoria: 'ecommerce', slug: 'tienda-ropa-online', imagen: '/placeholder.jpg' },
    { id: 2, titulo: 'ElectroShop', categoria: 'ecommerce', slug: 'electroshop', imagen: '/placeholder.jpg' },
    { id: 3, titulo: 'Corporativo ABC', categoria: 'corporate', slug: 'corporativo-abc', imagen: '/placeholder.jpg' },
  ];

  // ✅ FUNCIÓN PURA CON useMemo: Calcula precio y desglose reactivamente
  const calcularPrecioYDesglose = useMemo(() => {
    if (!selectedService) return { precio: 0, desglose: [] };
    
    let precio = 0;
    let desglose = [];

    if (selectedService.id === 'corporate') {
      precio = 3500;
      desglose.push({ concepto: 'Base (hasta 5 páginas, español)', monto: 3500 });

      const paginas = formData.paginas;
      if (paginas === '1-5 páginas') {
        precio -= 500;
        desglose.push({ concepto: 'Ajuste por 1-5 páginas', monto: -500 });
      } else if (paginas === '6-10 páginas') {
        precio += 1500;
        desglose.push({ concepto: '+6-10 páginas', monto: 1500 });
      } else if (paginas === '11-20 páginas') {
        precio += 1500 + 750;
        desglose.push({ concepto: '+11-20 páginas', monto: 2250 });
      } else if (paginas === 'Más de 20') {
        const paginasBase = 20;
        const paginasExtra = formData.cantidadExacta ? formData.cantidadExacta - paginasBase : 1;
        const costoAdicional = Math.max(0, paginasExtra) * 100;
        precio += 1500 + 750 + costoAdicional;
        const totalPaginas = formData.cantidadExacta || '21+';
        desglose.push({ 
          concepto: `+${totalPaginas} páginas totales`, 
          monto: 2250 + costoAdicional,
          nota: formData.cantidadExacta ? undefined : 'Precio estimado. $100 por página adicional sobre 20'
        });
      }

      const idiomas = formData.idiomas;
      if (idiomas === 'Bilingüe') {
        precio += 2675;
        desglose.push({ concepto: '+Idioma adicional (bilingüe)', monto: 2675 });
      } else if (idiomas === 'Multilingüe') {
        const idiomasAdicionales = 2;
        const costoIdiomas = idiomasAdicionales * 2675;
        precio += costoIdiomas;
        desglose.push({ 
          concepto: `+${idiomasAdicionales} idiomas adicionales`, 
          monto: costoIdiomas,
          nota: '$2,675 por idioma adicional'
        });
      }

      const blog = formData.blog;
      if (blog === 'Sí, básico') {
        precio += 500;
        desglose.push({ concepto: '+Blog básico', monto: 500 });
      } else if (blog === 'Sí, avanzado') {
        precio += 1000;
        desglose.push({ concepto: '+Blog avanzado', monto: 1000 });
      }

    } else if (selectedService.id === 'ecommerce') {
      precio = 6000;
      desglose.push({ concepto: 'Base (<50 productos + 1 pasarela)', monto: 6000 });

      const productos = formData.productos;
      if (productos === '50-200') {
        precio += 4500;
        desglose.push({ concepto: '+50-200 productos', monto: 4500 });
      } else if (productos === '200-500') {
        precio += 4500 + 6000;
        desglose.push({ concepto: '+200-500 productos', monto: 10500 });
      } else if (productos === 'Más de 500') {
        const productosBase = 500;
        const productosExtra = formData.cantidadExacta ? formData.cantidadExacta - productosBase : 1;
        const costoAdicional = Math.max(0, productosExtra) * 15;
        precio += 4500 + 6000 + costoAdicional;
        const totalProductos = formData.cantidadExacta || '501+';
        desglose.push({ 
          concepto: `+${totalProductos} productos totales`, 
          monto: 10500 + costoAdicional,
          nota: formData.cantidadExacta ? undefined : 'Precio estimado. $15 por producto adicional sobre 500'
        });
      }

      const envios = formData.envios;
      if (envios === 'Sí, básico') {
        precio += 500;
        desglose.push({ concepto: '+Envíos básico', monto: 500 });
      } else if (envios === 'Sí, avanzado con tracking') {
        precio += 2500;
        desglose.push({ concepto: '+Envíos avanzado con tracking', monto: 2500 });
      }

    } else {
      precio = selectedService.precioBase;
      desglose.push({ concepto: 'Base del proyecto', monto: selectedService.precioBase });

      if (formData.presupuesto > 10000) {
        precio += 2000;
        desglose.push({ concepto: 'Ajuste por presupuesto', monto: 2000 });
      }
      if (formData.presupuesto > 20000) {
        precio += 3000;
        desglose.push({ concepto: 'Ajuste por escala', monto: 3000 });
      }
      if (formData.caracteristicas.includes('seo')) {
        precio += 800;
        desglose.push({ concepto: 'Optimización SEO', monto: 800 });
      }
      if (formData.caracteristicas.includes('analytics')) {
        precio += 500;
        desglose.push({ concepto: 'Analytics', monto: 500 });
      }
      if (formData.caracteristicas.includes('multilenguaje')) {
        precio += 1200;
        desglose.push({ concepto: 'Multilenguaje', monto: 1200 });
      }
      if (formData.caracteristicas.includes('api')) {
        precio += 1500;
        desglose.push({ concepto: 'API personalizada', monto: 1500 });
      }
    }

    return { precio: Math.max(0, precio), desglose };
  }, [selectedService, formData]); // ✅ Se recalcula automáticamente cuando cambia formData

  const handleEnviarCotizacion = () => {
    const newTracking = `COT-${Math.floor(Math.random() * 9000) + 1000}`;
    setTrackingNumber(newTracking);
    
    setCotizacion({
      servicio: selectedService,
      datos: formData,
      precio: calcularPrecioYDesglose.precio,
      fecha: new Date().toLocaleDateString('es-ES')
    });
    setCurrentStep(3);
    setTimeout(() => {
      cotizacionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Animaciones
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        gsap.fromTo(sectionRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (showForm && formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
      setTimeout(() => {
        formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showForm]);

  useEffect(() => {
    if (cotizacion && cotizacionRef.current) {
      gsap.fromTo(cotizacionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.2)' }
      );
    }
  }, [cotizacion]);

  const openModal = (servicio) => {
    setSelectedService(servicio);
    setProyectosRelacionados(proyectosEjemplo.filter(p => p.categoria === servicio.id));
    setShowModal(true);
  };

  const openForm = (servicio) => {
    setSelectedService(servicio);
    setShowForm(true);
    setCurrentStep(1);
    setIsEditing(false);
    setCotizacion(null);
    setTrackingNumber(null);
    setFormData({
      nombre: '', email: '', telefono: '', empresa: '',
      presupuesto: servicio.precioBase, plazo: '', caracteristicas: [], necesidades: '',
      paginas: '', idiomas: '', blog: '',
      productos: '', pasarelas: '', envios: '',
      cantidadExacta: null
    });
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedService(null);
    setCurrentStep(1);
    setIsEditing(false);
    setCotizacion(null);
    setTrackingNumber(null);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
            currentStep >= step 
              ? 'bg-yellow-400 text-gray-900' 
              : 'bg-white/10 text-gray-400'
          }`}>
            {currentStep > step ? <FontAwesomeIcon icon={faCheck} className="w-4 h-4" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-12 h-1 mx-2 rounded ${currentStep > step ? 'bg-yellow-400' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  );

  // ✅ Componente de desglose que se actualiza en tiempo real
  const renderDesglosePrecios = () => {
    const { precio, desglose } = calcularPrecioYDesglose;
    return (
      <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
        <h5 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
          Desglose detallado:
          {isEditing && <span className="text-xs text-green-400 animate-pulse">● Actualizando...</span>}
        </h5>
        {desglose.map((item, index) => (
          <div key={index} className="flex justify-between items-start">
            <span className="text-gray-300">{item.concepto}</span>
            <div className="text-right">
              <span className={`font-medium ${item.monto >= 0 ? 'text-white' : 'text-green-400'}`}>
                {item.monto >= 0 ? '+' : ''}${Math.abs(item.monto).toLocaleString()}
              </span>
              {item.nota && (
                <p className="text-gray-500 text-xs mt-1">{item.nota}</p>
              )}
            </div>
          </div>
        ))}
        <div className="border-t border-white/10 pt-3 mt-3">
          <div className="flex justify-between font-bold text-yellow-400 text-lg">
            <span>Total estimado</span>
            <span className="transition-all duration-300">${precio.toLocaleString()} MXN</span>
          </div>
          {(selectedService?.id === 'corporate' && formData.paginas === 'Más de 20' && !formData.cantidadExacta) ||
           (selectedService?.id === 'ecommerce' && formData.productos === 'Más de 500' && !formData.cantidadExacta) ? (
            <p className="text-gray-500 text-xs mt-2">
              * Precio estimado. El valor final se ajustará según el número exacto.
            </p>
          ) : null}
        </div>
      </div>
    );
  };

  // ✅ Componente de campos editables para Step 2
  const renderEditableField = ({ label, value, onChange, type = 'text', options = [], required = false, placeholder = '', min, max, step }) => (
    <div className="space-y-1">
      <label className="block text-gray-300 text-xs font-medium">{label}{required && <span className="text-red-400">*</span>}</label>
      {type === 'select' ? (
        <select 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 text-white text-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all appearance-none cursor-pointer hover:bg-gray-900/90"
        >
          <option value="" >Selecciona...</option>
          {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)}
          rows="3"
          placeholder={placeholder}
          className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm focus:border-yellow-400 outline-none transition-colors resize-none"
        />
      ) : type === 'checkbox' ? (
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-1.5 text-gray-300 text-xs cursor-pointer hover:text-white transition-colors">
              <input 
                type="checkbox" 
                checked={value?.includes(opt.toLowerCase()) || false}
                onChange={(e) => {
                  const updated = e.target.checked 
                    ? [...(value || []), opt.toLowerCase()] 
                    : (value || []).filter(f => f !== opt.toLowerCase());
                  onChange(updated);
                }}
                className="w-3.5 h-3.5 accent-yellow-400 rounded"
              />
              {opt}
            </label>
          ))}
        </div>
      ) : type === 'range' ? (
        <>
          <input 
            type="range" 
            min={min} max={max} step={step || 1}
            value={value || 0} 
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full accent-yellow-400"
          />
          <div className="flex justify-between text-gray-500 text-xs">
            <span>${min?.toLocaleString()}</span>
            <span className="text-yellow-400 font-semibold">${value?.toLocaleString()}</span>
            <span>${max?.toLocaleString()}</span>
          </div>
        </>
      ) : type === 'number' ? (
        <input 
          type="number" 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
          min={min}
          placeholder={placeholder}
          className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm focus:border-yellow-400 outline-none transition-colors "
        />
      ) : (
        <input 
          type={type} 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm focus:border-yellow-400 outline-none transition-colors"
        />
      )}
    </div>
  );

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white mb-4">Datos de contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderEditableField({
              label: 'Nombre completo', value: formData.nombre, 
              onChange: (v) => setFormData({...formData, nombre: v}), required: true
            })}
            {renderEditableField({
              label: 'Email', value: formData.email, type: 'email',
              onChange: (v) => setFormData({...formData, email: v}), required: true
            })}
            {renderEditableField({
              label: 'Teléfono', value: formData.telefono, type: 'tel',
              onChange: (v) => setFormData({...formData, telefono: v})
            })}
            {renderEditableField({
              label: 'Empresa / Proyecto', value: formData.empresa,
              onChange: (v) => setFormData({...formData, empresa: v})
            })}
          </div>

          {selectedService?.id !== 'corporate' && selectedService?.id !== 'ecommerce' && (
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Presupuesto estimado (MXN)</label>
              {renderEditableField({
                value: formData.presupuesto, type: 'range',
                onChange: (v) => setFormData({...formData, presupuesto: v}),
                min: selectedService?.precioMin || 1000,
                max: selectedService?.precioMax || 50000
              })}
            </div>
          )}

          {selectedService?.preguntas?.map((preg, idx) => (
            <div key={idx}>
              <label className="block text-gray-300 mb-2 text-sm">{preg.pregunta}</label>
              {renderEditableField({
                value: formData[preg.id], type: 'select', options: preg.opciones,
                onChange: (v) => setFormData({...formData, [preg.id]: v, cantidadExacta: null})
              })}
              
              {(preg.id === 'paginas' && formData.paginas === 'Más de 20') && (
                <div className="mt-3 pl-4 border-l-2 border-yellow-400/30">
                  {renderEditableField({
                    label: 'Número exacto de páginas (opcional)',
                    value: formData.cantidadExacta, type: 'number', min: 21,
                    onChange: (v) => setFormData({...formData, cantidadExacta: v}),
                    placeholder: 'Ej: 25'
                  })}
                  <p className="text-gray-500 text-xs mt-1">💡 $100 por cada página adicional sobre 20</p>
                </div>
              )}
              {(preg.id === 'productos' && formData.productos === 'Más de 500') && (
                <div className="mt-3 pl-4 border-l-2 border-yellow-400/30">
                  {renderEditableField({
                    label: 'Número exacto de productos (opcional)',
                    value: formData.cantidadExacta, type: 'number', min: 501,
                    onChange: (v) => setFormData({...formData, cantidadExacta: v}),
                    placeholder: 'Ej: 650'
                  })}
                  <p className="text-gray-500 text-xs mt-1">💡 $15 por cada producto adicional sobre 500</p>
                </div>
              )}
            </div>
          ))}

          {selectedService?.id !== 'corporate' && selectedService?.id !== 'ecommerce' && (
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Características adicionales</label>
              {renderEditableField({
                value: formData.caracteristicas, type: 'checkbox',
                options: ['SEO', 'Analytics', 'Multilenguaje', 'API', 'Soporte post-lanzamiento'],
                onChange: (v) => setFormData({...formData, caracteristicas: v})
              })}
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-2 text-sm">Necesidades específicas</label>
            {renderEditableField({
              value: formData.necesidades, type: 'textarea',
              onChange: (v) => setFormData({...formData, necesidades: v}),
              placeholder: 'Cuéntanos más sobre tu proyecto...'
            })}
          </div>

          <button 
            onClick={() => {
              if (formData.nombre && formData.email) {
                setCurrentStep(2);
              } else {
                alert('Por favor completa los campos obligatorios');
              }
            }} 
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
            Continuar <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      );
    }
    
    // ✅ STEP 2: RESUMEN CON EDICIÓN DINÁMICA EN TIEMPO REAL
    if (currentStep === 2) {
      const { precio } = calcularPrecioYDesglose;
      
      return (
        <div ref={cotizacionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Columna izquierda: Resumen editable */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Resumen de tu cotización</h3>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all ${
                  isEditing 
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                    : 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30'
                }`}
              >
                <FontAwesomeIcon icon={isEditing ? faSave : faEdit} className="w-3.5 h-3.5" />
                {isEditing ? 'Guardar cambios' : 'Editar datos'}
              </button>
            </div>
            
            <div className={`bg-white/5 rounded-xl p-4 space-y-3 text-sm transition-all ${isEditing ? 'ring-2 ring-yellow-400/50' : ''}`}>
              {/* Campos de contacto editables */}
              {renderEditableField({
                label: 'Nombre completo', value: formData.nombre,
                onChange: (v) => setFormData({...formData, nombre: v}),
                required: true
              })}
              {renderEditableField({
                label: 'Email', value: formData.email, type: 'email',
                onChange: (v) => setFormData({...formData, email: v}),
                required: true
              })}
              {renderEditableField({
                label: 'Teléfono', value: formData.telefono, type: 'tel',
                onChange: (v) => setFormData({...formData, telefono: v})
              })}
              {renderEditableField({
                label: 'Empresa / Proyecto', value: formData.empresa,
                onChange: (v) => setFormData({...formData, empresa: v})
              })}
              
              {/* Campos específicos de Corporate */}
              {selectedService?.id === 'corporate' && isEditing && (
                <>
                  <div className="pt-3 border-t border-white/10">
                    {renderEditableField({
                      label: 'Número de páginas', value: formData.paginas, type: 'select',
                      options: ['1-5 páginas', '6-10 páginas', '11-20 páginas', 'Más de 20'],
                      onChange: (v) => setFormData({...formData, paginas: v, cantidadExacta: null})
                    })}
                  </div>
                  {formData.paginas === 'Más de 20' && (
                    <div className="pl-4 border-l-2 border-yellow-400/30">
                      {renderEditableField({
                        label: 'Páginas exactas', value: formData.cantidadExacta, type: 'number', min: 21,
                        onChange: (v) => setFormData({...formData, cantidadExacta: v}),
                        placeholder: 'Ej: 25'
                      })}
                    </div>
                  )}
                  {renderEditableField({
                    label: 'Idiomas', value: formData.idiomas, type: 'select',
                    options: ['Solo español', 'Bilingüe', 'Multilingüe'],
                    onChange: (v) => setFormData({...formData, idiomas: v})
                  })}
                  {renderEditableField({
                    label: 'Blog', value: formData.blog, type: 'select',
                    options: ['No', 'Sí, básico', 'Sí, avanzado'],
                    onChange: (v) => setFormData({...formData, blog: v})
                  })}
                </>
              )}
              
              {/* Campos específicos de E-commerce */}
              {selectedService?.id === 'ecommerce' && isEditing && (
                <>
                  <div className="pt-3 border-t border-white/10">
                    {renderEditableField({
                      label: 'Número de productos', value: formData.productos, type: 'select',
                      options: ['Menos de 50', '50-200', '200-500', 'Más de 500'],
                      onChange: (v) => setFormData({...formData, productos: v, cantidadExacta: null})
                    })}
                  </div>
                  {formData.productos === 'Más de 500' && (
                    <div className="pl-4 border-l-2 border-yellow-400/30">
                      {renderEditableField({
                        label: 'Productos exactos', value: formData.cantidadExacta, type: 'number', min: 501,
                        onChange: (v) => setFormData({...formData, cantidadExacta: v}),
                        placeholder: 'Ej: 650'
                      })}
                    </div>
                  )}
                  {renderEditableField({
                    label: 'Pasarelas de pago', value: formData.pasarelas, type: 'select',
                    options: ['PayPal', 'Stripe', 'MercadoPago', 'Transferencia', 'Todas'],
                    onChange: (v) => setFormData({...formData, pasarelas: v})
                  })}
                  {renderEditableField({
                    label: 'Integración de envíos', value: formData.envios, type: 'select',
                    options: ['No', 'Sí, básico', 'Sí, avanzado con tracking'],
                    onChange: (v) => setFormData({...formData, envios: v})
                  })}
                </>
              )}
              
              {/* Campos para otros servicios */}
              {selectedService?.id !== 'corporate' && selectedService?.id !== 'ecommerce' && isEditing && (
                <>
                  <div className="pt-3 border-t border-white/10">
                    <label className="block text-gray-300 text-xs font-medium mb-2">Presupuesto estimado</label>
                    {renderEditableField({
                      value: formData.presupuesto, type: 'range',
                      onChange: (v) => setFormData({...formData, presupuesto: v}),
                      min: selectedService?.precioMin || 1000,
                      max: selectedService?.precioMax || 50000
                    })}
                  </div>
                  <div>
                    <label className="block text-gray-300 text-xs font-medium mb-2">Características</label>
                    {renderEditableField({
                      value: formData.caracteristicas, type: 'checkbox',
                      options: ['SEO', 'Analytics', 'Multilenguaje', 'API', 'Soporte post-lanzamiento'],
                      onChange: (v) => setFormData({...formData, caracteristicas: v})
                    })}
                  </div>
                </>
              )}
              
              {/* Vista de solo lectura cuando no está editando */}
              {!isEditing && (
                <>
                  {selectedService?.id === 'corporate' && (
                    <>
                      {formData.paginas && <p><strong className="text-yellow-400">Páginas:</strong> {formData.paginas}{formData.cantidadExacta && formData.paginas === 'Más de 20' ? ` (${formData.cantidadExacta})` : ''}</p>}
                      {formData.idiomas && <p><strong className="text-yellow-400">Idiomas:</strong> {formData.idiomas}</p>}
                      {formData.blog && <p><strong className="text-yellow-400">Blog:</strong> {formData.blog}</p>}
                    </>
                  )}
                  {selectedService?.id === 'ecommerce' && (
                    <>
                      {formData.productos && <p><strong className="text-yellow-400">Productos:</strong> {formData.productos}{formData.cantidadExacta && formData.productos === 'Más de 500' ? ` (${formData.cantidadExacta})` : ''}</p>}
                      {formData.pasarelas && <p><strong className="text-yellow-400">Pasarelas:</strong> {formData.pasarelas}</p>}
                      {formData.envios && <p><strong className="text-yellow-400">Envíos:</strong> {formData.envios}</p>}
                    </>
                  )}
                  {selectedService?.id !== 'corporate' && selectedService?.id !== 'ecommerce' && (
                    <>
                      <p><strong className="text-yellow-400">Presupuesto:</strong> ${formData.presupuesto.toLocaleString()}</p>
                      <p><strong className="text-yellow-400">Características:</strong> {formData.caracteristicas.length > 0 ? formData.caracteristicas.join(', ') : 'Ninguna'}</p>
                    </>
                  )}
                </>
              )}
              
              {/* Campo de necesidades (siempre editable) */}
              <div className="pt-3 border-t border-white/10">
                {renderEditableField({
                  label: 'Necesidades específicas', value: formData.necesidades, type: 'textarea',
                  onChange: (v) => setFormData({...formData, necesidades: v}),
                  placeholder: 'Cuéntanos más sobre tu proyecto...'
                })}
              </div>
            </div>
            
            <button onClick={() => setCurrentStep(1)} className="text-yellow-400 hover:text-yellow-300 flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faArrowLeft} /> Volver al paso 1
            </button>
          </div>

          {/* Columna derecha: Detalle de precios (siempre visible y actualizado) */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Detalle de tu proyecto</h3>
            
            {/* Info del servicio */}
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-yellow-400">{selectedService?.titulo}</h4>
              <p className="text-gray-300 mt-2 text-sm">{selectedService?.descripcionCompleta?.substring(0, 200)}...</p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-gray-300 text-sm"><strong>Tecnologías:</strong> {selectedService?.tecnologias?.join(', ')}</p>
              </div>
            </div>

            {/* ✅ Desglose de precios - SE ACTUALIZA EN TIEMPO REAL */}
            {renderDesglosePrecios()}

            <button 
              onClick={handleEnviarCotizacion} 
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              disabled={!formData.nombre || !formData.email}
            >
              {(!formData.nombre || !formData.email) ? 'Completa los campos obligatorios' : 'Enviar cotización'} 
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      );
    }
    
    // Paso 3: Confirmación
    if (currentStep === 3 && cotizacion) {
      return (
        <div ref={cotizacionRef} className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto animate-pulse">
            <FontAwesomeIcon icon={faCheck} className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-white">¡Cotización enviada con éxito!</h3>
          <p className="text-gray-300">Gracias por tu interés. Te contactaremos a la brevedad para revisar los detalles de tu proyecto.</p>
          <div className="bg-white/5 rounded-xl p-4 max-w-md mx-auto border border-green-500/30">
            <p><strong className="text-yellow-400">Número de seguimiento:</strong> #{trackingNumber || 'COT-XXXX'}</p>
            <p className="text-gray-400 text-sm mt-2">Hemos enviado una copia a <strong className="text-white">{formData.email}</strong></p>
            <p className="text-gray-300 font-semibold mt-2">Total estimado: ${cotizacion.precio.toLocaleString()} MXN</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={closeForm} className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-2 rounded-xl font-semibold transition-all">
              Volver a servicios
            </button>
            <button onClick={() => { closeForm(); openForm(selectedService); }} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition-all">
              Nueva cotización
            </button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Servicios que ofrecemos</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Soluciones digitales personalizadas para cada necesidad</p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-purple-500 mx-auto rounded-full mt-6"></div>
        </div>

        {!showForm && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((servicio) => (
              <div key={servicio.id} className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-yellow-400/50 transition-all hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-yellow-400/20 flex items-center justify-center mb-4 group-hover:bg-yellow-400/30 transition">
                  <FontAwesomeIcon icon={servicio.icono} className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{servicio.titulo}</h3>
                <p className="text-gray-300 text-sm mb-4">{servicio.descripcion}</p>
                <div className="flex gap-2">
                  <button onClick={() => openModal(servicio)} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm transition-all">
                    Ver más
                  </button>
                  <button onClick={() => openForm(servicio)} className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-2 rounded-lg text-sm font-semibold transition-all">
                    Cotizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && selectedService && (
          <div ref={formSectionRef} className="mt-8">
            <div ref={formRef} className="bg-gradient-to-br from-gray-900/80 to-purple-900/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={closeForm}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    aria-label="Volver a servicios"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4 text-white" />
                  </button>
                  <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <FontAwesomeIcon icon={selectedService.icono} className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Cotización: {selectedService.titulo}</h3>
                    <p className="text-gray-400 text-sm">Completa el formulario para recibir tu propuesta</p>
                  </div>
                </div>
                <button 
                  onClick={closeForm}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/20 flex items-center justify-center transition-colors group"
                  aria-label="Cerrar formulario"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-white group-hover:text-red-400 transition-colors" />
                </button>
              </div>

              <div className="p-6 md:p-8">
                {renderStepIndicator()}
                {renderStep()}
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="modal-content relative max-w-4xl w-full max-h-[85vh] bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl overflow-y-auto border border-white/20">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center z-10">
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-white" />
            </button>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <FontAwesomeIcon icon={selectedService.icono} className="w-8 h-8 text-yellow-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedService.titulo}</h2>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">{selectedService.descripcionCompleta}</p>
              <div className="mb-6">
                <h4 className="text-yellow-400 font-semibold mb-2">Tecnologías utilizadas</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedService.tecnologias.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">{tech}</span>
                  ))}
                </div>
              </div>
              {proyectosRelacionados.length > 0 && (
                <div>
                  <h4 className="text-yellow-400 font-semibold mb-2">Proyectos desarrollados</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {proyectosRelacionados.map((proy) => (
                      <Link key={proy.id} href={`/proyectos/${proy.slug}`} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/30 rounded flex items-center justify-center"><FontAwesomeIcon icon={faCode} /></div>
                        <span className="text-white text-sm">{proy.titulo}</span>
                        <FontAwesomeIcon icon={faArrowRight} className="ml-auto text-gray-400 text-xs" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-4 mt-8">
                <button onClick={() => { setShowModal(false); openForm(selectedService); }} className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-3 rounded-xl font-semibold transition-all">
                  Cotizar este servicio
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition-all">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Cotizador;