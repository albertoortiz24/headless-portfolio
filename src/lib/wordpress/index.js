// lib/wordpress/index.js
export { WORDPRESS_API_URL, getImageUrl } from './client';

// Marcas
export { getMarcas } from './marcas';

// Proyectos
export { 
  getProyectosDestacados,
  getCategoriasProyectos,
  getProyectoBySlug,
  getAllProyectoSlugs,
  getProyectoCompletoBySlug
} from './proyectos';

// Skills
export { getSkills } from './skills';

// Experiencia
export { getExperiencia } from './experiencia';

// Noticias
export {
  getNoticiasDestacadas,
  getAllNoticiasBlog,
  getNoticiaBySlug,
  getNoticiasRelacionadas,
  getNoticiasRecientes,
  getNoticiasMasVistas,
  getCategoriasNoticias
} from './noticias';

// Testimonios
export {
    getTestimoniosDestacados,
    getAllTestimonios,
    getGoogleReviewsData
} from './testimonios';


export { getServicios } from './servicios';