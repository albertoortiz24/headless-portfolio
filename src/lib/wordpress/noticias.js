// lib/wordpress/noticias.js
import { WORDPRESS_API_URL, defaultFetchOptions } from './client';

/**
 * Obtener noticias destacadas desde WordPress
 */
export async function getNoticiasDestacadas() {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/noticias/v1/destacadas`, {
      next: { ...defaultFetchOptions.next, tags: ['noticias-destacadas'] }
    });
    if (!res.ok) throw new Error('Error al obtener noticias destacadas');
    return await res.json();
  } catch (error) {
    console.error('Error fetching noticias:', error);
    return [];
  }
}

/**
 * Obtener todas las noticias del blog
 */
export async function getAllNoticiasBlog() {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/noticias/v1/all`, {
      next: { ...defaultFetchOptions.next, tags: ['noticias-all'] }
    });
    if (!res.ok) throw new Error('Error al obtener noticias');
    return await res.json();
  } catch (error) {
    console.error('Error fetching noticias:', error);
    return [];
  }
}

/**
 * Obtener una noticia por su slug
 */
export async function getNoticiaBySlug(slug) {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/noticias?slug=${slug}&_embed`, {
      next: { ...defaultFetchOptions.next, tags: [`noticia-${slug}`] }
    });
    
    if (!res.ok) throw new Error('Error al obtener noticia');
    
    const posts = await res.json();
    if (posts.length === 0) return null;
    
    const post = posts[0];
    
    let imagenUrl = '';
    if (post._embedded?.['wp:featuredmedia']?.[0]) {
      imagenUrl = post._embedded['wp:featuredmedia'][0].source_url;
    }
    
    let categoria = 'General';
    if (post.categoria_noticia?.length > 0) {
      try {
        const catRes = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/categorias-noticia/${post.categoria_noticia[0]}`);
        const catData = await catRes.json();
        categoria = catData.name;
      } catch (err) {
        console.error('Error fetching category:', err);
      }
    }
    
    return {
      id: post.id,
      titulo: post.title?.rendered || '',
      descripcion: post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
      contenido: post.content?.rendered || '',
      imagen: imagenUrl,
      categoria: categoria,
      fecha: new Date(post.date).toLocaleDateString('es-ES', { 
        day: 'numeric', month: 'long', year: 'numeric' 
      }),
      slug: post.slug,
    };
  } catch (error) {
    console.error('Error fetching noticia by slug:', error);
    return null;
  }
}

/**
 * Obtener noticias relacionadas por categoría
 */
export async function getNoticiasRelacionadas(slug, limit = 3) {
  try {
    const currentRes = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/noticias?slug=${slug}`);
    const currentPosts = await currentRes.json();
    if (currentPosts.length === 0) return [];
    
    const currentPost = currentPosts[0];
    const categoriaId = currentPost.categoria_noticia?.[0];
    
    if (!categoriaId) return [];
    
    const res = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/noticias?categoria_noticia=${categoriaId}&per_page=${limit}&exclude=${currentPost.id}&_embed`,
      { next: { ...defaultFetchOptions.next, tags: ['noticias-relacionadas'] } }
    );
    
    if (!res.ok) throw new Error('Error al obtener noticias relacionadas');
    const posts = await res.json();
    
    return posts.map(post => {
      let imagenUrl = '';
      if (post._embedded?.['wp:featuredmedia']?.[0]) {
        imagenUrl = post._embedded['wp:featuredmedia'][0].source_url;
      }
      return {
        id: post.id,
        titulo: post.title?.rendered || '',
        descripcion: post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
        imagen: imagenUrl,
        categoria: 'Categoría',
        fecha: new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
        slug: post.slug,
      };
    });
  } catch (error) {
    console.error('Error fetching noticias relacionadas:', error);
    return [];
  }
}

/**
 * Obtener noticias recientes
 */
export async function getNoticiasRecientes(limit = 5) {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/noticias?per_page=${limit}&_embed`, {
      next: { ...defaultFetchOptions.next, tags: ['noticias-recientes'] }
    });
    if (!res.ok) throw new Error('Error al obtener noticias recientes');
    const posts = await res.json();
    
    return posts.map(post => {
      let imagenUrl = '';
      if (post._embedded?.['wp:featuredmedia']?.[0]) {
        imagenUrl = post._embedded['wp:featuredmedia'][0].source_url;
      }
      return {
        id: post.id,
        titulo: post.title?.rendered || '',
        descripcion: post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
        imagen: imagenUrl,
        fecha: new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
        slug: post.slug,
      };
    });
  } catch (error) {
    console.error('Error fetching noticias recientes:', error);
    return [];
  }
}

/**
 * Obtener noticias más vistas (simulado)
 */
export async function getNoticiasMasVistas(limit = 5) {
  return getNoticiasRecientes(limit);
}

/**
 * Obtener categorías de noticias
 */
export async function getCategoriasNoticias() {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/categorias-noticia?per_page=100`, {
      next: { ...defaultFetchOptions.next, tags: ['categorias-noticia'] }
    });
    if (!res.ok) throw new Error('Error al obtener categorías');
    const data = await res.json();
    return data.map(cat => ({
      id: cat.id,
      nombre: cat.name,
      slug: cat.slug,
      contador: cat.count
    }));
  } catch (error) {
    console.error('Error fetching categorias:', error);
    return [];
  }
}