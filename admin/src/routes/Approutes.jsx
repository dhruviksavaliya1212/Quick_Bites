import React from 'react';
import {Routes,Route} from "react-router-dom";
import MainLayout from '../layouts/MainLayout';
import AllFoodsmanagemet from "../pages/AllFoodsmanagement"
import DeliveryAgentmanagement from "../pages/DeliveryAgentmanagement"
import Menumanagement from "../pages/Menumanagement"
import Ordermanagement from "../pages/Ordermanagement"
import Promotionmanagement from "../pages/Promotionmanagement"
import Reportsmanagement from "../pages/Reportsmanagement"
import Restauarantmanagement from "../pages/Restauarantmanagement"
import Settings from "../pages/Settings"
import Usermanagement from "../pages/Usermanagement"
import Dashboard from "../pages/Dashboard"
import Profile from '../pages/Profile';
import ChatSupport from '../pages/ChatSupport';
import Login from '../pages/login';


const Approutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path='/' element={<MainLayout/>} >
        <Route path='/' index element={<Dashboard />} />
        <Route path='/Menumanagement'  element={<Menumanagement />} />
        <Route path='/Usermanagement'  element={<Usermanagement />} />
        <Route path='/Restauarantmanagement'  element={<Restauarantmanagement />} />
        <Route path='/Ordermanagement'  element={<Ordermanagement />} />
        <Route path='/DeliveryAgentmanagement'  element={<DeliveryAgentmanagement />} />
        <Route path='/Promotionmanagement'  element={<Promotionmanagement />} />
        <Route path='/Reportsmanagement'  element={<Reportsmanagement />} />
        <Route path='/profile'  element={<Profile />} />
        <Route path='/chatsupport'  element={<ChatSupport />} />
        </Route>
      </Routes>
    </div>
  )
}

export default Approutes
