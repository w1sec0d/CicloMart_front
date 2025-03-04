import Button from './Button'
import logo from '../assets/logo.png'
import {
  Menu,
  Person,
  ShoppingCart,
  Close,
  Home,
  Info,
  DirectionsBike,
  Build,
  Publish,
  Login,
  PersonAdd,
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const user = useSelector((state) => state.auth.authUser)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Cerrar el menú cuando la pantalla se hace grande
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Cerrar menú cuando se hace clic en un enlace
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsMenuOpen(false)
    }
  }

  return (
    <nav className="bg-primary p-4 font-medium shadow-md h-[64px] flex items-center justify-between fixed left-0 top-0 w-screen z-10 text-lg">
      <div className="flex flex-row items-center">
        <Link to="/" className="flex flex-row items-center">
          <img
            src={logo}
            alt="Logo de Ciclomart, un carrito de compras fusionado con una bicicleta"
            className="w-12 h-12 mr-6"
          />
          <h1 className="text-xl font-bold">
            <span className="text-tertiary">Ciclo</span>
            <span className="text-secondary">Mart</span>
          </h1>
        </Link>
      </div>

      {/* Icono de menú móvil */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <Close /> : <Menu />}
        </button>
      </div>

      {/* Menú de navegación */}
      <ul
        className={`absolute left-0 w-full bg-primary shadow-md lg:shadow-none flex flex-col lg:flex-row lg:static lg:w-auto transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'top-[64px]' : '-top-[500px] lg:top-0'
        } p-4 lg:p-0 z-40`}
      >
        <li className="py-2 lg:py-0 lg:px-4 hover:font-bold text-center flex items-center justify-center">
          <Link to="/" className="block w-full" onClick={handleLinkClick}>
            <Home className="mr-2" /> Inicio
          </Link>
        </li>
        <li className="py-2 lg:py-0 lg:px-4 hover:font-bold text-center flex items-center justify-center">
          <Link
            to="/conocenos"
            className="block w-full"
            onClick={handleLinkClick}
          >
            <Info className="mr-2" /> Conócenos
          </Link>
        </li>
        <li className="py-2 lg:py-0 lg:px-4 hover:font-bold text-center flex items-center justify-center">
          <Button
            className="text-white bg-tertiary w-full max-w-[250px] lg:w-auto text-base outline-none focus:outline-primary active:outline-primary hover:bg-tertiary/90 font-semibold"
            to="/search/bycicle"
            onClick={handleLinkClick}
          >
            <DirectionsBike className="mr-2" /> Explorar Bicicletas
          </Button>
        </li>
        <li className="py-2 lg:py-0 lg:px-4 hover:font-bold text-center flex items-center justify-center">
          <Button
            className="text-white bg-tertiary w-full max-w-[250px] lg:w-auto text-base outline-none focus:outline-primary active:outline-primary hover:bg-tertiary/90 font-semibold"
            to="/search/component"
            onClick={handleLinkClick}
          >
            <Build className="mr-2" /> Explorar Componentes
          </Button>
        </li>

        {/* Sección de usuario */}
        {user ? (
          <li className="py-2 lg:py-0 lg:px-4 hover:font-bold text-center flex flex-col lg:flex-row items-center justify-center gap-2">
            {user.rol === 'vendedor' && (
              <Button
                className="text-white bg-tertiary w-full max-w-[200px] lg:w-auto text-base outline-none focus:outline-primary active:outline-primary hover:bg-tertiary/90 mb-2 lg:mb-0 lg:mr-2"
                to="/publish"
                onClick={handleLinkClick}
              >
                <Publish className="mr-2" /> Publicar
              </Button>
            )}
            <Button
              className="text-white bg-tertiary w-full max-w-[200px] lg:w-auto text-base outline-none focus:outline-primary active:outline-primary hover:bg-tertiary/90"
              to="/profile"
              onClick={handleLinkClick}
            >
              <Person className="mr-2" /> Perfil
            </Button>
          </li>
        ) : (
          <li className="py-2 lg:py-0 lg:px-4 hover:font-bold text-center flex flex-col lg:flex-row items-center justify-center gap-2">
            <Button
              className="text-white bg-secondary w-full max-w-[200px] lg:w-auto text-base outline-none focus:outline-primary active:outline-primary hover:bg-secondary/90 mb-2 lg:mb-0 lg:mr-2 font-bold"
              to="/login"
              onClick={handleLinkClick}
            >
              <Login className="mr-2" /> Inicia sesión
            </Button>
            <Button
              className="text-white bg-secondary w-full max-w-[200px] lg:w-auto text-base outline-none focus:outline-primary active:outline-primary hover:bg-secondary/90 font-bold"
              to="/register"
              onClick={handleLinkClick}
            >
              <PersonAdd className="mr-2" /> Regístrate
            </Button>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
