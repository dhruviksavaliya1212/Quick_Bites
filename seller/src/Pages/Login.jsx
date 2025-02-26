import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { SellerContext } from "../Context/SellerContext";

const Login = () => {
  const navigate = useNavigate();
  const { backend, setStoken } = useContext(SellerContext);

  // State variables
  const [state, setState] = useState("Login"); // "Sign Up", "Login", "Forgot Password", "Verify OTP", "Reset Password"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpId, setOtpId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let url = backend;
    let payload = {};

    if (state === "Sign Up") {
      url += "/api/seller/register";
      payload = { name, email, password };
    } else if (state === "Login") {
      url += "/api/seller/login";
      payload = { email, password };
    } else if (state === "Forgot Password") {
      url += "/api/seller/forget-password";
      payload = { email };
    } else if (state === "Verify OTP") {
      url += "/api/seller/verify-otp-login";
      payload = { otpId, verificationcode: otp };
    } else if (state === "Reset Password") {
      url += "/api/seller/verify-otp-forget-password";
      payload = { otpId, verificationCode: otp, newPassword, cPassword: confirmPassword };
    }

    try {
      const { data } = await axios.post(url, payload);
      if (data.success) {
        toast.success(data.message);
        if (state === "Sign Up") {
          setState("Login"); // Back to login after signup
        } else if (state === "Login" && data.otpId) {
          setOtpId(data.otpId);
          setState("Verify OTP"); // Show OTP for login
        } else if (state === "Forgot Password") {
          setOtpId(data.otpId);
          setState("Reset Password"); // Show OTP and password reset
        } else if (state === "Verify OTP") {
          setStoken(data.token);
          localStorage.setItem("seller-token", data.token);
          navigate("/"); // Login complete
        } else if (state === "Reset Password") {
          setState("Login"); // Back to login after reset
          setOtp("");
          setNewPassword("");
          setConfirmPassword(""); // Clear confirm password
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center py-10">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg shadow-zinc-500 bg-gradient-to-b from-orange-100 to-orange-200">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : state === "Forgot Password" || state === "Reset Password" ? "Reset Password" : "Login Account"}
        </p>
        <p className="mt-1">
          Please {state === "Sign Up" ? "sign up" : state === "Forgot Password" || state === "Reset Password" ? "reset your password" : "login"} to access your dashboard
        </p>

        {/* Name field for Sign Up */}
        {state === "Sign Up" && (
          <div className="w-full">
            <p className="mt-2">Full Name</p>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              className="border border-zinc-500 rounded w-full p-2 mt-1 bg-transparent"
            />
          </div>
        )}

        {/* Email field for Login, Sign Up, and Forgot Password */}
        {(state === "Login" || state === "Sign Up" || state === "Forgot Password") && (
          <div className="w-full">
            <p className="mt-4">Email</p>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="border border-zinc-500 rounded w-full p-2 mt-1 bg-transparent"
            />
          </div>
        )}

        {/* Password field for Login and Sign Up */}
        {(state === "Login" || state === "Sign Up") && (
          <div className="w-full">
            <p className="mt-4">Password</p>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className="border border-zinc-500 rounded w-full p-2 mt-1 bg-transparent"
            />
          </div>
        )}

        {/* OTP field for Verify OTP and Reset Password */}
        {(state === "Verify OTP" || state === "Reset Password") && (
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
          </>
        )}

        {/* New Password and Confirm Password fields for Reset Password */}
        {state === "Reset Password" && (
          <>
            <div className="w-full">
              <p className="mt-4">New Password</p>
              <input
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
                className="border border-zinc-500 rounded w-full p-2 mt-1 bg-transparent"
              />
            </div>
            <div className="w-full">
              <p className="mt-4">Confirm Password</p>
              <input
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
                className="border border-zinc-500 rounded w-full p-2 mt-1 bg-transparent"
              />
            </div>
          </>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full border bg-orange-400 py-3 text-zinc-700 font-medium rounded mt-4 text-[16px] ${!loading && 'hover:bg-orange-500 hover:text-black hover:scale-105'} transition-all duration-300`}
        >
          {loading ? "Working on..." : state === "Sign Up" ? "Create Account" : state === "Forgot Password" ? "Send OTP" : state === "Reset Password" ? "Reset Password" : state === "Verify OTP" ? "Verify Code" : "Login Account"}
        </button>

        {/* Navigation links */}
        {(state === "Login" || state === "Sign Up") && (
          <p className="mt-4">
            {state === "Sign Up" ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
              className="text-primary underline cursor-pointer"
            >
              {state === "Sign Up" ? "Login Here" : "Sign Up Here"}
            </span>
          </p>
        )}
        {state === "Login" && (
          <p className="mt-2">
            Forgot Password?
            <span
              onClick={() => setState("Forgot Password")}
              className="text-primary underline cursor-pointer"
            >
              Reset Here
            </span>
          </p>
        )}
        {(state === "Forgot Password" || state === "Verify OTP" || state === "Reset Password") && (
          <button
            type="button"
            onClick={() => {
              setState("Login");
              setOtp("");
              setNewPassword("");
              setConfirmPassword(""); // Clear confirm password
            }}
            className="mt-2 text-sm text-primary underline cursor-pointer"
          >
            Back to Login
          </button>
        )}
      </div>
    </form>
  );
};

export default Login;
