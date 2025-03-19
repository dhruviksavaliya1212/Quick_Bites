import { useState, useEffect, useContext } from "react";
import OrderCard from "../components/OrderCard";
import StatCard from "../components/StatCard";
import { FaMotorcycle, FaCheckCircle, FaClock } from "react-icons/fa";
import withAuth from "../../utills/withAuth";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { OrderContext } from "../../context/OrderContext";
import { toast, ToastContainer } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toastify

function ActiveOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [agentData, setAgentData] = useState([]);
  const { addAcceptedOrder } = useContext(OrderContext);

  const token = localStorage.getItem("deliveryAgent-token");
  const decoded = jwtDecode(token);
  const deliveryAgentId = decoded.agentId;

  useEffect(() => {
    fetchActiveOrders();
  }, []);

  const fetchActiveOrders = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "https://quick-bites-backend.vercel.app/api/delivery-agent/get-orders",
        { sellerId: decoded.sellerId }
      );
      console.log(data)

      if (data.success) {
        // Filter out "accepted" orders and reverse the array (newest first)
        const activeOrders = data.orderData
          .filter((order) => order.status !== "accepted")
          .reverse(); // Reverse to show newest orders first
        setOrders(activeOrders);
        toast.success("Orders fetched successfully!"); // Add toast for success
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      alert("Failed to fetch orders.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.post(
        "https://quick-bites-backend.vercel.app/api/delivery-agent/respondeto-order",
        {
          orderId,
          action: newStatus,
          deliverAgentId: deliveryAgentId,
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message || "Order status updated successfully."); // Success toast
        if (newStatus === "accept") {
          const acceptedOrder = orders.find((order) => order._id === orderId);
          addAcceptedOrder({ ...acceptedOrder, status: "accepted" });
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order._id !== orderId)
          );
        } else {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === orderId ? { ...order, status: newStatus } : order
            )
          );
        }
        return true;
      } else {
        alert(res.data.message || "Failed to update order status.");
        return false;
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong while updating order status.";
      alert(errorMsg);
      return false;
    }
  };

  const getStatsData = async () => {
    try {
      const res = await axios.post(
        "https://quick-bites-backend.vercel.app/api/delivery-agent/get-specific-agents",
        { sellerId: decoded.sellerId }
      );
      if (res.data) {
        setAgentData(res.data.agentData);
        toast.success("Agent stats fetched successfully!"); // Add toast for success
      } else {
        alert(res.data?.message || "Failed to fetch the stats-data.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStatsData();
  }, []);

  const stats = {
    totalOrders: agentData[0]?.totalDeliveries || 0,
    completed: agentData[0]?.completedDeliveries || 0,
    pending: agentData[0]?.pendingDeliveries || 0,
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
          <div className="flex justify-center items-center">
            <h1 className="font-bold text-2xl text-primary">
              Loading Orders...
            </h1>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order._id}
              order={{
                ...order,
                itemName: order.items.map((item) => item.name).join(", "),
                deliveryAddress: `${order.address?.flatno || ""}, ${
                  order.address?.societyName || ""
                }, ${
                  order.address?.city !== "Please Select"
                    ? order.address?.city
                    : "N/A"
                }, ${order.address?.state || ""}, ${
                  order.address?.zipcode || "N/A"
                }`,
                customerPhone: order.address?.phone || "N/A",
                email: order.userId?.email || "N/A",
              }}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        )}
      </div>

      <ToastContainer /> {/* Toast container to render toasts */}
    </div>
  );
}

export default withAuth(ActiveOrders);
