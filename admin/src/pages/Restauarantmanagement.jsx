import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { saveAs } from "file-saver";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

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
    {
      id: 55,
      name: "Paradise",
      address: "Sector 17, Chandigarh, India",
      phone: "8765432109",
      email: "paradise@example.com",
      deliveryCommission: 2,
      pickUpCommission: 0,
      revenue: 11440.98,
      status: "Inactive",
    },
    {
      id: 55,
      name: "Paradise",
      address: "Sector 17, Chandigarh, India",
      phone: "8765432109",
      email: "paradise@example.com",
      deliveryCommission: 2,
      pickUpCommission: 0,
      revenue: 11440.98,
      status: "Inactive",
    },
    {
      id: 55,
      name: "Hotel Delux",
      address: "Nana varchha, Surat, India",
      phone: "9499810766",
      email: "Delux@example.com",
      deliveryCommission: 2,
      pickUpCommission: 0,
      revenue: 11440.98,
      status: "active",
    },
    // Add more restaurant objects here
  ]);

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsEditModalOpen(true);
  };

  const handleDelete = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setRestaurants(restaurants.filter((r) => r.id !== selectedRestaurant.id));
    setIsDeleteModalOpen(false);
  };

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

  const handleViewAnalytics = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsAnalyticsModalOpen(true);
  };

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

  return (
    <div className="p-6 bg-ray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-cener ">
        Restaurant Management
      </h1>
      <div className="bg-white p-4 shadow rounded-lg overflow-x-auto">
        {/* Search Bar */}
        <div className="flex items-center justify-between space-x-4 mb-6">
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute top-2 left-3 text-gray-500" />
            <input
              type="text"
              className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by Name, ID, Email, Phone"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className=" flex justify-end">
            <button
              onClick={handleExport}
              className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Restaurant Table */}
        <table className="w-full text-left bg-white border border-gray-200 rounded-lg">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Address</th>
              {/* <th className="py-3 px-4">Email</th> */}
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Delivery Commission</th>
              <th className="py-3 px-4">Pick-Up Commission</th>
              <th className="py-3 px-4">Revenue</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants
              .filter(
                (restaurant) =>
                  restaurant.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  restaurant.id.toString().includes(searchTerm) ||
                  restaurant.phone.includes(searchTerm) ||
                  restaurant.email.toLowerCase().includes(searchTerm)
              )
              .map((restaurant) => (
                <tr key={restaurant.id} className="hover:bg-orange-100">
                  <td className="py-2 px-4">{restaurant.id}</td>
                  <td className="py-2 px-4">{restaurant.name}</td>
                  <td className="py-2 px-4">{restaurant.address}</td>
                  <td className="py-2 px-4">{restaurant.phone}</td>
                  <td className="py-2 px-4">
                    ${restaurant.deliveryCommission}
                  </td>
                  <td className="py-2 px-4">${restaurant.pickUpCommission}</td>
                  <td className="py-2 px-4">${restaurant.revenue}</td>
                  <td className="py-2 px-4">{restaurant.status}</td>
                  <td className="py-2 px-4 flex space-x-2">
                  <button
                      onClick={() => handleViewAnalytics(restaurant)}
                      className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-5 py-2 rounded-lg shadow-md transform transition-all hover:scale-105 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      View Analytics
                    </button>
                    <button
                      onClick={() => handleEdit(restaurant)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow-md transform transition-all hover:scale-105 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <FiEdit className="mr-2" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(restaurant)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-lg shadow-md transform transition-all hover:scale-105 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <MdDelete className="mr-2" /> Delete
                    </button>
               
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed overflow-y-auto inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Edit Restaurant
            </h2>
            <input
              type="text"
              value={selectedRestaurant.name}
              onChange={(e) =>
                setSelectedRestaurant({
                  ...selectedRestaurant,
                  name: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="Restaurant Name"
            />
            <input
              type="text"
              value={selectedRestaurant.address}
              onChange={(e) =>
                setSelectedRestaurant({
                  ...selectedRestaurant,
                  address: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="Restaurant Address"
            />
            <input
              type="text"
              value={selectedRestaurant.phone}
              onChange={(e) =>
                setSelectedRestaurant({
                  ...selectedRestaurant,
                  phone: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="Phone Number"
            />
            <input
              type="email"
              value={selectedRestaurant.email}
              onChange={(e) =>
                setSelectedRestaurant({
                  ...selectedRestaurant,
                  email: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="Email"
            />
            <input
              type="number"
              value={selectedRestaurant.deliveryCommission}
              onChange={(e) =>
                setSelectedRestaurant({
                  ...selectedRestaurant,
                  deliveryCommission: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="Delivery Commission"
            />
            <input
              type="number"
              value={selectedRestaurant.pickUpCommission}
              onChange={(e) =>
                setSelectedRestaurant({
                  ...selectedRestaurant,
                  pickUpCommission: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="Pick-Up Commission"
            />
            <input
              type="number"
              value={selectedRestaurant.revenue}
              onChange={(e) =>
                setSelectedRestaurant({
                  ...selectedRestaurant,
                  revenue: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="Revenue"
            />
            <select
              value={selectedRestaurant.status}
              onChange={(e) =>
                setSelectedRestaurant({
                  ...selectedRestaurant,
                  status: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setRestaurants(
                    restaurants.map((restaurant) =>
                      restaurant.id === selectedRestaurant.id
                        ? selectedRestaurant
                        : restaurant
                    )
                  );
                  setIsEditModalOpen(false);
                }}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
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
              Confirm Delete
            </h2>
            <p className="mb-4">
              Are you sure you want to delete {selectedRestaurant.name}?
            </p>
            <div className="flex justify-end space-x-2">
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {isAnalyticsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Analytics for {selectedRestaurant.name}
            </h2>
            <Line data={data} />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsAnalyticsModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantManagement;
