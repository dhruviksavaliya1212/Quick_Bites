import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import vegetarian from "../assets/vegetarian.webp";
import { assets } from "../assets/assets";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";
import DeliveryTracker from "../Components/DeliveryTracker";

const OrderDesc = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const currency = "₹"

  const { backend, token } = useContext(AppContext);

  const getOrder = async () => {
    try {
      const { data } = await axios.post(
        `${backend}/api/order/get-orders`,
        {},
        { headers: { token } }
      );
      if (data.success) {
        const foundOrder = data.orderData.find((item) => item._id === id);
        if (foundOrder) setOrder(foundOrder);
      }
    } catch (err) {
      toast.error("Failed to fetch order details");
    }
  };

  useEffect(() => {
    if (token) {
      getOrder();
    }
  }, [token]);

  const deliveryAgentId = order?.deliveryAgentId;

  const sendFeedback = async () => {
    try {
      if (feedbackMsg === "") {
        return toast.info("Please Enter Feedback");
      }
      const { data } = await axios.post(
        `${backend}/api/order/send-feedback`,
        { _id: id, feedbackMsg },
        { headers: { token } }
      );
      if (data.success) {
        setFeedbackMsg("");
        toast.success(data.message);
        getOrder();
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const loadImageAsBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("../assests/logo.png"));
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  
  const platformFees = order?.items?.[0]?.newprice
    ? Math.round(order.items[0].newprice * 0.07)
    : "N/A";
    const generateInvoice = async () => {
      setIsGenerating(true);
      try {
        const doc = new jsPDF();
        const orange = "#f7931e";
        const gray = "#666";
        const deliveryFee = 39;
    
        // Load base64 logo image
        const logoBase64 = await loadImageAsBase64(assets.logo);
    
        // Header
        doc.addImage(logoBase64, "PNG", 20, 10, 30, 20);
        doc.setTextColor(orange);
        doc.setFontSize(20);
        doc.text("QuickBites", 60, 18);
        doc.setFontSize(12);
        doc.text("Online Dining Solutions", 60, 26);
    
        doc.setFontSize(16);
        doc.text("INVOICE", 160, 20);
    
        // Seller Info
        doc.setTextColor(0);
        doc.setFontSize(11);
        doc.text("From:", 20, 45);
        doc.setFontSize(10);
        doc.text(`${order.restoName}`, 20, 52);
        doc.text(order.restoAddress, 20, 59);
    
        // Customer Info
        doc.setFontSize(11);
        doc.text("Bill To:", 20, 75);
        doc.setFontSize(10);
        doc.text(`${order.address.firstName} ${order.address.lastName}`, 20, 82);
        doc.text(`${order.address.flatno}, ${order.address.societyName}`, 20, 89);
        doc.text(`${order.address.city}, ${order.address.state} ${order.address.zipcode}`, 20, 96);
    
        // Invoice Meta
        doc.setTextColor(gray);
        doc.setFontSize(10);
        doc.text(`Order ID: ${order._id}`, 140, 45);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 52);
    
        // Table Header
        doc.setTextColor(orange);
        doc.setFontSize(11);
        const tableTop = 115;
        doc.text("Description", 20, tableTop);
        doc.text("Qty", 100, tableTop);
        doc.text("Price", 130, tableTop);
        doc.text("Total", 190, tableTop, { align: "right" });
        doc.setDrawColor(orange);
        doc.line(20, tableTop + 2, 190, tableTop + 2);
    
        // Table Content
        let yPos = tableTop + 12;
        doc.setTextColor(0);
        doc.setFontSize(10);
    
        let totalItemsAmount = 0;
        order.items.forEach((item) => {
          const itemTotal = item.newprice * item.quantity;
          totalItemsAmount += itemTotal;
    
          doc.text(item.name, 20, yPos);
          doc.text(item.quantity.toString(), 100, yPos, { align: "right" });
          doc.text(`${item.newprice}`, 130, yPos, { align: "right" });
          doc.text(`${itemTotal}`, 190, yPos, { align: "right" });
          yPos += 8;
        });
    
        // Additional Charges
        const addCharge = (label, value) => {
          doc.text(label, 20, yPos);
          doc.text("1", 100, yPos, { align: "right" });
          doc.text(`${value}`, 130, yPos, { align: "right" });
          doc.text(`${value}`, 190, yPos, { align: "right" });
          yPos += 8;
        };
    
        addCharge("Platform Fee", platformFees);
        addCharge("Delivery Fee", deliveryFee);
    
        // Calculate Total
        const finalTotal = totalItemsAmount + platformFees + deliveryFee;
    
        // Total Line
        doc.setDrawColor(orange);
        doc.line(20, yPos + 2, 190, yPos + 2);
        yPos += 10;
    
        doc.setFontSize(11);
        doc.setTextColor(orange);
        doc.text("Total Amount", 130, yPos);
        doc.setTextColor(0);
        doc.text(`${finalTotal} Rupees Only/-`, 190, yPos, { align: "right" });
    
        // Footer
        yPos += 20;
        doc.setFontSize(9);
        doc.setTextColor(gray);
        doc.text("GST 5%, platform fee and delivery fees applied on total.", 20, yPos);
        doc.setTextColor(orange);
        doc.setFontSize(10);
        doc.text("Thank you for your order!", 20, yPos + 10);
    
        doc.save(`invoice_${order._id}.pdf`);
        toast.success("Invoice downloaded successfully");
      } catch (error) {
        toast.error("Failed to generate invoice");
        console.error(error);
      } finally {
        setIsGenerating(false);
      }
    };
    
     
    
    

  if (!order) {
    return <div>Loading order details...</div>;
  }

  return (
    <div className="flex flex-col mb-20 pt-24 min-h-screen w-full xl:w-[90%]">
      <div className="flex items-center justify-center flex-col mb-20">
        <div className="mt-5 w-full lg:w-[90%] xl:w-[80%]">
          <div className="flex flex-col gap-3 text-base font-semibold text-zinc-800">
            <div className="flex flex-col sm:flex-row gap-2">
              <p>Order Name :</p>
              <p className="text-zinc-700">{order.items.map(item => item.name).join(', ')}</p>
            </div>
            <div>
              {order.payment && (
                <button
                  onClick={generateInvoice}
                  className="px-5 py-1.5 bg-slate-300 hover:bg-zinc-400 hover:transition-all hover:duration-700 shadow-md shadow-zinc-600 rounded-full flex items-center gap-2"
                  disabled={isGenerating}
                >
                  {isGenerating && (
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full"></span>
                  )}
                  {isGenerating ? "Generating..." : "Download Invoice"}
                </button>
              )}
            </div>
          </div>
          {order.items &&
            order.items.map((item, index) => (
              <div key={index}>
                <div className="mt-10 mb-5 flex flex-col sm:flex-row items-center justify-start gap-5 lg:gap-7">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt=""
                      className="min-w-44 max-w-44 h-44 rounded bg-gradient-to-t from-slate-500 to-slate-900"
                    />
                  </div>
                  <div className="max-md:ml-5 max-sm:mt-3">
                    <div className="flex gap-2 items-center">
                      <img src={vegetarian} alt="" className="w-5" />
                      <p className="text-md text-red-700 font-semibold">
                        {item.bestSeller === true && "Best Seller"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <p className="text-xl font-bold text-zinc-900">
                        {item.name}
                      </p>
                      <span className="text-xl font-bold text-zinc-900">-</span>
                      <p className="text-xl font-bold text-zinc-900">
                        {item.quantity}
                      </p>
                    </div>
                    <p className="text-md font-semibold text-zinc-900 -mt-1">
                      {item.restoname}
                    </p>
                    <div className="mt-1 flex gap-3 item-center">
                      <p className="line-through font-semibold text-zinc-500">
                        <span>₹</span>
                        {item.oldprice}
                      </p>
                      <p className="font-semibold text-zinc-900">
                        <span>₹</span>
                        {item.newprice}
                      </p>
                    </div>
                    <div className="flex items-center my-2">
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
                      <p className="text-green-700 font-semibold ml-1">
                        {item.rating}
                      </p>
                    </div>
                    <p className="text-md font-normal text-zinc-800 max-w-[90%]">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <hr className="w-[90%] border border-zinc-600 m-auto mt-5 outline-none" />
              </div>
            ))}
          <div className="mt-10 w-full flex flex-wrap gap-5 justify-between">
            <div>
              <div className="flex gap-3 items-center">
                <p className="text-xl font-semibold text-zinc-800">
                  Total Amount
                </p>
                <p className="text-sm font-normal text-red-600">
                  * All charges applied{" "}
                </p>
              </div>
              <p className="mt-2 text-lg font-medium text-zinc-700">
                <span className="font-semibold">{currency}</span>{" "}
                <span>{order.amount}</span>
              </p>
            </div>
            <div className="text-xl font-semibold text-zinc-800">
              <p>Payment Type </p>
              <div className="flex items-center gap-3 mt-3">
                {order.paymentType === "Cash On Delivery" ? (
                  <img src={assets.cashondelivery} className="w-8"></img>
                ) : (
                  <img src={assets.paymentmethod} alt="" className="w-8" />
                )}
                <p className="text-base font-medium text-zinc-800">
                  {order.paymentType}
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {order.payment ? (
                <img src={assets.checkmark} className="w-8"></img>
              ) : order.paymentType === "Cash On Delivery" ? (
                <img src={assets.pending} className="w-9"></img>
              ) : (
                <img src={assets.close} className="w-7"></img>
              )}
              <span
                className={`text-base font-medium text-zinc-800 ${
                  order.payment
                    ? "text-green-600"
                    : order.paymentType === "Cash On Delivery"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {order.payment
                  ? "Payment successful"
                  : order.paymentType === "Cash On Delivery"
                  ? "Payment Pending"
                  : "Payment Failed"}
              </span>
            </div>
          </div>
          <div className="w-full flex flex-col justify-between">
            <p className="mt-10 text-xl font-semibold text-zinc-800">
              Delivery Address
            </p>
            {order.address && (
              <div
                className={`w-full rounded mt-3 shadow-inner shadow-slate-800 py-5 px-5 bg-slate-200 cursor-pointer relative`}
              >
                <div className="text-lg font-medium text-zinc-800 flex gap-2 items-center">
                  {order.address.category === "Office" && (
                    <img src={assets.office} className="w-8" />
                  )}
                  {order.address.category === "Home" && (
                    <img src={assets.home} className="w-8" />
                  )}
                  {order.address.category === "Other" && (
                    <img src={assets.other} className="w-8" />
                  )}
                  {order.address.category}
                </div>
                <div className="flex gap-2 capitalize text-lg font-medium text-zinc-800 mt-5">
                  <p>{order.address.firstName}</p>
                  <p>{order.address.lastName}</p>
                </div>
                <div className="flex flex-wrap gap-2 capitalize text-[17px] text-zinc-700 font-normal my-1">
                  <p>{order.address.flatno},</p>
                  <p>{order.address.societyName},</p>
                  <p>{order.address.city},</p>
                  <p>{order.address.state},</p>
                  <p>{order.address.zipcode},</p>
                  <p>{order.address.country}</p>
                </div>
                <div className="flex gap-2 capitalize text-base text-zinc-700 font-normal">
                  <p>{order.address.phone}</p>
                </div>
              </div>
            )}
          </div>
          {order.status === "Delivered" && (
            <div>
              <p className="mt-10 text-xl font-semibold text-zinc-800">
                {order.feedback === "" ? "Give Feedback" : "Your Feedback"}
              </p>
              {order.feedback === "" ? (
                <>
                  <textarea
                    onChange={(e) => setFeedbackMsg(e.target.value)}
                    value={feedbackMsg}
                    rows="3"
                    placeholder="Enter Feedback Here"
                    className="w-full bg-transparent border-2 border-zinc-700 px-5 py-1.5 rounded-md mt-5 shadow-md shadow-zinc-500 outline-none placeholder:text-zinc-600"
                  />
                  <button
                    onClick={sendFeedback}
                    className="px-5 py-1.5 bg-orange-500 text-zinc-100 hover:bg-orange-600 hover:transition-all hover:duration-700 shadow-md shadow-zinc-600 rounded-full"
                  >
                    Send Feedback
                  </button>
                </>
              ) : (
                <p className="text-md font-semibold text-zinc-700 mt-3">
                  {order.feedback}
                </p>
              )}
            </div>
          )}
          {order.response !== "" && (
            <div className="mt-5">
              <p className="text-xl font-semibold text-zinc-800">
                Seller Response
              </p>
              <p className="text-md font-semibold text-zinc-700 mt-3">
                {order.response}
              </p>
            </div>
          )}
          <div className="">
            <p className="mt-10 text-xl font-semibold text-zinc-800">
              Delivery Status
            </p>
            <div className="mt-2">
              <div className="mt-5 text-lg font-semibold text-zinc-700">
                <p>Order History</p>
                <div className="flex items-center justify-start gap-3 mt-2">
                  <p>🟠</p>
                  <img src={assets.checkout} alt="" className="w-10" />
                  <p>Order placed</p>
                </div>
                {order.status === "Accepted" ? (
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
                ) : order.status === "Cancelled" ? (
                  <>
                    <hr className="w-12 mt-5 -ml-3 border border-orange-500 text-orange-600 rotate-90" />
                    <div className="flex items-center justify-start gap-3 mt-2 text-lg font-semibold text-zinc-700">
                      <p>🟠</p>
                      <img src={assets.close} alt="" className="w-8" />
                      <p>Order Cancelled</p>
                    </div>
                  </>
                ) : order.status === "Out for Delivery" ? (
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
                    <div className="z-10 relative">
                      {order.status === "Out for Delivery" && deliveryAgentId && (
                        <DeliveryTracker deliveryAgentId={deliveryAgentId} />
                      )}
                    </div>
                  </>
                ) : (
                  order.status === "Delivered" && (
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
                        <img src={assets.fooddelivery} alt="" className="w-10" />
                        <p>Order Delivered</p>
                      </div>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDesc;
