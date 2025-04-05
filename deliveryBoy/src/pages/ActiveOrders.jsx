import { useState, useEffect, useContext } from "react";
import OrderCard from "../components/OrderCard";
import StatCard from "../components/StatCard";
import { FaMotorcycle, FaCheckCircle, FaClock } from "react-icons/fa";
import withAuth from "../../utills/withAuth";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { OrderContext } from "../../context/OrderContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeliveryPanel from "../../utills/delivreylocation.jsx";

function ActiveOrders() {
  // const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]); // Store all orders for filtering
  const [isLoading, setIsLoading] = useState(false);
  const [agentData, setAgentData] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { addAcceptedOrder, backend,orders,setOrders } = useContext(OrderContext);

  const navigate = useNavigate();
  const token = localStorage.getItem("deliveryAgent-token");
  const decoded = jwtDecode(token);
  const deliveryAgentId = decoded.agentId;

  useEffect(() => {
    console.log(token);
    if (token === null) {
      navigate('/auth');
    } else {
      fetchActiveOrders();
      getStatsData();
    }
  }, []);

  const fetchActiveOrders = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${backend}/api/delivery-agent/get-orders`,
        { sellerId: decoded.sellerId }
      );
      console.log(data);

      if (data.success) {
        const activeOrders = data.orderData
          .filter((order) => order.status !== "accepted")
          .sort((a, b) => {
            const statusPriority = {
              "placed": 1,
              "rejected": 2,
              "Delivered": 3,
              "accepted": 4
            };
            return (statusPriority[a.status] || 5) - (statusPriority[b.status] || 5);
          })
          .reverse();
        setOrders(activeOrders);
        setAllOrders(activeOrders); // Store all orders for filtering
        toast.success("Orders fetched successfully!");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

// In ActiveOrders
const handleUpdateStatus = async (orderId, newStatus) => {
  try {
    const res = await axios.post(
      `${backend}/api/delivery-agent/respondeto-order`,
      {
        orderId,
        action: newStatus,
        deliverAgentId: deliveryAgentId,
      }
    );

    if (res.status === 200) {
      toast.success(res.data.message || "Order status updated successfully.");
      if (newStatus === "accept") {
        const acceptedOrder = orders.find((order) => order._id === orderId);
        addAcceptedOrder({ ...acceptedOrder, status: "accepted", deliveryAgentId });
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "accepted", deliveryAgentId } : order
          )
        );
        setAllOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "accepted", deliveryAgentId } : order
          )
        );
      } else if (newStatus === "reject") {
        // Only update rejectedBy, keep status as "placed"
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  rejectedBy: [
                    ...(order.rejectedBy || []),
                    { deliverAgentId: deliveryAgentId, date: new Date() },
                  ],
                }
              : order
          )
        );
        setAllOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  rejectedBy: [
                    ...(order.rejectedBy || []),
                    { deliverAgentId: deliveryAgentId, date: new Date() },
                  ],
                }
              : order
          )
        );
      } else {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        setAllOrders((prevOrders) =>
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
        `http://localhost:3000/api/delivery-agent/get-agentprofile`,
        { deliveryAgentId: deliveryAgentId }
      );
      if (res.data) {
        setAgentData(res.data.agentData);
      } else {
        alert(res.data?.message || "Failed to fetch the stats-data.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to filter orders by selected status
  const filterOrdersByStatus = (status) => {
    if (status === "all") {
      setOrders(allOrders); // Show all orders
      toast.info("Showing all orders!");
    } else {
      const filteredOrders = allOrders.filter((order) => order.status === status);
      setOrders(filteredOrders);
      toast.info(`Showing only ${status} orders!`);
    }
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const stats = {
    totalOrders: agentData[0]?.totalDeliveries || 0,
    completed: agentData[0]?.completedDeliveries || 0,
    pending: agentData[0]?.pendingDeliveries || 0,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Active Orders</h2>
      
      </div>

    <DeliveryPanel deliveryAgentId={deliveryAgentId}/>

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

      <div className="relative mb-4">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-orange-500  text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Sort by Status
          </button>
          {isDropdownOpen && (
            <div className="absolute  mt-2 w-40 bg-white border rounded shadow-lg z-10">
              <button
                onClick={() => filterOrdersByStatus("placed")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Placed
              </button>
              <button
                onClick={() => filterOrdersByStatus("rejected")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Rejected
              </button>
              <button
                onClick={() => filterOrdersByStatus("Delivered")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              > 
                Delivered
              </button>
              <button
                onClick={() => filterOrdersByStatus("all")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                All
              </button>
            </div>
          )}
        </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <h1 className="font-bold text-2xl text-primary">
              Loading Orders...
            </h1>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex justify-center items-center">
            <h1 className="font-bold text-xl text-gray-500">
              No orders found for this status
            </h1>
          </div>
        ) : (
          orders.reverse().map((order) => (
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

      <ToastContainer />
    </div>
  );
}

export default withAuth(ActiveOrders);
