// lib/wordpress/skills.js
import { WORDPRESS_API_URL, defaultFetchOptions } from './client';

/**
 * Obtener todas las skills tecnológicas desde WordPress
 */
export async function getSkills() {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/skills/v1/all`, {
      next: { ...defaultFetchOptions.next, tags: ['skills'] }
    });

    if (!res.ok) throw new Error('Error al obtener skills');

    return await res.json();
  } catch (error) {
    console.error('Error fetching skills:', error);
    return { stack: [], learning: [], total: 0 };
  }
}