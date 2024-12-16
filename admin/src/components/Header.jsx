import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdNotificationsNone } from "react-icons/md";

const Header = ({ toggleSidebar }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);

  const toggleSearch = () => setSearchVisible(!searchVisible);
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  return (
    <header className="bg-[#f97316] border border-orange-400 text-white shadow p-4 flex justify-between items-center w-full fixed top-0 z-30">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-3 bg-orange-500 text-white rounded-full"
      >
        <div className="flex flex-col justify-center items-center space-y-1">
          <div className="w-6 h-1 bg-white rounded-full"></div>
          <div className="w-6 h-1 bg-white rounded-full"></div>
          <div className="w-6 h-1 bg-white rounded-full"></div>
        </div>
      </button>

      {/* Title */}
      <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold sm:pl-16 lg:pl-72">
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
          <div className="absolute top-14 left-0 right-0 mx-4 sm:relative sm:mx-0 z-50">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded px-3 py-2 outline-none shadow bg-white text-gray-800 w-full sm:w-auto"
              />
              <div className="absolute top-[-8px] sm:left-2 w-4 h-4 bg-white rotate-45 border-t border-l"></div>
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
          <div
            onClick={toggleDropdown}
            className="w-8 h-8 sm:w-10 sm:h-10 cursor-pointer rounded-full bg-orange-400 flex justify-center items-center"
          >
            <CgProfile className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>

          {dropdownVisible && (
            <div className="absolute top-12 right-0 w-40 bg-white rounded shadow-lg z-50">
              {/* Arrow pointing to the profile icon */}
              <div className="absolute -top-2 right-1 rounded w-4 h-4 bg-white rotate-45 border-t border-l"></div>

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
