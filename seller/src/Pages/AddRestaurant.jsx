import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { SellerContext } from "../Context/SellerContext";

import { useNavigate } from "react-router-dom";

const AddRestaurant = () => {
  const { backend, stoken, restaurantIsAvailable } = useContext(SellerContext);

  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const [img, setImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [desc, setDesc] = useState("");
  const [phone, setPhone] = useState("");
  const [deliverytime, setDeliveryTime] = useState("20-25 min");
  const [timing, setTiming] = useState("10AM - 9AM");
  const [address, setAddress] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoader(true);

    // Call Add Doctor API
    try {
      if (!img) {
        return toast.error("Image Not Selected");
      }

      const formData = new FormData();

      formData.append("image", img);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("desc", desc);
      formData.append("phone", phone);
      formData.append("deliverytime", deliverytime);
      formData.append("timing", timing);
      formData.append("address", address);

      // console.log;
      // formData.forEach((value, key) => {
      //   console.log(`${key} : ${value}`);
      // });

      const { data } = await axios.post(
        `${backend}/api/restaurant/add-restaurant`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${stoken}`, // Use Bearer token format
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Ensure cookies are sent if needed
        }
      );
      

      console.log(data);

      if (data.success) {
        toast.success(data.message);
        setImg(false);
        setName("");
        setEmail("");
        setDesc("");
        setPhone("");
        setDeliveryTime("");
        setTiming("");
        setAddress("");
        restaurantIsAvailable(stoken);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
    setLoader(false);
  };

  return loader ? (
    <div class=" absolute top-0 right-0 flex-col gap-4 w-full h-screen flex items-center justify-center bg-transparent">
      <div class="w-20 h-20 border-[5px] border-transparent text-primary text-6xl animate-spin flex items-center justify-center border-t-primary rounded-full">
        <div class="w-16 h-16 border-[5px] border-transparent text-red-600 text-4xl animate-spin flex items-center justify-center border-t-red-500 rounded-full">
          <div class="w-[2px] h-10 border-[5px] border-transparent text-red-600 text-4xl animate-pulse flex items-center justify-center bg-indigo-900 rounded-full"></div>
        </div>
      </div>
    </div>
  ) : (
    <div className=" w-full h-screen  bg-orange-50 py-5">
      <div className="w-full flex justify-center">
        <p className="my-3 text-xl font-medium w-full md:w-[80%] sm:px-8 px-5  max-w-6xl">
          Send request for add Restuarant
        </p>
      </div>
      <form
        onSubmit={onSubmitHandler}
        className=" w-full flex flex-col items-center justify-center px-3 sm:px-10 "
      >
        <div className=" bg-zinc-100 shadow-inner shadow-zinc-700 sm:px-8 px-5 py-8 border max-h-[85vh] rounded w-full md:w-[80%] max-w-6xl overflow-y-scroll">
          <div className=" flex items-center gap-5 text-zinc-700 mb-8">
            <label htmlFor="img">
              <img
                src={img ? URL.createObjectURL(img) : assets.upload_area}
                alt=""
                className=" w-20 bg-gray-100 border border-zinc-800 rounded-full cursor-pointer"
              />
            </label>
            <input
              onChange={(e) => setImg(e.target.files[0])}
              type="file"
              id="img"
              hidden
            />
            <p>
              Upload Restuarant <br /> picture
            </p>
          </div>
          <div className=" flex flex-col lg:flex-row items-start gap-10 text-gray-600">
            <div className=" w-full lg:flex-1 flex flex-col gap-4">
              <div className=" flex-1 flex flex-col gap-1">
                <p>Restuarant Name</p>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Enter Name"
                  required
                  className=" shadow-inner shadow-zinc-500 outline-none rounded px-3 py-2"
                />
              </div>
              <div className=" flex-1 flex flex-col gap-1">
                <p>Restuarant Email</p>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Enter Email"
                  required
                  className=" shadow-inner shadow-zinc-500 outline-none rounded px-3 py-2"
                />
              </div>
              <div className=" flex-1 flex flex-col gap-1">
                <p>Restuarant Contact No</p>
                <input
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  type="text"
                  placeholder="Enter Contact no"
                  required
                  className=" outline-none shadow-inner shadow-zinc-500 rounded px-3 py-2"
                />
              </div>
              <div>
                <p className=" mt-4 mb-2">Restuarant Address</p>
                <textarea
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  rows="5"
                  placeholder="Enter Address"
                  className="w-full outline-none px-4 pt-2 shadow-inner shadow-zinc-500 rounded"
                ></textarea>
              </div>
            </div>
            <div className=" w-full lg:flex-1 flex flex-col gap-4">
              <div className=" flex-1 flex flex-col gap-1">
                <p>Restuarant Timing</p>
                <input
                  onChange={(e) => setTiming(e.target.value)}
                  value={timing}
                  type="text"
                  placeholder="Enter Timing"
                  required
                  className="outline-none shadow-inner shadow-zinc-500 rounded px-3 py-2"
                />
              </div>
              <div className=" flex-1 flex flex-col gap-1">
                <p>Restuarant Delivery Time</p>
                <input
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  value={deliverytime}
                  type="text"
                  placeholder="Enter Delivery Time"
                  required
                  className="outline-none shadow-inner shadow-zinc-500 rounded px-3 py-2"
                />
              </div>
            </div>
          </div>
          <div>
            <p className=" mt-4 mb-2">Restuarant Description</p>
            <textarea
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
              rows="5"
              placeholder="Enter Description"
              className="w-full outline-none px-4 pt-2 shadow-inner shadow-zinc-500 rounded"
            ></textarea>
          </div>
          <button
            type="submit"
            className=" bg-orange-500 shadow-md shadow-zinc-700 px-10 py-3 mt-4 text-white rounded-full hover:bg-orange-600 hover:scale-105 transition-all duration-300"
          >
            Send Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRestaurant;
