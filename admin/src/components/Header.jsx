import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdNotificationsNone } from "react-icons/md";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logout from "../utills/hoc/logOut";


const quickSearchRoutes = [
  { label: "Dashboard", path: "/" },
  { label: "Menu Management", path: "/Menumanagement" },
  { label: "User Management", path: "/Usermanagement" },
  { label: "Restaurant Management", path: "/Restauarantmanagement" },
  { label: "Order Management", path: "/Ordermanagement" },
  { label: "Delivery Agent Management", path: "/DeliveryAgentmanagement" },
  { label: "Promotion Management", path: "/Promotionmanagement" },
  { label: "Reports Management", path: "/Reportsmanagement" },
];

const Header = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);

  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() !== "") {
      const results = quickSearchRoutes.filter((route) =>
        route.label.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  };

  const handleRedirect = (path) => {
    navigate(path);
    setSearchQuery("");
    setFilteredResults([]);
    setSearchVisible(false); // Close search on mobile after redirect
  };

  const toggleSearch = () => setSearchVisible(!searchVisible);
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  return (
    <header className="bg-[#F26B0F] mx-auto border border-orange-400 text-white shadow p-4 flex justify-between items-center w-full right-0 fixed top-0 z-30">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="p-2  lg:hidden rounded-full hover:bg-orange-600 transition-all duration-300"
      >
        <FaBars size={24} />
      </button>

      {/* Title */}
      <h1 className="text-sm lg:tracking-widest sm:text-base md:text-lg lg:text-xl font-bold sm:pl-16 lg:ml-72 z-50">
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

        {/* Search Input for Mobile */}
        {searchVisible && (
          <div className="absolute top-16  right-1 bg-white shadow-lg rounded p-2 z-50">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="w-full border px-3 py-2 rounded outline-none text-gray-800"
            />
            {/* Search Results */}
            {filteredResults.length > 0 && (
              <div className="bg-white rounded shadow mt-2 max-h-60 overflow-y-auto">
                <ul className="divide-y divide-gray-200">
                  {filteredResults.map((result) => (
                    <li
                      key={result.path}
                      onClick={() => handleRedirect(result.path)}
                      className="p-2 text-black hover:bg-orange-400 cursor-pointer"
                    >
                      {result.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Search Input (desktop view) */}
        <div className="hidden lg:block relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="border outline-none text-gray-800 rounded px-3 py-1 w-[200px]"
          />
          {/* Search Results */}
          {filteredResults.length > 0 && (
            <div className="absolute top-full left-0 w-[200px] bg-white shadow rounded z-50">
              <ul>
                {filteredResults.map((result) => (
                  <li
                    key={result.path}
                    onClick={() => handleRedirect(result.path)}
                    className="p-2 text-black hover:bg-orange-400 cursor-pointer"
                  >
                    {result.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
            <div
              onClick={toggleDropdown}
              className="w-8 h-8 sm:w-10 sm:h-7 cursor-pointer rounded-full flex justify-center items-center"
            >
              <CgProfile className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div
              onClick={toggleDropdown}
              className="w-3 h-3 overflow-y-hidden border-t-2 border-r-2 border-white rotate-[-230deg] cursor-pointer"
            ></div>
          </div>

          {dropdownVisible && (
            <div className="absolute top-12 right-0 w-40 bg-white rounded shadow-lg z-50">
              {/* Dropdown Items */}
              <ul className="text-gray-800 text-sm">
                <li onClick={()=> navigate("/profile")}  className="hover:bg-orange-100 px-4 py-2 cursor-pointer rounded-t">
               Profile
                </li>
                <li onClick={()=> navigate("/chatsupport")} className="hover:bg-orange-100 px-4 py-2 cursor-pointer">
                chatsupport
                </li>
                <li onClick={()=> logout(navigate)} className="hover:bg-orange-100 px-4 py-2 cursor-pointer rounded-b">
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
