// Comunicates the front-end with the back-end
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

import axios from 'axios'

const getUsuario = async () => {
  const request = await axios.get(API_URL + '/usuarios')
  return request.data
}

const getUsuarioPhoto = async (id) => {
  const request = await axios.get(`${API_URL}/getUsuarioPhoto/${id}`)
  return request.data
}

const createUsuario = async (usuario) => {
  const request = await axios.post(API_URL + '/usuarios', usuario)
  return request.data
}

const getTiendas = async () => {
  const request = await axios.get(API_URL + '/tiendas')
  return request.data
}

//Products search
const searchProducts = async (params) => {
  params = new URLSearchParams(params).toString()
  const request = await axios.get(API_URL + '/search?' + params)
  return request.data
}

export default {
  getUsuario,
  getUsuarioPhoto,
  createUsuario,
  searchProducts,
  getTiendas,
}
