import axios from 'axios'

const API = axios.create({
  // Vite mein variable access karne ka sahi tarika:
  baseURL: import.meta.env.VITE_API_URL
})

export default API
