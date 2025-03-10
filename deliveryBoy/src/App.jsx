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

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/auth" element={<AuthPage />} />
        {/* Private (layout-wrapped) routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<ActiveOrders />} />
          <Route path="/active-orders" element={<ActiveOrders />} />
          <Route path="/delivery-history" element={<DeliveryHistory />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
