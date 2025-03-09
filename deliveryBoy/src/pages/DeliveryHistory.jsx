import { useState } from 'react';

function DeliveryHistory() {
  const [deliveries] = useState([
    {
      id: '1001',
      date: '2024-02-20',
      restaurant: 'Tasty Bites',
      amount: '350',
      status: 'delivered',
      customerRating: 5
    },
    {
      id: '1002',
      date: '2024-02-20',
      restaurant: 'Spice Garden',
      amount: '550',
      status: 'delivered',
      customerRating: 4
    }
  ]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Delivery History</h2>
      <div className="bg-white rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Restaurant</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Rating</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map(delivery => (
              <tr key={delivery.id} className="border-b">
                <td className="p-4">{delivery.id}</td>
                <td className="p-4">{delivery.date}</td>
                <td className="p-4">{delivery.restaurant}</td>
                <td className="p-4">₹{delivery.amount}</td>
                <td className="p-4">{'⭐'.repeat(delivery.customerRating)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeliveryHistory;