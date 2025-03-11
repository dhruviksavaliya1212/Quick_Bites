import { useState, useEffect } from "react";
import OrderCard from "../components/OrderCard";
import StatCard from "../components/StatCard";
import { FaMotorcycle, FaCheckCircle, FaClock } from "react-icons/fa";
import withAuth from "../../utills/withAuth";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function ActiveOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading,setisLoading] = useState(false);

  useEffect(() => {
    handleActiveOrders();
  }, []);

  const handleActiveOrders = async () => {
    setisLoading(true); // ✅ Start loading
  
    try {
      const token = localStorage.getItem("deliveryAgent-token");
      const decoded = jwtDecode(token);
      const sellerId = decoded.sellerId;
  
      const { data } = await axios.post(
        "http://localhost:3000/api/delivery-agent/get-orders",
        { sellerId }
      );
          console.log(data);
      
      if (data.success) {
        setOrders(data.orderData);
               
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      alert("Something went wrong fetching orders");
    } finally {
      setisLoading(false); // ✅ Stop loading
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
       {isLoading ? (
        <div className="flex justify-center items-center "><h1 className="font-bold text-2xl text-primary">Loading Orders...</h1></div>
       ) :  (orders.map((order) => (
          <OrderCard
            key={order._id}
            order={{
              id: order.items.map(item => item.name),
              restaurant: order.restoName,
              deliveryAddress: `${order.address?.flatno || ''}, ${order.address?.societyName || ''}, ${order.address?.city === "Please Select" ? "N/A" : order.address?.city}, ${order.address?.state || ''}, ${order.address?.zipcode || 'N/A'}`,
              customerPhone: order.address.phone,
              amount: order.amount,
              status: order.status,
              email: order.userId?.email || "N/A",
            }}
            onUpdateStatus={handleUpdateStatus}
          />
        )))}
      </div>
    </div>
  );
}

export default withAuth(ActiveOrders);
