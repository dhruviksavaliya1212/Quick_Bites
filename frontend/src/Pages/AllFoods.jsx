import React, { useContext, useEffect, useState } from "react";
import vegetarian from "../assets/vegetarian.webp";
import plus from "../assets/plus.png";
import remove from "../assets/remove.png";
import { AppContext } from "../Context/AppContext";
import axios from 'axios';

const AllFoods = () => {

  const { cart, addToCart, removeFromCart, food_list, backend } = useContext(AppContext);

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

  const [popup, setPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [filteredData, setFilteredData] = useState(false);

  const getFilteredData = async() => {
    try {
      const {data} = await axios.post(`${backend}/api/food/filtered-foods`,{category:selectedCategory, subCategory:selectedSubCategory});
      console.log(data);
      if(data.success){
        setFilteredData(data.filteredFoods);
      }
      setPopup(false)
    } catch (err) {
      
    }
  }

  const removeFilter = () => {
    setSelectedSubCategory(null);
    setSelectedCategory(null);
    setFilteredData(false);
  };

  useEffect(() => {
    
  }, [filteredData]);

  const handlePopup = () => {
    setPopup((prev) => !prev);
  };

  return (
    <div className=" pt-20 min-h-screen relative">
      <div className=" mt-2 flex gap-2">
        <button
          onClick={handlePopup}
          className=" px-5 py-1 border border-zinc-500 rounded cursor-pointer"
        >
          Filter
        </button>
        {
          filteredData && (<button onClick={removeFilter}
            className={` px-5 py-1 border border-zinc-500 rounded-full cursor-pointer`}
          >
            Remove Filter
          </button>)
        }
      </div>
      {/* Popup for Category Selection */}
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-[70%]">
            <h2 className="text-lg font-semibold mb-3">Choose Category</h2>
            <div className="flex flex-wrap gap-2">
              {Object.keys(categories).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`py-2 px-4 w-fit rounded-md border ${
                    selectedCategory === category
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Subcategories */}
            {selectedCategory && (
              <div className="mt-4">
                <h3 className="text-md font-semibold">Select Item</h3>
                <div className="flex flex-wrap  gap-2 mt-2">
                  {categories[selectedCategory].map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        setSelectedSubCategory(sub);
                      }}
                      className={`py-2 px-4 w-fit rounded-md border ${
                        selectedSubCategory === sub
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

          <div className=" mt-5 flex gap-10">
            <button onClick={()=> setPopup(false)} className="px-5 py-1 border border-red-500 rounded cursor-pointer text-red-500 hover:bg-red-500 hover:text-zinc-200 hover:transition-all hover:duration-500">Close</button>
            <button onClick={getFilteredData}  className="px-5 py-1 border border-green-500 rounded cursor-pointer text-green-500 hover:bg-green-500 hover:text-zinc-200 hover:transition-all hover:duration-500">Filter</button>
          </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center flex-col mb-20 w-[70rem]">
        <div className="  mt-10 w-full lg:w-[90%] xl:w-[80%]">
          {(filteredData || food_list).map((item, index) => (
            <div key={index}>
              <div className=" my-5 flex flex-col sm:flex-row items-center justify-start gap-5 lg:gap-10 ">
                <div className=" relative">
                  <img
                    src={item.image}
                    alt=""
                    className="min-w-52 max-w-52 h-48 rounded bg-gradient-to-t from-slate-500 to-slate-900"
                  />
                  {!cart[item._id] ? (
                    <div className="w-full flex justify-center -mt-6">
                      <button
                        onClick={() => addToCart(item._id)}
                        className=" w-[65%] border bg-orange-500 py-1 text-zinc-100 font-medium rounded text-[16px] hover:bg-orange-600 hover:text-black hover:scale-105 transition-all duration-300"
                      >
                        Add To Cart
                      </button>
                    </div>
                  ) : (
                    <div className=" w-32 h-fit bg-white shadow shadow-zinc-700 absolute -bottom-3 left-10 rounded flex items-center justify-between p-1">
                      <img
                        onClick={() => addToCart(item._id)}
                        src={plus}
                        alt=""
                        className=" w-6 cursor-pointer hover:scale-110 transition-all duration-500 "
                      />
                      <p className=" text-xl text-[#38913b] font-semibold">
                        {cart[item._id]}
                      </p>
                      <img
                        onClick={() => removeFromCart(item._id)}
                        src={remove}
                        alt=""
                        className=" w-6 cursor-pointer hover:scale-110 transition-all duration-500"
                      />
                    </div>
                  )}
                </div>
                <div className=" max-md:ml-5 max-sm:mt-5">
                  <div className=" flex gap-2 items-center ">
                    <img src={vegetarian} alt="" className="w-5" />
                    <p className=" text-md text-red-700 font-semibold">
                      {item.bestSeller === true && "Best Seller"}
                    </p>
                  </div>
                  <p className=" text-xl font-bold text-zinc-900">
                    {item.name}
                  </p>
                  <p className=" text-md font-semibold text-zinc-900 -mt-1">
                    {item.restoname}
                  </p>
                  <div className=" mt-1 flex gap-3 item-center">
                    <p className=" line-through font-semibold text-zinc-500">
                      <span>₹</span>
                      {item.oldprice}
                    </p>
                    <p className=" font-semibold text-zinc-900">
                      <span>₹</span>
                      {item.newprice}
                    </p>
                  </div>
                  <div className=" flex items-center my-3">
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
                    <p className=" text-green-700 font-semibold ml-1">
                      {item.rating}
                    </p>
                  </div>
                  <p className=" text-md font-normal text-zinc-800 w-full pr-10">
                    {item.desc}
                  </p>
                </div>
              </div>
              <hr className=" w-[90%] border border-zinc-600 m-auto mt-10 outline-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllFoods;
