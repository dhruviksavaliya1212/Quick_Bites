import React, { useContext, useEffect, useState } from "react";
import { SellerContext } from "../Context/SellerContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

const AllFoods = () => {
  const { currency, backend, stoken } = useContext(SellerContext);

  const navigate = useNavigate();

  const [foods, setFoods] = useState(false);

  const getFoods = async () => {
    const { data } = await axios.post(
      `${backend}/api/restaurant/get-foods`,
      {},
      { headers: { Authorization: `Bearer ${stoken}` } } 
    );

    console.log(data);

    if (data.success) {
      setFoods(data.foods);
    }
  };

  // remove food
  const removeFood = async (itemId) => {
    const { data } = await axios.post(
      `${backend}/api/restaurant/remove-food`,
      { itemId },
      { headers: { Authorization: `Bearer ${stoken}` } } 
    );

    if (data.success) {
      toast.success(data.message);
      getFoods();
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    if (stoken) {
      getFoods();
    }
  }, [stoken]);

  return (
    foods && (
      <div className=" m-5 h-screen ">
        <p className=" text-lg font-semibold text-zinc-800 my-3">All Foods</p>
        <div className="flex items-center flex-col mb-20 rounded-sm shadow-lg shadow-zinc-700 bg-zinc-100 max-h-screen min-h-screen overflow-y-scroll">
          <div className="  mt-3 w-full lg:w-[90%] xl:w-[80%]">
            {foods.map((item, index) => (
              <div key={index}>
                <div className=" my-5 flex flex-col sm:flex-row items-center justify-start gap-5 lg:gap-10  ">
                  <div className=" relative">
                    <img
                      src={item.image}
                      alt=""
                      className=" min-w-44 max-w-44 h-44 rounded bg-gradient-to-t from-slate-500 to-slate-900"
                    />
                    <div
                      onClick={() => removeFood(item._id)}
                      className=" mt-1 absolute -bottom-5 w-full flex justify-center"
                    >
                      <button className=" flex gap-5 bg-red-400 text-sm font-semibold text-zinc-900 px-3 py-2 border border-red-800 shadow-inner shadow-red-200 rounded-md hover:scale-105 transition-all duration-600">
                        Remove Food{" "}
                        <img src={assets.trash} alt="" className=" w-5" />
                      </button>
                    </div>
                  </div>
                  <div className=" max-md:ml-5 max-sm:mt-5">
                    <div className=" flex gap-2 items-center ">
                      <img src={assets.vegetarian} alt="" className="w-5" />
                      <p className=" text-md text-red-700 font-semibold">
                        {item.bestSeller === true && "Best Seller"}
                      </p>
                    </div>
                    <p className=" text-xl font-bold text-zinc-900">
                      {item.name}
                    </p>
                    <p className=" text-md font-semibold text-zinc-900 -mt-1">
                      {item.restoname}
                    </p>
                    <div className=" mt-1 flex gap-3 item-center">
                      <p className=" line-through font-semibold text-zinc-500">
                        <span>₹</span>
                        {item.oldprice}
                      </p>
                      <p className=" font-semibold text-zinc-900">
                        <span>₹</span>
                        {item.newprice}
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
                    </div>
                    <p className=" text-md font-normal text-zinc-800 max-w-[90%]">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <hr className=" w-[90%] border border-zinc-600 m-auto mt-7 outline-none" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default AllFoods;
