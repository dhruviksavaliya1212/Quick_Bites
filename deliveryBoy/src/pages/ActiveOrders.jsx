import { useState, useEffect } from "react";
import OrderCard from "../components/OrderCard";
import StatCard from "../components/StatCard";
import { FaMotorcycle, FaCheckCircle, FaClock } from "react-icons/fa";
import withAuth from "../../utills/withAuth";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function ActiveOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    handleActiveOrders();
  }, []);

  const handleActiveOrders = async () => {
    const token = localStorage.getItem("deliveryAgent-token");
    const decoded = jwtDecode(token);
    const sellerId = decoded.sellerId;
    console.log(sellerId);

    const data = await axios.post(
      "http://localhost:3000/api/delivery-agent/get-orders",
      { sellerId }
    );
    if (data.data.success) {
      console.log(data);
      setOrders(data.data.orderData);
    } else {
      console.error("Error");
      alert(data.data.message);
    }
  };

  const stats = {
    totalOrders: orders.length,
    completed: orders.filter((order) => order.status === "delivered").length,
    pending: orders.filter((order) => order.status === "pending").length,
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    console.log(`Order ${orderId} status updated to ${newStatus}`);
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Active Orders</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={<FaMotorcycle />}
          value={stats.totalOrders}
          label="Total Orders"
        />
        <StatCard
          icon={<FaCheckCircle />}
          value={stats.completed}
          label="Completed"
        />
        <StatCard icon={<FaClock />} value={stats.pending} label="Pending" />
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={{
              id: order.items.map(item => item.name),
              restaurant: order.restoName,
              deliveryAddress: `${order.address.flatno}, ${order.address.societyName}`,
              customerPhone: order.address.phone,
              amount: order.amount,
              status: order.status,
              email: order.userId?.email || "N/A",
            }}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
}

export default withAuth(ActiveOrders);
