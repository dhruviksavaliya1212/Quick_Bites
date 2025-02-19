import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { SellerContext } from "../Context/SellerContext";

const Login = () => {

  const navigate = useNavigate();

  const {backend, setStoken} = useContext(SellerContext);

  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showOTP, setShowOTP] = useState(false); // Toggle for OTP UI
  const [otp, setOtp] = useState(""); // Store OTP input
  const [otpId, setOtpId] = useState(""); // Store OTP ID from backend
  const [loading, setLoading] = useState(false); // New loading state

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    let url = backend;
    if(state === "Sign Up"){
      url += '/api/seller/register'
    } else {
      url += '/api/seller/login'
    }
    try {
      const {data} = await axios.post(url,{name,email,password})

      if(data.success){
        toast.success(data.message)
        if(data.otpId) { // Check if OTP is required (backend sends otpId)
          setShowOTP(true);
          setOtpId(data.otpId); // Store the OTP ID
        } else {
          setStoken(data.token)
          localStorage.setItem("seller-token", data.token);
          navigate('/')
        }
      } else {
        toast.error(data.message)
      }
    } catch(error) {
      toast.error("An error occurred during submission");
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  const onOTPSubmit = async(e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    const url = `${backend}/api/seller/verify-otp`; // Match backend endpoint
    try {
      const {data} = await axios.post(url, { otpId, verificationcode: otp }); // Match backend expectation
      if(data.success){
        toast.success(data.message);
        setStoken(data.token);
        localStorage.setItem("seller-token", data.token);
        navigate('/');
        setShowOTP(false); // Reset after successful verification
        setOtpId(""); // Clear OTP ID
        setOtp(""); // Clear OTP input
      } else {
        toast.error(data.message);
      }
    } catch(error) {
      toast.error("An error occurred during OTP verification");
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <form onSubmit={showOTP ? onOTPSubmit : onSubmitHandler} className=" flex items-center py-10">
      <div className=" flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg shadow-zinc-500 bg-gradient-to-b from-orange-100 to-orange-200">
        <p className=" text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login Account"}
        </p>
        <p className="mt-1">
          Please {state === "Sign Up" ? "sign up" : "login"} access your dashboard
        </p>
        {state === "Sign Up" && (
          <div className=" w-full">
            <p className=" mt-2">Full Name</p>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              className=" border border-zinc-500 rounded w-full p-2 mt-1 bg-transparent"
            />
          </div>
        )}
        <div className=" w-full">
          <p className=" mt-4">Email</p>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            className=" border border-zinc-500 rounded w-full p-2 mt-1 bg-transparent"
          />
        </div>
        <div className=" w-full">
          <p className=" mt-4">Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            className=" border border-zinc-500 rounded w-full p-2 mt-1 bg-transparent"
          />
        </div>

        {!showOTP ? (
          <button
            type="submit"
            disabled={loading}
            className={`w-full border  bg-orange-400 py-3 text-zinc-700 font-medium rounded mt-4 text-[16px] ${!loading && 'hover:bg-orange-500 hover:text-black hover:scale-105'} transition-all duration-300`}
          >
            {loading ? "sending otp..." : (state === "Sign Up" ? "Create Account" : "Login Account")}
          </button>
        ) : (
          <>
            <div className="w-full">
              <p className="mt-4">Verification Code</p>
              <input
                type="text"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                required
                className="border border-zinc-500 rounded w-full p-2 mt-1 bg-transparent"
                placeholder="Enter 6-digit code"
              />
              <p className="mt-2 text-sm text-gray-500">
                Please check your email for the verification code
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full border ${loading ? 'bg-gray-400' : 'bg-orange-400'} py-3 text-zinc-700 font-medium rounded mt-4 text-[16px] ${!loading && 'hover:bg-orange-500 hover:text-black hover:scale-105'} transition-all duration-300`}
            >
              {loading ? "Loading..." : "Verify Code"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowOTP(false);
                setOtp(""); // Clear OTP input when going back
              }}
              className="mt-2 text-sm text-primary underline cursor-pointer"
            >
              Back to Login
            </button>
          </>
        )}

        {!showOTP && (state === "Sign Up" ? (
          <p className=" mt-4 ">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className=" text-primary underline cursor-pointer"
            >
              Login Here
            </span>
          </p>
        ) : (
          <p className=" mt-4 ">
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className=" text-primary underline cursor-pointer"
            >
              Sign Up Here
            </span>
          </p>
        ))}
      </div>
    </form>
  );
};

export default Login;
