import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaDownload, FaFilter } from 'react-icons/fa';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Reportsmanagement = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [filterData, setFilterData] = useState([]);

  // Sample Data
  const userData = [
    { id: 1, name: 'Bholo', email: 'Bholo@example.com', registered: '2024-02-13', orders: 20 },
    { id: 2, name: 'NA', email: 'na@example.com', registered: '2024-02-23', orders: 0 },
    { id: 3, name: 'Ashima', email: 'ashima2@example.com', registered: '2024-07-03', orders: 4 },
    { id: 4, name: 'Ridham', email: 'Ridham@example.com', registered: '2024-09-30', orders: 6 },
  ];

  const ordersData = [
    { id: 1, orderId: 'ORD001', customer: 'Milan', date: '2024-12-13', amount: 100 },
    { id: 2, orderId: 'ORD002', customer: 'Ridham', date: '2024-02-14', amount: 500 },
    { id: 3, orderId: 'ORD003', customer: 'Dhurivik', date: '2024-02-14', amount: 399 },
    { id: 4, orderId: 'ORD004', customer: 'Bholo', date: '2024-02-14', amount: 400 },
  ];

  const restaurantData = [
    { id: 1, name: 'Food Palace', location: 'Delhi', registered: '2024-02-10', orderReceived: 120 },
    { id: 2, name: 'Surti Ghaat', location: 'surat', registered: '2024-06-30', orderReceived: 10 },
    { id: 3, name: 'Bihari Dahaba', location: 'Bihar', registered: '2024-08-20', orderReceived: 230 },
  ];

  const driverData = [
    { id: 1, name: 'John', phone: '1234567890', joined: '2024-02-01', ordersDelivered: 50 },
    { id: 2, name: 'Ridham', phone: '1234567890', joined: '2024-03-07', ordersDelivered: 150 },
    { id: 3, name: 'Kishan', phone: '1234567890', joined: '2024-09-21', ordersDelivered: 20 },
  ];

  const handleFilter = () => {
    let data = [];
    switch (activeTab) {
      case 'users':
        data = userData.filter((item) => {
          const matchDate = selectedDate
            ? new Date(item.registered).toDateString() === selectedDate.toDateString()
            : true;
          const matchQuery = searchQuery
            ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
          return matchDate && matchQuery;
        });
        break;
      case 'orders':
        data = ordersData.filter((item) => {
          const matchDate = selectedDate
            ? new Date(item.date).toDateString() === selectedDate.toDateString()
            : true;
          const matchQuery = searchQuery
            ? item.customer.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
          return matchDate && matchQuery;
        });
        break;
      case 'restaurants':
        data = restaurantData;
        break;
      case 'drivers':
        data = driverData;
        break;
      default:
        data = [];
    }
    setFilterData(data);
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      activeTab === 'users'
        ? ['ID', 'Name', 'Email', 'Registered On', 'Total Orders']
        : activeTab === 'orders'
        ? ['ID', 'Order ID', 'Customer', 'Date', 'Amount']
        : activeTab === 'restaurants'
        ? ['ID', 'Name', 'Location', 'Registered On', 'Orders Received']
        : ['ID', 'Name', 'Phone', 'Joined', 'Orders Delivered'],
      ...filterData.map((item) => Object.values(item)),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${activeTab}-reports.csv`);
    a.click();
  };

  const graphData = {
    labels: filterData.map((item) => item.name || item.customer || item.location || item.phone),
    datasets: [
      {
        label: `${activeTab} Data`,
        data: filterData.map((item) =>
          activeTab === 'users'
            ? item.orders
            : activeTab === 'orders'
            ? item.amount
            : activeTab === 'drivers'
            ? item.ordersDelivered
            : item.orderReceived
        ),
        backgroundColor: 'rgba(242, 107, 15, 0.9)',
        borderColor: 'rgba(255, 165, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Reports Management</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex gap-4 overflow-x-auto mb-6">
          {['users', 'orders', 'restaurants', 'drivers'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setFilterData([]);
              }}
              className={`px-4 py-2 rounded text-sm font-medium ${
                activeTab === tab ? 'bg-orange-500 text-white' : 'bg-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            placeholderText="Filter by date"
            className="border p-2 rounded w-full sm:w-auto"
          />
          <button
            onClick={handleFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
          >
            <FaFilter /> Filter
          </button>
          <button
            onClick={handleDownloadCSV}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600"
          >
            <FaDownload /> Download CSV
          </button>
        </div>

        <div className="mb-6">
          {activeTab === 'users' && <Line data={graphData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />}
          {activeTab === 'orders' && <Line data={graphData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />}
          {activeTab === 'restaurants' && <Bar data={graphData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />}
          {activeTab === 'drivers' && <Line data={graphData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead className="bg-gray-200">
              <tr>
                {filterData.length > 0 &&
                  Object.keys(filterData[0]).map((key) => (
                    <th key={key} className="border p-2">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filterData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-100">
                  {Object.values(item).map((val, idx) => (
                    <td key={idx} className="border p-2">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reportsmanagement;
