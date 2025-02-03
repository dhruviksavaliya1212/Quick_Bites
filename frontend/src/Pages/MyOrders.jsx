import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { backend, token, currency } = useContext(AppContext);

  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  console.log(token);

  const getOrders = async () => {
    const { data } = await axios.post(
      `${backend}/api/order/get-orders`,
      {},
      { headers: { token } }
    );

    console.log(data);

    if (data.success) {
      setOrders(data.orderData);
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    if (token) {
      getOrders();
    }
  }, [token]);
  return (
    <div className="flex flex-col mb-20 py-24 min-h-screen w-full xl:w-[90%]">
      <h1 className=" text-xl text-zinc-800 font-semibold">My Orders</h1>
      <div className=" flex flex-col gap-5 mt-4 ">
        {orders.reverse().map((item, index) => (
          <div
            onClick={() => navigate(`/order/${item._id}`)}
            key={index}
            className=" flex justify-center"
          >
            <div className=" w-[350px] sm:w-full shadow-md shadow-zinc-600 rounded-md cursor-pointer px-5 py-3 flex justify-between flex-col lg:flex-row gap-5 bg-orange-100 items-start">
              <div className=" flex flex-col sm:flex-row sm:justify-between sm:w-full lg:w-1/3">
                <img
                  src={assets.fooddelivery}
                  alt=""
                  className=" w-14 h-14 mb-5"
                />
                <div className=" flex gap-3 flex-col sm:flex-row lg:flex-col w-fit sm:w-[70%] md:w-1/2 justify-between lg:w-fit">
                  <div className="flex items-center gap-3">
                    <img src={assets.orderhistory} alt="" className="w-8" />
                    <span className=" text-base font-medium text-zinc-800">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className=" flex gap-2 items-center">
                    <img src={assets.tracking} alt="" className="w-10" />{" "}
                    <span className=" text-base font-medium text-zinc-800">
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className=" flex flex-col gap-3 sm:gap-10 lg:gap-3 sm:flex-row lg:flex-col w-full lg:w-fit justify-between">
                <div className=" flex gap-3">
                  <img src={assets.food} alt="" className="w-8 h-8" />
                  <div className=" flexx flex-col ">
                    {item.items.map((item, index) => (
                      <div key={index} className=" flex items-center gap-1">
                        <p className=" text-base font-medium text-zinc-800">
                          {item.name}
                        </p>{" "}
                        <span className=" text-base font-medium text-zinc-800">
                          -
                        </span>
                        <p className=" text-base font-medium text-zinc-800">
                          {item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className=" flex items-center gap-3">
                  <img src={assets.invoice} alt="" className=" w-10" />
                  <span className=" text-base font-medium text-zinc-800">
                    {currency}
                    {item.amount}
                  </span>
                </div>
              </div>

              <div className=" flex flex-col gap-3 sm:gap-10 lg:gap-3 sm:flex-row lg:flex-col w-full lg:w-fit justify-between">
                <div className=" flex gap-2 items-center">
                  {item.paymentType === "Cash On Delivery" ? (
                    <img src={assets.cashondelivery} className="w-8"></img>
                  ) : (
                    <img src={assets.paymentmethod} alt="" className="w-8" />
                  )}

                  <p className=" text-base font-medium text-zinc-800">
                    {" "}
                    {item.paymentType}{" "}
                  </p>
                </div>

                <div className=" flex gap-2 items-center ">
                  {item.payment ? (
                    <img src={assets.checkmark} className="w-8"></img>
                  ) : item.paymentType === "Cash On Delivery" ? (
                    <img src={assets.pending} className=" w-9"></img>
                  ) : (
                    <img src={assets.close} className=" w-7"></img>
                  )}

                  <span
                    className={`text-base font-medium text-zinc-800 ${
                      item.payment
                        ? "text-green-600"
                        : item.paymentType === "Cash On Delivery"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.payment
                      ? "Payment successfull"
                      : item.paymentType === "Cash On Delivery"
                      ? "Payment Pending"
                      : "Payment Failed"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
