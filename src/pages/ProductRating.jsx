import RatingView from '../components/RatingView'
import Button from '../components/Button'
import { useForm } from 'react-hook-form'
import { FaStar, FaUpload } from 'react-icons/fa'
import { useState, useRef, useEffect, useCallback } from 'react'
import StarRating from '../components/StarRating'
import { setNotification } from '../store/slices/notificationSlice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import ratingService from '../services/ratingService'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'

const ProductRating = ({ telefono }) => {
  const { id } = useParams()

  const { register, handleSubmit, reset } = useForm()
  const [rating, setRating] = useState(null)
  const [hover, setHover] = useState(null)
  const [image, setImage] = useState(null)
  const [commentList, setCommentList] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const fileInputRef = useRef(null)
  const dispatch = useDispatch()

  //el id del Documento producto es necesario pasarlo por la prop

  const idDoc = Number(id)

  //Obteniendo el id del usuario logueado

  const authUser = useSelector((state) => state.auth.authUser)

  //Verifica si un usuario ya ha realizado un compra del producto
  const checkPurchase = async () => {
    try {
      if (!authUser || !authUser.idUsuario) {
        dispatch(
          setNotification({
            title: '¡UPS!',
            text: 'Debes iniciar sesión primero para poder calificar el producto',
            icon: 'error',
            timer: 3000,
          })
        )
        return
      }
      const idUsuario = authUser.idUsuario

      const request = await ratingService.checkUserPurchase({
        idComprador: idUsuario,
        idProducto: idDoc,
      })

      return { success: true, idVendedor: request.results[0].idVendedor }
    } catch (error) {
      if (error.status === 404) {
        dispatch(
          setNotification({
            title: '¡UPS!',
            text: 'No has adquirido el producto para poder calificarlo',
            icon: 'error',
            timer: 3000,
          })
        )
      }
    }
  }

  //Valida si se introdujo un comentario y se marco alguna estrella
  const validateFields = (Comment, Rating) => {
    if (!Comment || !Rating) {
      dispatch(
        setNotification({
          title: '¡UPS!',
          text: 'Debes calificar con algúna estrella y dejar un comentario',
          icon: 'error',
          timer: 3000,
        })
      )
      return -1
    }
    return 0
  }

  //Carga la imagen
  const ImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
    } else {
      dispatch(
        setNotification({
          title: '¡UPS!',
          text: 'Selecciona un archivo de imagen válido',
          icon: 'error',
          timer: 3000,
        })
      )
    }
  }

  // Obtiene todos las calificaciones del producto es necesario cambiar el valor por la prop
  const getProductRating = useCallback(async () => {
    const getAvgRating = async () => {
      try {
        const request = await ratingService.getAvgRatingProduct(idDoc)
        setAvgRating(request.results[0].avg_calificacion)
      } catch (error) {
        console.error(
          'Error al obtener el promedio de las calificaciones',
          error
        )
      }
    }
    try {
      const request = await ratingService.getRatingProduct(idDoc)
      setCommentList(request.results)
      getAvgRating()
    } catch (error) {
      console.error('Error al obtener las calificaciones', error)
    }
  }, [idDoc])

  //Actualiza el componente cada vez que se agrega un comentario
  useEffect(() => {
    getProductRating()
  }, [getProductRating])

  // Envia la calificación al backend
  const onSubmit = async (data) => {
    try {
      const isPurchase = await checkPurchase()
      if (isPurchase.error === 'login') {
        dispatch(
          setNotification({
            title: '¡UPS!',
            text: 'Debes iniciar sesión primero para poder calificar el producto',
            icon: 'error',
            timer: 3000,
          })
        )
        return
      }

      if (isPurchase.error === 'user') {
        dispatch(
          setNotification({
            title: '¡UPS!',
            text: 'Todavia no has adquirido el producto para poder calificarlo',
            icon: 'error',
            timer: 3000,
          })
        )
        return
      }
      const idUsuario = authUser.idUsuario

      if (
        validateFields(data.calificacion, rating) === 0 &&
        isPurchase.success
      ) {
        if (!image) {
          const request = await ratingService.createRating({
            idUsuarioComprador: idUsuario,
            idUsuarioVendedor: isPurchase.idVendedor,
            idProducto: idDoc,
            comentario: data.calificacion,
            nota: rating,
            foto: null,
          })

          getProductRating()

          dispatch(
            setNotification({
              title: 'Comentario',
              text: 'Tú comentario se ha añadio con éxito',
              icon: 'success',
              timer: 3000,
            })
          )
          return
        }

        const formData = new FormData()
        formData.append('file', image)
        formData.append('upload_preset', 'cicloMart')

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dg354wdzy/image/upload', // Reemplaza con tu cloud name
          formData
        )

        const request = await ratingService.createRating({
          idProducto: idDoc,
          idUsuarioComprador: idUsuario,
          idUsuarioVendedor: isPurchase.idVendedor,
          comentario: data.calificacion,
          foto: response.data.secure_url,
          nota: rating,
        })

        getProductRating()

        dispatch(
          setNotification({
            title: 'Comentario',
            text: 'Tú comentario se ha añadio con éxito',
            icon: 'success',
            timer: 3000,
          })
        )
      }
    } catch (error) {
      console.error('error', error)
      if (error.status === 404) {
        dispatch(
          setNotification({
            title: '¡UPS!',
            text: 'Ocurrio un error. Vuelve a intentarlo',
            icon: 'error',
            timer: 3000,
          })
        )
      }
    } finally {
      setImage(null)
      setRating(null)
      reset()
    }
  }

  //Obtiene el promedio de las calificaciones de un producto
  const getAvgRating = async () => {
    try {
      const request = await ratingService.getAvgRatingProduct(idDoc)
      setAvgRating(request.results[0].avg_calificacion)
    } catch (error) {
      console.error('Error al obtener el promedio de las calificaciones', error)
    }
  }

  const StartGenerate = () => {
    return (
      <div className="Calificacion_Start items-center flex-col flex mt-0">
        <div className="flex">
          {[...Array(5)].map((start, index) => {
            const currentRating = index + 1
            return (
              <label className="inline-block" key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={currentRating}
                  onClick={() => setRating(currentRating)}
                  className="hidden"
                />
                <FaStar
                  className="StartRating cursor-pointer"
                  size={30}
                  color={
                    currentRating <= (hover || rating) ? '#F28A19' : '#e4e5e9'
                  }
                  onMouseEnter={() => setHover(currentRating)}
                  onMouseLeave={() => setHover(null)}
                />
              </label>
            )
          })}
        </div>
        <div>
          <p className="mt-1">Tu calificación es {rating}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col mt-8 px-4 md:px-8 lg:px-16">
      <div className="w-full h-auto border-y border-lgray py-2 flex items-center justify-center">
        <h2 className="font-black text-2xl"> Opiniones del producto</h2>
      </div>
      <div className="h-auto w-full border border-primary mt-6 rounded-xl p-4 md:p-8 shadow-xl flex flex-col md:flex-row mb-6">
        <div className="flex flex-col md:flex-row w-full">
          <div className="flex items-start space-x-12 border-lgray border-r pr-8 flex-wrap">
            <div className="flex space-x-5 items-center">
              <div className="text-7xl font-bold text-primary">
                {(avgRating || 0).toFixed(1)}
              </div>
              <div className="flex flex-col">
                {!avgRating ? (
                  <StarRating rating={0} size="star-large" />
                ) : (
                  <StarRating rating={avgRating} size="star-large" />
                )}
                <p className="text-sm">{commentList.length} comentario(s)</p>
              </div>
            </div>
            <div className="flex flex-col space-y-4 mt-8 lg:mt-0">
              {commentList.length != 0 &&
                commentList.map((val, key) => (
                  <div key={val.idCalificacion}>
                    <RatingView
                      description={val.comentario}
                      date={new Date(
                        val.fechaCalificacion
                      ).toLocaleDateString()}
                      rating={val.puntuacion}
                      image={val.foto}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="mx-auto flex flex-col items-center justify-center mt-4 md:mt-0">
          <p className="py-2 pt-5 font-secondary text-xl">
            Puedes iniciar un chat con el vendedor
          </p>
          <div className="py-4">
            <Link
              to={`https://wa.me/57${telefono}`}
              className="text-center py-1 px-2 bg-primary text-white rounded"
              target="_blank"
              rel="noopener"
            >
              Iniciar chat
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className="flex border-y h-auto border-lgray justify-center py-2 mb-4">
          <h2 className="font-black text-2xl">Deja tú comentario</h2>
        </div>
        <div className="flex flex-col justify-center items-center mt-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full max-w-4xl gap-3"
          >
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-grow">
                <textarea
                  id="calificacion"
                  placeholder="Escribe aquí tu comentario"
                  {...register('calificacion', { required: false })}
                  rows="4"
                  maxLength="45"
                  className="block w-full p-2 border resize-none border-primary rounded-md shadow-sm focus:border-secondary sm:text-sm focus:outline-none"
                />
              </div>
              <div className="relative flex items-center justify-center">
                <div
                  className="bg-gray-200 rounded-full cursor-pointer h-36 w-36 flex items-center justify-center"
                  onClick={() => fileInputRef.current.click()}
                >
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      className="transition duration-200 ease-in-out hover:scale-110 hover:opacity-80 hover:cursor-pointer w-36 h-36 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-center flex items-center">
                      <FaUpload className="mr-2" size={20} /> Subir Imagen
                    </span>
                  )}
                  <input
                    type="file"
                    onChange={ImageUpload}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-0">
              <StartGenerate />
            </div>
            <div className="flex items-center justify-center mb-10">
              <Button
                type="submit"
                className="text-center bg-primary text-white py-2 px-7 rounded-full"
              >
                Enviar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductRating
