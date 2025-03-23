import React, { useContext, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { AppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, backend, setToken } = useContext(AppContext);

  const [state, setState] = useState("Login"); // "Sign Up", "Login", "Forget Password", "Reset Password"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [otpId, setOtpId] = useState(null); // Store OTP ID from backend
  const [otp, setOtp] = useState(""); // User-entered OTP
  const [showOtpModal, setShowOtpModal] = useState(false); // Toggle OTP UI
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Handle initial form submission (register/login/forget password/reset password)
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let url = backend;
    let payload = {};

    if (state === "Sign Up") {
      url += "/api/user/register";
      payload = { name, email, password };
    } else if (state === "Login") {
      url += "/api/user/login";
      payload = { email, password };
    } else if (state === "Forget Password") {
      url += "/api/user/forget-password";
      payload = { email };
    } else if (state === "Reset Password") {
      url += "/api/user/verify-otp-forget-password";
      payload = { otpId, verificationCode: otp, newPassword, cPassword: confirmPassword };
    }

    try {
      const { data } = await axios.post(url, payload);
      console.log(data)
      if (data.success) {
        if (state === "Forget Password") {
          setOtpId(data.otpId);
          setShowOtpModal(true);
          setState("Reset Password"); // Move to reset password after OTP is sent
          toast.success(data.message);
        } else if (state === "Reset Password") {
          toast.success(data.message);
          setShowOtpModal(false);
          setState("Login"); // Return to login after successful reset
          setEmail("");
          setNewPassword("");
          setConfirmPassword("");
          setOtp("");
        } else {
          setOtpId(data.otpId);
          setShowOtpModal(true);
          toast.success(data.message);
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err)
      toast.error(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification for login
  const onOtpSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${backend}/api/user/verify-otp-login`, {
        otpId,
        verificationcode: otp,
      });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem("user-token", data.token);
        toast.success(data.message);
        setShowOtpModal(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Google login handler
  const handleGoogleLogin = async (authResult) => {
    try {
      if (authResult["code"]) {
        await handleLogin(authResult["code"]);
      }
    } catch (err) {
      toast.error("Something went wrong with Google login");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: handleGoogleLogin,
    flow: "auth-code",
  });

  return (
    <div className="flex items-center justify-center min-h-screen py-5">
      {/* Main Form */}
      {!showOtpModal ? (
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg shadow-zinc-500 bg-white"
        >
          <p className="text-2xl font-semibold">
            {state === "Sign Up"
              ? "Create Account"
              : state === "Forget Password"
              ? "Forget Password"
              : "Login"}
          </p>
          <p className="mt-4">
            {state === "Sign Up"
              ? "Please sign up to place an order"
              : state === "Forget Password"
              ? "Enter your email to reset your password"
              : "Please login to place an order"}
          </p>

          {state === "Sign Up" && (
            <div className="w-full">
              <p className="mt-4">Full Name</p>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                className="border border-zinc-500 rounded w-full p-2 mt-1 bg-transparent"
              />
            </div>
          )}
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
          {state !== "Forget Password" && (
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
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full border py-3 text-zinc-700 font-medium rounded mt-4 text-[16px] transition-all duration-300 ${
              isLoading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-400 hover:bg-orange-500 hover:text-black hover:scale-105"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-zinc-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                  />
                </svg>
                Sending OTP...
              </span>
            ) : state === "Sign Up" ? (
              "Create Account with Email"
            ) : state === "Forget Password" ? (
              "Send Reset OTP"
            ) : (
              "Login with Email"
            )}
          </button>

          {(state === "Login" || state === "Sign Up") && (
            <>
              <p className="text-center font-bold w-full">or</p>
              <div
                onClick={state === "Login" ? googleLogin : null} // Only clickable in Login state
                className={`w-full border flex items-center justify-center gap-5 bg-white py-2 text-zinc-700 font-medium rounded mt-4 text-[16px] transition-all duration-300 ${
                  state === "Sign Up"
                    ? "cursor-not-allowed opacity-[70%]"
                    : "hover:text-black hover:scale-105 cursor-pointer"
                }`}
              >
                <img src={assets.google} alt="Google" className="w-8" />
                <p>Continue with Google</p>
              </div>
            </>
          )}

          {state === "Sign Up" ? (
            <p className="mt-4">
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-orange-500 underline cursor-pointer"
              >
                Login Here
              </span>
            </p>
          ) : state === "Login" ? (
            <>
              <p className="mt-4">
                Don’t have an account?{" "}
                <span
                  onClick={() => setState("Sign Up")}
                  className="text-orange-500 underline cursor-pointer"
                >
                  Sign Up Here
                </span>
              </p>
              <p className="mt-2">
                Forgot your password?{" "}
                <span
                  onClick={() => setState("Forget Password")}
                  className="text-orange-500 underline cursor-pointer"
                >
                  Reset Here
                </span>
              </p>
            </>
          ) : (
            <p className="mt-4">
              Back to{" "}
              <span
                onClick={() => setState("Login")}
                className="text-orange-500 underline cursor-pointer"
              >
                Login
              </span>
            </p>
          )}
        </form>
      ) : state === "Reset Password" ? (
        /* Reset Password OTP Verification Form */
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg shadow-zinc-500 bg-white"
        >
          <p className="text-2xl font-semibold">Reset Password</p>
          <p className="mt-4">
            Enter the OTP sent to <span className="font-medium">{email}</span> and your new password
          </p>
          <div className="w-full">
            <p className="mt-4">OTP Code</p>
            <input
              type="text"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              required
              maxLength="6"
              className="border border-zinc-500 rounded w-full p-2 mt-1 bg-transparent text-center text-lg tracking-widest"
              placeholder="Enter 6-digit OTP"
            />
          </div>
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
            <p className="mt-4">Confirm New Password</p>
            <input
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
              className="border border-zinc-500 rounded w-full p-2 mt-1 bg-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full border py-3 text-zinc-700 font-medium rounded mt-4 text-[16px] transition-all duration-300 ${
              isLoading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-400 hover:bg-orange-500 hover:text-black hover:scale-105"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-zinc-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                  />
                </svg>
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
          <p className="mt-4 text-center w-full">
            Didn’t receive an OTP?{" "}
            <span
              onClick={() => {
                setShowOtpModal(false);
                setOtp("");
                setState("Forget Password");
                onSubmitHandler({ preventDefault: () => {} }); // Resend OTP
              }}
              className="text-orange-500 underline cursor-pointer"
            >
              Resend
            </span>
          </p>
        </form>
      ) : (
        /* Login OTP Verification Form */
        <form
          onSubmit={onOtpSubmitHandler}
          className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg shadow-zinc-500 bg-white"
        >
          <p className="text-2xl font-semibold">Verify OTP</p>
          <p className="mt-4">
            Please enter the OTP sent to <span className="font-medium">{email}</span>
          </p>
          <div className="w-full">
            <p className="mt-4">OTP Code</p>
            <input
              type="text"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              required
              maxLength="6"
              className="border border-zinc-500 rounded w-full p-2 mt-1 bg-transparent text-center text-lg tracking-widest"
              placeholder="Enter 6-digit OTP"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full border py-3 text-zinc-700 font-medium rounded mt-4 text-[16px] transition-all duration-300 ${
              isLoading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-400 hover:bg-orange-500 hover:text-black hover:scale-105"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-zinc-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                  />
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify OTP"
            )}
          </button>
          <p className="mt-4 text-center w-full">
            Didn’t receive an OTP?{" "}
            <span
              onClick={() => {
                setShowOtpModal(false);
                setOtp("");
                onSubmitHandler({ preventDefault: () => {} }); // Resend OTP
              }}
              className="text-orange-500 underline cursor-pointer"
            >
              Resend
            </span>
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;
