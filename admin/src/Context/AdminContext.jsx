import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

  const backend = "https://quick-bites-backend.vercel.app";
  const [orderData, setOrderData] = useState(false)
  const [profileData, setprofileData] = useState({})
  const [feedbackData, setfeedbackData] = useState(false)


  console.log('context',profileData);
  
  const getOrders = async () => {
    try {
      const { data } = await axios.post(
        `${backend}/api/order/get-all-orders`,
      );
  
      console.log(data)
      if (data.success) {
        setOrderData(data.orderData);
        setfeedbackData(data.orderData.filter((order,_) => order.feedback !== ''))
      }
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(()=>{
    getOrders()
  },[])

  const values = {
    backend,
    orderData,
    feedbackData,
    profileData,
    setprofileData

  }

  return(
    <AdminContext.Provider value={values}>
      {props.children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider
