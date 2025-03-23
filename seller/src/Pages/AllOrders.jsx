import React, { useContext } from "react";
import { SellerContext } from "../Context/SellerContext";
import { useNavigate } from "react-router-dom";

const AllOrders = () => {
  const { orders, currency } = useContext(SellerContext);

  const navigate = useNavigate();

  return (
    orders && (
      <div className=" m-5 h-fit">
        <p className=" text-lg font-semibold text-zinc-800">All Orders</p>
        <div className=" p-5 bg-zinc-100 h-screen overflow-y-scroll">
          {orders.reverse().map((item, index) => (
            <div
            key={index}
              onClick={() => navigate(`/desc/${item._id}`)}
              className=" flex border-b border-b-gray-400 items-center px-1 py-3 gap-3 hover:bg-orange-100 "
            >
              <div
               
                className=" lg:grid flex flex-col sm:flex-row md:flex-col justify-between grid-cols-2 gap-5 w-full cursor-pointer "
              >
                <div className="flex flex-col gap-2">
                  <div className="text-zinc-600 font-medium text-sm flex gap-2">
                    <p className="">{item._id}</p>
                  </div>
                  <div className="text-gray-800 capitalize font-medium text-[16px] flex gap-2">
                    {/* <p>{item.address.firstName}</p>
                      <p>{item.address.lastName}</p> */}
                    {item.items.map((item, index) => (
                        <div key={index} className=" grid grid-cols-1 gap-1 text-zinc-700 text-sm">
                        <p>{item.name} - {item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className=" flex flex-col md:flex-row justify-between">
                  <div className="text-gray-800  flex flex-col gap-2">
                    <div className=" flex items-center gap-3">
                      {/* <img src={assets.invoice} alt="" className=" w-10" /> */}
                      <span className="font-medium text-zinc-700 text-sm">
                        {currency}
                        {item.amount}
                      </span>
                    </div>
                    {item.paymentType === "Cash On Delivery" ? (
                        <div className=" flex gap-2 text-sm items-center">
                          <p>Cash on Delivery</p>
                        </div>
                      ) : item.paymentType === "Online(Stripe)" ? (
                        <p>Online(Stripe)</p>
                      ) : (
                        item.paymentType === "Online(Razorpay)" && (
                          <p>Online(Razorpay)</p>
                        )
                      )}
                  </div>
                  <div className=" flex flex-col gap-2">
                    {item.isCancelled ? (
                      <p className=" text-red-600 text-sm">Order Cancelled</p>
                    ) : item.isCompleted ? (
                      <p className=" text-sm text-green-600">Order Completed</p>
                    ) : (
                      item.isAccepted && (
                        <p className=" text-sm text-green-600">
                          Order Accepted
                        </p>
                      )
                    )}
                  </div>
                </div>

                
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default AllOrders;
