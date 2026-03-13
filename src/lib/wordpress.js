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