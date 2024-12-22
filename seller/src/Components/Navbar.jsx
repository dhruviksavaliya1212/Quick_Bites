import React, { useContext } from "react";
// import { assets } from '../assets/assets'
import { useNavigate } from "react-router-dom";
import { SellerContext } from "../Context/SellerContext";
import { assets } from "../assets/assets";

const Navabar = () => {
  const navigate = useNavigate();

  const { stoken, setStoken } = useContext(SellerContext);

  const logOut = () => {

    if(localStorage.getItem("seller-token")){
      setStoken("")
      localStorage.removeItem('seller-token')
    } 
    navigate('/login')
  }

  return (
    <div className=" fixed w-full z-50 flex justify-between items-center px-4 py-3 border-b bg-white ">
      <div className=" flex items-center gap-2 text-xs">
        <img src={assets.fooddelivery} alt="" className=" w-10" />
        <p className=" border p-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          Seller
        </p>
      </div>

      {stoken === "" ? (
        <button className=" bg-orange-500 text-zinc-100 px-10 py-2 text-base font-medium rounded-full shadow-md shadow-zinc-700 capitalize hover:scale-105 transition-all duration-500">Log in</button>
      ) : (
        <svg
          onClick={logOut}
          className="h-8 w-8 text-indigo-700 cursor-pointer"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" />{" "}
          <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />{" "}
          <path d="M7 12h14l-3 -3m0 6l3 -3" />
        </svg>
      )}
    </div>
  );
};

export default Navabar;
