//Componentes
import ExposurePrice from '../components/Exposure/ExposurePrice'
import GradeInformation from '../components/Exposure/GradeInformation'

const ExposureInfo = () => {
  return (
    <div className="w-full h-auto flex flex-col">
      <div className="bg-secondary h-14 w-full flex items-center justify-center drop-shadow-lg">
        <h1 className="text-xl font-bold text-center">Grados de exposición en CicloMart</h1>
      </div>
      <div className="flex flex-col h-auto w-full mt-8 mb-8 px-4 sm:px-8">
        <div>
          <h2 className="font-bold bg-tertiary py-3 px-3 rounded-tr-xl w-full sm:w-64 drop-shadow-lg">
            GRADOS DE EXPOSICIÓN
          </h2>
        </div>
        <div className="mt-4">
          <p>
            Los grados de exposición son útiles para posicionar la publicación
            de un producto (bicicletas y repuesto) en las secciones principales
            de CicloMart (sección de bicicletas, repuesto u ofertas) por encima
            de otras publicaciones con un grado de exposición menor. Además
            también son útiles para ordenar el orden de aparición de los
            productos en la sección de búsqueda de productos.{' '}
            <p className="inline-block text-primary font-bold">
              ¡Consulta nuestros formas de pago y selecciona una que se ajuste a
              lo que buscas!{' '}
            </p>
          </p>
        </div>
      </div>

      {/* Grados de exposición y selección */}
      <div className="bg-lgray/[.37] w-full h-auto px-4 sm:px-8">
        <div className="mb-20">
          <h2 className="bg-primary py-3 px-3 font-bold rounded-tr-xl w-full sm:w-64 drop-shadow-lg">
            FORMAS DE PAGO
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16 pb-8">
          <ExposurePrice grade={1} />
          <ExposurePrice grade={2} />
          <ExposurePrice grade={3} />
          <ExposurePrice grade={4} />
        </div>
      </div>

      {/*Como funciona? Información de grados para dar info al vendedor */}
      <div className="flex flex-col px-4 sm:px-8">
        <div className="mb-4">
          <h2 className="bg-tertiary w-full sm:w-64 rounded-tr-xl mt-5 py-3 px-3 font-bold drop-shadow-lg">
            ¿COMO FUNCIONA?
          </h2>
        </div>
        <GradeInformation grade={0} />
        <GradeInformation grade={1} />
        <GradeInformation grade={2} />
        <GradeInformation grade={3} />
        <GradeInformation grade={4} />
      </div>
    </div>
  )
}

export default ExposureInfo
