import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SellerContext } from "../Context/SellerContext";
import vegetarian from "../assets/vegetarian.webp";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDesc = () => {
  const { id } = useParams();
  const _id = id;

  const { orders, currency, acceptOrder, rejectOrder, completeOrder, backend, stoken, getOrders } =
    useContext(SellerContext);

  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    if (orders) {
      const order = orders.find((item) => item._id === id);
      setOrderData(order);
    }
  }, [orders, id]);

  const changeOrderStatus = async(orderId, status) => {
    const {data} = await axios.post(`${backend}/api/restaurant/change-status`,{orderId, status});

    if(data.success){
      toast.success(data.message);
      getOrders();
    } else{
      toast.error(data.message);
    }
  }

  const [responseMsg, setResponseMsg] = useState('')

  const sendResponse = async () => {
    try {
      if (responseMsg === "") {
        return toast.info("Please Enter Response");
      }

      const { data } = await axios.post(
        `${backend}/api/order/send-response`,
        { _id, responseMsg }
      );
      if (data.success) {
        setResponseMsg("");
        toast.success(data.message);
        getOrders()
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  console.log(orderData, "orderData");  
  
  return (
    <div className="flex flex-col mb-20 pt-5 px-5 min-h-screen ">
      {orderData && (
        <div className="flex items-center justify-center flex-col mb-20">
          <div className="  mt-5 w-full lg:w-[90%] xl:w-[80%]">
            <div className=" flex gap-3 text-base font-semibold text-zinc-800">
              <p className=" hidden sm:block">Order Name :</p>
              <p className=" text-zinc-700">  {orderData.items?.map((data) => data.name).join(", ")}</p>
            </div>
            {!orderData.isCancelled && !orderData.isAccepted ? (
              <div className=" mt-5  w-fit">
                <p className="text-lg font-semibold text-zinc-800">
                  Choose Order Accept / Not
                </p>
                <div className=" flex w-full justify-center gap-5 items-center">
                  <p className=" cursor-pointer ml-2 w-7 rounded-full">
                    <svg
                      onClick={() => rejectOrder(orderData._id)}
                      className="h-10 w-10 text-red-500 hover:scale-110 transition-all duration-400 hover:text-red-600"
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
                      onClick={() => acceptOrder(orderData._id)}
                      className="h-11 w-11 text-green-600 hover:scale-110 transition-all duration-400 cursor-pointer hover:text-green-700"
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
              </div>
            ) : orderData.isCancelled ? (
              <div className=" flex gap-3 items-center mt-3">
                <img src={assets.close} alt="" className="w-8" />
                <p className="text-red-500 font-semibold text-lg">
                  {" "}
                  Order Rejected
                </p>
              </div>
            ) : (
              orderData.isAccepted && (
                <div className=" flex gap-3 items-center mt-3">
                  <img src={assets.checkmark} alt="" className="w-8" />
                  <p className="text-[#03BC7D] font-semibold text-lg">
                    {" "}
                    Order Accepted
                  </p>
                </div>
              )
            )}
            {orderData.isAccepted && !orderData.isCompleted ? (
              <button
                className="bg-zinc-200 hover:scale-105 transition-all duration-500 text-green-600 font-bold py-2 px-4 rounded-full mt-2 text-sm shadow shadow-zinc-700"
                onClick={() => completeOrder(orderData._id)}
              >
                Complete Order
              </button>
            ) : orderData.isCompleted ? (
              <div className="flex gap-3 items-center mt-3">
                <img src={assets.checkmark} alt="" className="w-8" />
                <p className="text-[#03BC7D] font-semibold text-lg">
                  Order Completed
                </p>
              </div>
            ) : null}
            {orderData.items &&
              orderData.items.map((item, index) => (
                <div key={index}>
                  <div className=" mt-10 mb-5 flex flex-col sm:flex-row items-center justify-start gap-5 lg:gap-7 ">
                    <div className=" relative">
                      <img
                        src={item.image}
                        alt=""
                        className=" min-w-44 max-w-44 h-44 rounded bg-gradient-to-t from-slate-500 to-slate-900"
                      />
                    </div>
                    <div className=" max-md:ml-5 max-sm:mt-3">
                      <div className=" flex gap-2 items-center ">
                        <img src={vegetarian} alt="" className="w-5" />
                        <p className=" text-md text-red-700 font-semibold">
                          {item.bestSeller === true && "Best Seller"}
                        </p>
                      </div>
                      <div className=" flex gap-1 flex-wrap">
                        <p className=" text-xl font-bold text-zinc-900">
                          {item.name} - {item.quantity}
                        </p>
                      </div>
                      <p className=" text-md font-semibold text-zinc-900 -mt-1">
                        {item.restoname}
                      </p>
                      <div className=" mt-1 flex gap-3 item-center">
                        <p className=" line-through font-semibold text-zinc-500">
                          <span>₹</span>
                          {item.oldprice}
                        </p>
                        <p className=" font-semibold text-zinc-900">
                          <span>₹</span>
                          {item.newprice}
                        </p>
                      </div>
                      <div className=" flex items-center my-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          role="img"
                        >
                          <rect width="14" height="14" fill=""></rect>
                          <path
                            d="M5.67163 3.99166C6.22068 2.34179 6.49521 1.51686 7 1.51686C7.50479 1.51686 7.77932 2.34179 8.32837 3.99166L8.65248 4.96556H9.60668C11.4122 4.96556 12.315 4.96556 12.4703 5.45302C12.6256 5.94049 11.8893 6.4628 10.4167 7.50744L9.67376 8.03444L9.97544 8.94095C10.5325 10.615 10.8111 11.452 10.4033 11.754C9.99553 12.056 9.27604 11.5457 7.83705 10.5249L7 9.93112L6.16295 10.5249C4.72396 11.5457 4.00447 12.056 3.5967 11.754C3.18893 11.452 3.46747 10.615 4.02456 8.94095L4.04557 8.87783C4.18081 8.47145 4.24843 8.26825 4.18684 8.08006C4.12525 7.89187 3.94958 7.76725 3.59824 7.51802C2.11566 6.46633 1.37437 5.94049 1.52971 5.45302C1.68504 4.96556 2.5878 4.96556 4.39332 4.96556H5.34752L5.67163 3.99166Z"
                            fill="#1BA672"
                          ></path>
                        </svg>
                        <p className=" text-green-700 font-semibold ml-1">
                          {item.rating}
                        </p>
                      </div>
                      <p className=" text-md font-normal text-zinc-800 max-w-[90%]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <hr className=" w-[90%] border border-zinc-600 m-auto mt-5 outline-none" />
                </div>
              ))}
            <div className=" mt-10 w-full flex flex-wrap gap-5 justify-between">
              <div>
                <div className=" flex gap-3 items-center ">
                  <p className=" text-xl font-semibold text-zinc-800">
                    Total Amount
                  </p>
                  <p className=" text-sm font-normal text-red-600">
                    * All charges applied{" "}
                  </p>
                </div>
                <p className=" mt-2 text-lg font-medium text-zinc-700">
                  <span className=" font-semibold">{currency}</span>{" "}
                  <span>{orderData.amount}</span>
                </p>
              </div>
              <div className=" text-xl font-semibold text-zinc-800">
                <p>Payment Type </p>
                <div className=" flex items-center gap-3 mt-3">
                  {orderData.paymentType === "Cash On Delivery" ? (
                    <img src={assets.cashondelivery} className="w-8"></img>
                  ) : (
                    <img src={assets.paymentmethod} alt="" className="w-8" />
                  )}

                  <p className=" text-base font-medium text-zinc-800">
                    {" "}
                    {orderData.paymentType}{" "}
                  </p>
                </div>
              </div>
              <div className=" flex gap-2 items-center ">
                {!orderData.payment &&
                orderData.paymentType === "Cash On Delivery" ? (
                  <img src={assets.pending} className="w-8"></img>
                ) : orderData.payment &&
                  (orderData.paymentType === "Online(Stripe)" ||
                    orderData.paymentType === "Online(Razorpay)") ? (
                  <img src={assets.checkmark} className="w-8"></img>
                ) : orderData.payment ? (
                  <img src={assets.checkmark} className="w-8"></img>
                ) : (
                  <img src={assets.close} className=" w-7"></img>
                )}
                <span
                  className={`text-base font-medium text-zinc-800 ${
                    orderData.payment ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {!orderData.payment &&
                  orderData.paymentType === "Cash On Delivery"
                    ? "Payment Pending"
                    : orderData.payment &&
                      (orderData.paymentType === "Online(Stripe)" ||
                        orderData.paymentType === "Online(Razorpay)")
                    ? "Payment Successful"
                    : orderData.payment
                    ? "Payment Successful"
                    : "Payment Failed"}
                </span>
              </div>
            </div>
            <div className=" w-full flex flex-col justify-between">
              <p className=" mt-10 text-xl font-semibold text-zinc-800">
                Delivery Address
              </p>
              {orderData.address && (
                <div
                  className={` w-full rounded mt-3 shadow-inner shadow-slate-800 py-5 px-5 bg-slate-200 cursor-pointer relative `}
                >
                  <div className=" text-lg font-medium text-zinc-800 flex gap-2 items-center">
                    {orderData.address.category === "Office" && (
                      <img src={assets.office} className="w-8" />
                    )}
                    {orderData.address.category === "Home" && (
                      <img src={assets.home} className="w-8" />
                    )}
                    {orderData.address.category === "Other" && (
                      <img src={assets.other} className="w-8" />
                    )}
                    {orderData.address.category}
                  </div>
                  <div className=" flex gap-2 capitalize text-lg font-medium text-zinc-800 mt-5 ">
                    <p>{orderData.address.firstName}</p>
                    <p>{orderData.address.lastName}</p>
                  </div>
                  <div className=" flex flex-wrap gap-2 capitalize text-[17px] text-zinc-700 font-normal my-1 ">
                    <p>{orderData.address.flatno},</p>

                    <p>{orderData.address.societyName},</p>

                    <p>{orderData.address.city},</p>

                    <p>{orderData.address.state},</p>

                    <p>{orderData.address.zipcode},</p>

                    <p>{orderData.address.country}</p>
                  </div>
                  <div className=" flex gap-2 capitalize text-base text-zinc-700 font-normal ">
                    <p>{orderData.address.phone}</p>
                  </div>
                </div>
              )}
            </div>
            {orderData.feedback !== "" && (
              <div className=" mt-5 ">
                <p className=" text-xl font-semibold text-zinc-800">Customer Feedback</p>
                  <p className="text-md font-semibold text-zinc-700 mt-3">
                   {orderData.feedback}
                  </p>
              </div>
            )}
             {orderData.feedback !== "" && (
              <div>
                <p className="mt-10 text-xl font-semibold text-zinc-800">
                  {orderData.response === '' ?  "Give Response" : "Your Response"}
                </p>
                {orderData.response === "" ? (
                  <>
                    <textarea
                      onChange={(e) => setResponseMsg(e.target.value)}
                      value={responseMsg}
                      rows="3"
                      placeholder="Enter Response Here"
                      className="w-full bg-transparent border-2 border-zinc-700 px-5 py-1.5 rounded-md mt-5 shadow-md shadow-zinc-500 outline-none placeholder:text-zinc-600"
                    />
                    <button
                      onClick={sendResponse}
                      className="px-5 py-1.5 bg-orange-500 text-zinc-100 hover:bg-orange-600 hover:transition-all hover:duration-700 shadow-md shadow-zinc-600 rounded-full"
                    >
                      Send Response
                    </button>
                  </>
                ) : (
                  <p className="text-md font-semibold text-zinc-700 mt-3">
                    {orderData.response}
                  </p>
                )}
              </div>
            )}

            <div className="">
              <p className="mt-10 text-xl font-semibold text-zinc-800">
                Delivery Status
              </p>

              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-zinc-700">
                    Current Status:
                  </p>
                  <select
                    className="border border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={orderData.status}
                    onChange={(e) => changeOrderStatus(orderData._id,e.target.value)}
                  >
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div className="mt-5 text-lg font-semibold text-zinc-700">
                  <p>Order History</p>
                  <div className="flex items-center justify-start gap-3 mt-2">
                    <p>🟠</p>
                    <img src={assets.checkout} alt="" className="w-10" />
                    <p>Order Placed</p>
                  </div>
                  {orderData.status === "Accepted" && (
                    <>
                      <hr className="w-12 mt-5 -ml-3 border border-orange-500 text-orange-600 rotate-90" />
                      <div className="flex items-center justify-start gap-3 mt-2 text-lg font-semibold text-zinc-700">
                        <p>🟠</p>
                        <img src={assets.checkmark} alt="" className="w-10" />
                        <p>Order Accepted</p>
                      </div>
                      <hr className="w-12 mt-5 -ml-3 border border-orange-500 text-orange-600 rotate-90" />
                      <div className="flex items-center justify-start gap-3 mt-2 text-lg font-semibold text-zinc-700">
                        <p>🟠</p>
                        <img src={assets.processing} alt="" className="w-10" />
                        <p>Order Processing</p>
                      </div>
                    </>
                  )}
                  {orderData.status === "Cancelled" && (
                    <>
                      <hr className="w-12 mt-5 -ml-3 border border-orange-500 text-orange-600 rotate-90" />
                      <div className="flex items-center justify-start gap-3 mt-2 text-lg font-semibold text-zinc-700">
                        <p>🟠</p>
                        <img src={assets.close} alt="" className="w-8" />
                        <p>Order Cancelled</p>
                      </div>
                     
                    </>
                  )}
                  {orderData.status === "Out for Delivery" && (
                    <>
                      <hr className="w-12 mt-5 -ml-3 border border-orange-500 text-orange-600 rotate-90" />
                      <div className="flex items-center justify-start gap-3 mt-2 text-lg font-semibold text-zinc-700">
                        <p>🟠</p>
                        <img src={assets.checkmark} alt="" className="w-10" />
                        <p>Order Accepted</p>
                      </div>
                      <hr className="w-12 mt-5 -ml-3 border border-orange-500 text-orange-600 rotate-90" />
                      <div className="flex items-center justify-start gap-3 mt-2 text-lg font-semibold text-zinc-700">
                        <p>🟠</p>
                        <img src={assets.processing} alt="" className="w-10" />
                        <p>Order Processing</p>
                      </div>
                      <hr className="w-12 mt-5 -ml-3 border border-orange-500 text-orange-600 rotate-90" />
                      <div className="flex items-center justify-start gap-3 mt-2 text-lg font-semibold text-zinc-700">
                        <p>🟠</p>
                        <img src={assets.delivery} alt="" className="w-10" />
                        <p>Out for Delivery</p>
                      </div>
                    </>
                  )}
                  {orderData.status === "Delivered" && (
                    <>
                      <hr className="w-12 mt-5 -ml-3 border border-orange-500 text-orange-600 rotate-90" />
                      <div className="flex items-center justify-start gap-3 mt-2 text-lg font-semibold text-zinc-700">
                        <p>🟠</p>
                        <img src={assets.checkmark} alt="" className="w-10" />
                        <p>Order Accepted</p>
                      </div>
                      <hr className="w-12 mt-5 -ml-3 border border-orange-500 text-orange-600 rotate-90" />
                      <div className="flex items-center justify-start gap-3 mt-2 text-lg font-semibold text-zinc-700">
                        <p>🟠</p>
                        <img src={assets.processing} alt="" className="w-10" />
                        <p>Order Processing</p>
                      </div>
                      <hr className="w-12 mt-5 -ml-3 border border-orange-500 text-orange-600 rotate-90" />
                      <div className="flex items-center justify-start gap-3 mt-2 text-lg font-semibold text-zinc-700">
                        <p>🟠</p>
                        <img src={assets.delivery} alt="" className="w-10" />
                        <p>Order Out for Delivery</p>
                      </div>
                      <hr className="w-12 mt-5 -ml-3 border border-orange-500 text-orange-600 rotate-90" />
                      <div className="flex items-center justify-start gap-3 mt-2 text-lg font-semibold text-zinc-700">
                        <p>🟠</p>
                        <img
                          src={assets.fooddelivery}
                          alt=""
                          className="w-10"
                        />
                        <p>Order Delivered</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDesc;
