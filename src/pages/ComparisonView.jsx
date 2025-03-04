import React from 'react'
import { useQuery } from 'react-query'
import { useParams, Link } from 'react-router-dom'
import { getProductById } from '../services/productService'
import BuyButton from '../components/Comparison/BuyButton'
import ComparisionSection from '../components/Comparison/ComparisionSection'
import Loading from '../components/Loading'
import DisplayImg from '../components/Comparison/DisplayImg'
import SouthIcon from '@mui/icons-material/South'
import Photo from '../assets/userPhoto.png'

const Header = ({ product1, product2 }) => {
  return (
    <div className="h-[50px] flex flex-row relative">
      <BuyButton producto={product1}>{product1.precio}</BuyButton>
      <div className="z-10 h-5/6 bg-lblue w-full absolute top-0 left-0 rounded-t-3xl flex justify-center items-center">
        <b className="text-xl mx-4">Comparación</b>
      </div>
      <BuyButton
        className={
          'ml-auto rounded-tl-none rounded-br-none rounded-bl-[3rem] rounded-tr-3xl bg-secondary'
        }
        producto={product2}
      >
        {product2.precio}
      </BuyButton>
    </div>
  )
}

const ComparisonView = () => {
  const { id1, id2 } = useParams()

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery(['productos', id1, id2], async () => {
    const [product1, product2] = await Promise.all([
      getProductById(id1),
      getProductById(id2),
    ])
    return { product1, product2 }
  })

  if (isLoading) return <Loading />
  if (isError) return <p>{isError.message}</p>

  const { product1, product2 } = products

  //Captura las keys de cada uno de los productos
  const propertiesProduct1 = Object.keys(product1)
  const propertiesProduct2 = Object.keys(product2)

  // Filtra las propiedades que existen en product1 y product2 para imprimir solo lo existente en cada producto
  const filteredProperties1 = propertiesProduct1.filter(
    (property) =>
      product1[property] &&
      !property.startsWith('id') &&
      !property.startsWith('imagen') &&
      !property.startsWith('nombre')
  )

  const filteredProperties2 = propertiesProduct2.filter(
    (property) =>
      product2[property] &&
      !property.startsWith('id') &&
      !property.startsWith('imagen') &&
      !property.startsWith('nombre')
  )

  //Elimina keys duplicadas
  const properties = filteredProperties1.concat(filteredProperties2)
  const uniqProperties = [...new Set(properties)]

  //Captura las coindencias entre los productos y retorna las keys sin duplicados
  const coincidences = uniqProperties.filter((property) => {
    return (
      filteredProperties1.includes(property) &&
      filteredProperties2.includes(property)
    )
  })

  //Captura las discrepancias entre los productos
  const discrepancies = uniqProperties.filter(
    (property) =>
      !filteredProperties2.includes(property) ||
      !filteredProperties1.includes(property)
  )

  return (
    <div className="h-auto flex flex-col">
      <div className="h-auto w-auto mx-10 mb-8 my-10 rounded-3xl bg-white drop-shadow-lg flex flex-col">
        {/*Header */}
        <Header product1={product1} product2={product2} />
        {/*Sección nombre y foto producto 1 y 2 respectivamente*/}
        <div className="h-72 flex flex-row w-full">
          <DisplayImg product={product1} />
          <DisplayImg product={product2} />
        </div>
        {/*Sección elementos compartidos producto 1 y 2 respectvamente */}
        <ComparisionSection
          title={'Elementos Compartidos'}
          product1={product1}
          product2={product2}
          coincidences={coincidences}
          highlightDiffs={true}
        />
        {/*Sección elementos Agregados */}
        {discrepancies.length > 0 && (
          <ComparisionSection
            title={'Agregados'}
            className1={'rounded-bl-3xl'}
            className2={'rounded-br-3xl'}
            product1={product1}
            product2={product2}
            coincidences={discrepancies}
          />
        )}
      </div>

      <div className="flex justify-center">
        <SouthIcon style={{ fontSize: '9rem', opacity: 0.1 }}></SouthIcon>
      </div>
      <div className="h-auto w-auto mx-10 mb-8 my-10 rounded-bl-3xl rounded-br-3xl bg-white drop-shadow-lg flex flex-col">
        <div className="text-black h-10 border-y border-y-lgray w-full flex flex-row items-center justify-center  text-xl bg-lblue opacity-80">
          {/*Muestra un botón para resaltar diferencias */}
          <b>Información vendedores</b>
        </div>
        <div className="flex flex-row items-center">
          <div className="w-1/2 h-auto border-r border-lgray flex flex-row items-center justify-center">
            <img src={Photo} className="h-24 w-24 ml-2 my-2" />
            <div className="flex flex-col ml-4">
              <b>
                {product1.nombreVendedor} {product1.apellidoVendedor}
              </b>
              <p>{product1.correoVendedor}</p>
              <Link
                className="text-sm text-blue-500"
                to={`/vendedor/${product1.idVendedor}`}
              >
                Ver reseñas vendedor
              </Link>
            </div>
          </div>
          <div className="w-1/2 h-auto border-r border-lgray flex flex-row items-center justify-center">
            <img src={Photo} className="h-24 w-24 ml-2 my-2" />
            <div className="flex flex-col ml-4">
              <b>
                {product2.nombreVendedor} {product2.apellidoVendedor}
              </b>
              <p>{product2.correoVendedor}</p>
              <Link
                className="text-sm text-blue-500"
                to={`/vendedor/${product2.idVendedor}`}
              >
                Ver reseñas vendedor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparisonView
