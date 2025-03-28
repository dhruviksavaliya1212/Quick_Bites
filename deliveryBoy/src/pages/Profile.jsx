import { useState, useEffect, useContext } from "react";
import { FaUser, FaMotorcycle, FaIdCard } from "react-icons/fa";
import withAuth from "../../utills/withAuth";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { OrderContext } from "../../context/OrderContext";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const { backend } = useContext(OrderContext);

  const token = localStorage.getItem("deliveryAgent-token");
  const decoded = jwtDecode(token);
  const deliveryAgentId = decoded.agentId;
  const sellerId = decoded.sellerId; // Assuming sellerId is in the token

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${backend}/api/delivery-agent/get-agentprofile`,
        { deliveryAgentId}
      );
      if (data.success) {
        const agent = data.agentData.find(
          (agent) => agent._id === deliveryAgentId
        );
        if (agent) {
          setProfile(agent);
          setFormData({
            firstName: agent.firstName || "",
            lastName: agent.lastName || "",
            contactNo: agent.contactNo || "",
            email: agent.email || "",
            licenseNumber: agent.licenseNumber || "",
            vehicleNumber: agent.vehicleNumber || "",
          });
        } else {
          setError("Profile not found for this delivery agent.");
        }
      } else {
        setError(data.message || "Failed to fetch profile.");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to fetch profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfilePhotoFile(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const updatePayload = new FormData();
    updatePayload.append("deliveryAgentId", deliveryAgentId);

    // Only append fields that have been changed or are non-empty
    if (formData.firstName && formData.firstName !== profile.firstName) {
      updatePayload.append("firstName", formData.firstName);
    }
    if (formData.lastName && formData.lastName !== profile.lastName) {
      updatePayload.append("lastName", formData.lastName);
    }
    if (formData.contactNo && formData.contactNo !== profile.contactNo) {
      updatePayload.append("contactNo", formData.contactNo);
    }
    if (formData.email && formData.email !== profile.email) {
      updatePayload.append("email", formData.email);
    }
    if (
      formData.licenseNumber &&
      formData.licenseNumber !== profile.licenseNumber
    ) {
      updatePayload.append("licenseNumber", formData.licenseNumber);
    }
    if (
      formData.vehicleNumber &&
      formData.vehicleNumber !== profile.vehicleNumber
    ) {
      updatePayload.append("vehicleNumber", formData.vehicleNumber);
    }
    if (profilePhotoFile) {
      updatePayload.append("profilePhoto", profilePhotoFile);
    }

    try {
      const { data } = await axios.put(
        "https://quick-bites-backend.vercel.app/api/delivery-agent/updateAgent-profile",
        updatePayload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (data.success) {
        setProfile(data.data);
        setFormData({
          firstName: data.data.firstName || "",
          lastName: data.data.lastName || "",
          contactNo: data.data.contactNo || "",
          email: data.data.email || "",
          licenseNumber: data.data.licenseNumber || "",
          vehicleNumber: data.data.vehicleNumber || "",
        });
        setProfilePhotoFile(null);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        setError(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <h1 className="font-bold text-2xl text-primary">Loading Profile...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl">
              {profile.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FaUser />
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-gray-600">Delivery Partner</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-white px-4 py-2 rounded-full hover:bg-secondary"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-gray-600">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter first name (optional)"
                  />
                </div>
                <div>
                  <label className="text-gray-600">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter last name (optional)"
                  />
                </div>
                <div>
                  <label className="text-gray-600">Phone Number</label>
                  <input
                    type="text"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter phone number (optional)"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-600">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter email (optional)"
                  />
                </div>
                <div>
                  <label className="text-gray-600">License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter license number (optional)"
                  />
                </div>
                <div>
                  <label className="text-gray-600">Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter vehicle number (optional)"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-gray-600">Profile Photo</label>
              <input
                type="file"
                name="profilePhoto"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-full hover:bg-secondary"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-gray-600">Phone Number</label>
                <p className="font-semibold">{profile.contactNo || "N/A"}</p>
              </div>
              <div>
                <label className="text-gray-600">Email</label>
                <p className="font-semibold">{profile.email || "N/A"}</p>
              </div>
              <div className="flex items-center">
                <FaMotorcycle className="text-primary mr-2" />
                <div>
                  <label className="text-gray-600">Vehicle Number</label>
                  <p className="font-semibold">
                    {profile.vehicleNumber || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <FaIdCard className="text-primary mr-2" />
                <div>
                  <label className="text-gray-600">License Number</label>
                  <p className="font-semibold">
                    {profile.licenseNumber || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-gray-600">Joining Date</label>
                <p className="font-semibold">
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="text-gray-600">Total Deliveries</label>
                <p className="font-semibold">{profile.totalDeliveries || 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(Profile);
