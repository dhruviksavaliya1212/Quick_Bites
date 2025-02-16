import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

  const backend = "http://localhost:3000";
  const [orderData, setOrderData] = useState(false)

  const getOrders = async () => {
    const { data } = await axios.post(
      `${backend}/api/order/get-all-orders`,
    );

    console.log(data)
    if (data.success) {
      setOrderData(data.orderData);
    }
  };

  useEffect(()=>{
    getOrders()
  },[])

  const values = {
    backend,
    orderData
  }

  return(
    <AdminContext.Provider value={values}>
      {props.children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider