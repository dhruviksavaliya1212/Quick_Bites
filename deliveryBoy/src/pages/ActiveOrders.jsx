import { useState } from 'react';
import OrderCard from '../components/OrderCard';
import StatCard from '../components/StatCard';
import { FaMotorcycle, FaCheckCircle, FaClock } from 'react-icons/fa';
import withAuth from '../../utills/withAuth';
function ActiveOrders() {
  const [orders] = useState([
    {
      id: '1234',
      restaurant: 'Tasty Bites Restaurant',
      amount: '350',
      deliveryAddress: '29,parmeshwar society,nana varachha,surat',
      customerPhone: '+91 78610 68642',
      status: 'pending'
    },
    {
      id: '1235',
      restaurant: 'Spice Garden',
      amount: '550',
      deliveryAddress: '456 Park Road, House 7, Mumbai',
      customerPhone: '+91 9428635112',
      status: 'pending'
    }
  ]);

  const stats = {
    totalOrders: orders.length,
    completed: orders.filter(order => order.status === 'delivered').length,
    pending: orders.filter(order => order.status === 'pending').length
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    console.log(`Order ${orderId} status updated to ${newStatus}`);
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Active Orders</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard 
          icon={<FaMotorcycle />}
          value={stats.totalOrders}
          label="Total Orders"
        />
        <StatCard 
          icon={<FaCheckCircle />}
          value={stats.completed}
          label="Completed"
        />
        <StatCard 
          icon={<FaClock />}
          value={stats.pending}
          label="Pending"
        />
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <OrderCard 
            key={order.id} 
            order={order}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
}

export default withAuth(ActiveOrders);
