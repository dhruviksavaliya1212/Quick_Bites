import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import vegetarian from "../assets/vegetarian.webp";
import { assets } from "../assets/assets";
// import { MapContainer, TileLayer, Marker } from "leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import io from "socket.io-client";

const OrderDesc = () => {
  const { id } = useParams();

  const [order, setOrder] = useState([]);

  const { backend, token, currency } = useContext(AppContext);

  const getOrder = async () => {
    const { data } = await axios.post(
      `${backend}/api/order/get-orders`,
      {},
      { headers: { token } }
    );
    if (data.success) {
      data.orderData.find((item) => item._id === id && setOrder(item));
    }
  };

  useEffect(() => {
    if (token) {
      getOrder();
    }
  }, [token]);

  // useEffect(() => {
  //   const socket = io(import.meta.env.VITE_BACKEND);

  //   if (navigator.geolocation) {
  //     navigator.geolocation.watchPosition((position) => {
  //       const { latitude, longitude } = position.coords;
  //       socket.emit("send-location", { latitude, longitude });
  //     }),
  //       (error) => {
  //         console.log(error);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         timeout: 5000,
  //         maximumAge: 0,
  //       };
  //   }

  //   const markers = {}

  //   if (mapRef.current) {
  //     const map = L.map(mapRef.current).setView([0,0], 10);
  //     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //       attribution: "OpenStreetMap",
  //     }).addTo(map);
  //     socket.on("receive-location", (data) => {
  //       const { id, latitude, longitude } = data;
  //       map.setView([latitude, longitude], 10);
  //       if(markers[id]){
  //         markers[id].setLatLang([latitude, longitude])
  //       } else{
  //         markers[id] = L.marker([latitude, longitude]).addTo(map)
  //       }
  //     });
  //   }
  // }, []);

  // useEffect(() => {
  //   if (mapRef.current) {
  //     const map = L.map(mapRef.current).setView([51.505, -0.09], 13);
  //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  //     // Add a marker to the map
  //     const marker = L.marker([51.505, -0.09]).addTo(map);
  //     marker.bindPopup('Hello world!').openPopup();
  //   }
  // }, []);

  return (
    <div className="flex flex-col mb-20 pt-24 min-h-screen ">
      {order && (
        <div className="flex items-center justify-center flex-col mb-20">
          <div className="  mt-5 w-full lg:w-[90%] xl:w-[80%]">
            <div className=" flex gap-3 text-base font-semibold text-zinc-800">
              <p>Order Id :</p>
              <p className=" text-zinc-700">{order._id}</p>
            </div>
            {order.items &&
              order.items.map((item, index) => (
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
                      <div className=" flex gap-2">
                        <p className=" text-xl font-bold text-zinc-900">
                          {item.name}
                        </p>
                        <span className=" text-xl font-bold text-zinc-900">
                          -
                        </span>
                        <p className=" text-xl font-bold text-zinc-900">
                          {item.quantity}
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
                          <rect width="14" height="14" fill="white"></rect>
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
                  <span>{order.amount}</span>
                </p>
              </div>
              <div className=" text-xl font-semibold text-zinc-800">
                <p>Payment Type </p>
                <div className=" flex items-center gap-3 mt-3">
                  {order.paymentType === "Cash On Delivery" ? (
                    <img src={assets.cashondelivery} className="w-8"></img>
                  ) : (
                    <img src={assets.paymentmethod} alt="" className="w-8" />
                  )}

                  <p className=" text-base font-medium text-zinc-800">
                    {" "}
                    {order.paymentType}{" "}
                  </p>
                </div>
              </div>
              <div className=" flex gap-2 items-center ">
                {order.payment ? (
                  <img src={assets.checkmark} className="w-8"></img>
                ) : (
                  <img src={assets.close} className=" w-7"></img>
                )}

                <span
                  className={`text-base font-medium text-zinc-800 ${
                    order.payment ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {order.payment ? "Payment successfull" : "Payment Failed"}
                </span>
              </div>
            </div>
            <div className=" w-full flex flex-col justify-between">
              <p className=" mt-10 text-xl font-semibold text-zinc-800">
                Delivery Address
              </p>
              {order.address && (
                <div
                  className={` w-full rounded mt-3 shadow-inner shadow-slate-800 py-5 px-5 bg-slate-200 cursor-pointer relative `}
                >
                  <div className=" text-lg font-medium text-zinc-800 flex gap-2 items-center">
                    {
                      order.address.category === "Office" && (<img src={assets.office} className="w-8"/>)
                    }
                    {
                      order.address.category === "Home" && (<img src={assets.home} className="w-8"/>)
                    }
                    {
                      order.address.category === "Other" && (<img src={assets.other} className="w-8"/>)
                    }
                    {order.address.category}
                  </div>
                  <div className=" flex gap-2 capitalize text-lg font-medium text-zinc-800 mt-5 ">
                    <p>{order.address.firstName}</p>
                    <p>{order.address.lastName}</p>
                  </div>
                  <div className=" flex flex-wrap gap-2 capitalize text-[17px] text-zinc-700 font-normal my-1 ">
                    <p>{order.address.flatno},</p>

                    <p>{order.address.societyName},</p>

                    <p>{order.address.city},</p>

                    <p>{order.address.state},</p>

                    <p>{order.address.zipcode},</p>

                    <p>{order.address.country}</p>
                  </div>
                  <div className=" flex gap-2 capitalize text-base text-zinc-700 font-normal ">
                    <p>{order.address.phone}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="">
              <p className="mt-10 text-xl font-semibold text-zinc-800">
                Delivery Status
              </p>
              {/* <div
                ref={mapRef}
                className="map"
                style={{ height: "400px", width: "100%" }}
              ></div> */}
              <div className="mt-2">
                <div className="flex items-center justify-start gap-3 mt-5 text-lg font-semibold text-zinc-700">
                  <p>🟠</p>
                  <img src={assets.checkout} alt="" className="w-10" />
                  <p>Order Placed</p>
                </div>
                {order.status === "Processing" && (
                  <>
                    <hr className=" w-12 mt-5 -ml-3 border border-orange-500 text-orange-600 rotate-90" />
                    <div className="flex items-center justify-start gap-3 mt-5 text-lg font-semibold text-zinc-700">
                      <p>🟠</p>
                      <img src={assets.tracking} alt="" className="w-10" />
                      <p>Order Processing</p>
                    </div>
                  </>
                )}

                {order.status === "Out for Delivery" && (
                  <>
                    <hr className=" w-12 mt-5 -ml-3 border border-orange-500 text-orange-600 rotate-90" />
                    <div className="flex items-center justify-start gap-3 mt-5 text-lg font-semibold text-zinc-700">
                      <p>🟠</p>
                      <img src={assets.delivery} alt="" className="w-10" />
                      <p>Order Out for Delivery</p>
                    </div>
                  </>
                )}
                {order.status === "Delivered" && (
                  <>
                    <hr className=" w-12 mt-5 -ml-3 border border-orange-500 text-orange-600 rotate-90" />
                    <div className="flex items-center justify-start gap-3 mt-5 text-lg font-semibold text-zinc-700">
                      <p>🟠</p>
                      <img src={assets.fooddelivery} alt="" className="w-10" />
                      <p>Order Delivered</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDesc;
