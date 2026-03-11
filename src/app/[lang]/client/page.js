// app/[lang]/client/page.js
import Link from 'next/link';

export default async function ClientPage({ params }) {
  const { lang } = await params;
  
  // Definir la URL de la API
  const apiUrl = 'https://greenyellow-vulture-916371.hostingersite.com/wp-json/wp/v2/posts';
  
  let posts = [];
  let error = null;

  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 60 } // Revalidar cada 60 segundos
    });
    
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
    }
    
    posts = await res.json();
    console.log('Posts obtenidos en client page:', posts);
  } catch (e) {
    console.error('Error al obtener posts en client page:', e);
    error = e.message;
  }

  // Textos traducidos
  const content = {
    es: {
      title: "Para Clientes - Proyectos y Servicios",
      back: "← Volver al inicio",
      noPosts: "No hay posts disponibles.",
      errorMsg: "Error al cargar los posts",
      postsTitle: "Últimos proyectos"
    },
    en: {
      title: "For Clients - Projects & Services",
      back: "← Back to home",
      noPosts: "No posts available.",
      errorMsg: "Error loading posts",
      postsTitle: "Latest projects"
    }
  };

  const t = content[lang] || content.es;

  return (
    <main className="min-h-screen p-8">
      <Link href={`/${lang}`} className="text-blue-600 hover:underline mb-4 block">
        {t.back}
      </Link>
      
      <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
      
      {/* Mostrar error si existe */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded mb-6">
          <h2 className="text-red-800 font-semibold">{t.errorMsg}</h2>
          <p className="text-red-600">{error}</p>
          <p className="text-gray-600 mt-2">
            URL intentada: <code className="bg-gray-100 px-2 py-1 rounded">{apiUrl}</code>
          </p>
        </div>
      )}
      
      {/* Mostrar posts si hay */}
      {!error && posts.length === 0 && (
        <p className="text-gray-600">{t.noPosts}</p>
      )}
      
      {posts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">{t.postsTitle}</h2>
          <div className="grid gap-6">
            {posts.map(post => (
              <article key={post.id} className="border p-4 rounded-lg shadow-sm">
                <h3 
                  className="text-xl font-semibold mb-2"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <div 
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />
              </article>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}