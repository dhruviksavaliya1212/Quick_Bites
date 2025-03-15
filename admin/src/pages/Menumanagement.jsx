import React, { useState } from "react";
import pizza from "../assets/pizza-pizza-filled-with-tomatoes-salami-olives.jpg";
import withAuth from "../utills/hoc/withAuth";
import { useContext } from "react";
import { AdminContext } from "../Context/AdminContext";
import { useEffect } from "react";
import axios from 'axios'

const MenuManagement = () => {

  const {backend} = useContext(AdminContext)
  const [categories, setCategories] = useState([
    { id: 1, name: "Pizza" },
    { id: 2, name: "Burgers" },
  ]);

  const [menuItems, setMenuItems] = useState(false);

  const [newItem, setNewItem] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    ingredients: "",
    status: "Available",
    category: "",
    image: null,
  });

  const [editMode, setEditMode] = useState(false);

  

  const getAllFoods = async() => {
    try {
      const {data} = await axios.post(`${backend}/api/food/all-foods`)
      console.log(data);
      if(data.success){
        setMenuItems(data.foods)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(()=>{
    getAllFoods()
  },[])

  return (
    <div className="min-h-screen lg:p-1">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Menu Management</h1>

     
      {/* Menu Items Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-bold text-[#F57C00] mb-4">Menu Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#F57C00] text-white">
                {[
                  "Image",
                  "Name",
                  "Restaurant Name",
                  "Description",
                  "Category",
                  "New Price (₹)",
                  "Old Price (₹)",
                  "Rating",
                  "Veg",
                ].map((header) => (
                  <th key={header} className="p-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {menuItems && menuItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-300 hover:bg-[#FFF8E1]"
                >
                  <td className="p-3">
                    <img
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.restoname}</td>
                  <td className="p-3 w-[20rem]">{item.desc}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">₹{item.newprice}</td>
                  <td className="p-3">₹{item.oldprice}</td>
                  <td className="p-3">{item.rating}</td>
                  <td className="p-3">{item.veg}</td>
                  {/* <td className="p-3">
                    <button
                      onClick={() => handleEditItem(item.id)}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withAuth(MenuManagement) ;
