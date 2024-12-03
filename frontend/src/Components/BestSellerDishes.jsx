import React from "react";
import pizza from "../assets/pizza1.png";
import vegetarian from "../assets/vegetarian.webp";
import seller from "../assets/seller.png";
import hot from "../assets/hot.png";
import plus from "../assets/plus.png";
import remove from "../assets/remove.png";
import { bestSeller } from "../assets/assets";

const BestSellerDishes = () => {
  return (
    <div>
      <div className=" mt-20 p-1 flex flex-col justify-center items-center ">
        <p className=" text-center text-3xl font-semibold mb-10">
          Our Best Selling Dishes
        </p>
        <div className=" mt-10 w-full lg:w-[90%] xl:w-[80%]">
          {bestSeller.map((item, index) => (
            <div key={index}>
              <div
                className=" my-5 flex flex-col sm:flex-row items-center justify-start gap-5 lg:gap-10 "
              >
                <div className=" relative">
                  <img
                    src={item.img}
                    alt=""
                    className=" min-w-52 max-w-52 h-48 rounded bg-gradient-to-t from-slate-500 to-slate-900"
                  />
                  <div className=" w-32 h-fit bg-white shadow shadow-zinc-700 absolute -bottom-3 left-10 rounded flex items-center justify-between p-1">
                    <img src={plus} alt="" className=" w-6 cursor-pointer hover:scale-110 transition-all duration-500 " />
                    <p className=" text-xl text-[#38913b] font-semibold">5</p>
                    <img src={remove} alt="" className=" w-6 cursor-pointer hover:scale-110 transition-all duration-500" />
                  </div>
                </div>
                <div className=" max-md:ml-5 max-sm:mt-5">
                  <div className=" flex gap-2 items-center ">
                    <img src={vegetarian} alt="" className="w-5" />
                    {/* <img src={seller} alt="" className='w-28'/> */}
                    {/* <img src={hot} alt="" className=' w-10'/> */}
                    <p className=" text-md text-red-700 font-semibold">
                      {item.bestSeller === true && 'Best Seller'}
                    </p>
                  </div>
                  <p className=" text-xl font-bold text-zinc-900">
                    {item.name}
                  </p>
                  <div className=" mt-1 flex gap-3 item-center">
                    <p className=" line-through font-semibold text-zinc-500">
                      <span>₹</span>
                      {item.oldPrice}
                    </p>
                    <p className=" font-semibold text-zinc-900">
                      <span>₹</span>
                      {item.newPrice}
                    </p>
                  </div>
                  <div className=" flex items-center my-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      
                    >
                      <rect width="14" height="14" fill="white"></rect>
                      <path
                        d="M5.67163 3.99166C6.22068 2.34179 6.49521 1.51686 7 1.51686C7.50479 1.51686 7.77932 2.34179 8.32837 3.99166L8.65248 4.96556H9.60668C11.4122 4.96556 12.315 4.96556 12.4703 5.45302C12.6256 5.94049 11.8893 6.4628 10.4167 7.50744L9.67376 8.03444L9.97544 8.94095C10.5325 10.615 10.8111 11.452 10.4033 11.754C9.99553 12.056 9.27604 11.5457 7.83705 10.5249L7 9.93112L6.16295 10.5249C4.72396 11.5457 4.00447 12.056 3.5967 11.754C3.18893 11.452 3.46747 10.615 4.02456 8.94095L4.04557 8.87783C4.18081 8.47145 4.24843 8.26825 4.18684 8.08006C4.12525 7.89187 3.94958 7.76725 3.59824 7.51802C2.11566 6.46633 1.37437 5.94049 1.52971 5.45302C1.68504 4.96556 2.5878 4.96556 4.39332 4.96556H5.34752L5.67163 3.99166Z"
                        fill="#1BA672"
                      ></path>
                    </svg>
                    <p className=" text-green-700 font-semibold ml-1">
                      {item.rating}
                    </p>
                    <p className=" ml-[2px] text-sm font-medium text-zinc-700">
                      ({item.ratingCount})
                    </p>
                  </div>
                  <p className=" text-md font-normal text-zinc-800 max-w-[90%]">
                    {item.desc}
                  </p>
                </div>
              </div>
              <hr className=" w-[90%] border border-zinc-600 m-auto mt-10 outline-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellerDishes;
