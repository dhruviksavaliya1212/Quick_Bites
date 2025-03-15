import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import logout from "../utills/hoc/logOut";
import { AdminContext } from "../Context/AdminContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar(false);
    }
  };

  const navigate = useNavigate()
  const {profileData} = useContext(AdminContext)

  return (
    <>
      {/* Toggle Button for Small Screens */}
      <button
        onClick={() => toggleSidebar(!isOpen)}
        className="lg:hidden p-3 bg-orange-500 text-white fixed top-4 left-4 z-30 rounded-full shadow-lg"
      >
        <div className="flex flex-col justify-center items-center space-y-1">
          <div className="w-6 h-1 bg-white rounded-full transition-transform duration-300"></div>
          <div className="w-6 h-1 bg-white rounded-full transition-transform duration-300"></div>
          <div className="w-6 h-1 bg-white rounded-full transition-transform duration-300"></div>
        </div>
      </button>

      {/* Sidebar */}
      <div>
        <div className="fixed left-0 z-50 top-0">
          <aside
            className={`fixed overflow-y-hidden top-0 left-0 z-40  ${
              isOpen ? "translate-x-0" : "-translate-x-[80vw]"
            } lg:translate-x-0 lg:static lg:w-[20vw] bg-[#F26B0F] min-h-screen text-white flex flex-col ease-in-out duration-500 shadow-lg`}
            style={{ width: isOpen ? "80vw" : "20vw" }}
          >
            {/* Sidebar Header */}
            <div className="flex items-center lg:justify-center justify-between p-4 text-lg font-bold border-b border-orange-400">
              {/* Centered Logo Container */}
              <div className="flex items-center justify-center rounded-md bg-[#673f05]">
                <img
                  className="w-50 h-10 object-contain"
                  src={logo}
                  alt="Logo"
                />
              </div>

              {/* Close Button for Small Screens */}
              <button
                onClick={() => toggleSidebar(false)}
                className="lg:hidden text-white hover:text-orange-300"
              >
                ✕
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto">
              <div className="overflow-y-hidden">
                <NavLink
                  to="/"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `block py-3 px-6 ${
                      isActive
                        ? "bg-orange-600 text-white"
                        : "hover:bg-orange-600 hover:text-white"
                    } transition-colors duration-300`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/Menumanagement"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `block py-3 px-6 ${
                      isActive
                        ? "bg-orange-600 text-white"
                        : "hover:bg-orange-600 hover:text-white"
                    } transition-colors duration-300`
                  }
                >
                  Menu Management
                </NavLink>
                <NavLink
                  to="/Usermanagement"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `block py-3 px-6 ${
                      isActive
                        ? "bg-orange-600 text-white"
                        : "hover:bg-orange-600 hover:text-white"
                    } transition-colors duration-300`
                  }
                >
                  User Management
                </NavLink>
                <NavLink
                  to="/Restauarantmanagement"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `block py-3 px-6 ${
                      isActive
                        ? "bg-orange-600 text-white"
                        : "hover:bg-orange-600 hover:text-white"
                    } transition-colors duration-300`
                  }
                >
                  Restaurant Management
                </NavLink>
                <NavLink
                  to="/Ordermanagement"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `block py-3 px-6 ${
                      isActive
                        ? "bg-orange-600 text-white"
                        : "hover:bg-orange-600 hover:text-white"
                    } transition-colors duration-300`
                  }
                >
                  Order Management
                </NavLink>
                <NavLink
                  to="/DeliveryAgentmanagement"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `block py-3 px-6 ${
                      isActive
                        ? "bg-orange-600 text-white"
                        : "hover:bg-orange-600 hover:text-white"
                    } transition-colors duration-300`
                  }
                >
                  Delivery Agent Management
                </NavLink>
                <NavLink
                  to="/Promotionmanagement"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `block py-3 px-6 ${
                      isActive
                        ? "bg-orange-600 text-white"
                        : "hover:bg-orange-600 hover:text-white"
                    } transition-colors duration-300`
                  }
                >
                  Promotion Management
                </NavLink>
                <NavLink
                  to="/Reportsmanagement"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `block py-3 px-6 ${
                      isActive
                        ? "bg-orange-600 text-white"
                        : "hover:bg-orange-600 hover:text-white"
                    } transition-colors duration-300`
                  }
                >
                  Reports Management
                </NavLink>
              </div>
            </nav>

         

            {/* User Profile with Logout */}
            <div className="mb-auto p-4 bg-[#e65c00] overflow-x-hidden text-white flex items-center gap-4">
            
              <div className="flex-1 overflow-x-hidden">
                <p className="font-semibold">{profileData.name}</p>
                <p className="text-sm text-orange-200 ">{profileData.email}</p>
              </div>

              <button
                className="text-sm  text-red-200 hover:text-red-400"
                onClick={() => {
                  logout(navigate)
                }}
              >
                Logout
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Background Overlay for Small Screens */}
      {isOpen && (
        <div
          onClick={() => toggleSidebar(false)}
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
