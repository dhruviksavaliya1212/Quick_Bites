import { Link } from "react-router-dom";
import {
  FaClipboardList,
  FaMotorcycle,
  FaUser,
  FaHistory,
  FaWallet,
  FaTimes,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import logout from "../../utills/logout";
import { FcAcceptDatabase } from "react-icons/fc";

function Sidebar({ onClose }) {
  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="w-64 h-screen bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <FaMotorcycle className="text-primary text-2xl" />
          <span className="font-bold text-xl">Delivery Agent</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col justify-between p-4">
        {/* Top Section */}
        <div>
          <div className="font-bold text-primary mb-4 flex items-center">
            <MdDashboard className="mr-2" />
            Dashboard
          </div>

          <nav className="space-y-4">
            <Link
              to="/active-orders"
              className="block text-gray-600 hover:text-primary transition-colors p-2 rounded hover:bg-orange-50"
              onClick={handleLinkClick}
            >
              <FaClipboardList className="inline mr-2" />
              Active Orders
            </Link>
            <Link
              to="/accepted-orders"
              className="block text-gray-600 hover:text-primary transition-colors p-2 rounded hover:bg-orange-50"
              onClick={handleLinkClick}
            >
              <FcAcceptDatabase className="  text-black inline mr-2" />
               Accepted Orders
            </Link>
            <Link
              to="/delivery-history"
              className="block text-gray-600 hover:text-primary transition-colors p-2 rounded hover:bg-orange-50"
              onClick={handleLinkClick}
            >
              <FaHistory className="inline mr-2" />
              Delivery History
            </Link>
            <Link
              to="/earnings"
              className="block text-gray-600 hover:text-primary transition-colors p-2 rounded hover:bg-orange-50"
              onClick={handleLinkClick}
            >
              <FaWallet className="inline mr-2" />
              My Earnings
            </Link>
            <Link
              to="/profile"
              className="block text-gray-600 hover:text-primary transition-colors p-2 rounded hover:bg-orange-50"
              onClick={handleLinkClick}
            >
              <FaUser className="inline mr-2" />
              Profile
            </Link>
          </nav>
        </div>

        {/* Logout Button at Bottom */}
        <div className="pt-8 pb-2">
          <button
            onClick={logout}
            className="w-full bg-primary text-white font-semibold hover:font-bold py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
