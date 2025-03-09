function OrdersTable({ orders }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Latest Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Order ID</th>
              <th className="text-left py-2">Items</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Payment</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-3">{order.id}</td>
                <td className="py-3">{order.items}</td>
                <td className="py-3">₹{order.amount}</td>
                <td className="py-3">{order.payment}</td>
                <td className="py-3">
                  <span className="text-green-500 bg-green-100 px-2 py-1 rounded">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersTable;