import axios from 'axios'

const API = axios.create({
  // Use the actual URL of your FastAPI backend
  baseURL: 'http://localhost:8000'
})

// Add this Interceptor to handle the token automatically
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API
