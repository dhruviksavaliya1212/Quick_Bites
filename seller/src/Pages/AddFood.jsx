import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { SellerContext } from "../Context/SellerContext";

import { useNavigate } from "react-router-dom";

const AddFood = () => {
  const { backend, stoken } = useContext(SellerContext);

  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const [img, setImg] = useState(false);
  const [name, setName] = useState("");
  const [oldprice, setOldprice] = useState("");
  const [newprice, setNewprice] = useState("");
  const [desc, setDesc] = useState("");
  const [veg, setVeg] = useState("yes");
  const [category, setCategory] = useState("Fast Food");
  const [subCategory, setSubCategory] = useState("Pizza");

  const categories = {
    "Fast Food": ["Burger", "Pizza", "Fries", "Chicken Wings", "Tacos", "Hot Dogs", "Pav Bhaji", "Rolls"],
    "South Indian": ["Idli", "Dosa", "Vada", "Uttapam", "Sambar", "Rasam", "Biryani (South Style)"],
    "North Indian": ["Paneer Butter Masala", "Dal Makhani", "Butter Chicken", "Naan", "Chole Bhature", "Rajma Chawal", "Paratha", "Khichdi", "Paneer Items"],
    "Rajasthani": ["Dal Baati Churma", "Gatte ki Sabzi", "Ker Sangri", "Laal Maas", "Mirchi Bada"],
    "Chinese": ["Noodles", "Manchurian", "Spring Roll", "Fried Rice", "Dim Sum", "Schezwan Dishes"],
    "Beverages": ["Tea", "Coffee", "Juice", "Lassi", "Smoothies", "Milkshakes"],
    "Desserts": ["Ice Cream", "Gulab Jamun", "Rasgulla", "Jalebi", "Kheer", "Halwa"],
    "Gujarati": ["Dhokla", "Thepla", "Khandvi", "Undhiyu", "Fafda Jalebi"],
    "Punjabi": ["Sarson da Saag", "Makki di Roti", "Chole", "Rajma", "Lassi", "Paratha"],
    "Italian": ["Pasta", "Lasagna", "Risotto", "Garlic Bread", "Calzone"],
    "Mexican": ["Burritos", "Quesadillas", "Nachos", "Enchiladas", "Tostadas"],
    "Bakery": ["Bread", "Cake", "Pastries", "Cookies", "Muffins"],
    "Continental":["Pasta", "Salad"]
  };

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
      formData.append("oldprice", oldprice);
      formData.append("newprice", newprice);
      formData.append("desc", desc);
      formData.append("veg", veg);
      formData.append("category", category);
      formData.append("subCategory", subCategory);

      // console.log;
      formData.forEach((value, key) => {
        console.log(`${key} : ${value}`);
      });

      const { data } = await axios.post(
        `${backend}/api/food/add-food`,
        formData,
        { headers: { Authorization: `Bearer ${stoken}` } } 
      );

      console.log(data);

      if (data.success) {
        toast.success(data.message);
        setImg(false);
        setName("");
        setOldprice("");
        setNewprice("");
        setDesc("");
        // setVeg("");
        // setCategory("");
        // restaurantIsAvailable(stoken);
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
    <div className=" w-full h-screen px-2 sm:px-5">
      <div className="w-full flex justify-center ">
        <p className="mt-5 mb-3 text-xl font-medium  w-full md:w-[95%]  max-w-6xl">
          Add Food
        </p>
      </div>
      <form
        onSubmit={onSubmitHandler}
        className=" w-full h-[90vh] flex flex-col items-center justify-center  "
      >
        <div className=" bg-orange-50 shadow-inner shadow-zinc-700 sm:px-8 px-5 py-8 border max-h-[90vh] rounded w-full md:w-[95%] max-w-6xl overflow-y-scroll">
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
              Upload Food <br /> picture
            </p>
          </div>
          <div className=" flex flex-col lg:flex-row items-start gap-10 text-gray-600">
            <div className=" w-full lg:flex-1 flex flex-col gap-4">
              <div className=" flex-1 flex flex-col gap-1">
                <p>Food Name</p>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Enter Name"
                  required
                  className=" bg-white shadow-inner shadow-zinc-500 outline-none rounded px-3 py-2"
                />
              </div>
              <div className=" flex-1 flex flex-col gap-1">
                <p>Food old price</p>
                <input
                  onChange={(e) => setOldprice(e.target.value)}
                  value={oldprice}
                  type="number"
                  placeholder="Enter Old Price"
                  required
                  className=" shadow-inner shadow-zinc-500 outline-none rounded px-3 py-2"
                />
              </div>
              <div className=" flex-1 flex flex-col gap-1">
                <p>Food New Price</p>
                <input
                  onChange={(e) => setNewprice(e.target.value)}
                  value={newprice}
                  type="number"
                  placeholder="Enter New Price"
                  required
                  className=" outline-none shadow-inner shadow-zinc-500 rounded px-3 py-2"
                />
              </div>
              <div>
                <p className=" mt-4 mb-2">Food Description</p>
                <textarea
                  onChange={(e) => setDesc(e.target.value)}
                  value={desc}
                  rows="5"
                  placeholder="Enter Description"
                  required
                  className="w-full outline-none px-4 pt-2 shadow-inner shadow-zinc-500 rounded"
                ></textarea>
              </div>
            </div>
            <div className=" w-full lg:flex-1 flex flex-col gap-4">
              <div className=" flex-1 flex flex-col gap-1">
                <p>Food is Veg or Non-veg</p>
                <select
                  onChange={(e) => setVeg(e.target.value)}
                  value={veg}
                  className="w-full outline-none px-4 py-2 shadow-inner shadow-zinc-500 rounded"
                >
                  <option value="yes">Veg</option>
                  <option value="no">Non-veg</option>
                </select>
              </div>
              <div className=" flex-1 flex flex-col gap-1">
                <p>Food Category</p>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  className="w-full outline-none px-4 py-2 shadow-inner shadow-zinc-500 rounded"
                >
                  {Object.keys(categories).map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
                </select>
              </div>
              <div className=" flex-1 flex flex-col gap-1">
                <p>Food Sub Category</p>
                <select
                  onChange={(e) => setSubCategory(e.target.value)}
                  value={subCategory}
                  className="w-full outline-none px-4 py-2 shadow-inner shadow-zinc-500 rounded"
                >
                  {categories[category].map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
                </select>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className=" bg-orange-500 shadow-md shadow-zinc-700 px-10 py-3 mt-4 text-white rounded-full hover:bg-orange-600 hover:scale-105 transition-all duration-300"
          >
            Add Food
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFood;
