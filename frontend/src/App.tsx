import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './components/pages/Home'
import { Login } from './components/pages/Login'
import { Signup } from './components/pages/Signup'
import { BestRoute } from './components/pages/BestRoute'
import { Assistant } from './components/pages/Assistant'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route element={<Home />} path='/' />
      <Route element={<BestRoute />} path='/best-route/results' />
      <Route element={<Assistant />} path='/ameer' />
      <Route element={<Login />} path='/login' />
      <Route element={<Signup />} path='/signup' />
    </Routes>
    </BrowserRouter>
    
    
  )
}

export default App
