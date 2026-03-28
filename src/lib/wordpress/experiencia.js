// lib/wordpress/experiencia.js
import { WORDPRESS_API_URL, defaultFetchOptions } from './client';

/**
 * Obtener experiencia/CV desde WordPress
 */
export async function getExperiencia() {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/experiencia/v1/all`, {
      next: { ...defaultFetchOptions.next, tags: ['experiencia'] }
    });
    if (!res.ok) throw new Error('Error al obtener experiencia');
    return await res.json();
  } catch (error) {
    console.error('Error fetching experiencia:', error);
    return {};
  }
}