import React from "react";
import { assets, people } from "../assets/assets";

const People = () => {
  return (
    <div className=" mt-20 p-1">
      <div className=" w-full  flex flex-col md:flex-row items-center justify-center md:gap-5 lg:gap-10 gap-10">
        {/* left side */}
        <div className="">
          <img src={assets.peopleimg} alt="" className=" h-full w-[24rem] sm:w-[30rem] md:w-[20rem] lg:w-[24rem] rounded-md"/>
        </div>
        {/* right side */}
        <div className="rounded-md shadow-inner shadow-zinc-800  bg-zinc-200">
          {people.map((item, index) => (
            <div key={index} >
            <div className=" rounded-md  flex items-center justify-center gap-5 py-5 px-10 ">
              <div>
                <img src={item.img} alt="" className=" w-20"/>
              </div>
              <div className=" flex flex-col gap-2">
                <p className=" text-2xl font-semibold">{item.title}</p>
                <p className=" text-sm font-medium text-zinc-800">{item.desc}</p>
              </div>
            </div>
            <hr className="w-[90%] last:hidden m-auto border border-zinc-700"/>
            </div>
            
          ))}
          
        </div>
        
      </div>
    </div>
  );
};

export default People;
