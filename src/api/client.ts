import axios from 'axios'

const client = axios.create({
  baseURL: 'http://kanban-api.test',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Attach Bearer token from auth store on every request.
// Imported lazily inside the interceptor to avoid circular dependency at module load time.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client
