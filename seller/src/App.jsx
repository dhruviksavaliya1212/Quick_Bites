import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Navabar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import Login from "./Pages/Login";
import { SellerContext } from "./Context/SellerContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./Pages/Dashboard";
import AddRestaurant from "./Pages/AddRestaurant";
import OrderDesc from "./Pages/OrderDesc";
import AllOrders from "./Pages/AllOrders";
import AllFoods from "./Pages/AllFoods";
import AddFood from "./Pages/AddFood";
import Profile from "./Pages/Profile";
import Requested from "./Pages/Requested";
import Response from "./Pages/Response";
import AddDeliveryAgent from "./Pages/AddDeliveryAgent";

const App = () => {
  const { stoken, isAvailable, restoData } = useContext(SellerContext);

  return stoken ? (
    isAvailable === false ? (
      <div className=" w-full h-full bg-orange-100">
        <AddRestaurant />
        <ToastContainer />
      </div>
    ) : (
      <div className="overflow-x-hidden overflow-y-scroll bg-orange-100 ">
        <Navabar />
        <div className=" flex items-start pt-14 bg-white h-fit border-r">
          {!restoData.isrequested && <Sidebar />}
          <div className=" bg-orange-200 w-full h-screen min-h-fit pb-10">
            {restoData.isrequested && <Requested />}
            <Routes>
              <Route path="/" element={<></>} />
              {!restoData.isrequested && (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/desc/:id" element={<OrderDesc />} />
                  <Route path="/all-orders/" element={<AllOrders />} />
                  <Route path="/all-foods/" element={<AllFoods />} />
                  <Route path="/add-food/" element={<AddFood />} />
                  <Route path="/profile/" element={<Profile />} />
                  <Route path="/response/" element={<Response />} />
                  <Route path="/add-delivery-agent/" element={<AddDeliveryAgent />} />
                </>
              )}
            </Routes>
          </div>
        </div>
        <ToastContainer />
      </div>
    )
  ) : (
    <div className="w-full min-h-screen flex justify-center items-center bg-orange-50">
      <Login />
      <ToastContainer />
    </div>
  );
};

export default App;
