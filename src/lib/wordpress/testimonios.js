// lib/wordpress.js - Agregar al final
// src/lib/wordpress/testimonios.js
import { WORDPRESS_API_URL } from './client';
/**
 * Obtener testimonios destacados (carrusel principal)
 */
export async function getTestimoniosDestacados() {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/testimonios/v1/destacados`, {
      next: { revalidate: 60, tags: ['testimonios-destacados'] }
    });
    if (!res.ok) throw new Error('Error al obtener testimonios');
    return await res.json();
  } catch (error) {
    console.error('Error fetching testimonios:', error);
    return [];
  }
}

/**
 * Obtener todos los testimonios
 */
export async function getAllTestimonios() {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/testimonios/v1/all`, {
      next: { revalidate: 60, tags: ['testimonios-all'] }
    });
    if (!res.ok) throw new Error('Error al obtener testimonios');
    return await res.json();
  } catch (error) {
    console.error('Error fetching testimonios:', error);
    return [];
  }
}

/**
 * Obtener reseñas de Google y configuración
 */
export async function getGoogleReviewsData() {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/wp-json/testimonios/v1/google`, {
      next: { revalidate: 3600, tags: ['google-reviews'] }
    });
    if (!res.ok) throw new Error('Error al obtener reseñas de Google');
    return await res.json();
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return { reviews: [], settings: {} };
  }
}