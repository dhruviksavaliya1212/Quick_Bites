import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div>
      <div className=' bg-orange-600 rounded-lg mt-5 flex flex-col md:flex-row justify-between items-center shadow-lg shadow-zinc-500'>
        {/* left side */}
        <div className=' px-6 py-10 max-md:py-10 relative md:w-[50%] flex flex-col items-center'>
          <p className=' text-4xl sm:text-5xl md:text-3xl lg:text-5xl font-semibold text-zinc-100 '>Desire <span className=' bg-[#4C281A] text-orange-300 px-6 py-1 text-2xl sm:text-3xl md:text-2xl lg:text-3xl rounded-full md:ml-2 -rotate-12 inline-block shadow-sm shadow-zinc-300'> Food</span> </p>
          <p className=' text-4xl sm:text-5xl md:text-3xl lg:text-5xl font-semibold text-zinc-100 mt-3'>for Your Taste</p>
          <p className=' mt-5 text text-zinc-300 text-sm font-normal text-center '> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto laborum consectetur culpa aliquam quasi enim aperiam! Laudantium, tempore, ducimus officia non aut illo nisi nesciunt</p>
          <button className=' px-8 py-2 bg-zinc-200 text-orange-500 mt-5 rounded-full text-md font-semibold shadow-md shadow-zinc-800'> Order Now</button>
        </div>
        {/* right side */}
        <div className=' overflow-x-scroll flex sm:w-[70%] md:w-[45%] lg:w-[40%] items-center gap-10 sm:gap-20  md:gap-10'>
          <img src={assets.header} alt="" className=' w-96 sm:w-[26rem] lg:w-[30rem]' />
          <img src={assets.header2} alt="" className=' w-96 sm:w-[26rem] lg:w-[30rem]' />
          <img src={assets.header3} alt="" className=' w-96 sm:w-[26rem] lg:w-[30rem]' />
          <img src={assets.header4} alt="" className=' w-96 sm:w-[26rem] lg:w-[26rem]' />
          <img src={assets.header5} alt="" className=' w-96 sm:w-[26rem] lg:w-[30rem]' />
        </div>
      </div>
    </div>
  )
}

export default Header