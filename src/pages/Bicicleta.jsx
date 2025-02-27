//Componentes
import ItemContainer from '../components/ItemContainer'
import ComparisonBar from '../components/Comparison/ComparisonBar'
import Input from '../components/Input'

//Utilidades
import { useQuery } from 'react-query'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading, clearLoading } from '../store/slices/loadingSlice'
import ReactPaginate from 'react-paginate'
import Fuse from 'fuse.js'

//Icons
import { IoIosArrowForward } from 'react-icons/io'
import { IoIosArrowBack } from 'react-icons/io'

//Servicios
import { getBicicletas, getProducts } from '../services/productService'

const Bicicleta = () => {
  const dispatch = useDispatch()
  const itemsPerPage = 5
  const [currentPage, setCurrentPage] = useState(0)
  const [query, setQuery] = useState('')

  //Trae bicicletas
  const {
    data: bicicletas,
    isError,
    isLoading,
  } = useQuery(['productos'], getProducts)

  // Maneja cambio de página
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected)
  }

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading())
    } else {
      dispatch(clearLoading())
    }
  }, [isLoading, dispatch])

  if (isLoading) return null
  if (isError) return <p>Error: {isError.message}</p>

  const fuse = new Fuse(bicicletas, {
    keys: ['nombre', 'precio'],
    includeScore: true,
  })

  const handleOnSearch = ({ currentTarget = {} }) => {
    const { value } = currentTarget
    setQuery(value)
  }

  // Calcula que elementos mostrar
  const results = fuse.search(query)
  const matchResults = query ? results.map((result) => result.item) : bicicletas

  const offset = currentPage * itemsPerPage
  const currentItems = matchResults.slice(offset, offset + itemsPerPage)

  return (
    <div className="bg-lgray pb-8 ">
      <ComparisonBar />
      <div>
        <h1 className="font-bold text-3xl bg-primary w-full h-20 mb-10 shadow-xl flex items-center justify-center">
          ¡Encuentra tu próxima bicicleta!
        </h1>
      </div>
      <div className="flex items-end justify-center mb-10 ">
        <div className="w-40 bg-secondary flex items-center justify-center rounded-l-xl  h-10 border-black/50 border font-bold shadow-xl">
          <h2>Busca</h2>
        </div>
        <Input
          id={'busqueda'}
          className={'bg-white mt-2 w-[900px] shadow-xl rounded-r-xl '}
          inputClassName={' border px-2 rounded-r-xl '}
          label=""
          value={query}
          onChange={handleOnSearch}
        />
      </div>
      <div className="px-9 mb-10">
        <div className="grid grid-cols-5">
          {currentItems.map((bicicleta) => (
            <ItemContainer
              {...bicicleta}
              key={bicicleta.idProducto}
              className={'mt-2'}
              envioGratis={bicicleta['método de envio'] === 'gratis'}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <ReactPaginate
          previousLabel={
            <span className="bg-secondary flex items-center justify-center w-10 h-10 rounded-md">
              <IoIosArrowBack className="size-6" />
            </span>
          }
          nextLabel={
            <span className="bg-secondary flex items-center justify-center w-10 h-10 rounded-md">
              <IoIosArrowForward className="size-6" />
            </span>
          }
          breakLabel={<span className="mr-2">...</span>}
          pageCount={Math.ceil(matchResults.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={'flex items-center justify-center'}
          pageClassName="border border-lgray hover:bg-stone-400/35 w-10 h-10 flex items-center justify-center rounded-xl ml-2 mr-2 "
          activeClassName={'bg-tertiary/50'}
        />
      </div>
    </div>
  )
}

export default Bicicleta
