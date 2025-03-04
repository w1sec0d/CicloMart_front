import { useParams } from 'react-router-dom'
import Photo from '../assets/userPhoto.png'
import { FaClockRotateLeft } from 'react-icons/fa6'
import StarRating from '../components/StarRating'
import ratingService from '../services/ratingService'
import { useState, useEffect } from 'react'
import RatingSeller from '../components/Vendedor/RatingSeller'
import Modal from 'react-modal'
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'

Modal.setAppElement('#root')

//Navbar para las opciones de filtrado
const Navbar = ({ setFilter }) => {
  const buttonClasses =
    'rounded-full p-1 bg-lgray hover:bg-blue-500 hover:text-white transition-all duration-300'

  return (
    <nav className="flex items-center justify-between w-full gap-8 px-6 py-3 flex-wrap">
      <div>
        <h1 className="flex text-3xl font-bold">Reseñas</h1>
      </div>
      <div className="rounded-lg md:rounded-full bg-lgray p-2 px-3 space-x-4 items-center w-full md:w-fit flex flex-wrap justify-center">
        {['Recientes', 'Con Fotos', 'Positivas', 'Neutrales', 'Negativas'].map(
          (label) => (
            <button
              key={label}
              className={buttonClasses}
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          )
        )}
      </div>
    </nav>
  )
}

const Vendedor = () => {
  const { id } = useParams()
  const [results, setResults] = useState([])
  const [promedio, setPromedio] = useState(0)
  const [size, setSize] = useState(0)
  const [positivas, setPositivas] = useState([])
  const [neutras, setNeutras] = useState([])
  const [negativas, setNegativas] = useState([])
  const [conFoto, setConFoto] = useState([])
  const [recientes, setRecientes] = useState([])
  const [filter, setFilter] = useState('Recientes')
  const [modalIsOpen, setModalIsOpen] = useState(false)

  //Establece los datos para uso en los filtros
  const establecerDatos = (results) => {
    const sumaNotas = results.reduce((suma, { nota }) => suma + nota, 0)
    const promedio = results.length ? sumaNotas / results.length : 0
    const size =
      results.length === 1 && results[0].nota === null ? 0 : results.length
    const positivas = results.filter(({ nota }) => nota >= 4 && nota !== null)
    const neutras = results.filter(({ nota }) => nota === 3 && nota !== null)
    const negativas = results.filter(({ nota }) => nota < 3 && nota !== null)
    const conFoto = results.filter(({ foto }) => foto !== null && foto !== '')
    const recientes = results
      .filter(({ fecha }) => fecha !== null)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 2)

    setResults(results[0])
    setPromedio(promedio)
    setSize(size)
    setPositivas(positivas)
    setNeutras(neutras)
    setNegativas(negativas)
    setConFoto(conFoto)
    setRecientes(recientes)
  }

  //Obtine todas las calificaciones del vendedor
  const getRatingSeller = async () => {
    try {
      const results = await ratingService.getRatingSeller(id)
      establecerDatos(results)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getRatingSeller()
  }, [id])

  //Aplica filtros con base en la elección del usuario
  const filterResults = (() => {
    switch (filter) {
      case 'Positivas':
        return positivas
      case 'Neutrales':
        return neutras
      case 'Negativas':
        return negativas
      case 'Con Fotos':
        return conFoto
      case 'Recientes':
        return recientes
      default:
        return recientes
    }
  })()

  return (
    <div className="relative flex bg-lgray justify-center min-h-screen">
      <div className="flex flex-col w-[100%] mt-6 h-full px-4 lg:px-0">
        <div className="flex flex-col lg:flex-row items-center bg-white rounded-3xl p-6 mt-1 lg:mx-[170px] mx-2 h-auto lg:h-52 w-auto shadow-lg lg:pl-20">
          <div className="flex relative ml-4">
            <img
              src={results.imagenVendedor || Photo}
              className="w-36 h-36 rounded-full"
              alt="Foto de perfil"
            />
          </div>
          <div className="flex flex-col lg:ml-[50px] mt-4 lg:mt-0 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row items-center">
              <b className="text-2xl lg:text-4xl">{results.nombre}</b>
              <b className="text-2xl lg:text-4xl">&nbsp;{results.apellido}</b>
            </div>
            <div className="flex flex-col lg:flex-row items-center space-x-0 lg:space-x-7 mt-5 text-center lg:text-left">
              <div className="flex items-center space-x-3">
                <StarRating rating={promedio} size="star-large" />
                <p>
                  {promedio.toFixed(1)} - {size}{' '}
                  <strong className="text-black font-bold">reseñas</strong>
                </p>
              </div>
              <div className="flex space-x-1 mt-3 lg:mt-0">
                <FaClockRotateLeft size={24} color="#A2C634" />
                <p className="text-1xl">
                  Fecha de registro:{' '}
                  {new Date(results.fechaRegistro).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              {results.reporte === 0 ? (
                <div className="flex items-center justify-center space-x-2">
                  <ThumbUpAltIcon style={{ fontSize: 30, color: '#A2C634' }} />
                  <div className="flex flex-col">
                    <p className="text-1xl text-black ">
                      Este usuario <strong>no tiene</strong>
                    </p>
                    <p className="text-1xl text-black font-bold ">
                      reportes negativos
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <ThumbDownAltIcon
                    style={{ fontSize: 30, color: '#F28A19' }}
                  />
                  <div className="flex flex-col">
                    <p className="text-1xl text-black ">
                      Este usuario <strong>tiene</strong>
                    </p>
                    <p className="text-1xl text-black font-bold">
                      reportes negativos
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-3 bg-white rounded-3xl lg:mx-[170px] mx-2 h-auto lg:h-[70vh] mb-5 w-auto shadow-lg p-2">
          <Navbar setFilter={setFilter} />
          <div className="flex flex-col px-6">
            {filterResults.slice(0, 2).map((review, index) => (
              <RatingSeller
                key={index}
                description={review.comentario}
                date={review.fecha}
                rating={review.nota}
                image={review.foto}
                idProducto={review.idProducto}
                nombreComprador={review.nombreComprador}
                apellidoComprador={review.apellidoComprador}
                imageCom={review.imagenComprador}
              />
            ))}
            <div className="flex items-center justify-center">
              {filterResults.length > 2 && (
                <button
                  className="px-4 py-1 bg-blue-500 text-white rounded-full"
                  onClick={() => setModalIsOpen(true)}
                >
                  Ver más reseñas
                </button>
              )}
            </div>
          </div>
          <div className="justify-center items-center my-8 lg:mt-32">
            {filterResults.length === 0 && (
              <div className="flex flex-col items-center justify-center">
                <SentimentDissatisfiedIcon style={{ fontSize: 60 }} />
                <p className="text-center text-2xl justify-center mt-5">
                  No hay reseñas para mostrar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Todas las calificaciones"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="relative bg-white w-full max-w-4xl max-h-[80vh] p-8 mt-6 overflow-y-auto rounded-lg">
          <button
            className="absolute top-4 right-4 bg-gray-200 text-tertiary hover:bg-tertiary hover:text-white active:outline-neutral-300 focus:outline-neutral-300 rounded-full p-2"
            onClick={() => setModalIsOpen(false)}
          >
            Cerrar
          </button>
          <h2 className="text-2xl font-bold mb-4">Todas las calificaciones</h2>
          <div className="flex flex-col px-2">
            {filterResults.map((review, index) => (
              <RatingSeller
                key={index}
                description={review.comentario}
                date={review.fecha}
                rating={review.nota}
                image={review.foto}
                idProducto={review.idProducto}
                nombreComprador={review.nombreComprador}
                apellidoComprador={review.apellidoComprador}
                imageCom={review.imagenComprador}
              />
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Vendedor
