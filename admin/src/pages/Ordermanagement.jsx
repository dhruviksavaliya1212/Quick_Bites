import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AdminContext } from "../Context/AdminContext";

const Ordermanagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {backend} = useContext(AdminContext)

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get( `${backend}/api/auth/admin/getall-orders`);
        if (res.data && Array.isArray(res.data.orderData)) {
          setOrders(res.data.orderData);
          setFilteredOrders(res.data.orderData);
        } else {
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (paymentFilter) {
      filtered = filtered.filter((order) => order.paymentType === paymentFilter);
    }

    setFilteredOrders(filtered);
  }, [statusFilter, paymentFilter, orders]);

  return (
    <div className="p-6 bg-orange-0 min-h-screen">
      <h1 className="text-3xl font-bold  mb-6">Order Management</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-orange-300 bg-white text-orange-700 p-2 rounded-md focus:ring-2 focus:ring-orange-400"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="delivered">Delivered</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="border border-orange-300 bg-white text-orange-700 p-2 rounded-md focus:ring-2 focus:ring-orange-400"
        >
          <option value="">All Payment Types</option>
          <option value="Cash On Delivery">Cash on Delivery</option>
          <option value="Online(Stripe)">Online</option>
        </select>
      </div>

      {/* Orders */}
      {isLoading ? (
        <p className="text-orange-500">Loading orders...</p>
      ) : filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-orange-200 rounded-xl shadow-md p-5 hover:shadow-orange-300 transition-all"
            >
              <p className="text-xs text-gray-400 mb-2">Order ID: {order._id}</p>
              <h2 className="text-lg font-semibold text-orange-700 mb-1">
                {order.items[0]?.name || "Unknown Item"} x {order.items[0]?.quantity || 0}
              </h2>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Customer:</strong>{" "}
                {order?.address?.firstName && order?.address?.lastName
                  ? `${order.address.firstName} ${order.address.lastName}`
                  : "N/A"}
              </p>
              <p className="text-sm mb-1">
                <strong>Amount:</strong> ₹{order.amount}
              </p>
              <p className="text-sm mb-1">
                <strong>Payment:</strong> {order.paymentType || "N/A"}
              </p>
              <p className="text-sm mb-1">
                <strong>Status:</strong>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded text-white text-xs ${
                    order.status === "Delivered"
                      ? "bg-green-500"
                      : order.status === "Pending"
                      ? "bg-yellow-500"
                      : order.status === "Rejected"
                      ? "bg-red-500"
                      : "bg-orange-500"
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Ordered At: {new Date(order.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No orders found.</p>
      )}
    </div>
  );
};

export default Ordermanagement;
