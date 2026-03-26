
import BannerInicio from "./components/Banner-inicio";
import Marcas from "./components/Marcas.jsx";
import CarruselTecnologias from "./components/Carrusel-tecnologias.jsx";
import GridProyectos from "./components/GridProyectos";
import TechSkills from "./components/TechSkills";
import BlogSection from "./components/BlogSection";  // ← NUEVO
export default function Page() {
  return (
    <div>
      <BannerInicio />
       <Marcas />
        <GridProyectos />
          <TechSkills />      
      <BlogSection />  // ← NUEVO
      <CarruselTecnologias />
    </div>
  )
}