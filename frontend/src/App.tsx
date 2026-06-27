import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './components/pages/Home'
import { Login } from './components/pages/Login'
import { Signup } from './components/pages/Signup'
import { BestRoute } from './components/pages/BestRoute'
import { Assistant } from './components/pages/Assistant'
import { Profile } from './components/pages/Profile'
import { Explore } from './components/pages/Explore'
import { Experience } from './components/pages/Experience'
import About from './components/pages/About'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route element={<Home />} path='/' />
      <Route element={<BestRoute />} path='/best-route/results' />
      <Route element={<Assistant />} path='/ameer' />
      <Route element={<Login />} path='/login' />
      <Route element={<Signup />} path='/signup' />
      <Route element={<Profile />} path='/profile' />
      <Route element={<Explore />} path='/explore' />
      <Route element={<About />} path='/about' />
      <Route element={<Experience />} path='/profile/create' />
    </Routes>
    </BrowserRouter>
    
    
  )
}

export default App
