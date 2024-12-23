import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { saveAs } from "file-saver";

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

  // Handlers for Pending Table
  const handleApprove = (restaurant) => {
    setRestaurants([...restaurants, { ...restaurant, status: "Active" }]);
    setPendingRestaurants(pendingRestaurants.filter((r) => r.id !== restaurant.id));
  };

  const handleReject = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsRejectModalOpen(true); // Open rejection modal
  };

  // Handlers for Approved Table
  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsEditModalOpen(true);
  };

  const handleDelete = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDeleteModalOpen(true);
  };

  // Confirm Rejection Handler
  const confirmReject = () => {
    setRejectedRestaurants([
      ...rejectedRestaurants,
      { ...selectedRestaurant, rejectionReason },
    ]);
    setPendingRestaurants(pendingRestaurants.filter((r) => r.id !== selectedRestaurant.id));
    setIsRejectModalOpen(false);
    setRejectionReason(""); // Clear the rejection reason after submission
  };

  // Confirm Deletion Handler
  const confirmDelete = () => {
    if (selectedRestaurant.status === "Pending") {
      setPendingRestaurants(pendingRestaurants.filter((r) => r.id !== selectedRestaurant.id));
    } else {
      setRestaurants(restaurants.filter((r) => r.id !== selectedRestaurant.id));
    }
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
    }));

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, "restaurants_data.csv");
  };

  // Analytics Data
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Revenue",
        data: [10000, 15000, 13000, 18000, 21000, 17000, 19000],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
      {
        label: "Pick-Up Commission",
        data: [1000, 1200, 1300, 1100, 1400, 1500, 1600],
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
    ],
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
    <div className="p-6 min-h-screen">
 <div className=" flex justify-between items-center mb-3">
 <h1 className="text-2xl font-bold mb-4 ">Restaurant Management</h1>
   {/* Export Button */}
   <div className="text-center mb-6">
        <button
          onClick={handleExport}
          className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600"
        >
          Export to CSV
        </button>
      </div>
 </div>
   

      {/* Pending Restaurants Table */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Pending Restaurants</h2>
        
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
              <tr key={restaurant.id} className="hover:bg-orange-100">
                <td className="py-2 px-4">{restaurant.id}</td>
                <td className="py-2 px-4">{restaurant.name}</td>
                <td className="py-2 px-4">{restaurant.address}</td>
                <td className="py-2 px-4">{restaurant.phone}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <button
                    onClick={() => handleApprove(restaurant)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(restaurant)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
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
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Rejected Restaurants</h2>
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
              <tr key={restaurant.id} className="hover:bg-red-100">
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
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-xl font-bold mb-4">Approved Restaurants</h2>
        <table className="w-full text-left bg-white border border-gray-200 rounded-lg">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredRestaurants.map((restaurant) => (
              <tr key={restaurant.id} className="hover:bg-green-100">
                <td className="py-2 px-4">{restaurant.id}</td>
                <td className="py-2 px-4">{restaurant.name}</td>
                <td className="py-2 px-4">{restaurant.address}</td>
                <td className="py-2 px-4">{restaurant.phone}</td>
                <td className="py-2 px-4">{restaurant.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

   

      {/* Rejection Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Reject Restaurant</h2>
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
