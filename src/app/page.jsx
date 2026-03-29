
import BannerInicio from "./components/Banner-inicio";
import Marcas from "./components/Marcas.jsx";
import CarruselTecnologias from "./components/Carrusel-tecnologias.jsx";
import GridProyectos from "./components/GridProyectos";
import TechSkills from "./components/TechSkills";
import BlogSection from "./components/BlogSection"; 
import Testimonios from "./components/Testimonios";
import ConstructionModal from "./components/ConstructionModal"; // ← NUEVO
export default function Page() {
  return (
    <div>
      <ConstructionModal /> 
      <BannerInicio />
       <Marcas />
        <GridProyectos />
        <TechSkills />      
        <BlogSection /> 
        <Testimonios />
      <CarruselTecnologias />
    </div>
  )
}