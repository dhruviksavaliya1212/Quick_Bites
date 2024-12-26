import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { saveAs } from "file-saver";
import { MdVerified } from "react-icons/md";

const RestaurantManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState([
    {
      id: 54,
      name: "Wok n Roll",
      address: "Sahibzada Ajit Singh Nagar, Punjab, India",
      phone: "9876543210",
      email: "woknroll@example.com",
      deliveryCommission: 10,
      pickUpCommission: 5,
      revenue: 103058.34,
      status: "Active",
      verified: false, // New field
    },
    // Add more approved restaurants...
  ]);

  const [pendingRestaurants, setPendingRestaurants] = useState([
    {
      id: 56,
      name: "Cafe Delight",
      address: "MG Road, Bengaluru, India",
      phone: "9876509876",
      email: "cafedelight@example.com",
      deliveryCommission: 8,
      pickUpCommission: 4,
    },
    // Add more pending restaurants...
  ]);

  const [rejectedRestaurants, setRejectedRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [newRestaurantData, setNewRestaurantData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    deliveryCommission: 0,
    pickUpCommission: 0,
    revenue: 0,
    status: "Active",
  });

  // Handlers for Pending Table
  const handleApprove = (restaurant) => {
    setRestaurants([
      ...restaurants,
      { ...restaurant, status: "Active", verified: false },
    ]);
    setPendingRestaurants(
      pendingRestaurants.filter((r) => r.id !== restaurant.id)
    );
  };

  const handleReject = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsRejectModalOpen(true); // Open rejection modal
  };

  // Handlers for Approved Table
  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsEditModalOpen(true);
    setNewRestaurantData({ ...restaurant }); // Pre-fill the edit form with restaurant data
  };

  const handleDelete = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDeleteModalOpen(true);
  };

  const handleVerify = (restaurant) => {
    const updatedRestaurants = restaurants.map((r) =>
      r.id === restaurant.id ? { ...r, verified: !r.verified } : r
    );
    setRestaurants(updatedRestaurants);
  };

  // Confirm Rejection Handler
  const confirmReject = () => {
    setRejectedRestaurants([
      ...rejectedRestaurants,
      { ...selectedRestaurant, rejectionReason },
    ]);
    setPendingRestaurants(
      pendingRestaurants.filter((r) => r.id !== selectedRestaurant.id)
    );
    setIsRejectModalOpen(false);
    setRejectionReason(""); // Clear the rejection reason after submission
  };

  // Confirm Deletion Handler
  const confirmDelete = () => {
    setRestaurants(restaurants.filter((r) => r.id !== selectedRestaurant.id));
    setIsDeleteModalOpen(false);
  };

  // Export Restaurants to CSV
  const handleExport = () => {
    const csvData = restaurants.map((restaurant) => ({
      ID: restaurant.id,
      Name: restaurant.name,
      Address: restaurant.address,
      Phone: restaurant.phone,
      Email: restaurant.email,
      DeliveryCommission: restaurant.deliveryCommission,
      PickUpCommission: restaurant.pickUpCommission,
      Revenue: restaurant.revenue,
      Status: restaurant.status,
      Verified: restaurant.verified ? "Yes" : "No",
    }));

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, "restaurants_data.csv");
  };

  // Handle View Analytics
  const handleViewAnalytics = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsAnalyticsModalOpen(true);
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPendingRestaurants = pendingRestaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRejectedRestaurants = rejectedRestaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3 min-h-screen bg-gry-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Restaurant Management
        </h1>
        <div className="text-center mb-6">
          <button
            onClick={handleExport}
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition duration-200"
          >
            Export to CSV
          </button>
        </div>
      </div>

      {/* Pending Restaurants Table */}
      <div className="bg-white p-4 shadow-lg rounded-xl mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Pending Restaurants
        </h2>
        <table className="w-full text-left bg-white border border-gray-200 rounded-lg">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPendingRestaurants.map((restaurant) => (
              <tr key={restaurant.id} className="hover:bg-orange-50">
                <td className="py-2 px-4">{restaurant.id}</td>
                <td className="py-2 px-4">{restaurant.name}</td>
                <td className="py-2 px-4">{restaurant.address}</td>
                <td className="py-2 px-4">{restaurant.phone}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <button
                    onClick={() => handleApprove(restaurant)}
                    className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(restaurant)}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rejected Restaurants Table */}
      <div className="bg-white p-4 shadow-lg rounded-xl mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Rejected Restaurants
        </h2>
        <table className="w-full text-left bg-white border border-gray-200 rounded-lg">
          <thead className="bg-red-500 text-white">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Rejection Reason</th>
            </tr>
          </thead>
          <tbody>
            {filteredRejectedRestaurants.map((restaurant) => (
              <tr key={restaurant.id} className="hover:bg-red-50">
                <td className="py-2 px-4">{restaurant.id}</td>
                <td className="py-2 px-4">{restaurant.name}</td>
                <td className="py-2 px-4">{restaurant.address}</td>
                <td className="py-2 px-4">{restaurant.phone}</td>
                <td className="py-2 px-4">{restaurant.rejectionReason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Approved Restaurants Table */}
      <div className="bg-white overflow-x-auto p-4 shadow-lg rounded-xl mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Approved Restaurants
        </h2>
        <table className="w-full text-left bg-white border border-gray-200 rounded-lg">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Commission</th>
              <th className="py-3 px-4">Verified</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRestaurants.map((restaurant) => (
              <tr key={restaurant.id} className="hover:bg-green-50">
                <td className="py-2 px-4">{restaurant.id}</td>

                {/* Name - Horizontally scrollable */}
                <td
                  className="py-2 px-4"
                  style={{ width: "200px", maxWidth: "200px" }}
                >
                  <div className="overflow-x-auto whitespace-nowrap">
                    {restaurant.name}
                  </div>
                  {restaurant.verified && (
                    <span className="inline-block ml-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Verified
                    </span>
                  )}
                </td>

                {/* Address - Horizontally scrollable */}
                <td className="py-2 px-4">
                  <div className="overflow-x-auto whitespace-nowrap">
                    {restaurant.address}
                  </div>
                </td>

                <td className="py-2 px-4">{restaurant.phone}</td>
                <td className="py-2 px-4">{restaurant.email}</td>
                <td className="py-2 px-4">{restaurant.status}</td>
                <td className="py-2 px-4">
                  Delivery: {restaurant.deliveryCommission}% / Pick-Up:{" "}
                  {restaurant.pickUpCommission}%
                </td>

                {/* Verified - Fancy sticker */}
                <td className="py-2 px-4">
                  <MdVerified className="text-green-500 text-xl mx-auto" />
                </td>

                <td className="py-2 px-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(restaurant)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-200"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(restaurant)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Edit Restaurant
            </h2>
            <input
              type="text"
              value={newRestaurantData.name}
              onChange={(e) =>
                setNewRestaurantData({
                  ...newRestaurantData,
                  name: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="Restaurant Name"
            />
            <input
              type="text"
              value={newRestaurantData.address}
              onChange={(e) =>
                setNewRestaurantData({
                  ...newRestaurantData,
                  address: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="Address"
            />
            <input
              type="text"
              value={newRestaurantData.phone}
              onChange={(e) =>
                setNewRestaurantData({
                  ...newRestaurantData,
                  phone: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="Phone"
            />
            <input
              type="email"
              value={newRestaurantData.email}
              onChange={(e) =>
                setNewRestaurantData({
                  ...newRestaurantData,
                  email: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="Email"
            />
            <div className="flex justify-between mb-4">
              <input
                type="number"
                value={newRestaurantData.deliveryCommission}
                onChange={(e) =>
                  setNewRestaurantData({
                    ...newRestaurantData,
                    deliveryCommission: e.target.value,
                  })
                }
                className="w-1/2 p-3 border rounded-lg mb-4"
                placeholder="Delivery Commission (%)"
              />
              <input
                type="number"
                value={newRestaurantData.pickUpCommission}
                onChange={(e) =>
                  setNewRestaurantData({
                    ...newRestaurantData,
                    pickUpCommission: e.target.value,
                  })
                }
                className="w-1/2 p-3 border rounded-lg mb-4"
                placeholder="Pick-Up Commission (%)"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const updatedRestaurants = restaurants.map((restaurant) =>
                    restaurant.id === selectedRestaurant.id
                      ? { ...newRestaurantData, id: selectedRestaurant.id }
                      : restaurant
                  );
                  setRestaurants(updatedRestaurants);
                  setIsEditModalOpen(false);
                }}
                className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Delete Restaurant
            </h2>
            <p>Are you sure you want to delete {selectedRestaurant.name}?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Reject Restaurant
            </h2>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="Reason for rejection"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantManagement;
