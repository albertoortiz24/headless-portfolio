// src/lib/wordpress/servicios.js
import { WORDPRESS_API_URL } from './client';

export async function getServicios() {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/servicios/v1/all`, {
      next: { revalidate: 60, tags: ['servicios'] }
    });
    if (!res.ok) throw new Error('Error al obtener servicios');
    return await res.json();
  } catch (error) {
    console.error('Error fetching servicios:', error);
    return [];
  }
}