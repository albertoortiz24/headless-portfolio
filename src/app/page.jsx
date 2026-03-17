
import BannerInicio from "./components/Banner-inicio";
import Marcas from "./components/Marcas.jsx";
import CarruselTecnologias from "./components/Carrusel-tecnologias.jsx";
import GridProyectos from "./components/GridProyectos";
export default function Page() {
  return (
    <div>
      <BannerInicio />
       <Marcas />
        <GridProyectos />
      <CarruselTecnologias />
    </div>
  )
}