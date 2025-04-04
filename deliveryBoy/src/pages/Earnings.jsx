import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaRupeeSign,
  FaMotorcycle,
  FaStar,
  FaCalendarAlt,
  FaCalendarWeek,
  FaCalendarCheck,
} from 'react-icons/fa';
import StatCard from '../components/StatCard';
import withAuth from '../../utills/withAuth';
import { jwtDecode } from 'jwt-decode';
import { OrderContext } from '../../context/OrderContext';

function Earnings() {
  const [earnings, setEarnings] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    pendingPayouts: 0,
    completedPayouts: 0,
    rating: 0,
  });
  const { backend } = useContext(OrderContext);
  const [error, setError] = useState(null);

  const getDeliveryAgentId = () => {
    const token = localStorage.getItem('deliveryAgent-token');
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.agentId;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const deliveryAgentId = getDeliveryAgentId();
    if (!deliveryAgentId) {
      setError('Invalid or missing token.');
      return;
    }

    const fetchEarningsByType = async (type) => {
      try {
        const res = await axios.get(
          `${backend}/api/delivery-agent/deliveryAgent-earnings/${deliveryAgentId}`,
          {
            params: { type },
          }
        );
        return res.data.earnings;
      } catch (err) {
        console.error(err);
        throw new Error(`Failed to fetch ${type} earnings`);
      }
    };

    const getCurrentWeekNumber = (date) => {
      const firstDay = new Date(date.getFullYear(), 0, 1);
      const pastDays = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000));
      return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
    };

    const fetchAllEarnings = async () => {
      try {
        const [dayData, weekData, monthData] = await Promise.all([
          fetchEarningsByType('day'),
          fetchEarningsByType('week'),
          fetchEarningsByType('month'),
        ]);

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const currentDay = now.getDate();
        const currentWeek = getCurrentWeekNumber(now);

        const filterByDate = (data, type) => {
          if (!Array.isArray(data)) return 0;

          return data
            .filter((item) => {
              const { year, month, day, week } = item._id || {};
              if (type === 'day') {
                return year === currentYear && month === currentMonth && day === currentDay;
              }
              if (type === 'week') {
                return year === currentYear && week === currentWeek;
              }
              if (type === 'month') {
                return year === currentYear && month === currentMonth;
              }
              return false;
            })
            .reduce((sum, item) => sum + (item.totalEarnings || 0), 0);
        };

        setEarnings((prev) => ({
          ...prev,
          today: filterByDate(dayData, 'day'),
          thisWeek: filterByDate(weekData, 'week'),
          thisMonth: filterByDate(monthData, 'month'),
        }));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAllEarnings();
  }, []);

  if (error) {
    return (
      <div>
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Earnings</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<FaCalendarAlt />} value={`₹${earnings.today}`} label="Today's Earnings" />
        <StatCard icon={<FaCalendarWeek />} value={`₹${earnings.thisWeek}`} label="This Week" />
        <StatCard icon={<FaCalendarCheck />} value={`₹${earnings.thisMonth}`} label="This Month" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<FaRupeeSign />} value={`₹${earnings.thisMonth}`} label="Pending Payouts" />
        <StatCard icon={<FaMotorcycle />} value={earnings.completedPayouts} label="Completed Payouts" />
        <StatCard icon={<FaStar />} value={4.5} label="Rating" />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Earnings Breakdown</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>Pending Payouts</span>
            <span className="font-bold text-orange-500">₹{earnings.thisMonth}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>Total Earnings (This Month)</span>
            <span className="font-bold">₹{earnings.thisMonth}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Earnings);
