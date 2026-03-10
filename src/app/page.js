// app/page.js - Versión CORREGIDA y SIMPLIFICADA
export default async function Home() {
  // 1. Definir la URL de tu API (¡AHORA CON TU DOMINIO CORRECTO!)
  const apiUrl = 'https://greenyellow-vulture-916371.hostingersite.com/wp-json/wp/v2/posts';
  
  // 2. Variable para almacenar los posts
  let posts = [];
  let error = null;

  // 3. Intentar obtener los posts
  try {
    const res = await fetch(apiUrl, {
      // Opción: revalidar cada 60 segundos (opcional)
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }
    
    posts = await res.json();
    console.log('Posts obtenidos:', posts); // Para ver en la terminal
  } catch (e) {
    console.error('Error al obtener posts:', e);
    error = e.message;
  }

  // 4. Renderizar la página
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">
        Mi Headless WordPress 🚀
      </h1>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          <h2 className="text-red-800 font-semibold">Error de conexión</h2>
          <p className="text-red-600">{error}</p>
          <p className="text-gray-600 mt-2">
            URL intentada: <code className="bg-gray-100 px-2 py-1 rounded">{apiUrl}</code>
          </p>
        </div>
      ) : posts.length === 0 ? (
        <p className="text-gray-600">No hay posts publicados.</p>
      ) : (
        <div className="grid gap-6">
          {posts.map(post => (
            <article key={post.id} className="border p-4 rounded-lg shadow-sm">
              <h2 
                className="text-2xl font-semibold mb-2"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
              <div 
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
              />
              <hr className="mt-4" />
            </article>
          ))}
        </div>
      )}
    </main>
  );
}