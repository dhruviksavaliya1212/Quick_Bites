import axios from "axios";
import { useState, useContext } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRupeeSign,
  FaDirections,
  FaEnvelope,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { OrderContext } from "../../context/OrderContext";
import { jwtDecode } from "jwt-decode";

function OrderCard({ order, onUpdateStatus }) {
  const [displayStatus, setDisplayStatus] = useState(order.status); // Local status for display
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const { orders: contextOrders, setOrders } = useContext(OrderContext);
  const token = localStorage.getItem("deliveryAgent-token");
  const decoded = jwtDecode(token);
  const deliveryAgentId = decoded.agentId;

  const checkEligibilityToAccept = () => {
    // Only "placed" orders can be accepted or rejected
    if (order.status !== "placed") return false;

    // Check if the current agent's ID is in the rejectedBy array
    const hasRejected = order.rejectedBy?.some(
      (rejection) => rejection.deliverAgentId === deliveryAgentId
    );

    // If the agent has rejected it, they can't see the options
    return !hasRejected;
  };

  const handleStatusUpdate = async (newStatus) => {
    const success = await onUpdateStatus(order._id, newStatus);
    if (success) {
      if (newStatus === "reject") {
        // For the rejecting agent, show "rejected" locally without changing order.status
        setDisplayStatus("rejected");
      } else {
        // For other statuses, update the display status
        setDisplayStatus(newStatus);
      }
    }
  };

  const handleNavigate = () => {
    const encodedAddress = encodeURIComponent(order.deliveryAddress);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`,
      "_blank"
    );
  };

  const handleCall = () => {
    if (order.customerPhone) {
      window.location.href = `tel:${order.customerPhone}`;
    }
  };

  const handleEmail = async () => {
    setIsSendingOtp(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/delivery-agent/send-delivery-otp",
        {
          email: order.email,
          orderId: order._id,
        }
      );
      toast.success(res.data.message || "OTP sent successfully!");
      setOtpSent(true);
      setShowOtpInput(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/delivery-agent/verify-delivery-otp",
        {
          orderId: order._id,
          otp: otpInput,
        }
      );
      toast.success(res.data.message || "OTP verified successfully!");
      setShowOtpInput(false);
      setOtpInput("");
    } catch (err) {
      alert(err.response?.data?.message || "Incorrect OTP.");
    }
  };

  const canAcceptOrReject = checkEligibilityToAccept();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold">{order.itemName}</h3>
          <p className="text-gray-600">{order.restoName}</p>
        </div>
        <div className="flex items-center bg-orange-50 px-3 py-1 rounded-full">
          <FaRupeeSign className="text-primary" />
          <span className="font-bold">{order.amount}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <FaMapMarkerAlt className="text-primary flex-shrink-0" />
            <p className="text-sm">{order.deliveryAddress}</p>
          </div>
          <button
            onClick={handleNavigate}
            className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-full hover:bg-secondary transition-colors flex items-center justify-center gap-2"
          >
            <FaDirections />
            <span>Navigate</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <FaPhoneAlt className="text-primary flex-shrink-0" />
            <p className="text-sm">{order.customerPhone}</p>
          </div>
          <button
            onClick={handleCall}
            className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <FaPhoneAlt />
            <span>Call</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <FaEnvelope className="text-primary flex-shrink-0" />
            <p className="text-sm">{order.email}</p>
          </div>
          <button
            onClick={handleEmail}
            disabled={
              !(displayStatus === "pickedup" || displayStatus === "accepted") ||
              isSendingOtp
            }
            className={`w-full sm:w-auto px-4 py-2 rounded-full flex items-center justify-center gap-2 transition-colors ${
              displayStatus === "pickedup" || displayStatus === "accepted"
                ? isSendingOtp
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSendingOtp ? <span>Sending...</span> : <span>Send OTP</span>}
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        {canAcceptOrReject ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => handleStatusUpdate("accept")}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition-colors"
            >
              Accept Order
            </button>
            <button
              onClick={() => handleStatusUpdate("reject")}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition-colors"
            >
              Reject Order
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <select
              value={displayStatus}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="w-full p-3 border rounded-full text-center"
              disabled={displayStatus === "rejected" || displayStatus === "Delivered"}
            >
              <option value="accepted">Accepted</option>
              <option
                value="rejected"
                disabled={displayStatus === "rejected" || displayStatus === "accepted"}
              >
                Rejected
              </option>
              <option value="pickedup">Picked Up</option>
              <option value="Delivered" disabled>
                Delivered (via OTP)
              </option>
            </select>
          </div>
        )}

        {(displayStatus === "pickedup" || displayStatus === "accepted") &&
          otpSent &&
          showOtpInput && (
            <div className="space-y-2 mt-2">
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleOtpSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors w-full"
              >
                Verify & Complete Delivery
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

export default OrderCard;
