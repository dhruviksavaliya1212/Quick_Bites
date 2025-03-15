import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaDownload, FaFilter } from 'react-icons/fa';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import withAuth from '../utills/hoc/withAuth';

const Reportsmanagement = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [filterData, setFilterData] = useState([]);
  const [reportData, setReportData] = useState({ users: [], orders: { orders: [], statusSummary: {} }, restaurants: [], drivers: [] });

  // API Endpoints
  const apiEndpoints = {
    users: 'https://quick-bites-backend.vercel.app/api/auth/admin/generateUserReportsby-admin',
    orders: 'https://quick-bites-backend.vercel.app/api/auth/admin/generateOrderStatusReportsby-admin',
    restaurants: 'https://quick-bites-backend.vercel.app/api/auth/admin/generateRestaurantReportBy-admin',
    drivers: 'https://quick-bites-backend.vercel.app/api/auth/admin/getDeliveryBoyReportsby-admin',
  };

  // Fetch data from API when activeTab changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoints[activeTab], {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();

        if (result.success) {
          let data;
          switch (activeTab) {
            case 'users':
              data = result.userReport.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                orders: user.orders,
              }));
              setReportData((prev) => ({ ...prev, [activeTab]: data }));
              setFilterData(data);
              break;
            case 'orders':
              data = {
                orders: result.data.orders.map((order) => ({
                  orderId: order.orderId,
                  date: order.date,
                  status: order.status,
                })),
                statusSummary: result.data.statusSummary,
              };
              setReportData((prev) => ({ ...prev, [activeTab]: data }));
              setFilterData(data.orders); // Table shows individual orders
              break;
            case 'restaurants':
              data = result.report.detailedReport.map((restaurant) => ({
                restaurantId: restaurant.restaurantId,
                ownerName: restaurant.ownerName,
                phone: restaurant.phone,
                ordersReceived: restaurant.ordersReceived,
                totalAmount: restaurant.totalAmount,
              }));
              setReportData((prev) => ({ ...prev, [activeTab]: data }));
              setFilterData(data);
              break;
            case 'drivers':
              data = result.deliveryBoyReport.map((driver) => ({
                firstname: driver.firstname,
                lastname: driver.lastname,
                RestorauntName: driver.RestorauntName,
                contactNumber: driver.contactNumber,
                ordersDelivered: driver.ordersDelivered,
              }));
              setReportData((prev) => ({ ...prev, [activeTab]: data }));
              setFilterData(data);
              break;
            default:
              data = [];
          }
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab} report:`, error);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleFilter = () => {
    let data = activeTab === 'orders' ? reportData.orders.orders : reportData[activeTab];
    data = data.filter((item) => {
      const matchDate = selectedDate
        ? new Date(item.date || '').toDateString() === selectedDate.toDateString()
        : true;
      const matchQuery = searchQuery
        ? (
            item.name || 
            item.ownerName || 
            `${item.firstname} ${item.lastname}` || 
            item.orderId || 
            ''
          ).toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchDate && matchQuery;
    });
    setFilterData(data);
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      activeTab === 'users'
        ? ['ID', 'Name', 'Email', 'Phone', 'Orders']
        : activeTab === 'orders'
        ? ['Order ID', 'Date', 'Status']
        : activeTab === 'restaurants'
        ? ['Restaurant ID', 'Owner Name', 'Phone', 'Orders Received', 'Total Amount']
        : ['Firstname', 'Lastname', 'Restaurant Name', 'Contact Number', 'Orders Delivered'],
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

  const graphData = activeTab === 'orders' 
    ? {
        labels: Object.keys(reportData.orders.statusSummary),
        datasets: [
          {
            label: 'Order Status Summary',
            data: Object.values(reportData.orders.statusSummary),
            backgroundColor: 'rgba(242, 107, 15, 0.9)',
            borderColor: 'rgba(255, 165, 0, 1)',
            borderWidth: 1,
          },
        ],
      }
    : {
        labels: filterData.map((item) => 
          item.name || 
          item.orderId || 
          item.ownerName || 
          `${item.firstname} ${item.lastname}`
        ),
        datasets: [
          {
            label: `${activeTab} Data`,
            data: filterData.map((item) =>
              activeTab === 'users'
                ? item.orders
                : activeTab === 'restaurants'
                ? item.ordersReceived
                : item.ordersDelivered
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
                setFilterData(tab === 'orders' ? reportData.orders.orders : reportData[tab]);
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
            placeholder="Search by name or ID"
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
          {activeTab === 'orders' && <Bar data={graphData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />}
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
                      {key.split(/(?=[A-Z])/).join(' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filterData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
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

export default withAuth(Reportsmanagement);
