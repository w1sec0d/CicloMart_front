// src/components/ProductForm.js
import React, { useState } from 'react'
import BycicleForm from './BycicleForm'
import SparePartForm from './SparePartForm'
import GeneralInfo from './GeneraInfo'
import AvailabilityForm from './AvailabilityForm'
import Button from '../Button'

const ProductForm = ({ type, onSubmit, models, brands }) => {
  const [step, setStep] = useState(1)
  const [product, setProduct] = useState({
    nombre: '',
    tipo: type,
    descripcion: '',
    precio: '',
    imagenes: [],
    idMarca: '',
    modelo: '',
    disponibilidad: '',
    retiro: false,
    costoEnvio: '',
    estado: '',
  })

  const [bycicle, setBycicle] = useState({
    tipoBicicleta: '',
    color: '',
    genero: '',
    edad: '',
    tamañoMarco: '',
    materialMarco: '',
    modeloMarco: '',
    modeloRuedas: '',
    tamañoRueda: '',
    tipoFrenos: '',
    modeloFrenos: '',
    tipoManubrio: '',
    modeloManubrio: '',
    tipoSuspension: '',
    velocidades: '',
    transmision: '',
    tipoPedales: '',
    pesoBicicleta: '',
    pesoMaximo: '',
    modeloPedales: '',
    modeloCassette: '',
    modeloSillin: '',
    modeloCadena: '',
    extras: '',
  })

  const [componentData, setComponentData] = useState({
    compatibilidad: '',
    modelo: '',
    categoria: '',
    marca: '',
  })

  const [imagePreviews, setImagePreviews] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (type === 'bicicleta') {
      onSubmit(product, bycicle)
    } else if (type === 'componente') {
      onSubmit(product, componentData)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: value })
  }

  const handleBCchange = (e) => {
    const { name, value } = e.target
    if (type === 'bicicleta') setBycicle({ ...bycicle, [name]: value })
    else setComponentData({ ...componentData, [name]: value })
  }

  const handleBrandChange = (e) => {
    const { value, id } = e.target
    setProduct({ ...product, idMarca: id })
    //getModels(type, id)
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setProduct({ ...product, images: files })

    const previews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews(previews)
  }

  const handleComponentChange = (e) => {
    const { name, value } = e.target
    setComponentData({ ...componentData, [name]: value })
  }

  const handleBycicleChange = (event) => {
    const { id, value } = event.target
    setBycicle({ ...bycicle, [id]: value })
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Publicar {type}</h1>
        <div className="w-full m-15 px-20 ">
          <form onSubmit={handleSubmit} className="w-full space-y-5 p-4">
            {step === 1 && (
              <GeneralInfo
                product={product}
                handleChange={handleChange}
                handleImageChange={handleImageChange}
                handleBrandChange={handleBrandChange}
                imagePreviews={imagePreviews}
                brands={brands}
              />
            )}

            {step === 2 && (
              <>
                {type === 'bicicleta' && (
                  <BycicleForm
                    bycicle={bycicle}
                    handleChange={handleBCchange}
                  />
                )}
                {type === 'componente' && (
                  <SparePartForm
                    componentData={componentData}
                    handleChange={handleComponentChange}
                  />
                )}
              </>
            )}

            {step === 3 && (
              <AvailabilityForm product={product} handleChange={handleChange} />
            )}
            {/* {type === 'bicicleta' && <BycicleForm onSubmit={onSubmit} />}
            {type === 'repuesto' && <SparePartForm onSubmit={onSubmit} />} */}
          </form>
          {step > 1 && (
            <Button
              type="button"
              onClick={handlePrevious}
              className="justify-center"
            >
              Anterior
            </Button>
          )}

          {step < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="justify-center"
            >
              Siguiente
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={handleSubmit}
              className="justify-center"
            >
              Publicar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductForm
