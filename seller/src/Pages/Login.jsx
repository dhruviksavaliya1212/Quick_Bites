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

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    let url = backend;
    if(state === "Sign Up"){
      url += '/api/seller/register'
    } else {
      url += '/api/seller/login'
    }
    const {data} = await axios.post(url,{name,email,password})

    if(data.success){
      toast.success(data.message)
      setStoken(data.token)
      localStorage.setItem("seller-token", data.token);
      navigate('/')
    } else {
      toast.error(data.message)
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className=" flex items-center py-10">
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
        <button
          type="submit"
          className=" w-full border bg-orange-400 py-3 text-zinc-700 font-medium rounded mt-4 text-[16px] hover:bg-orange-500 hover:text-black hover:scale-105 transition-all duration-300"
        >
          {state === "Sign Up" ? "Create Account" : "Login Account"}
        </button>

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
