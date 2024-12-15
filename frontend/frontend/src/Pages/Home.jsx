import React from 'react'
import Header from '../Components/Header'
import Qualities from '../Components/Qualities'
import People from '../Components/People'
import BestSellerDishes from '../Components/BestSellerDishes'
import TopRestaurants from '../Components/TopRestaurants'

const Home = () => {
  return (
    <div className=' min-h-screen pt-20'>
      <Header/>
      <Qualities/>
      <People/>
      <BestSellerDishes/>
      <TopRestaurants/>
    </div>
  )
}

export default Home