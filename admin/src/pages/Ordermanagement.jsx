import React, { useState } from "react";

const Ordermanagement = () => {
  const initialOrders = [
    {
      id: 753,
      date: "May 11, 2020 · 04:30 PM",
      items: "Tocipapas x 4 more",
      address: "Pizpa, Sector 28, Chandigarh, 160028, India",
      price: "₹147.60",
      paymentType: "Cash",
      status: "InTransit",
    },
    {
      id: 756,
      date: "May 11, 2020 · 05:54 PM",
      items: "Tocipapas x 6 more",
      address: "Pizpa, Sector 28, Chandigarh, 160028, India",
      price: "₹202.14",
      paymentType: "Cash",
      status: "Delivered",
    },
    {
      id: 759,
      date: "May 11, 2020 · 05:54 PM",
      items: "Tocipapas x 6 more",
      address: "Pizpa, Sector 28, Chandigarh, 160028, India",
      price: "₹202.14",
      paymentType: "Online",
      status: "Delivered",
    },
    {
      id: 758,
      date: "May 11, 2020 · 05:54 PM",
      items: "Tocipapas x 6 more",
      address: "Pizpa, Sector 28, Chandigarh, 160028, India",
      price: "₹202.14",
      paymentType: "Cash",
      status: "Delivered",
    },
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [filterPayment, setFilterPayment] = useState("All");
  const [sortOption, setSortOption] = useState("date");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editOrderData, setEditOrderData] = useState({
    id: "",
    date: "",
    items: "",
    address: "",
    price: "",
    paymentType: "",
  });

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handlePaymentChange = (e) => setFilterPayment(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);

  const handleEditOrder = (orderId) => {
    const order = orders.find((order) => order.id === orderId);
    setEditOrderData({
      id: order.id,
      date: order.date,
      items: order.items,
      address: order.address,
      price: order.price,
      paymentType: order.paymentType,
    });
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateOrder = () => {
    const updatedOrders = orders.map((order) =>
      order.id === selectedOrder.id
        ? {
            ...order,
            ...editOrderData,
            paymentType: editOrderData.paymentType.trim().toLowerCase(), // Normalize to lowercase
          }
        : order
    );
    setOrders(updatedOrders);
    handleCloseModal();
  };

  const handleDeleteOrder = (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (confirmDelete) {
      const updatedOrders = orders.filter((order) => order.id !== orderId);
      setOrders(updatedOrders);
    }
  };

  // Filter orders based on search (case-insensitive) and payment type
  const filteredOrders = orders
    .filter((order) => order.id.toString().includes(search))
    .filter(
      (order) =>
        filterPayment === "All" ||
        order.paymentType.toLowerCase() === filterPayment.toLowerCase() // Normalize here
    );

  const sortedOrders = filteredOrders.sort((a, b) => {
    if (sortOption === "date") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortOption === "payment") {
      return (
        parseFloat(b.price.replace("₹", "").replace(",", "")) -
        parseFloat(a.price.replace("₹", "").replace(",", ""))
      );
    }
    return 0;
  });

  // Sort orders based on selected option (by date or price)

  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="font-extrabold text-2xl text-gray-900 py-5">
        Order Management
      </h1>

      {/* Header - Search and Filters */}
      <div className="flex flex-col justify-between p-4 bg-white shadow-lg rounded-lg mb-6">
        <div className="flex justify-between gap-6 w-full md:w-auto overflow-x-auto">
          <input
            type="text"
            placeholder="Search by Order ID"
            className="border outline-none border-gray-300 rounded-lg p-3 w-full md:w-80 focus:ring-2 focus:ring-indigo-500 transition"
            value={search}
            onChange={handleSearchChange}
          />
          <div className="flex gap-4">
            <select
              className="border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 transition w-full md:w-52"
              value={filterPayment}
              onChange={handlePaymentChange}
            >
              <option value="All">All Payment Types</option>
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 transition w-full md:w-52"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="date">Sort by Date</option>
              <option value="payment">Sort by Payment Type</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedOrders.length > 0 ? (
            sortedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold text-gray-800">
                    ORDER ID - {order.id}
                  </span>
                  <button
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                    onClick={() => handleEditOrder(order.id)}
                  >
                    Edit
                  </button>
                </div>
                <p className="text-gray-600 mb-2">{order.date}</p>
                <p className="text-gray-600 mb-2">{order.items}</p>
                <p className="text-gray-600 mb-2">{order.address}</p>
                <p className="text-gray-600 mb-2">Price - {order.price}</p>
                <p className="text-gray-600 mb-4">
                  Payment - {order.paymentType}
                </p>
                <p className="text-gray-600 mb-4">
                  Order Status - {order.status}
                </p>
                <div className="flex gap-4">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    onClick={() => handleEditOrder(order.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No orders found!</p>
          )}
        </div>
      </div>

      {/* Edit Order Modal */}
      {isModalOpen && (
        <div className="fixed overflow-y-auto inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-6">Edit Order</h2>
            <div>
              <label className="block mb-2 text-gray-700">Order ID</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-3 w-full mb-4 bg-gray-100"
                value={editOrderData.id}
                readOnly
              />
              <label className="block mb-2 text-gray-700">Date</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-3 w-full mb-4"
                value={editOrderData.date}
                onChange={(e) =>
                  setEditOrderData({ ...editOrderData, date: e.target.value })
                }
              />
              <label className="block mb-2 text-gray-700">Items</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-3 w-full mb-4"
                value={editOrderData.items}
                onChange={(e) =>
                  setEditOrderData({ ...editOrderData, items: e.target.value })
                }
              />
              <label className="block mb-2 text-gray-700">Address</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-3 w-full mb-4"
                value={editOrderData.address}
                onChange={(e) =>
                  setEditOrderData({
                    ...editOrderData,
                    address: e.target.value,
                  })
                }
              />
              <label className="block mb-2 text-gray-700">Price</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-3 w-full mb-4"
                value={editOrderData.price}
                onChange={(e) =>
                  setEditOrderData({ ...editOrderData, price: e.target.value })
                }
              />
              <label className="block mb-2 text-gray-700">Payment Type</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-3 w-full mb-4"
                value={editOrderData.paymentType}
                placeholder="Enter payment type (e.g., cash or online)"
                onChange={(e) =>
                  setEditOrderData({
                    ...editOrderData,
                    paymentType: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                onClick={handleUpdateOrder}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ordermanagement;
