import React from "react";

import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Footer from "./Components/Footer";
import AllFoods from "./Pages/AllFoods";
import Login from "./Pages/Login";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import About from "../src/Pages/About";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./Pages/Verify";
import MyOrders from "./Pages/MyOrders";
import OrderDesc from "./Pages/OrderDesc";
import AllResto from "./Pages/AllResto";
import RestoDesc from "./Pages/RestoDesc";
import Support from "./Pages/Support";
import MyProfile from "./Pages/MyProfile";
// import About from "./Components/About";

const App = () => {
  return (
    <div className=" min-h-screen px-2 sm:px-10 md:px-14 lg:px-28 bg-orange-50 flex flex-col items-center">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-foods" element={<AllFoods />} />
        <Route path="/all-resto" element={<AllResto />} />
        <Route path="/all-resto/:id" element={<RestoDesc />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order/:id" element={<OrderDesc />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<MyProfile />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
