import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AdminContext } from "../Context/AdminContext";
import axios from 'axios'
import { toast } from 'react-toastify';
import withAuth from "../utills/hoc/withAuth";

// Sample data for reviews
const reviews = [
  { id: 1, product: "Pizza", rating: 4, review: "Delicious pizza, but a bit cold.", customer: "John Doe" },
  { id: 2, product: "Burger", rating: 5, review: "Loved the burger! Excellent taste.", customer: "Jane Smith" },
  { id: 3, product: "Pasta", rating: 3, review: "Good, but needed more sauce.", customer: "Bob Lee" },
  { id: 4, product: "Fries", rating: 4, review: "Crispy and fresh, but too salty.", customer: "Alice Green" },
];

// Register components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { backend, orderData, feedbackData } = useContext(AdminContext);
  const [dailyOrders, setDailyOrders] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashData, setDashData] = useState(false);
  const [contactData, setContactData] = useState(false);
  const [reviewsData, setReviewsData] = useState(reviews);
  const [responseText, setResponseText] = useState("");
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backend}/api/admin/dash-data`);
      console.log("dash-data", data);
      if (data.success) {
        setDashData(data.dashData);
      }
    } catch (err) {
      toast.success("Something went wrong");
    }
  };

  const contactResponses = async () => {
    try {
      const { data } = await axios.get(`${backend}/api/auth/admin/getAllContactMessages`);
      console.log("contact", data);
      if (data.success) {
        setContactData(data.data);
      }
    } catch (error) {
      toast.success(error);
    }
  };

  const getDailyOrders = async () => {
    try {
      const { data } = await axios.get(`${backend}/api/admin/get-dailyorders`);
      setDailyOrders(data);
    } catch (err) {
      toast.error("Failed to fetch daily orders");
    }
  };

  const getRevenueData = async () => {
    try {
      const { data } = await axios.get(`${backend}/api/admin/get-revenue`);
      setMonthlyRevenue(data);
    } catch (err) {
      toast.error("Failed to fetch revenue data");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          getDashData(),
          contactResponses(),
          getDailyOrders(),
          getRevenueData()
        ]);
      } catch (err) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleSeeMore = () => {
    navigate("/Ordermanagement");
  };

  // Bar Chart - Orders by Day
  const ordersChartData = {
    labels: dailyOrders.map(order => {
      const date = new Date(order._id);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: "Orders",
        data: dailyOrders.map(order => order.totalOrders),
        backgroundColor: "rgba(242, 107, 15, 0.6)",
      },
    ],
  };

  // Line Chart - Revenue Trends
  const revenueChartData = {
    labels: monthlyRevenue.map(rev => {
      const [year, month] = rev._id.split("-");
      return new Date(`${year}-${month}-01`).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }),
    datasets: [
      {
        label: "Revenue (₹)",
        data: monthlyRevenue.map(rev => rev.totalRevenue),
        borderColor: "#F26B0F",
        backgroundColor: "rgba(242, 107, 15, 0.2)",
        fill: true,
      },
    ],
  };

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-solid"></div>
    </div>
  );

  return (
    <div className="lg:p-4 min-h-screen">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

          {/* Stats Overview */}
          {dashData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="p-4 bg-white shadow rounded-lg">
                <h2 className="text-gray-600">Total Orders</h2>
                <p className="text-2xl font-bold text-orange-500">{dashData.totalOrders}</p>
              </div>
              <div className="p-4 bg-white shadow rounded-lg">
                <h2 className="text-gray-600">Revenue</h2>
                <p className="text-2xl font-bold text-orange-500 overflow-x-hidden">₹{dashData.revenue}</p>
              </div>
              <div className="p-4 bg-white shadow rounded-lg">
                <h2 className="text-gray-600">Active Users</h2>
                <p className="text-2xl font-bold text-orange-500">{dashData.totalUsers}</p>
              </div>
              <div className="p-4 bg-white shadow rounded-lg">
                <h2 className="text-gray-600">Pending Orders</h2>
                <p className="text-2xl font-bold text-orange-500">{dashData.pendingOrders}</p>
              </div>
              <div className="p-4 bg-white shadow rounded-lg">
                <h2 className="text-gray-600">Restaurants</h2>
                <p className="text-2xl font-bold text-orange-500">{dashData.totalResto}</p>
              </div>
              <div className="p-4 bg-white shadow rounded-lg">
                <h2 className="text-gray-600">Delivered Orders</h2>
                <p className="text-2xl font-bold text-orange-500">{dashData.deliveredOrders}</p>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Orders by Day</h2>
              <Bar data={ordersChartData} options={{ responsive: true }} />
            </div>
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Revenue Trends</h2>
              <Line data={revenueChartData} options={{ responsive: true }} />
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white p-4 mt-8 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Recent Orders</h2>
              <button onClick={handleSeeMore} className="text-gray-700 font-bold hover:underline">
                See More
              </button>
            </div>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Food</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Payment</th>
                </tr>
              </thead>
              <tbody>
                {orderData && orderData.reverse().slice(0, 5).map((item, index) => (
                  <tr key={index} className="border-b hover:bg-orange-300">
                    <td className="p-2">{item._id}</td>
                    <td className="p-2">
                      {item.items.map((order, index) => (
                        <p key={index}>{order.name}</p>
                      ))}
                    </td>
                    <td className="p-2">
                      {item.items.map((order, index) => (
                        <p key={index}>{order.quantity}</p>
                      ))}
                    </td>
                    <td className="p-2">{item.date.slice(0, 10)}</td>
                    <td className="p-2">{item.paymentType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Contact Responses Section */}
          <div className="bg-white p-4 mt-8 rounded-md">
            <h2 className="text-lg font-bold mb-4">Contact-page Response</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Contact Id</th>
                    <th className="p-2">email</th>
                    <th className="p-2">name</th>
                    <th className="p-2">feedbackMessage</th>
                  </tr>
                </thead>
                <tbody>
                  {contactData && contactData.map((review, index) => (
                    <tr key={index} className="border-b hover:bg-orange-300">
                      <td className="p-2">{review._id}</td>
                      <td className="p-2">{review.email}</td>
                      <td className="p-2">{review.name}</td>
                      <td className="p-2">{review.feedbackMessage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Review and Feedback Section */}
          <div className="bg-white p-4 mt-8 rounded-md">
            <h2 className="text-lg font-bold mb-4">Customer Feedback & Seller Response</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Order Id</th>
                    <th className="p-2">Food</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Feedback</th>
                    <th className="p-2">Response</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackData && feedbackData.map((review, index) => (
                    <tr key={index} className="border-b hover:bg-orange-300">
                      <td className="p-2">{review._id}</td>
                      <td className="p-2">
                        {review.items.map((order, index) => (
                          <p key={index}>{order.name}</p>
                        ))}
                      </td>
                      <td className="p-2">
                        {review.items.map((order, index) => (
                          <p key={index}>{order.quantity}</p>
                        ))}
                      </td>
                      <td className="p-2">{review.feedback}</td>
                      <td className="p-2">
                        {review.response === '' ? "No Response From Seller" : review.response}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default withAuth(Dashboard);
