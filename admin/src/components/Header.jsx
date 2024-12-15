import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Header = ({ toggleSidebar }) => {
  const [searchVisible, setSearchVisible] = useState(false); // To toggle the search bar visibility

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  return (
    <header className="bg-[#f97316]  border-b border-orange-400 text-white lg:h-[10.4vh] overflow-y-hidden shadow p-4 flex justify-between items-center  w-full lg:w-[80vw] fixed top-0 right-0 z-30">

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
      <h1 className="text-lg font-bold sm:pl-16 lg:pl-10">Admin Panel</h1>

      {/* Header Right Section */}
      <div className="flex items-center space-x-4 flex-wrap relative">
        {/* Search Toggle Icon (visible only on smaller screens) */}
        <button
          onClick={toggleSearch}
          className="p-2 bg-gray-200 rounded sm:block lg:hidden"
        >
          <FaSearch />
        </button>

        {/* Search Input (conditionally visible when toggle is on) */}
        {searchVisible && (
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-3 py-1 absolute sm:relative top-16 left-4 right-4 sm:w-auto w-[90%] lg:w-auto"
          />
        )}

        {/* Full Search Input (always visible on larger screens) */}
        <div className="lg:block hidden ">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-3 py-1 w-[200px]"
          />
        </div>

        {/* User Icon */}
        <div className="w-8 h-8 rounded-full bg-orange-400"></div>
      </div>
    </header>
  );
};

export default Header;
