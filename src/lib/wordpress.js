const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://greenyellow-vulture-916371.hostingersite.com/';

/**
 * Obtener todas las marcas y el contador desde WordPress
 */
export async function getMarcas() {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/marcas/v1/all`, {
      next: { 
        revalidate: 3600, // Revalidar cada hora
        tags: ['marcas'] 
      }
    });

    if (!res.ok) {
      throw new Error('Error al obtener marcas');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching marcas:', error);
    return { 
      marcas: [], 
      contador: 50,
      total: 0 
    };
  }
}

/**
 * Obtener URL completa de la imagen
 */
export function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${WORDPRESS_API_URL}${path}`;
}





/**
 * Obtener proyectos destacados desde WordPress
 * @param {string} categoria - Slug de categoría (opcional)
 */
export async function getProyectosDestacados(categoria = '') {
  try {
    let url = `${WORDPRESS_API_URL}/wp-json/proyectos/v1/destacados`;
    if (categoria) {
      url += `?categoria=${categoria}`;
    }
    
    const res = await fetch(url, {
      next: { 
        revalidate: 3600,
        tags: ['proyectos'] 
      }
    });

    if (!res.ok) throw new Error('Error al obtener proyectos');
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching proyectos:', error);
    return { proyectos: [], total: 0 };
  }
}

/**
 * Obtener categorías de proyectos
 */
export async function getCategoriasProyectos() {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/proyectos/v1/categorias`, {
      next: { 
        revalidate: 3600,
        tags: ['categorias-proyecto'] 
      }
    });

    if (!res.ok) throw new Error('Error al obtener categorías');
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching categorias:', error);
    return [];
  }
}

/**
 * Obtener un proyecto por su slug
 * @param {string} slug - Slug del proyecto
 */
export async function getProyectoBySlug(slug) {
  try {
    const res = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/proyectos?slug=${slug}&_embed`,
      {
        next: { 
          revalidate: 3600,
          tags: [`proyecto-${slug}`] 
        }
      }
    );

    if (!res.ok) throw new Error('Error al obtener proyecto');
    
    const posts = await res.json();
    if (posts.length === 0) return null;
    
    const post = posts[0];
    
    // Obtener categorías
    const categorias = await Promise.all(
      post.categoria_proyecto.map(async (catId) => {
        const catRes = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/categoria_proyecto/${catId}`);
        return catRes.json();
      })
    );
    
    return {
      id: post.id,
      titulo: post.title.rendered,
      descripcion_corta: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
      descripcion_completa: post.content.rendered,
      imagen_destacada: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      url_sitio: post.meta?._proyecto_url_sitio || '',
      url_cotizar: post.meta?._proyecto_url_cotizar || '',
      categorias: categorias.map(c => ({ nombre: c.name, slug: c.slug })),
      slug: post.slug,
    };
  } catch (error) {
    console.error('Error fetching proyecto by slug:', error);
    return null;
  }
}

/**
 * Obtener todos los slugs para generación estática
 */
export async function getAllProyectoSlugs() {
  try {
    const res = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/proyectos?per_page=100&_fields=slug`,
      {
        next: { revalidate: 3600 }
      }
    );

    if (!res.ok) throw new Error('Error al obtener slugs');
    
    const data = await res.json();
    return data.map(post => ({ slug: post.slug }));
  } catch (error) {
    console.error('Error fetching slugs:', error);
    return [];
  }
}









