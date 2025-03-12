import { useContext } from "react";
import { OrderContext } from "../../context/OrderContext";
import OrderCard from "../components/OrderCard";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AcceptedOrders = () => {
  const { acceptedOrders, updateAcceptedOrder } = useContext(OrderContext);

  const token = localStorage.getItem("deliveryAgent-token");
  const decoded = jwtDecode(token);
  const deliveryAgentId = decoded.agentId;

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/delivery-agent/respondeto-order",
        {
          orderId,
          action: newStatus,
          deliverAgentId: deliveryAgentId,
        }
      );

      if (res.status === 200) {
        alert(res.data.message || "Order status updated successfully.");
        // Update the context with the new status
        updateAcceptedOrder(orderId, newStatus);
        return true; // Indicate success to OrderCard
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Accepted Orders</h2>
      {acceptedOrders.length === 0 ? (
        <p>No accepted orders yet.</p>
      ) : (
        acceptedOrders.map((order) => (
          <OrderCard
            key={order._id}
            order={{
              ...order,
              itemName: order.items.map((item) => item.name).join(", "),
              deliveryAddress: `${order.address?.flatno || ""}, ${
                order.address?.societyName || ""
              }, ${order.address?.city || ""}, ${order.address?.state || ""}, ${
                order.address?.zipcode || ""
              }`,
              customerPhone: order.address?.phone || "N/A",
              email: order.userId?.email || "N/A",
            }}
            onUpdateStatus={handleUpdateStatus}
          />
        ))
      )}
    </div>
  );
};

export default AcceptedOrders;
