import { useState, useEffect, useContext } from "react";
import withAuth from "../../utills/withAuth";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { OrderContext } from "../../context/OrderContext";

function DeliveryHistory() {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { backend } = useContext(OrderContext);

  const token = localStorage.getItem("deliveryAgent-token");
  const decoded = jwtDecode(token);
  const deliveryAgentId = decoded.agentId;

  useEffect(() => {
    fetchDeliveryHistory();
  }, []);

  const fetchDeliveryHistory = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${backend}/api/delivery-agent/delivery-history/${deliveryAgentId}`
      );
      if (data.success) {
        setDeliveries(data.deliveryHistory);
      } else {
        alert(data.message || "No delivery history found.");
      }
    } catch (err) {
      console.error("Error fetching delivery history:", err);
      // alert("Failed to fetch delivery history.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Delivery History</h2>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <h1 className="font-bold text-2xl text-primary">
            Loading Delivery History...
          </h1>
        </div>
      ) : deliveries.length === 0 ? (
        <p>No delivery history available.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Restaurant</th>
                <th className="p-4 text-left">Items</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Completed At</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery._id} className="border-b">
                  <td className="p-4">{delivery._id}</td>
                  <td className="p-4">
                    {new Date(delivery.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">{delivery.restoName || "N/A"}</td>
                  <td className="p-4">
                    {delivery.items
                      .map((item) => `${item.name} (x${item.quantity})`)
                      .join(", ")}
                  </td>
                  <td className="p-4">₹{delivery.amount.toFixed(2)}</td>
                  <td className="p-4">{delivery.status}</td>
                  <td className="p-4">
                    {delivery.completedAt
                      ? new Date(delivery.completedAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default withAuth(DeliveryHistory);
