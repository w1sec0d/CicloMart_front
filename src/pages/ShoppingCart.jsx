import React, { useEffect } from 'react'
import { useState } from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { MaterialReactTable } from 'material-react-table'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import cartService from '../services/cartService'
import { useSelector, useDispatch } from 'react-redux'
import { SiEac } from 'react-icons/si'
import Button from '../components/Button'
import { removeItem } from '../store/slices/cartSlice'

const ShoppingCart = () => {
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.auth.authUser)
  const [cart, setCart] = useState([])
  const [dataWithTotal, setDataWithTotal] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [envio, setEnvio] = useState(0)
  const [total, setTotal] = useState(0)

  const getCartElements = async (id) => {
    const elements = await cartService.getCart(id)
    dispatch(setCart(elements.results))
    setCart(elements.results)
  }

  const removeFromCart = async (index) => {
    const element = cart[index]
    dispatch(removeItem(element.idProducto))
    await cartService.removeFromCart(authUser.idUsuario, element.idProducto)
    const updated = await cartService.getCart(authUser.idUsuario)
    setCart(updated.results)
  }

  useEffect(() => {
    getCartElements(authUser.idUsuario)
  }, [authUser.idUsuario])

  console.log('cart: ', cart)
  // Definir los impuestos
  const impuestos = 253200

  useEffect(() => {
    // Calcular el total para cada producto
    const calculateTotal = (precio, cantidad) => {
      return precio * cantidad
    }

    // Añadir el total calculado a cada producto en el carrito
    const updatedDataWithTotal = cart.map((item) => ({
      ...item,
      total: calculateTotal(item.precio_unitario, item.cantidad),
    }))

    setDataWithTotal(updatedDataWithTotal)

    // Calcular el subtotal
    const updatedSubtotal = updatedDataWithTotal.reduce(
      (acc, item) => acc + item.total,
      0
    )
    setSubtotal(updatedSubtotal)

    // Calcular el envío
    const updatedEnvio = updatedDataWithTotal.reduce(
      (acc, item) => acc + item.costoEnvio,
      0
    )
    setEnvio(updatedEnvio)

    // Calcular el total
    const updatedTotal = updatedSubtotal + updatedEnvio + impuestos
    setTotal(updatedTotal)
  }, [cart])

  // Función para formatear números como moneda
  const formatCurrency = (value) => {
    return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
  }

  const columns = [
    {
      accessorKey: 'nombre',
      header: 'Producto',
    },
    {
      accessorKey: 'precio_unitario',
      header: 'Precio',
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
    },
    {
      accessorKey: 'cantidad',
      header: 'Cantidad',
    },
    {
      accessorKey: 'total',
      header: 'Total',
      Cell: ({ cell }) => formatCurrency(cell.getValue()),
    },
    {
      accessorKey: 'delete',
      header: '',
      Cell: ({ row }) => (
        <Button color="secondary" onClick={() => removeFromCart(row.index)}>
          <RemoveCircleOutlineIcon />
        </Button>
      ),
    },
  ]

  return (
    <>
      <div>
        <h1 className="font-black text-5xl text-center mt-20">
          Tu carrito de compras
        </h1>
        <div className="flex flex-row m-10 space-x-20">
          <div className="flex flex-col w-full">
            <MaterialReactTable
              columns={columns}
              data={dataWithTotal}
              enablePagination={false}
              enableSorting={false}
              enableColumnActions={false}
              enableBottomToolbar={false}
              enableCellActions={false}
              enableColumnFilters={false}
              enableHiding={false}
              enableTopToolbar={false}
              muiTableContainerProps={{ sx: { boxShadow: 'none' } }}
              muiTableBodyProps={{
                sx: {
                  '& .MuiTableBody-root': {
                    '& .MuiTableRow-root.MuiTableRow-empty': {
                      '& .MuiTableCell-root': {
                        textAlign: 'center',
                        fontSize: '1.25rem',
                        color: 'gray',
                      },
                    },
                  },
                },
              }}
            />
            {dataWithTotal.length === 0 && (
              <TableRow className="MuiTableRow-empty">
                <TableCell colSpan={columns.length}>
                  No hay productos en el carrito
                </TableCell>
              </TableRow>
            )}

            <div className="flex justify-start mt-4">
              <Button to="/" color="primary">
                ← Volver a la tienda
              </Button>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex flex-col justify-between">
              <Typography variant="h5" gutterBottom>
                Resumen de compra
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Subtotal</TableCell>
                      <TableCell align="right">
                        {formatCurrency(subtotal)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Envío</TableCell>
                      <TableCell align="right">
                        {formatCurrency(envio)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Impuestos</TableCell>
                      <TableCell align="right">
                        {formatCurrency(impuestos)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <div className="flex flex-col justify-between mt-4">
              <Typography variant="h5" gutterBottom>
                Total
              </Typography>
              <Typography variant="h4">{formatCurrency(total)}</Typography>
              <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
                Continuar al pago
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShoppingCart
