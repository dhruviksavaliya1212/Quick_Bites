import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      name: "Delicious Discounts",
      discount: "50%",
      banner:
        "https://www.shutterstock.com/image-vector/delicious-homemade-burger-chili-bbq-260nw-1804330342.jpg",
      offerCode: "NY2024",
      status: true,
    },
    {
      id: 2,
      name: "Hot Deals on Fresh Mealso",
      discount: "25%",
      banner: "https://images.freecreatives.com/wp-content/uploads/2016/04/Mexican-restaurant-weekend-offer-banner.jpg",
      offerCode: "HOLIDAY15",
      status: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editPromotion, setEditPromotion] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [offerCode, setOfferCode] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPromotions = promotions.filter((promo) =>
    promo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditPromotion(null);
    setBannerPreview("");
    setOfferCode("");
    setShowModal(true);
  };

  const handleEdit = (promo) => {
    setEditPromotion(promo);
    setBannerPreview(promo.banner);
    setOfferCode(promo.offerCode);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      setPromotions(promotions.filter((promo) => promo.id !== id));
    }
  };

  const handleSave = (promo) => {
    if (editPromotion) {
      setPromotions(promotions.map((p) => (p.id === promo.id ? promo : p)));
    } else {
      setPromotions([...promotions, { ...promo, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const toggleStatus = (id) => {
    setPromotions(
      promotions.map((promo) =>
        promo.id === id ? { ...promo, status: !promo.status } : promo
      )
    );
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Generate a URL for the selected file
      setBannerPreview(imageUrl); // Store the generated URL, not the file name
    }
  };

  const openImagePreview = (banner) => {
    setBannerPreview(banner); // The banner should be a valid URL for an image
    setShowImagePreview(true);
  };

  const closeImagePreview = () => {
    setShowImagePreview(false);
    setBannerPreview("");
  };

  return (
    <div className="p-4  min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Promotion Management
      </h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by Name..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 outline-none rounded w-full md:w-1/3 mb-2 md:mb-0"
        />
        <button
          onClick={handleAdd}
          className="flex items-center bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
        >
          <FaPlus className="mr-2" /> Add Promotion
        </button>
      </div>
      <div className="overflow-x-auto ">
        <table className="table-auto w-full bg-white shadow-lg rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Discount</th>
              <th className="p-2">Offer Code</th>
              <th className="p-2">Banner</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPromotions.map((promo) => (
              <tr key={promo.id} className="text-center border-b">
                <td className="p-2">{promo.id}</td>
                <td className="p-2">{promo.name}</td>
                <td className="p-2">{promo.discount}</td>
                <td className="p-2">{promo.offerCode}</td>
                <td className="p-2">
                  {promo.banner ? (
                    <button
                      onClick={() => openImagePreview(promo.banner)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
                    >
                      Preview Banner
                    </button>
                  ) : (
                    "No Banner"
                  )}
                </td>

                <td className="p-2">
                  <button
                    onClick={() => toggleStatus(promo.id)}
                    className={`p-1 rounded ${
                      promo.status ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {promo.status ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(promo)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg w-full md:w-1/3">
            <h2 className="text-lg font-bold mb-4">
              {editPromotion ? "Edit Promotion" : "Add Promotion"}
            </h2>
            <input
              type="text"
              placeholder="Name"
              defaultValue={editPromotion?.name || ""}
              className="border p-2 w-full mb-4"
              id="promoName"
            />
            <input
              type="text"
              placeholder="Discount"
              defaultValue={editPromotion?.discount || ""}
              className="border p-2 w-full mb-4"
              id="promoDiscount"
            />
            <input
              type="text"
              placeholder="Offer Code"
              value={offerCode}
              onChange={(e) => setOfferCode(e.target.value)}
              className="border p-2 w-full mb-4"
            />
            <input
              type="file"
              className="border p-2 w-full mb-4"
              onChange={handleBannerChange}
            />
            {bannerPreview && (
              <div className="mb-4">
                <strong>Uploaded File:</strong> {bannerPreview}
              </div>
            )}
            <button
              onClick={() =>
                handleSave({
                  id: editPromotion?.id || Date.now(),
                  name: document.getElementById("promoName").value,
                  discount: document.getElementById("promoDiscount").value,
                  offerCode: offerCode,
                  banner: bannerPreview,
                  status: true,
                })
              }
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="ml-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Full-screen image preview modal */}
      {showImagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="relative w-full max-w-3xl p-4">
            <img
              src={bannerPreview}
              alt="Banner Preview"
              className="w-full h-auto max-h-screen rounded shadow-lg"
            />
            <button
              onClick={closeImagePreview}
              className="absolute top-4 right-4 text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionManagement;
