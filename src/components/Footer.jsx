import { forwardRef } from 'react'
import { FaGithub } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = forwardRef((props, ref) => {
  return (
    <footer ref={ref} className="w-full bg-primary">
      <div className="flex flex-col h-full w-full">
        <div className="container mx-auto py-4 flex-row flex pl-6 text-white">
          <ul className="w-1/3 border-r border-primaryDark ">
            <h3 className="text-xl font-bold mb-4">Legalidad</h3>
            <li>
              <Link to="/terms">Terminos y condiciones</Link>
            </li>
            <li>
              <Link to="/privacy">Politica de datos</Link>
            </li>
          </ul>
          <ul className="w-1/3 ml-4 border-r border-primaryDark ">
            <h3 className="text-xl font-bold mb-4">Recursos</h3>
            <li className="flex flex-col space-y-2">
              <div className='flex items-center'>
                <p className="mr-2">Github BackEnd</p>
                <Link to='https://github.com/w1sec0d/CicloMart_Back'>
                  <FaGithub className="text-3xl" />
                </Link>
              </div>
              <div className='flex items-center'>
                <p className="mr-2">Github FrontEnd</p>
                <Link to='https://github.com/w1sec0d/CicloMart_front'>
                  <FaGithub className="text-3xl" />
                </Link>
              </div>
            </li>
          </ul>
          <ul className="w-1/3 ml-4 ">
            <h3 className="text-xl font-bold mb-4">Responsables</h3>
            <li>Carlos David Ramírez Muñoz</li>
            <li>Johan David Rodríguez Gutíerrez</li>
            <li>Ronald Daniel Jacanamejoy Mutumbajoy</li>
            <li>Juan David Madrid Contreras</li>
          </ul>
        </div>
        <div className="py-4 w-full border-t border-primaryDark flex flex-row px-6">
          <p className="text-center text-white justify-start mr-auto">
            &copy; 2025 - Todos los derechos reservados
          </p>
          {/* Create an email support */}
          <p className="text-center text-white">
            Soporte:
            <a
              href="mailto:cramirezmun@unal.edu.co"
              className="text-secondary font-bold"
            >
              {' '}
              cramirezmun@unal.edu.co
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
