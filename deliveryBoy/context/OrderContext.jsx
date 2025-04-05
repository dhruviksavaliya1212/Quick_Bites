import { createContext, useContext, useState } from "react";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [deliveryAgentId, setDeliveryAgentId] = useState(false);
  const [orders,setOrders] = useState([]);

  // const {orders,setOrders} = useContext(OrderContext);

  const backend = 'https://quick-bites-backend.vercel.app';

  const addAcceptedOrder = (order) => {
    setAcceptedOrders((prev) => {
      if (!prev.some((o) => o._id === order._id)) {
        return [...prev, order];
      }
      return prev;
    });
  };

  const updateAcceptedOrder = (orderId, newStatus) => {
    setAcceptedOrders((prev) => {
      if (newStatus === "delivered") {
        // Remove the order from acceptedOrders when delivered
        return prev.filter((order) => order._id !== orderId);
      }
      // Update status for other cases (e.g., "pickedup")
      return prev.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
    });
  };

  return (
    <OrderContext.Provider value={{ acceptedOrders,orders,setOrders,addAcceptedOrder, updateAcceptedOrder, backend }}>
      {children}
    </OrderContext.Provider>
  );
};
