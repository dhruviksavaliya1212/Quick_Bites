import React, { useState } from "react";
import pizza from '../assets/pizza-pizza-filled-with-tomatoes-salami-olives.jpg';

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
      image: `${pizza}`, // Placeholder
    },
  ]);

  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
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

  // Add new category
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const updatedCategories = [
        ...categories,
        { id: categories.length + 1, name: newCategory.trim() },
      ];
      setCategories(updatedCategories);
      setNewCategory("");
    } else {
      alert("Category name cannot be empty.");
    }
  };

  // Delete category and associated items
  const handleDeleteCategory = (id) => {
    const categoryToDelete = categories.find((category) => category.id === id);
    const updatedCategories = categories.filter((category) => category.id !== id);
    const updatedMenuItems = menuItems.filter(
      (item) => item.category !== categoryToDelete.name
    );

    setCategories(updatedCategories);
    setMenuItems(updatedMenuItems);
  };

  // Start editing category
  const handleEditCategory = (id) => {
    const categoryToEdit = categories.find((category) => category.id === id);
    setEditingCategory(categoryToEdit);
    setEditingCategoryName(categoryToEdit.name);
  };

  // Save category edits
  const handleSaveCategoryEdit = () => {
    const updatedCategories = categories.map((category) =>
      category.id === editingCategory.id
        ? { ...category, name: editingCategoryName }
        : category
    );

    const updatedMenuItems = menuItems.map((item) =>
      item.category === editingCategory.name
        ? { ...item, category: editingCategoryName }
        : item
    );

    setCategories(updatedCategories);
    setMenuItems(updatedMenuItems);
    setEditingCategory(null);
    setEditingCategoryName("");
  };

  // Add new item
  const handleAddItem = () => {
    if (
      newItem.name &&
      newItem.description &&
      newItem.price &&
      newItem.category
    ) {
      const updatedItems = [
        ...menuItems,
        {
          ...newItem,
          id: menuItems.length + 1,
          ingredients: newItem.ingredients.split(","),
        },
      ];
      setMenuItems(updatedItems);
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
    } else {
      alert("Please fill all fields before adding an item.");
    }
  };

  // Edit item
  const handleEditItem = (id) => {
    const itemToEdit = menuItems.find((item) => item.id === id);
    setNewItem({
      ...itemToEdit,
      ingredients: itemToEdit.ingredients.join(","),
    });
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    const updatedItems = menuItems.map((item) =>
      item.id === newItem.id
        ? { ...newItem, ingredients: newItem.ingredients.split(",") }
        : item
    );
    setMenuItems(updatedItems);
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
    setEditMode(false);
  };

  // Delete item
  const handleDeleteItem = (id) => {
    const updatedItems = menuItems.filter((item) => item.id !== id);
    setMenuItems(updatedItems);
  };

  return (
    <div className="min-h-screen p-1">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Menu Management</h1>

      {/* Category Management */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
  <h2 className="text-lg font-bold text-[#F97316] mb-4">
    Manage Categories
  </h2>
  <div className="flex flex-col sm:flex-row sm:gap-4 mb-4">
    <label className="block text-gray-600">New Category Name</label>
    <input
      type="text"
      placeholder="New Category Name"
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
      className="border rounded-md p-2 flex-grow mb-2 sm:mb-0"
    />
    <button
      onClick={handleAddCategory}
      className="bg-[#F97316] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#ff9730] transition-all sm:w-auto w-full"
    >
      Add Category
    </button>
  </div>
  <ul className="list-disc list-inside">
    {categories.map((category) => (
      <li key={category.id} className="text-gray-600 flex justify-between">
        <span>{category.name}</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleEditCategory(category.id)}
            className="text-blue-500 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteCategory(category.id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </li>
    ))}
  </ul>
  {editingCategory && (
    <div className="mt-4">
      <input
        type="text"
        value={editingCategoryName}
        onChange={(e) => setEditingCategoryName(e.target.value)}
        className="border rounded-md p-2 flex-grow"
      />
      <button
        onClick={handleSaveCategoryEdit}
        className="bg-[#F97316] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#ff9730] transition-all ml-2"
      >
        Save
      </button>
    </div>
  )}
</div>


      {/* Add New Item */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-lg font-bold text-[#F97316] mb-4">Add New Item</h2>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-gray-600">Item Name</label>
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="border rounded-md p-2"
          />

          <label className="block text-gray-600">Description</label>
          <input
            type="text"
            placeholder="Description"
            value={newItem.description}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
            className="border rounded-md p-2"
          />

          <label className="block text-gray-600">Price</label>
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            className="border rounded-md p-2"
          />

          <label className="block text-gray-600">Ingredients</label>
          <input
            type="text"
            placeholder="Ingredients (comma separated)"
            value={newItem.ingredients}
            onChange={(e) =>
              setNewItem({ ...newItem, ingredients: e.target.value })
            }
            className="border rounded-md p-2"
          />

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
            {editMode ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </div>

      {/* Menu Items List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-bold text-[#F57C00] mb-4">Menu Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#F57C00] text-white">
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price (₹)</th>
                <th className="p-3">Ingredients</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
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

export default MenuManagement;
