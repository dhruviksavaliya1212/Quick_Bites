import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { address, assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    getTotalCartAmount,
    token,
    cart,
    calculateDelivery,
    calculateGst,
    calculatePlatformFee,
    currency,
    backend,
    food_list,
    appliedPromo,
    discount,
  } = useContext(AppContext);

  const [popup, setPopup] = useState(false);
  const [Address, setAddress] = useState({});
  const [listOfAdd, setListOfAdd] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const [addressData, setAddressData] = useState({
    firstName: "",
    lastName: "",
    flatno: "",
    societyName: "",
    city: "",
    state: "",
    zipcode: "",
    phone: "",
    country: "India",
    category: "Home",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setAddressData((data) => ({ ...data, [name]: value }));
  };

  const showPopup = () => {
    setPopup(true);
  };

  const closePopup = () => {
    setPopup(false);
  };

  const handleAddress = (address) => {
    setAddress(address);
  };

  const removeAddress = async (address) => {
    const { data } = await axios.post(
      `${backend}/api/address/remove-address`,
      { address },
      { headers: { token } }
    );

    if (data.success) {
      toast.success(data.message);
      getAddress();
    } else {
      toast.error(data.message);
    }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    setPopup(false);
    const { data } = await axios.post(
      `${backend}/api/address/add-address`,
      { addressData },
      { headers: { token } }
    );
    if (data.success) {
      toast.success(data.message);
      getAddress();
    } else {
      toast.error(data.message);
    }
  };

  const getAddress = async () => {
    if (token) {
      const { data } = await axios.post(
        `${backend}/api/address/get-address`,
        {},
        { headers: { token } }
      );
      if (data.success) {
        setListOfAdd(data.addressData.reverse().slice(0, 3));
      }
    }
  };

  const finalAmount =
    getTotalCartAmount() +
    calculateDelivery() +
    calculatePlatformFee() +
    calculateGst() -
    discount;

  const cashOnDelivery = async () => {
    let orderItems = [];
    food_list.map((item) => {
      if (cart[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cart[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: Address,
      items: orderItems,
      amount: finalAmount,
      discount: discount,
      appliedPromo: appliedPromo ? appliedPromo.offerCode : null,
    };

    const { data } = await axios.post(
      `${backend}/api/order/cash-on-delivery`,
      { orderData },
      { headers: { token } }
    );

    if (data.success) {
      toast.success(data.message);
      navigate("/my-orders");
    } else {
      toast.error(data.message);
    }
  };

  const stripePayment = async () => {
    if (!Address || Object.keys(Address).length === 0) {
      toast.error("Please select a delivery address");
      return;
    }

    setIsLoading(true);
    try {
      let orderItems = [];
      food_list.map((item) => {
        if (cart[item._id] > 0) {
          let itemInfo = item;
          itemInfo["quantity"] = cart[item._id];
          orderItems.push(itemInfo);
        }
      });

      let orderData = {
        address: Address,
        items: orderItems,
        amount: finalAmount,
        discount: discount,
        appliedPromo: appliedPromo ? appliedPromo.offerCode : null,
      };

      const { data } = await axios.post(
        `${backend}/api/order/online-stripe`,
        { orderData },
        { headers: { token } }
      );

      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Payment processing failed. Please try again.");
      setIsLoading(false);
    }
  };

  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "QuickBites Foods&Beverages Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backend}/api/order/verify-razorpay`,
            { response },
            { headers: { token } }
          );

          if (data.success) {
            toast.success(data.message);
            navigate("/my-orders");
          } else {
            toast.error(data.message);
          }
        } catch (err) {
          toast.error("Payment verification failed");
        } finally {
          setIsLoading(false);
        }
      },
      prefill: {
        contact: Address.phone,
        name: `${Address.firstName} ${Address.lastName}`,
      },
      theme: {
        color: "#F97316",
      },
      modal: {
        ondismiss: () => setIsLoading(false),
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const paymentRazorpay = async () => {
    if (!Address || Object.keys(Address).length === 0) {
      toast.error("Please select a delivery address");
      return;
    }

    setIsLoading(true);
    try {
      let orderItems = [];
      food_list.map((item) => {
        if (cart[item._id] > 0) {
          let itemInfo = item;
          itemInfo["quantity"] = cart[item._id];
          orderItems.push(itemInfo);
        }
      });

      let orderData = {
        address: Address,
        items: orderItems,
        amount: finalAmount,
        discount: discount,
        appliedPromo: appliedPromo ? appliedPromo.offerCode : null,
      };

      const { data } = await axios.post(
        `${backend}/api/order/online-razorpay`,
        { orderData },
        { headers: { token } }
      );

      if (data.success) {
        initPay(data.Order);
      } else {
        toast.error(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Payment processing failed. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAddress();
  }, [token]);

  return (
    <div className="flex flex-col items-center mb-20 py-28 min-h-screen relative w-full">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-lg font-medium text-zinc-800">
              Processing Payment...
            </p>
            <p className="text-sm text-zinc-600 mt-2">
              Please wait while we securely process your transaction
            </p>
          </div>
        </div>
      )}

      <div className="w-full xl:w-[90%]">
        <button
          onClick={showPopup}
          className="w-44 border border-zinc-600 px-5 py-2 rounded"
        >
          Add New Address
        </button>
        <div
          className={`w-full xl:w-[90%] top-20 flex absolute z-40 justify-center items-center backdrop-blur-lg h-screen ${
            popup === false && "hidden"
          }`}
        >
          <img
            src={assets.close}
            onClick={closePopup}
            className="w-8 top-1 right-2 absolute z-40 text-3xl font-light cursor-pointer"
          />
          <form
            onSubmit={addAddress}
            action=""
            method="post"
            className="flex lg:items-start items-center justify-between gap-5 lg:gap-10 flex-col lg:flex-row"
          >
            <div className="place-order-left">
              <p className="text-3xl text-zinc-800 font-semibold mb-8">
                Delivery Information
              </p>
              <div className="flex gap-2">
                <input
                  required
                  onChange={onChangeHandler}
                  value={addressData.firstName}
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  className="w-full bg-transparent border-2 border-zinc-700 px-3 py-1 rounded-lg mb-2 text-lg placeholder:text-zinc-600 font-medium outline-orange-700 outline-1"
                />
                <input
                  required
                  onChange={onChangeHandler}
                  value={addressData.lastName}
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  className="w-full bg-transparent border-2 border-zinc-700 px-3 py-1 rounded-lg mb-2 text-lg placeholder:text-zinc-600 font-medium outline-orange-700 outline-1"
                />
              </div>
              <input
                required
                onChange={onChangeHandler}
                value={addressData.flatno}
                type="text"
                name="flatno"
                placeholder="Door/Flat No"
                className="w-full bg-transparent border-2 border-zinc-700 px-3 py-1 rounded-lg mb-2 text-lg placeholder:text-zinc-600 font-medium outline-orange-700 outline-1"
              />
              <input
                required
                onChange={onChangeHandler}
                value={addressData.societyName}
                type="text"
                name="societyName"
                placeholder="Society Name"
                className="w-full bg-transparent border-2 border-zinc-700 px-3 py-1 rounded-lg mb-2 text-lg placeholder:text-zinc-600 font-medium outline-orange-700 outline-1"
              />
              <div className="flex gap-2">
                <input
                  required
                  onChange={onChangeHandler}
                  value={addressData.city}
                  type="text"
                  name="city"
                  placeholder="City"
                  className="w-full bg-transparent border-2 border-zinc-700 px-3 py-1 rounded-lg mb-2 text-lg placeholder:text-zinc-600 font-medium outline-orange-700 outline-1"
                />
                <input
                  required
                  onChange={onChangeHandler}
                  value={addressData.state}
                  type="text"
                  name="state"
                  placeholder="State"
                  className="w-full bg-transparent border-2 border-zinc-700 px-3 py-1 rounded-lg mb-2 text-lg placeholder:text-zinc-600 font-medium outline-orange-700 outline-1"
                />
              </div>
              <div className="flex gap-2">
                <input
                  required
                  onChange={onChangeHandler}
                  value={addressData.zipcode}
                  type="text"
                  name="zipcode"
                  placeholder="Zip code"
                  className="w-full bg-transparent border-2 border-zinc-700 px-3 py-1 rounded-lg mb-2 text-lg placeholder:text-zinc-600 font-medium outline-orange-700 outline-1"
                />
                <input
                  required
                  onChange={onChangeHandler}
                  value={addressData.country}
                  type="text"
                  name="country"
                  placeholder="Country"
                  className="w-full bg-transparent border-2 border-zinc-700 px-3 py-1 rounded-lg mb-2 text-lg placeholder:text-zinc-600 font-medium outline-orange-700 outline-1"
                />
              </div>
              <input
                required
                onChange={onChangeHandler}
                value={addressData.phone}
                type="text"
                name="phone"
                placeholder="Phone"
                className="w-full bg-transparent border-2 border-zinc-700 px-3 py-1 rounded-lg mb-2 text-lg placeholder:text-zinc-600 font-medium outline-orange-700 outline-1"
              />
              <select
                onChange={onChangeHandler}
                value={addressData.category}
                name="category"
                className="bg-transparent px-3 py-2 border-2 border-zinc-700 rounded-md w-full text-lg text-zinc-800 font-medium outline-orange-700 outline-1"
              >
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </select>
              <div className="w-full flex justify-center">
                <button
                  type="submit"
                  className="w-[300px] sm:w-[400px] border bg-orange-500 py-3 text-zinc-100 font-medium rounded mt-4 text-[16px] hover:bg-orange-600 hover:text-black hover:scale-105 transition-all duration-300"
                >
                  Add Address
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="w-full flex flex-col lg:flex-row justify-between lg:items-start items-center gap-5 lg:gap-0">
          <div>
            <p className="mt-5 text-lg font-semibold text-zinc-700">
              Delivery Address
            </p>
            {listOfAdd.map((item, index) => (
              <div
                onClick={() => handleAddress(item)}
                key={index}
                className={`w-[340px] sm:w-[500px] lg:w-[450px] xl:w-[500px] rounded mt-3 shadow-md shadow-zinc-700 py-5 px-5 bg-zinc-100 cursor-pointer hover:scale-105 transition-all duration-500 relative`}
              >
                <img
                  src={assets.checkmark}
                  alt=""
                  className={`w-8 absolute top-4 left-20 ${Address === item ? "flex" : "hidden"}`}
                />
                <img
                  onClick={() => removeAddress(item)}
                  src={assets.trash}
                  alt=""
                  className="w-7 absolute right-5"
                />
                <p className="text-lg font-medium text-zinc-800">{item.category}</p>
                <div className="flex gap-2 capitalize text-base text-zinc-600 font-normal mt-5">
                  <p>{item.firstName}</p>
                  <p>{item.lastName}</p>
                </div>
                <div className="flex flex-wrap gap-2 capitalize text-base text-zinc-600 font-normal">
                  <p>{item.flatno},</p>
                  <p>{item.societyName},</p>
                  <p>{item.city},</p>
                  <p>{item.state},</p>
                  <p>{item.zipcode},</p>
                  <p>{item.country}</p>
                </div>
                <div className="flex gap-2 capitalize text-base text-zinc-600 font-normal">
                  <p>{item.phone}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-[300px] sm:w-[400px] lg:w-[350px] xl:w-[400px]">
            <div className="mb-5 w-full">
              <p className="text-zinc-900 font-medium text-lg mb-4">Bill Details</p>
              <div className="mt-1 flex justify-between gap-5">
                <p className="text-sm text-zinc-700">Total Amount</p>
                <p className="text-sm text-zinc-700">
                  <span className="text-[15px]">{currency}</span>
                  {getTotalCartAmount()}
                </p>
              </div>
              <div className="mt-2 flex justify-between gap-5">
                <p className="text-sm text-zinc-700">Delivery Charge</p>
                <p className="text-sm text-zinc-700">
                  <span className="text-[15px]">{currency}</span>
                  {calculateDelivery()}
                </p>
              </div>
              <div className="mt-2 flex justify-between gap-5">
                <p className="text-sm text-zinc-700">Platform Fee</p>
                <div className="flex gap-3">
                  <p className="text-sm text-zinc-500 line-through">
                    <span className="text-[15px]">{currency}</span>10
                  </p>
                  <p className="text-sm text-zinc-700">
                    <span className="text-[15px]">{currency}</span>
                    {calculatePlatformFee()}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex justify-between gap-5">
                <p className="text-sm text-zinc-700">GST and Restaurant Charges</p>
                <p className="text-sm text-zinc-700">
                  <span className="text-[15px]">{currency}</span>
                  {calculateGst()}
                </p>
              </div>
              {appliedPromo && (
                <div className="mt-2 flex justify-between gap-5">
                  <p className="text-sm text-green-700">
                    Discount ({appliedPromo.discount}% off)
                  </p>
                  <p className="text-sm text-green-700">
                    <span className="text-[15px]">{currency}</span>
                    {discount}
                  </p>
                </div>
              )}
              <hr className="border border-zinc-600 mt-3" />
              <div className="flex justify-between mt-2 font-semibold text-zinc-900">
                <p>To Pay</p>
                <p>
                  <span>{currency}</span>
                  {finalAmount}
                </p>
              </div>
            </div>
            <div className="w-full">
              <button
                onClick={cashOnDelivery}
                disabled={isLoading}
                className={`w-full border bg-orange-500 py-3 text-zinc-100 font-medium rounded mt-4 text-[16px] transition-all duration-300 ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-orange-600 hover:text-black hover:scale-105"
                }`}
              >
                Cash on Delivery
              </button>
              <p className="mt-5 text-lg font-medium mb-2 text-zinc-900">
                Online Payment
              </p>
              <button
                onClick={stripePayment}
                disabled={isLoading}
                className={`w-full bg-white py-3 text-[#635AFF] shadow-md shadow-[#625aff7a] font-bold rounded text-xl transition-all duration-300 ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105"
                }`}
              >
                {isLoading ? "Processing..." : "Stripe"}
              </button>
              <div
                onClick={!isLoading ? paymentRazorpay : null}
                className={`w-full border bg-white py-3 font-medium rounded text-[16px] flex justify-center mt-3 shadow-md shadow-zinc-500 transition-all duration-300 ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105 cursor-pointer"
                }`}
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <img src={assets.payment} alt="Razorpay" className="w-28 text-center" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
