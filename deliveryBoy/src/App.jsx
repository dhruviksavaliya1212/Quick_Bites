import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ActiveOrders from './pages/ActiveOrders';
import DeliveryHistory from './pages/DeliveryHistory';
import Earnings from './pages/Earnings';
import Profile from './pages/Profile';
import { FaBars } from 'react-icons/fa';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex relative">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FaBars />
        </button>

        {/* Sidebar */}
        <div className={`
          fixed h-screen z-40 transition-transform duration-300
          lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <main className={`
          flex-1 min-h-screen bg-background w-full
          transition-all duration-300
          lg:ml-64 
        `}>
          <div className="p-4 lg:p-6">
            <Routes>
              <Route path="/" element={<ActiveOrders />} />
              <Route path="/active-orders" element={<ActiveOrders />} />
              <Route path="/delivery-history" element={<DeliveryHistory />} />
              <Route path="/earnings" element={<Earnings />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </main>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;