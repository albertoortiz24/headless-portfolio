// lib/wordpress/client.js
export const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://greenyellow-vulture-916371.hostingersite.com/';

// Configuración común de fetch
export const defaultFetchOptions = {
  next: { revalidate: 60 },
};

// Función para obtener URL completa de imagen
export function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${WORDPRESS_API_URL}${path}`;
}