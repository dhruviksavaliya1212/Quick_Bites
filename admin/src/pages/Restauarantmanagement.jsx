import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdDelete, MdVerified } from "react-icons/md";
import { saveAs } from "file-saver";
import axios from "axios";
import { useContext } from "react";
import { AdminContext } from "../Context/AdminContext";
import withAuth from "../utills/hoc/withAuth";
import { toast } from 'react-toastify'; // Ensure you have this installed

const RestaurantManagement = () => {
  const { backend } = useContext(AdminContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [rejectedRestaurants, setRejectedRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false); // For approve confirmation
  const [isRejectConfirmationModalOpen, setIsRejectConfirmationModalOpen] = useState(false); // For reject confirmation
  const [newRestaurantData, setNewRestaurantData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  // Get all restaurant data
  const getRestoData = async () => {
    try{
    const {data} = await axios.post(`${backend}/api/restaurant/get-resto-data`);
    console.log(data)
    if(data.success){
      setPendingRestaurants(data.restoData.filter((resto,_)=> resto.isrequested && resto.isrejected === false))
      setRestaurants(data.restoData.filter((resto,_) => resto.isrequested === false))
      setRejectedRestaurants(data.restoData.filter((resto,_) => resto.isrejected))
    } else {
      toast.error(data.message)
    }
  }
   catch (error) {
      console.error("Error fetching restaurant data:", error);
      toast.error("Failed to fetch restaurant data");
    }
  };

  const updateProfile = async () => {
    try {
      const { data } = await axios.post(
        `${backend}/api/restaurant/update-data-admin`,
        newRestaurantData
      );
      console.log(data);
      if (data.success) {
        toast.success("Restaurant updated successfully!");
        getRestoData();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
    setIsEditModalOpen(false);
  };

  const confirmDelete = async () => {
    try {
      const restoId = selectedRestaurant._id;
      const { data } = await axios.post(
        `${backend}/api/restaurant/delete-resto`,
        { restoId }
      );
      console.log(data);
      if (data.success) {
        console.log(data.message);
        setRestaurants(restaurants.filter((r) => r._id !== restoId));
        getRestoData()
        toast.success("Restaurant deleted successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete restaurant");
    }
    setIsDeleteModalOpen(false);
  };
  // Accept Resto request
  const acceptResto = async(restoId) => {
    try {
      // const restoId = selectedRestaurant._id
      const { data } = await axios.post(
        `${backend}/api/admin/accept-resto`,
        {restoId});
        console.log(data)
        if(data.success){
          getRestoData()
          setPendingRestaurants( pendingRestaurants.filter((r) => r._id !== restoId)
    );
        }
    } catch (err) {
      console.log(err)
    }
  }

    // Confirm Rejection Handler
    const confirmReject = async() => {

      try {
        const restoId = selectedRestaurant._id
        const {data} = await axios.post(`${backend}/api/admin/reject-resto`, {restoId, rejectionReason})

        console.log(data)
      if(data.success){
        getRestoData()
        setRejectedRestaurants([
          ...rejectedRestaurants,
          {...selectedRestaurant, rejectionReason },
        ]);
        setPendingRestaurants(
          pendingRestaurants.filter((r) => r._id !== selectedRestaurant._id)
        );
      }

      } catch (err) {
        console.log(err)
      }
      setIsRejectModalOpen(false);
      setRejectionReason(""); // Clear the rejection reason after submission
    };

  useEffect(()=>{
    getRestoData()
  },[])

  // Handlers for Pending Table
  // const handleApprove = (restaurant) => {
  //   setRestaurants([
  //     ...restaurants,
  //     { ...restaurant, status: "Active", verified: false },
  //   ]);
  //   setPendingRestaurants(
  //     pendingRestaurants.filter((r) => r.id !== restaurant.id)
  //   );
  // };
  // const confirmApprove = () => {
  //   setRestaurants([...restaurants, { ...selectedRestaurant, status: "Active", verified: false }]);
  //   setPendingRestaurants(pendingRestaurants.filter((r) => r._id !== selectedRestaurant._id));
  //   setIsApproveModalOpen(false);
  //   toast.success(`${selectedRestaurant.name} has been approved`);
  // };

  // const confirmReject = () => {
  //   setRejectedRestaurants([...rejectedRestaurants, { ...selectedRestaurant, rejectionReason }]);
  //   setPendingRestaurants(pendingRestaurants.filter((r) => r._id !== selectedRestaurant._id));
  //   setIsRejectConfirmationModalOpen(false); // Close confirmation modal
  //   setRejectionReason("");
  //   toast.success(`${selectedRestaurant.name} has been rejected`);
  // };

  // Handlers
  // const handleApprove = (restaurant) => {
  //   setSelectedRestaurant(restaurant);
  //   setIsApproveModalOpen(true); // Open approve confirmation modal
  // };

  const handleReject = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsRejectConfirmationModalOpen(true); // Open reject confirmation modal
  };

  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setNewRestaurantData({ ...restaurant }); // Pre-fill the edit form
    setIsEditModalOpen(true);
  };

  const handleDelete = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDeleteModalOpen(true);
  };

  // const handleVerify = (restaurant) => {
  //   const updatedRestaurants = restaurants.map((r) =>
  //     r.id === restaurant.id ? { ...r, verified: !r.verified } : r
  //   );
  //   setRestaurants(updatedRestaurants);
  // };
  useEffect(() => {
    getRestoData();
  }, []);

  // Export Restaurants to CSV
  const handleExport = () => {
    const csvData = restaurants.map((restaurant) => ({
      ID: restaurant._id,
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
  // const handleViewAnalytics = (restaurant) => {
  //   setSelectedRestaurant(restaurant);
  //   setIsAnalyticsModalOpen(true);
  // };

  // const filteredRestaurants = restaurants && restaurants.filter((restaurant) =>
  //   restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // const filteredPendingRestaurants = pendingRestaurants && pendingRestaurants.filter((restaurant) =>
  //   restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  // Filtering
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
    <div className="p-3 min-h-screen bg-gray-50">
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
      <div className="bg-white p-4 shadow-lg rounded-xl mb-6 overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Pending Restaurants
        </h2>
        <table className="w-full text-left bg-white border border-gray-200 rounded-lg">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="py-3 px-4">No</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPendingRestaurants.map((restaurant, index) => (
              <tr key={index} className="hover:bg-orange-50">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{restaurant.name}</td>
                <td className="py-2 px-4">{restaurant.address}</td>
                <td className="py-2 px-4">{restaurant.phone}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <button
                    onClick={() => acceptResto(restaurant._id)}
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
      <div className="bg-white p-4 shadow-lg rounded-xl mb-6 overflow-x-auto">
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
              <tr key={restaurant._id} className="hover:bg-red-50">
                <td className="py-2 px-4">{restaurant._id}</td>
                <td className="py-2 px-4">{restaurant.name}</td>
                <td className="py-2 px-4">{restaurant.address}</td>
                <td className="py-2 px-4">{restaurant.phone}</td>
                <td className="py-2 px-4">{restaurant.rejectionmsg}</td>
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
              <th className="py-3 px-4">No</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Owner Name</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Timing</th>
              <th className="py-3 px-4">Delivery Time</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Verified</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRestaurants.map((restaurant, index) => (
              <tr key={index} className="hover:bg-green-50">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4" style={{ width: "200px", maxWidth: "200px" }}>
                  <div className="overflow-x-auto whitespace-nowrap">
                    {restaurant.name}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className="overflow-x-auto whitespace-nowrap">
                    {restaurant.ownername}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className="flex flex-wrap w-[40rem]">
                    {restaurant.desc}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className="flex flex-wrap w-[40rem]">
                    {restaurant.address}
                  </div>
                </td>
                <td className="py-2 px-4">{restaurant.phone}</td>
                <td className="py-2 px-4">{restaurant.email}</td>
                <td className="py-2 px-4">{restaurant.timing}</td>
                <td className="py-2 px-4">{restaurant.deliverytime}</td>
                <td className="py-2 px-4">{restaurant.isOpen ? "Open" : "Close"}</td>
                <td className="py-2 px-4">
                  <MdVerified className="text-green-500 text-xl mx-auto" />
                </td>
                <td className="py-2 px-4 flex space-x-2 items-center justify-center">
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

      {/* Approve Confirmation Modal */}
      {isApproveModalOpen && selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Confirm Approve Restaurant
            </h2>
            <div className="mb-4">
              <p><strong>Name:</strong> {selectedRestaurant.name}</p>
              <p><strong>Address:</strong> {selectedRestaurant.address}</p>
              <p><strong>Phone:</strong> {selectedRestaurant.phone}</p>
              <p><strong>Email:</strong> {selectedRestaurant.email}</p>
              <p><strong>Owner Name:</strong> {selectedRestaurant.ownername}</p>
              <p><strong>Description:</strong> {selectedRestaurant.desc}</p>
              <p><strong>Timing:</strong> {selectedRestaurant.timing}</p>
              <p><strong>Delivery Time:</strong> {selectedRestaurant.deliverytime}</p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {isRejectConfirmationModalOpen && selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Confirm Reject Restaurant
            </h2>
            <div className="mb-4">
              <p><strong>Name:</strong> {selectedRestaurant.name}</p>
              <p><strong>Address:</strong> {selectedRestaurant.address}</p>
              <p><strong>Phone:</strong> {selectedRestaurant.phone}</p>
              <p><strong>Email:</strong> {selectedRestaurant.email}</p>
              <p><strong>Owner Name:</strong> {selectedRestaurant.ownername}</p>
              <p><strong>Description:</strong> {selectedRestaurant.desc}</p>
              <p><strong>Timing:</strong> {selectedRestaurant.timing}</p>
              <p><strong>Delivery Time:</strong> {selectedRestaurant.deliverytime}</p>
            </div>
            <div className="mb-4">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="Reason for rejection"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsRejectConfirmationModalOpen(false);
                  setRejectionReason("");
                }}
                className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

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
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={updateProfile}
                className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedRestaurant && (
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

      {/* Rejection Modal (optional, can be removed if confirmation modal handles all) */}
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

export default withAuth(RestaurantManagement);
