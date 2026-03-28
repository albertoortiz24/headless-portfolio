
import BannerInicio from "./components/Banner-inicio";
import Marcas from "./components/Marcas.jsx";
import CarruselTecnologias from "./components/Carrusel-tecnologias.jsx";
import GridProyectos from "./components/GridProyectos";
import TechSkills from "./components/TechSkills";
import BlogSection from "./components/BlogSection"; 
import Testimonios from "./components/Testimonios";
export default function Page() {
  return (
    <div>
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