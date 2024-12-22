import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdNotificationsNone } from "react-icons/md";
import { FaBars } from "react-icons/fa";
const Header = ({ toggleSidebar }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);

  const toggleSearch = () => setSearchVisible(!searchVisible);
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  return (
    <header className="bg-[#F26B0F] mx-auto  border border-orange-400 text-white shadow p-4 flex justify-between items-center w-full right-0 fixed top-0 z-30">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="text-white p-2 lg:hidden rounded-full hover:bg-orange-600 transition-all duration-300"
      >
        <FaBars size={24} />
      </button>

      {/* Title */}
      <h1 className="text-sm  lg:tracking-widest sm:text-base md:text-lg lg:text-xl font-bold sm:pl-16 lg:ml-72 z-50">
  QuickBites Admin Suite
</h1>


      {/* Header Right Section */}
      <div className="flex items-center space-x-4 flex-wrap relative">
        {/* Search Toggle Icon (visible only on smaller screens) */}
        <button
          onClick={toggleSearch}
          className="p-2 rounded sm:block lg:hidden"
        >
          <FaSearch />
        </button>

        {/* Search Input (conditionally visible when toggle is on) */}
        {searchVisible && (
          <div className="absolute top-14 -left-2 right-0 mx-4 sm:relative sm:mx-0 z-50">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded px-3 py-2 outline-none shadow bg-white text-gray-800 w-full sm:w-auto"
              />
              <div className="absolute top-[-8px] left-1 w-4 h-4 bg-white rotate-45 border-t border-l"></div>
            </div>
          </div>
        )}

        {/* Full Search Input (always visible on larger screens) */}
        <div className="hidden lg:block">
          <input
            type="text"
            placeholder="Search..."
            className="border outline-none text-gray-800 rounded px-3 py-1 w-[200px]"
          />
        </div>

        {/* Notification Icon with Counter */}
        <div className="relative flex items-center justify-center">
          <MdNotificationsNone className="w-6 h-6 sm:w-8 sm:h-8 text-white cursor-pointer hover:text-orange-200" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs sm:text-sm font-bold rounded-full px-2 py-0.5 shadow-md">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </div>

        {/* User Icon with Dropdown */}
        <div className="relative">
        <div className="flex flex-col items-center">
      {/* Profile Icon */}
      <div onClick={toggleDropdown} className="w-8 h-8 sm:w-10 sm:h-7 cursor-pointer rounded-full flex justify-center items-center">
        <CgProfile className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
      </div>

      {/* Downward Triangle */}
      <div onClick={toggleDropdown} className="w-3 h-3 overflow-y-hidden border-t-2 border-r-2 border-white rotate-[-230deg] cursor-pointer"></div>
    </div>
 
          {dropdownVisible && (
            <div className="absolute top-12 right-0 w-40 bg-white rounded shadow-lg z-50">
              {/* Arrow pointing to the profile icon */}
     

              {/* Dropdown Items */}
              <ul className="text-gray-800 text-sm">
                <li className="hover:bg-orange-100 px-4 py-2 cursor-pointer rounded-t">
                  Profile
                </li>
                <li className="hover:bg-orange-100 px-4 py-2 cursor-pointer">
                  Settings
                </li>
                <li className="hover:bg-orange-100 px-4 py-2 cursor-pointer rounded-b">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
