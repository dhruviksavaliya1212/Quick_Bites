import React, { useContext, useState } from "react";
import { useGoogleLogin, GoogleLogin } from "@react-oauth/google";
import { AppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const {handleLogin, backend, setToken} = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    let url = backend;
    if(state === "Sign Up"){
      url += '/api/user/register'
    } else {
      url += '/api/user/login'
    }
    const {data} = await axios.post(url,{name,email,password})

    if(data.success){
      toast.success(data.message)
      setToken(data.token)
      localStorage.setItem("user-token", data.token);
      navigate('/')
    } else {
      toast.error(data.message)
    }
  };

  const handleGoogleLogin = async (authResult) => {
    try {
      if (authResult['code']){
        handleLogin(authResult['code'])
      }
    } catch (err) {
      toast.error("Something went wrong")
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: handleGoogleLogin,
    flow: "auth-code",
  });

  return (
    <form onSubmit={onSubmitHandler} className=" flex items-center py-28">
      <div className=" flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg shadow-zinc-500 bg-gradient-to-b from-orange-100 to-orange-200">
        <p className=" text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login Account"}
        </p>
        <p className="mt-4">
          Please {state === "Sign Up" ? " sign up" : "login"} to book
          appointment
        </p>
        {state === "Sign Up" && (
          <div className=" w-full">
            <p className=" mt-4">Full Name</p>
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
        <button
          type="submit"
          className=" w-full border bg-orange-400 py-3 text-zinc-700 font-medium rounded mt-4 text-[16px] hover:bg-orange-500 hover:text-black hover:scale-105 transition-all duration-300"
        >
          {state === "Sign Up" ? "Create Account" : "Login Account"}
        </button>

        <div onClick={googleLogin} className="w-full border flex items-center justify-center gap-5 bg-white py-1 text-zinc-700 font-medium rounded mt-4 text-[16px] hover:text-black hover:scale-105 transition-all duration-300 cursor-pointer">
          <img src={assets.google} alt="" className="w-8" />
          <p>Continue with Google</p>
        </div>

        {state === "Sign Up" ? (
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
        )}
      </div>
    </form>
  );
};

export default Login;
