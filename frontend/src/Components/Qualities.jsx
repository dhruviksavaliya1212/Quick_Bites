import React from "react";
import { qualities } from "../assets/assets";

const Qualities = () => {
  return (
    <div className=" w-full mt-20 p-1">
      <p className=" text-center xl:w-[90%] text-3xl font-semibold mb-10">Why People Choose Us ?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {qualities.map((item, index) => (
          <div key={index} className=" bg-zinc-200 rounded-lg shadow-inner shadow-slate-800 flex flex-col items-center justify-center gap-5 py-4 px-6">
            <img src={item.img} alt="" className=" w-20" />
            <p className=" text-center text-2xl font-semibold">{item.title}</p>
            <p className=" text-center text-sm font-medium text-zinc-800">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Qualities;
