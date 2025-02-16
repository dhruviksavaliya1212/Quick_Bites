import React, { useState } from "react";
import pizza from "../assets/pizza-pizza-filled-with-tomatoes-salami-olives.jpg";
import withAuth from "../utills/hoc/withAuth";

const MenuManagement = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Pizza" },
    { id: 2, name: "Burgers" },
  ]);

  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Cheese Pizza",
      description: "Classic cheese pizza with mozzarella.",
      price: 200,
      ingredients: ["Cheese", "Tomato Sauce", "Dough"],
      status: "Available",
      category: "Pizza",
      image: pizza,
    },
  ]);

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

  // Add new item
  const handleAddItem = () => {
    if (newItem.name && newItem.description && newItem.price && newItem.category) {
      setMenuItems((prevItems) => [
        ...prevItems,
        {
          ...newItem,
          id: menuItems.length + 1,
          ingredients: newItem.ingredients.split(","),
        },
      ]);
      resetNewItem();
    } else {
      alert("Please fill all fields before adding an item.");
    }
  };

  // Edit item
  const handleEditItem = (id) => {
    const itemToEdit = menuItems.find((item) => item.id === id);
    setNewItem({ ...itemToEdit, ingredients: itemToEdit.ingredients.join(",") });
    setEditMode(true);
  };

  // Save edits
  const handleSaveEdit = () => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === newItem.id
          ? { ...newItem, ingredients: newItem.ingredients.split(",") }
          : item
      )
    );
    resetNewItem();
    setEditMode(false);
  };

  // Delete item
  const handleDeleteItem = (id) => {
    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Reset new item state
  const resetNewItem = () => {
    setNewItem({
      id: null,
      name: "",
      description: "",
      price: "",
      ingredients: "",
      status: "Available",
      category: "",
      image: null,
    });
  };

  return (
    <div className="min-h-screen lg:p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Menu Management</h1>

      {/* Add/Edit Item Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-lg font-bold text-[#F97316] mb-4">{editMode ? "Edit Item" : "Edit Item"}</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Item Name", value: newItem.name, key: "name", type: "text" },
            { label: "Description", value: newItem.description, key: "description", type: "text" },
            { label: "Price", value: newItem.price, key: "price", type: "number" },
            { label: "Ingredients", value: newItem.ingredients, key: "ingredients", type: "text", placeholder: "Comma separated" },
          ].map(({ label, value, key, type, placeholder = "" }) => (
            <React.Fragment key={key}>
              <label className="block text-gray-600">{label}</label>
              <input
                type={type}
                placeholder={placeholder || label}
                value={value}
                onChange={(e) => setNewItem({ ...newItem, [key]: e.target.value })}
                className="border rounded-md p-2"
              />
            </React.Fragment>
          ))}

          <label className="block text-gray-600">Category</label>
          <select
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            className="border rounded-md p-2"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <label className="block text-gray-600">Status</label>
          <select
            value={newItem.status}
            onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
            className="border rounded-md p-2"
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>

          <label className="block text-gray-600">Image</label>
          <input
            type="file"
            onChange={(e) =>
              setNewItem({ ...newItem, image: URL.createObjectURL(e.target.files[0]) })
            }
            className="border rounded-md p-2"
          />

          <button
            onClick={editMode ? handleSaveEdit : handleAddItem}
            className="bg-[#F97316] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#ff9730] transition-all col-span-2"
          >
            {editMode ? "Save Changes" : "Edit Item"}
          </button>
        </div>
      </div>

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
                  "Description",
                  "Category",
                  "Price (₹)",
                  "Ingredients",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <th key={header} className="p-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
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
                  <td className="p-3">{item.description}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">₹{item.price}</td>
                  <td className="p-3">{item.ingredients.join(", ")}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        item.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3">
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
                  </td>
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
