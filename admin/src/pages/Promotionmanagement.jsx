import React, { useState, useEffect,useContext } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import withAuth from "../utills/hoc/withAuth";
import axios from "axios";
import { AdminContext } from "../Context/AdminContext";
import {jwtDecode} from "jwt-decode"

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editPromotion, setEditPromotion] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [offerCode, setOfferCode] = useState("");
  const [isActive, setIsActive] = useState(true); // For update modal
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // Success or error
  const {backend} = useContext(AdminContext)

  const token = localStorage.getItem('token');
  const decode = jwtDecode(token)
  const adminId = decode.adminId;
  console.log(adminId);

  const BASE_URL = `${backend}/api/auth/admin`;

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/getallpromotions/${adminId}`);
      if (response.data.success) {
        setPromotions(response.data.promotions);
      }
    } catch (error) {
      setMessage({ text: "Failed to fetch promotions", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredPromotions = promotions.filter((promo) =>
    promo.promotionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditPromotion(null);
    setBannerPreview("");
    setOfferCode("");
    setIsActive(true);
    setBannerFile(null);
    setShowModal(true);
    setMessage({ text: "", type: "" });
  };

  const handleEdit = (promo) => {
    setEditPromotion(promo);
    setBannerPreview(promo.promotionBanner);
    setOfferCode(promo.offerCode);
    setIsActive(promo.isActive);
    setBannerFile(null);
    setShowModal(true);
    setMessage({ text: "", type: "" });

  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      setLoading(true);
      try {
        const response = await axios.delete(`${BASE_URL}/deletpromotion`, {
          data: { promtotionId: id },
        });
        if (response.data.success) {
          setPromotions(promotions.filter((promo) => promo._id !== id));
          setMessage({ text: "Promotion deleted successfully", type: "success" });
        }
      } catch (error) {
        setMessage({ text: "Failed to delete promotion", type: "error" });
      } finally {
        setLoading(false);
        fetchPromotions()
      }
    }
  };

  const handleSave = async () => {
    const promoName = document.getElementById("promoName").value;
    const promoDiscount = document.getElementById("promoDiscount").value;

    const formData = new FormData();
    formData.append("promotionName", promoName);
    formData.append("discount", promoDiscount);
    formData.append("offerCode", offerCode);
    formData.append("adminId", adminId);
    if (editPromotion) formData.append("promotionId", editPromotion._id);
    if (bannerFile) formData.append("promotionBanner", bannerFile);
    formData.append("isActive", isActive); // Include isActive for updates

    setLoading(true);
    try {
      if (editPromotion) {
        const response = await axios.put(`${BASE_URL}/updatepromotion`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.data.success) {
          setPromotions(
            promotions.map((p) =>
              p._id === editPromotion._id ? response.data.updatedPromtion : p
            )
          );
          setMessage({ text: "Promotion updated successfully", type: "success" });
          fetchPromotions()
        }
      } else {
        const response = await axios.post(`${BASE_URL}/addpromotion`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.data.success) {
          setPromotions([...promotions, response.data.promotion]);
          setMessage({ text: "Promotion added successfully", type: "success" });
        }
      }
      setShowModal(false);
    } catch (error) {
      setMessage({ text: "Failed to save promotion", type: "error" });
    } finally {
      setLoading(false);
    }
  };

 
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const openImagePreview = (banner) => {
    setBannerPreview(banner);
    setShowImagePreview(true);
  };

  const closeImagePreview = () => {
    setShowImagePreview(false);
    setBannerPreview("");
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Promotion Management
      </h1>

      {/* Message Display */}
      {message.text && (
        <div
          className={`mb-4 p-3 rounded text-white text-center ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by Name..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded w-full md:w-1/3 mb-4 md:mb-0 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={handleAdd}
          className="flex items-center bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition"
        >
          <FaPlus className="mr-2" /> Add Promotion
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center mb-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-lg rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Offer Code</th>
              <th className="p-3">Banner</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPromotions.map((promo) => (
              <tr key={promo._id} className="text-center border-b hover:bg-gray-50">
                <td className="p-3">{promo._id.slice(-6)}</td>
                <td className="p-3">{promo.promotionName}</td>
                <td className="p-3">{promo.discount}</td>
                <td className="p-3">{promo.offerCode}</td>
                <td className="p-3">
                  {promo.promotionBanner ? (
                    <button
                      onClick={() => openImagePreview(promo.promotionBanner)}
                      className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600 transition"
                    >
                      Preview
                    </button>
                  ) : (
                    "No Banner"
                  )}
                </td>
                <td className="p-3">
                  <button
                    className={`p-1 rounded w-20 ${
                      promo.isActive ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {promo.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => handleEdit(promo)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(promo._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed mt-14 overflow-y-auto inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {editPromotion ? "Edit Promotion" : "Add Promotion"}
            </h2>
            <input
              type="text"
              placeholder="Name"
              defaultValue={editPromotion?.promotionName || ""}
              className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              id="promoName"
            />
            <input
              type="text"
              placeholder="Discount"
              defaultValue={editPromotion?.discount || ""}
              className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              id="promoDiscount"
            />
            <input
              type="text"
              placeholder="Offer Code"
              value={offerCode}
              onChange={(e) => setOfferCode(e.target.value)}
              className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="file"
              accept="image/*"
              className="border p-2 w-full mb-4 rounded"
              onChange={handleBannerChange}
            />
            {/* {bannerPreview && (
              <img
                src={bannerPreview}
                alt="Banner Preview"
                className="w-full h-40 object-cover rounded mb-4"
              />
            )} */}
            {editPromotion && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Status</label>
                <select
                  value={isActive}
                  onChange={(e) => setIsActive(e.target.value === "true")}
                  className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="relative bg-wite p-4 rounded-lg shadow-lg max-w-3xl w-full">
            <img
              src={bannerPreview}
              alt="Banner Preview"
              className="w-full h-auto mt-20 max-h-[80vh]  object-contain rounded"
            />
            <button
              onClick={closeImagePreview}
              className="absolute top-2 right-2 mt-20 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(PromotionManagement);
