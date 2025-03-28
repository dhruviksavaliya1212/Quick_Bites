import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { SellerContext } from "../Context/SellerContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { currency, backend, stoken } = useContext(SellerContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const getOrders = async () => {
    setisLoading(true);
    try {
      const { data } = await axios.post(
        `${backend}/api/restaurant/get-orders`,
        {},
        { headers: { Authorization: `Bearer ${stoken}` } }
      );
      console.log(data);

      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    if (stoken) {
      getOrders();
    }
  }, [stoken]);

  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
      <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
    <p className='text-orange-500 text-2xl font-semibold mx-4'>Loading...</p>
  </div>
    );
  }

  return (
    orders && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white rounded min-w-52 p-4 border-2 border-gray-100 cursor-pointer hover:scale-105 hover:bg-orange-100 transition-all duration-400">
            <img src={assets.earning} alt="" className="w-14" />
            <div className="ml-3">
              <p className="text-xl font-semibold text-gray-600">
                {currency} {orders.earning}
              </p>
              <p className="text-gray-500">Earning</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white rounded min-w-52 p-4 border-2 border-gray-100 cursor-pointer hover:scale-105 hover:bg-orange-100 transition-all duration-400">
            <img src={assets.fooddelivery} alt="" className="w-14" />
            <div className="ml-3">
              <p className="text-xl font-semibold text-gray-600">
                {orders.orders}
              </p>
              <p className="text-gray-500">Orders</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white rounded min-w-52 p-4 border-2 border-gray-100 cursor-pointer hover:scale-105 hover:bg-orange-100 transition-all duration-400">
            <img src={assets.food} alt="" className="w-20" />
            <div className="ml-3">
              <p className="text-xl font-semibold text-gray-600">
                {orders.foods}
              </p>
              <p className="text-gray-500">Foods Added</p>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-4 md:mt-10 mt-5 rounded-t border bg-orange-50">
            <p className="font-semibold text-gray-800">Latest Orders</p>
          </div>
          <div className="pt-4 border border-t-0 h-96 overflow-y-scroll">
            {orders.latestOrders.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(`/desc/${item._id}`)}
                className="flex flex-col sm:flex-row border-b border-b-gray-400 items-center px-6 py-3 gap-3 hover:bg-orange-100"
              >
                <div className="lg:grid flex flex-col sm:flex-row md:flex-col justify-between grid-cols-2 gap-5 w-full cursor-pointer">
                  <div className="flex flex-col gap-2">
                    <div className="text-zinc-600 font-medium text-sm flex gap-2">
                      <p>{item._id}</p>
                    </div>
                    <div className="text-gray-800 capitalize font-medium text-[16px] flex gap-2">
                      {item.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 gap-1 text-zinc-700 text-sm">
                          <p>{item.name} - {item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="text-gray-800 flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-zinc-700 text-sm">
                          {currency} {item.amount}
                        </span>
                      </div>
                      {item.paymentType === "Cash On Delivery" ? (
                        <div className="flex gap-2 text-sm items-center">
                          <p>Cash on Delivery</p>
                        </div>
                      ) : (
                        <p>{item.paymentType}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {item.isCancelled ? (
                        <p className="text-red-600 text-sm">Order Cancelled</p>
                      ) : item.isCompleted ? (
                        <p className="text-sm text-green-600">Order Completed</p>
                      ) : (
                        item.isAccepted && (
                          <p className="text-sm text-green-600">Order Accepted</p>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
