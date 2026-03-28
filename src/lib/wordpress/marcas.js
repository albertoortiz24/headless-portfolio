// lib/wordpress/marcas.js
import { WORDPRESS_API_URL, defaultFetchOptions } from './client';

/**
 * Obtener todas las marcas y el contador desde WordPress
 */
export async function getMarcas() {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/marcas/v1/all`, {
      next: { 
        ...defaultFetchOptions.next,
        tags: ['marcas'] 
      }
    });

    if (!res.ok) throw new Error('Error al obtener marcas');

    return await res.json();
  } catch (error) {
    console.error('Error fetching marcas:', error);
    return { marcas: [], contador: 50, total: 0 };
  }
}