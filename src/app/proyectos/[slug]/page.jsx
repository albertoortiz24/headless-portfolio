import { getProyectoBySlug, getAllProyectoSlugs } from '@/lib/wordpress';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { notFound } from 'next/navigation';

// Generar rutas estáticas en build time
export async function generateStaticParams() {
  const slugs = await getAllProyectoSlugs();
  return slugs;
}

// Metadata dinámica para SEO
export async function generateMetadata({ params }) {
  const proyecto = await getProyectoBySlug(params.slug);
  
  if (!proyecto) {
    return {
      title: 'Proyecto no encontrado',
    };
  }

  return {
    title: `${proyecto.titulo} | Proyecto Destacado`,
    description: proyecto.descripcion_corta,
    openGraph: {
      title: proyecto.titulo,
      description: proyecto.descripcion_corta,
      images: proyecto.imagen_destacada ? [proyecto.imagen_destacada] : [],
    },
  };
}

// Página del proyecto
export default async function ProyectoPage({ params }) {
  const proyecto = await getProyectoBySlug(params.slug);

  if (!proyecto) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Botón volver */}
        <Link
          href="/#proyectos"
          className="inline-flex items-center text-white hover:text-yellow-300 transition-colors mb-8 group"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2 group-hover:-translate-x-2 transition-transform" />
          Volver a proyectos
        </Link>

        {/* Imagen destacada */}
        {proyecto.imagen_destacada && (
          <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={proyecto.imagen_destacada}
              alt={proyecto.titulo}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Título y categorías */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {proyecto.titulo}
          </h1>
          
          {proyecto.categorias?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {proyecto.categorias.map((cat) => (
                <span
                  key={cat.slug}
                  className="px-3 py-1 bg-white/10 text-white text-sm rounded-full"
                >
                  {cat.nombre}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Descripción completa */}
        <div 
          className="prose prose-invert prose-lg max-w-none mb-8 text-gray-300"
          dangerouslySetInnerHTML={{ __html: proyecto.descripcion_completa }}
        />

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          {proyecto.url_sitio && (
            <a
              href={proyecto.url_sitio}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
            >
              Visitar sitio web
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
          )}
          
          {proyecto.url_cotizar && (
            <a
              href={proyecto.url_cotizar}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:bg-white/10"
            >
              Cotizar proyecto similar
            </a>
          )}
        </div>
      </div>
    </main>
  );
}