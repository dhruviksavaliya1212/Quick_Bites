import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { token, setToken, userData, getTotalCartAmount } =
    useContext(AppContext);

  const navigate = useNavigate();

  const [navbar, setNavbar] = useState();

  const logOut = () => {
    toast.success("Log out successfull");
    localStorage.removeItem("user-token");
    setToken("");
  };

  return (
    <>
      <div className=" flex fixed w-[98%] sm:w-[90%] md:w-[88%] lg:w-[80%] xl:w-[84%] h-20 z-50 bg-slate-100/50  backdrop-blur-sm items-center justify-between text-sm pr-2 py-4 pt-5 border-b border-b-gray-400">
        <div>
          <img src={assets.logo} alt="" className=" w-40 sm:w-48" />
        </div>
        <ul className=" hidden md:flex gap-5 uppercase text-md font-semibold group ">
          <NavLink to="/">
            <li
              onClick={() => scrollTo(0, 0)}
              className="py-1 hover:translate-y-[-5px] transition-all duration-200"
            >
              Home
            </li>
            <hr className="border-none outline-none h-0.5 bg-orange-500 w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to="/all-foods">
            <li
              onClick={() => scrollTo(0, 0)}
              className=" py-1 hover:translate-y-[-5px] transition-all duration-200"
            >
              All Foods
            </li>
            <hr className="border-none outline-none h-0.5 bg-orange-500 w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to="/all-resto">
            <li
              onClick={() => scrollTo(0, 0)}
              className=" py-1 hover:translate-y-[-5px] transition-all duration-200"
            >
              All Restaurants
            </li>
            <hr className="border-none outline-none h-0.5 bg-orange-500 w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to="/offer-zone">
            <li
              onClick={() => scrollTo(0, 0)}
              className=" py-1 hover:translate-y-[-5px] transition-all duration-200"
            >
              Offer-Zone
            </li>
            <hr className="border-none outline-none h-0.5 bg-orange-500 w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to="/about">
            <li
              onClick={() => scrollTo(0, 0)}
              className=" py-1 hover:translate-y-[-5px] transition-all duration-200"
            >
              About
            </li>
            <hr className="border-none outline-none h-0.5 bg-orange-500 w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to="/support">
            <li
              onClick={() => scrollTo(0, 0)}
              className=" py-1 hover:translate-y-[-5px] transition-all duration-200"
            >
              Chat Support
            </li>
            <hr className="border-none outline-none h-0.5 bg-orange-500 w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to="/contact">
            <li
              onClick={() => scrollTo(0, 0)}
              className=" py-1 hover:translate-y-[-5px] transition-all duration-200"
            >
              Contact
            </li>
            <hr className="border-none outline-none h-0.5 bg-orange-500 w-3/5 m-auto hidden" />
          </NavLink>
        </ul>

        <div className=" flex gap-5 items-center">
          <div className=" relative">
            <img
              onClick={() => navigate("/cart")}
              src="data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0iTGF5ZXIgMiIgdmlld0JveD0iMCAwIDM1IDM1Ij48cGF0aCBkPSJNMjcuNDcsMjMuOTNIMTQuOTJBNS4wOSw1LjA5LDAsMCwxLDEwLDIwTDgsMTEuODdhNS4xMSw1LjExLDAsMCwxLDUtNi4zMmgxNi41YTUuMTEsNS4xMSwwLDAsMSw1LDYuMzJsLTIsOC4xNUE1LjEsNS4xLDAsMCwxLDI3LjQ3LDIzLjkzWk0xMi45NCw4LjA1YTIuNjIsMi42MiwwLDAsMC0yLjU0LDMuMjNsMiw4LjE1YTIuNiwyLjYsMCwwLDAsMi41NCwySDI3LjQ3YTIuNiwyLjYsMCwwLDAsMi41NC0ybDItOC4xNWEyLjYxLDIuNjEsMCwwLDAtMi41NC0zLjIzWiIvPjxwYXRoIGQ9Ik05LjQ2IDE0YTEuMjUgMS4yNSAwIDAgMS0xLjIxLTFMNi40NiA1LjIzQTMuMjEgMy4yMSAwIDAgMCAzLjMyIDIuNzVIMS42OWExLjI1IDEuMjUgMCAwIDEgMC0yLjVIMy4zMkE1LjcxIDUuNzEgMCAwIDEgOC45IDQuNjZsMS43OCA3Ljc3YTEuMjQgMS4yNCAwIDAgMS0uOTMgMS41QTEuNDMgMS40MyAwIDAgMSA5LjQ2IDE0ek0xNS4xMSAzNC43NWE0IDQgMCAxIDEgNC00QTQgNCAwIDAgMSAxNS4xMSAzNC43NXptMC01LjU0YTEuNTIgMS41MiAwIDEgMCAxLjUyIDEuNTJBMS41MiAxLjUyIDAgMCAwIDE1LjExIDI5LjIxek0yOC45MyAzNC43NWE0IDQgMCAxIDEgNC00QTQgNCAwIDAgMSAyOC45MyAzNC43NXptMC01LjU0YTEuNTIgMS41MiAwIDEgMCAxLjUzIDEuNTJBMS41MiAxLjUyIDAgMCAwIDI4LjkzIDI5LjIxeiIvPjxwYXRoIGQ9Ik0yOC45MywyOS4yMUgxMi4yN2EzLjg5LDMuODksMCwxLDEsMC03Ljc4aDIuNjVhMS4yNSwxLjI1LDAsMSwxLDAsMi41SDEyLjI3YTEuMzksMS4zOSwwLDEsMCwwLDIuNzhIMjguOTNhMS4yNSwxLjI1LDAsMCwxLDAsMi41WiIvPjwvc3ZnPg=="
              alt=""
              className=" w-8 cursor-pointer"
            />
            <div
              className={` ${
                getTotalCartAmount() === 0 ? "hidden" : "block"
              } w-3 h-3 bg-orange-500 absolute rounded-full top-0 -right-1`}
            ></div>
          </div>
          {!token ? (
            <button
              onClick={() => navigate("/login")}
              className=" px-5 py-2 text-white bg-orange-500 rounded-full shadow-md shadow-zinc-500 max-md:hidden"
            >
              Create Account
            </button>
          ) : (
            <div className=" relative flex items-center gap-4 group">
              <div className=" flex flex-col justify-center items-center">
                {userData.image ? (
                  <img
                    src={userData.image}
                    alt=""
                    className=" w-10 mt-2 rounded-full"
                  />
                ) : (
                  <img
                    src="data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDY0IDY0IiB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIHN0eWxlPSJmaWxsOiMxMzQ1NjMiIGQ9Im0tMjE4LjctMzA4LjYgMi0yIDExLjcgMTEuOCAxMS43LTExLjggMiAyLTEzLjcgMTMuNy0xMy43LTEzLjciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIzNyAzMzUpIi8+PC9zdmc+"
                    alt=""
                    className=" w-10 -mt-3"
                  />
                )}
              </div>
              <div className=" hidden group-hover:block absolute z-10 top-0 right-0 pt-14 text-base font-medium">
                <div className=" text-zinc-800 min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4  shadow-sm shadow-zinc-300">
                  <p
                    onClick={() => navigate("/profile")}
                    className=" hover:text-black cursor-pointer"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("/my-orders")}
                    className=" hover:text-black cursor-pointer"
                  >
                    My Orders
                  </p>
                  <p
                    onClick={logOut}
                    className=" hover:text-black cursor-pointer"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          )}
          {navbar ? (
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACZ0lEQVR4nO3cy27TQBSA4RPKRT6T9iG4qUW8CEgUWHQB7Chh0cwE3iAPCuIiqOAlsNG4GFqpFnGaNudk/k+aXRY5+jXjyI4sAgAAAAAAAAAAAAAA1mB+XXaO7sr29L6IjMSt+TUZx912ljyTSyG9khC/S0jNn/VFqvhMvKlmzyXEr//miN8kTF+KvxipPhWjW7VonIgXGie9c4T4QpwYSUjH5wzhK4r2xujWsY9jOF8v+ofwEUX/G+Nkbc/uiXk76c4CQexG0QVj5HXr/W1xYCQaP7qMogNiaPrg48jKdPZYQvzlKooOiJFn0/hIXNH0elCUcTxa33eNh26+68ZH0VJieIiipcWwHEVLjWExipYew1IUJYadKEoMO1GUGHaiKDHsRFFi2ImixLATRYlhJ4oSw04UJYadKEoMO1GUGIYeGKV60GctPBArYKc0a7s/VhRdWRRiGIpSszPsRKmJYSdKTYzLpIN+2hLEWIyGKPZiNESxF6Mhir0YDVEuHmPCrRMrdIkbhRb+YrSR9AJ3bYliKEaHKCuyyucZyvFlJ0aHKEu6zCd9yk6xE6NDlAVd5TNwZafYidEhSo91/jtE2Sl2YnSIYihGp/golmJI6VEsxig2iuUYxUXxEKOYKFV6uvEvn6mm++LDwVb7fkVPMZaL8rmd1bz89k7PW18HHF8u3igXZg/dxhgaZfxuT+yb3xSNP90cU8sfXz/aWV3Q9Kb3YughxpkoPTsl7yJXcpSzO+WTVOmJeFNN99sL+Omd4S7GX29vyDg9OHnVuIdfJH0OttoZ8ix5JgAAAAAAAAAAAAAAIFftNzm+PJEnw4B9AAAAAElFTkSuQmCC"
              alt=""
              className=" w-7 md:hidden"
              onClick={() => {
                setNavbar(false);
                scrollTo(0, 0);
              }}
            />
          ) : (
            <img
              src="data:image/svg+xml,%3csvg%20width='37'%20height='27'%20viewBox='0%200%2037%2027'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20x='17'%20y='24'%20width='20'%20height='3'%20rx='1.5'%20fill='%23000B6D'/%3e%3crect%20x='7'%20y='12'%20width='30'%20height='3'%20rx='1.5'%20fill='%23000B6D'/%3e%3crect%20width='37'%20height='3'%20rx='1.5'%20fill='%23000B6D'/%3e%3c/svg%3e"
              alt=""
              className=" md:hidden w-7 text-orange-500"
              onClick={() => {
                setNavbar(true);
                scrollTo(0, 0);
              }}
            />
          )}
        </div>
      </div>
      {/* for mobile view */}
      {navbar && (
        <div className=" fixed z-40 md:hidden flex flex-col text-sm py-4 animate-wiggle w-full h-screen bg-white">
          <div className=" mt-20">
            <ul className=" md:hidden flex flex-col mt-5 items-center gap-5 uppercase text-md font-medium">
              <NavLink to="/">
                <li
                  onClick={() => scrollTo(0, 0)}
                  className="py-1 hover:translate-y-[-5px] transition-all duration-200"
                >
                  Home
                </li>
              </NavLink>
              <NavLink to="/all-foods">
                <li
                  onClick={() => scrollTo(0, 0)}
                  className=" py-1 hover:translate-y-[-5px] transition-all duration-200"
                >
                  All Foods
                </li>
              </NavLink>
              <NavLink to="/offer-zone">
                <li
                  onClick={() => scrollTo(0, 0)}
                  className=" py-1 hover:translate-y-[-5px] transition-all duration-200"
                >
                  offer zone
                </li>
              </NavLink>
              <NavLink to="/about">
                <li
                  onClick={() => scrollTo(0, 0)}
                  className=" py-1 hover:translate-y-[-5px] transition-all duration-200"
                >
                  About
                </li>
              </NavLink>
              <NavLink to="/support">
                <li
                  onClick={() => scrollTo(0, 0)}
                  className=" py-1 hover:translate-y-[-5px] transition-all duration-200"
                >
                  Chat Support
                </li>
              </NavLink>
              <NavLink to="/contact">
                <li
                  onClick={() => scrollTo(0, 0)}
                  className=" py-1 hover:translate-y-[-5px] transition-all duration-200"
                >
                  Contact
                </li>
              </NavLink>
            </ul>
            <div className=" w-full flex justify-center mt-10">
              <button
                onClick={() => navigate("/login")}
                className=" px-5 py-2 text-white bg-orange-500 rounded-full shadow-md shadow-zinc-500"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
