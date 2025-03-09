import { FaRupeeSign, FaMotorcycle, FaStar, FaCalendarAlt, FaCalendarWeek, FaCalendarCheck } from 'react-icons/fa';
import StatCard from '../components/StatCard';

function Earnings() {
  const earnings = {
    today: 900,
    thisWeek: 5600,
    thisMonth: 22400,
    pendingPayouts: 1200,
    completedPayouts: 21200,
    deliveries: 28,
    rating: 4.8
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Earnings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={<FaCalendarAlt />}
          value={`₹${earnings.today}`}
          label="Today's Earnings"
        />
        <StatCard 
          icon={<FaCalendarWeek />}
          value={`₹${earnings.thisWeek}`}
          label="This Week"
        />
        <StatCard 
          icon={<FaCalendarCheck />}
          value={`₹${earnings.thisMonth}`}
          label="This Month"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={<FaRupeeSign />}
          value={`₹${earnings.pendingPayouts}`}
          label="Pending Payouts"
        />
        <StatCard 
          icon={<FaMotorcycle />}
          value={earnings.deliveries}
          label="Total Deliveries"
        />
        <StatCard 
          icon={<FaStar />}
          value={earnings.rating}
          label="Rating"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Earnings Breakdown</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>Pending Payouts</span>
            <span className="font-bold text-orange-500">₹{earnings.pendingPayouts}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>Completed Payouts</span>
            <span className="font-bold text-green-500">₹{earnings.completedPayouts}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span>Total Earnings</span>
            <span className="font-bold">₹{earnings.thisMonth}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Earnings;