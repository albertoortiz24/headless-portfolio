import { getProyectoCompletoBySlug, getAllProyectoSlugs } from '@/lib/wordpress';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExternalLinkAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import ImageGallery from '@/app/components/ImageGallery';
import TechCarouselConLogos from '@/app/components/TechCarouselConLogo';
import ProyectosSimilares from '@/app/components/ProyectosSimilares';

export async function generateStaticParams() {
  const slugs = await getAllProyectoSlugs();
  return slugs;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const proyecto = await getProyectoCompletoBySlug(slug);
  
  if (!proyecto) {
    return { title: 'Proyecto no encontrado' };
  }

  return {
    title: proyecto.titulo,
    description: proyecto.descripcion_corta,
  };
}

export default async function ProyectoPage({ params }) {
  const { slug } = await params;
  const proyecto = await getProyectoCompletoBySlug(slug);

  if (!proyecto) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Botón volver con mejor diseño */}
        <Link
          href="/proyectos"
          className="inline-flex items-center text-white/70 hover:text-yellow-300 transition-colors mb-8 group"
        >
          <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full mr-3 group-hover:bg-yellow-400/20 group-hover:scale-110 transition-all">
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          </div>
          <span className="text-lg">Volver a proyectos</span>
        </Link>

        {/* DOS COLUMNAS PRINCIPALES con mejor espaciado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* COLUMNA IZQUIERDA: Galería - MÁS GRANDE */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-4 border border-white/10">
              <ImageGallery 
                destacada={proyecto.imagen_destacada} 
                imagenes={proyecto.imagenes_adicionales} 
              />
            </div>
          </div>

          {/* COLUMNA DERECHA: Información */}
          <div className="space-y-8">
            {/* Categoría con diseño mejorado */}
            {proyecto.categorias && proyecto.categorias.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {proyecto.categorias.map((cat) => (
                  <span
                    key={cat.id || cat.slug}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 text-yellow-300 text-sm font-medium rounded-full border border-yellow-400/30 backdrop-blur-sm"
                  >
                    {cat.nombre}
                  </span>
                ))}
              </div>
            )}

            {/* Título con mejor tipografía */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {proyecto.titulo}
            </h1>

            {/* Descripción con mejor espaciado */}
            <div className="prose prose-invert prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: proyecto.descripcion_completa }}
                className="text-gray-300 leading-relaxed"
              />
            </div>

            {/* Botones de acción mejorados */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {proyecto.url_sitio && (
                <a
                  href={proyecto.url_sitio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-yellow-400/30 flex items-center justify-center gap-3"
                >
                  <span>Ir al sitio</span>
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </a>
              )}
              
              {proyecto.url_cotizar && (
                <a
                  href={proyecto.url_cotizar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-1 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 border-2 border-white/20 hover:border-yellow-400/50 flex items-center justify-center gap-3"
                >
                  <span>Cotizar proyecto</span>
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* SECCIÓN TECNOLOGÍAS - Título centrado */}
       {proyecto.tecnologias_logos && proyecto.tecnologias_logos.length > 0 && (
  <div className="mt-24">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Tecnologías utilizadas
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-purple-500 mx-auto rounded-full"></div>
    </div>
    <TechCarouselConLogos tecnologias={proyecto.tecnologias_logos} />
  </div>
)}

        {/* SECCIÓN PROYECTOS SIMILARES - Título centrado */}
        {proyecto.proyectos_similares && proyecto.proyectos_similares.length > 0 && (
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Proyectos similares
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-purple-500 mx-auto rounded-full"></div>
            </div>
            <ProyectosSimilares proyectos={proyecto.proyectos_similares} />
          </div>
        )}
      </div>
    </main>
  );
}