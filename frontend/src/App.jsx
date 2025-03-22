import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Footer from "./Components/Footer";
import AllFoods from "./Pages/AllFoods";
import Login from "./Pages/Login";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import About from "./Pages/About";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./Pages/Verify";
import MyOrders from "./Pages/MyOrders";
import OrderDesc from "./Pages/OrderDesc";
import AllResto from "./Pages/AllResto";
import RestoDesc from "./Pages/RestoDesc";
import Support from "./Pages/Support";
import MyProfile from "./Pages/MyProfile";
import Contact from "./Pages/Contact";
import OfferZones from "./Pages/OfferZones";

const App = () => {
  const location = useLocation();

  // ✅ Hide Navbar only on the /login route
  const hideNavbarRoutes = ["/login"];

  return (
    <div className="min-h-screen px-2 sm:px-10 md:px-14 lg:px-28 bg-orange-50 flex flex-col items-center">
      <ToastContainer />
      
      {/* ✅ Render Navbar only if the current route is NOT in hideNavbarRoutes */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/all-foods" element={<AllFoods />} />
        <Route path="/all-resto" element={<AllResto />} />
        <Route path="/all-resto/:id" element={<RestoDesc />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/offer-zone" element={<OfferZones />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order/:id" element={<OrderDesc />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      
      {/* ✅ Render Footer only if the current route is NOT in hideNavbarRoutes */}
      {!hideNavbarRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
};

export default App;
