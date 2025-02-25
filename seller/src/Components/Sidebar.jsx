import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { SellerContext } from "../Context/SellerContext";

const Sidebar = () => {
  const { stoken } = useContext(SellerContext);

  return (
    <div className=" h-screen bg-white border-r">
      {stoken && (
        <ul className="  text-zinc-800 mt-5 overflow-hidden">
          <NavLink
            to={"/dashboard"}
            className={({ isActive }) =>
              `flex item-center gap-3 px-3 md:px-9 py-3.5 w-12 md:min-w-72 cursor-pointer hover:bg-orange-400 hover:text-zinc-100 my-1 transition-all duration-400 ${
                isActive
                  ? "bg-orange-400 text-zinc-100 text-lg border-r-4 border-r-orange-200"
                  : ""
              }`
            }
          >
            {/* <img src={assets.home_icon} alt="" className=' w-5'/> */}
            <p className=" hidden md:block">Dashboard</p>
          </NavLink>
          <NavLink
            to={"/all-orders"}
            className={({ isActive }) =>
              `flex item-center gap-3 px-3 md:px-9 py-3.5 md:min-w-72 cursor-pointer hover:bg-orange-400 hover:text-zinc-100 my-1 hover:scale-105 transition-all duration-400 ${
                isActive
                  ? "bg-orange-400 text-zinc-100 text-lg border-r-4 border-r-orange-200"
                  : ""
              }`
            }
          >
            {/* <img src={assets.appointment_icon} alt="" className=' w-5' /> */}
            <p className=" hidden md:block">All orders</p>
          </NavLink>
          <NavLink
            to={"/response"}
            className={({ isActive }) =>
              `flex item-center gap-3 px-3 md:px-9 py-3.5 my-1 md:min-w-72 cursor-pointer hover:bg-orange-400 hover:text-zinc-100 transition-all duration-400 ${
                isActive
                  ? "bg-orange-400 text-zinc-100 text-lg border-r-4 border-r-orange-200"
                  : ""
              }`
            }
          >
            {/* <img src={assets.appointment_icon} alt="" className=' w-5' /> */}
            <p className=" hidden md:block">All Feedback</p>
          </NavLink>
          <NavLink
            to={"/add-food"}
            className={({ isActive }) =>
              `flex item-center gap-3 px-3 md:px-9 py-3.5 my-1 md:min-w-72 cursor-pointer hover:bg-orange-400 hover:text-zinc-100 transition-all duration-400 ${
                isActive
                  ? "bg-orange-400 text-zinc-100 text-lg border-r-4 border-r-orange-200"
                  : ""
              }`
            }
          >
            {/* <img src={assets.add_icon} alt="" className=' w-5' /> */}
            <p className=" hidden md:block">Add food</p>
          </NavLink>
          <NavLink
            to={"/all-foods"}
            className={({ isActive }) =>
              `flex item-center gap-3 px-3 md:px-9 py-3.5 my-1 md:min-w-72 cursor-pointer hover:bg-orange-400 hover:text-zinc-100 transition-all duration-400 ${
                isActive
                  ? "bg-orange-400 text-zinc-100 text-lg border-r-4 border-r-orange-200"
                  : ""
              }`
            }
          >
            {/* <img src={assets.people_icon} alt="" className=' w-5' /> */}
            <p className=" hidden md:block">All Foods</p>
          </NavLink>
          <NavLink
            to={"/add-delivery-agent"}
            className={({ isActive }) =>
              `flex item-center gap-3 px-3 md:px-9 py-3.5 my-1 md:min-w-72 cursor-pointer hover:bg-orange-400 hover:text-zinc-100 transition-all duration-400 ${
                isActive
                  ? "bg-orange-400 text-zinc-100 text-lg border-r-4 border-r-orange-200"
                  : ""
              }`
            }
          >
            {/* <img src={assets.people_icon} alt="" className=' w-5' /> */}
            <p className=" hidden md:block">Add Delivery Agent</p>
          </NavLink>
          <NavLink
            to={"/profile"}
            className={({ isActive }) =>
              `flex item-center gap-3 px-3 md:px-9 py-3.5 my-1 md:min-w-72 cursor-pointer hover:bg-orange-400 hover:text-zinc-100 transition-all duration-400 ${
                isActive
                  ? "bg-orange-400 text-zinc-100 text-lg border-r-4 border-r-orange-200"
                  : ""
              }`
            }
          >
            {/* <img src={assets.people_icon} alt="" className=' w-5' /> */}
            <p className=" hidden md:block">Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
