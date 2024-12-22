import React, { useContext } from "react";
import { SellerContext } from "../Context/SellerContext";
import { useNavigate } from "react-router-dom";

const AllOrders = () => {
  const { orders, currency } = useContext(SellerContext);

  const navigate = useNavigate();

  return (
    orders && (
      <div className=" m-5 h-screen">
        <p className=" text-lg font-semibold text-zinc-800">All Orders</p>
        <div className=" p-5 bg-zinc-100 min-h-screen overflow-y-scroll">
          {orders.map((item, index) => (
            <div
              onClick={() => navigate(`/desc/${item._id}`)}
              className=" flex border-b border-b-gray-400 items-center px-1 py-3 gap-3 hover:bg-orange-100 "
            >
              <div
                key={index}
                className=" flex flex-col sm:flex-row gap-3 justify-between w-full cursor-pointer "
              >
                <div className="flex flex-col gap-2">
                  <div className="text-zinc-600 font-medium text-sm flex gap-2">
                    <p className="">{item._id}</p>
                  </div>
                  <div className="text-gray-800 capitalize font-medium text-[16px] flex gap-2">
                    {/* <p>{item.address.firstName}</p>
                      <p>{item.address.lastName}</p> */}
                    {item.items.map((item, index) => (
                      <div className=" flex gap-1 text-zinc-700 text-sm">
                        <p>{item.name}</p>
                        <p>-</p>
                        <p>{item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
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
                        {/* <img
                            src={assets.cashondelivery}
                            className="w-10"
                          ></img> */}
                        <p>Cash on Delivery</p>
                      </div>
                    ) : (
                      // <img
                      //   src={assets.paymentmethod}
                      //   alt=""
                      //   className="w-10"
                      // />
                      <p>Online</p>
                    )}
                  </div>
                </div>

                {item.iscancelled ? (
                  <p className=" text-red-600 text-sm">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className=" text-sm text-green-600">Completed</p>
                ) : (
                  <div className=" flex gap-2 items-center">
                    <p className=" cursor-pointer ml-2 w-7 rounded-full">
                      <svg
                        onClick={() => cancelAppointment(item._id)}
                        className="h-7 w-7 text-red-500 hover:scale-110 transition-all duration-400 hover:text-red-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {" "}
                        <circle cx="12" cy="12" r="10" />{" "}
                        <line x1="15" y1="9" x2="9" y2="15" />{" "}
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    </p>{" "}
                    <p>
                      <svg
                        onClick={() => completeAppointment(item._id)}
                        className="h-8 w-8 text-green-600 hover:scale-110 transition-all duration-400 cursor-pointer hover:text-green-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default AllOrders;
