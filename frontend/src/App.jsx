import React from 'react'
import Navbar from './Components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Footer from './Components/Footer'
import AllFoods from './Pages/AllFoods'
import Login from './Pages/Login'
import Cart from './Pages/Cart'
import About from './Pages/About'

const App = () => {
  return (
    <div className=' min-h-screen px-2 sm:px-10 md:px-14 lg:px-28 bg-orange-50'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/all-foods' element={<AllFoods/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/about' element={<About/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
