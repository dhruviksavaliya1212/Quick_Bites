import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import AuthPage from "./pages/Authpage";
import ActiveOrders from "./pages/ActiveOrders";
import DeliveryHistory from "./pages/DeliveryHistory";
import Earnings from "./pages/Earnings";
import Profile from "./pages/Profile";
import Layout from "./pages/Layout.jsx"; // New layout wrapper
import AcceptedOrders from "./pages/AcceptedOrders.jsx";
import { OrderProvider } from "../context/OrderContext.jsx";

function App() {
  return (
    
    <Router>
      <OrderProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/auth" index element={<AuthPage />} />
        {/* Private (layout-wrapped) routes */}
        <Route element={<Layout />}>
          {/* <Route path="/" element={<ActiveOrders />} /> */}
          <Route path="/active-orders" element={<ActiveOrders />} />
          <Route path="/accepted-orders" element={<AcceptedOrders />} />
          <Route path="/delivery-history" element={<DeliveryHistory />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      </OrderProvider>
    </Router>
    
  );
}

export default App;
