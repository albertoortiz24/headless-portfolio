// lib/wordpress/proyectos.js
import { WORDPRESS_API_URL, defaultFetchOptions } from './client';

/**
 * Obtener proyectos destacados desde WordPress
 */
export async function getProyectosDestacados(categoria = '') {
  try {
    let url = `${WORDPRESS_API_URL}/wp-json/proyectos/v1/destacados`;
    if (categoria) url += `?categoria=${categoria}`;
    
    const res = await fetch(url, {
      next: { ...defaultFetchOptions.next, tags: ['proyectos'] }
    });

    if (!res.ok) throw new Error('Error al obtener proyectos');
    return await res.json();
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
      next: { ...defaultFetchOptions.next, tags: ['categorias-proyecto'] }
    });

    if (!res.ok) throw new Error('Error al obtener categorías');
    return await res.json();
  } catch (error) {
    console.error('Error fetching categorias:', error);
    return [];
  }
}

/**
 * Obtener un proyecto por su slug
 */
export async function getProyectoBySlug(slug) {
  try {
    const res = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/proyectos?slug=${slug}&_embed`,
      { next: { ...defaultFetchOptions.next, tags: [`proyecto-${slug}`] } }
    );

    if (!res.ok) throw new Error('Error al obtener proyecto');
    
    const posts = await res.json();
    if (posts.length === 0) return null;
    
    const post = posts[0];
    
    const categorias = await Promise.all(
      (post.categoria_proyecto || []).map(async (catId) => {
        const catRes = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/categoria_proyecto/${catId}`);
        return catRes.json();
      })
    );
    
    return {
      id: post.id,
      titulo: post.title?.rendered || '',
      descripcion_corta: post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
      descripcion_completa: post.content?.rendered || '',
      imagen_destacada: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      url_sitio: post.meta?._proyecto_url_sitio || '',
      url_cotizar: post.meta?._proyecto_url_cotizar || '',
      categorias: categorias.map(c => ({ id: c.id, nombre: c.name, slug: c.slug })),
      slug: post.slug,
    };
  } catch (error) {
    console.error('Error fetching proyecto by slug:', error);
    return null;
  }
}

/**
 * Obtener un proyecto COMPLETO por su slug (con todos los campos nuevos)
 */
export async function getProyectoCompletoBySlug(slug) {
  try {
    const res = await fetch(
      `${WORDPRESS_API_URL}/wp-json/proyectos/v1/proyecto/${slug}`,
      { next: { ...defaultFetchOptions.next, tags: [`proyecto-completo-${slug}`] } }
    );

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Error al obtener proyecto');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching proyecto completo:', error);
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
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error('Error al obtener slugs');
    
    const data = await res.json();
    return data.map(post => ({ slug: post.slug }));
  } catch (error) {
    console.error('Error fetching slugs:', error);
    return [];
  }
}