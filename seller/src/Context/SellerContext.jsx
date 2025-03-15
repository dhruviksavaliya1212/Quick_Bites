import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const SellerContext = createContext();

const SellerContextProvider = (props) => {
  const backend = "http://localhost:3000";

  const currency = "₹";

  const [stoken, setStoken] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [restoData, setRestoData] = useState(false);
  const [orders, setOrders] = useState(false);  
  const [feedbackData, setfeedbackData] = useState(false)


  const restaurantIsAvailable = async (token) => {
    const { data } = await axios.post(
      `${backend}/api/restaurant/check-restaurant`,
      {},
      { headers: { Authorization: `Bearer ${stoken}` } } 
    );

    console.log(data);

    if (data.success) {
      setIsAvailable(true);
      setRestoData(data.restaurant)
    } else {
      setIsAvailable(false);
    }
  };

  const getOrders = async () => {
    const { data } = await axios.post(
      `${backend}/api/order/get-orders2`,
      {},
      { headers: { Authorization: `Bearer ${stoken}` } });

    console.log(data);
    if (data.success) {
        setfeedbackData(data.orderData.filter((order,_) => order.feedback !== ''))
      setOrders(data.orderData);
    }
    
  };

  const acceptOrder = async (orderId) => {
    const { data } = await axios.post(
      `${backend}/api/restaurant/accept-order`,
      { orderId },
      { headers: { Authorization: `Bearer ${stoken}` } } 

    );

    if (data.success) {
      toast.success(data.message);
      getOrders(stoken);
    } else {
      toast.error(data.message);
    }
  };

  const rejectOrder = async (orderId) => {
    const { data } = await axios.post(
      `${backend}/api/restaurant/reject-order`,
      { orderId },
      { headers: { Authorization: `Bearer ${stoken}` } } 
    );

    if (data.success) {
      toast.success(data.message);
      getOrders(stoken);
    } else {
      toast.error(data.message);
    }
  };

  const completeOrder = async (orderId) => {
    const { data } = await axios.post(
      `${backend}/api/restaurant/complete-order`,
      { orderId },
      { headers: { Authorization: `Bearer ${stoken}` } } 
    );
    if (data.success) {
      toast.success(data.message);
      getOrders(stoken);
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("seller-token");
    if (token) {
      setStoken(token); // Only update state, don't call APIs here
    }
  }, []);  // Run only once on mount
  
  useEffect(() => {
    if (stoken) { // Ensure token is set before calling APIs
      restaurantIsAvailable();
      getOrders();
    }
  }, [stoken]); // Runs only when `stoken` updates
  

  const values = {
    stoken,
    setStoken,
    backend,
    currency,
    isAvailable,
    restaurantIsAvailable,
    orders,
    acceptOrder,
    rejectOrder,
    completeOrder,
    restoData,
    setRestoData,
    getOrders,
    feedbackData
  };

  return (
    <SellerContext.Provider value={values}>
      {props.children}
    </SellerContext.Provider>
  );
};

export default SellerContextProvider;
