import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Configurar axios para usar la URL del backend
    axios.defaults.baseURL = 'http://localhost:8000/api'
    
    // Probar la conexión
    axios.get('/test')
      .then(response => {
        setMessage(response.data.message)
      })
      .catch(error => {
        console.error('Error:', error)
        setMessage('Error al conectar con el backend')
      })
  }, [])

  return (
    <div className="App">
      <h1>Kolina Project</h1>
      <p>Status: {message}</p>
    </div>
  )
}

export default App