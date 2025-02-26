// -> Componentes
import Button from '../../../Button'
import UserData from '../UserData'
import randomId from '../../../../utils/randomId'

const InfoModal = ({ data }) => {
  // Parametros de la aplicacion en Mercado Pago
  const client_id = import.meta.env.VITE_MP_CLIENT_ID
  const redirect_uri = import.meta.env.VITE_MP_REDIRECT_URI
  const state = randomId()
  // Datos del usuario
  const { nombre, apellido, edad, rol, telefono, username, correo, direccion } =
    data

  return (
    <>
      {data.length != 0 ? (
        <div className="grid grid-cols-3 ">
          <UserData title="Nombre:" dataItem={nombre} />
          <UserData title="Apellido:" dataItem={apellido} />
          <UserData className="border-l" title="Edad:" dataItem={edad} />
          <UserData title="Rol:" dataItem={rol} />
          <UserData title="Telefono:" dataItem={telefono} />
          <UserData title="Usuario:" dataItem={username} />
          <UserData className="col-span-3" title="Correo:" dataItem={correo} />
          <UserData
            className="col-span-3 border-b-0"
            title="Dirección:"
            dataItem={direccion}
          />
          <Button
            to={`https://auth.mercadopago.com/authorization?client_id=${client_id}&response_type=code&platform_id=mp&state=${state}&redirect_uri=${redirect_uri}`}
          >
            Registrarme como vendedor
          </Button>
        </div>
      ) : null}
    </>
  )
}

export default InfoModal
