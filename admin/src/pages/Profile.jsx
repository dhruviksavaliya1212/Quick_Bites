import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import adminProfile from "../assets/adminProfile.jpg";
import withAuth from '../utills/hoc/withAuth';
import logout from '../utills/hoc/logOut';
import { jwtDecode } from "jwt-decode";
import { AdminContext } from '../Context/AdminContext';

const Profile = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    dob: '',
    address: '',
    gender: ''
  });


  const {setprofileData,profileData} = useContext(AdminContext)
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(adminProfile);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decode = jwtDecode(token);
  const adminId = decode.adminId;

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await fetch(`https://quick-bites-backend.vercel.app/api/auth/admin/getadmin-profile?adminId=${adminId}`);
        const data = await res.json();
        if (res.ok) {
          const admin = data.admin; // Extract from "admin" key
          // Convert ISO date (e.g., "2002-10-29T00:00:00.000Z") to "YYYY-MM-DD"
          const dob = admin.DOB ? new Date(admin.DOB).toISOString().split('T')[0] : '';
          setProfile({
            name: admin.userName || '',
            email: admin.email || '',
            phone: admin.phone || 'N/A', // Assuming phone might be added later
            role: admin.role || 'Administrator', // Role isn’t in response, defaulting
            dob: dob,
            address: admin.address || '',
            gender: admin.gender || ''
          });
          setprofileData({email:admin.email,name: admin.userName})
          if (admin.profilePhoto) {
            setPreviewImage(admin.profilePhoto); // Use Cloudinary URL directly
          }
        } else {
          toast.error(data.message || "Failed to load profile.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Error fetching profile.");
      }
    };

    fetchAdminProfile();
  }, [adminId]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    const formData = new FormData();
    if (profile.name) formData.append('userName', profile.name);
    if (profile.email) formData.append('email', profile.email);
    if (profile.phone) formData.append('phone', profile.phone);
    if (profile.dob) {
      const [year, month, day] = profile.dob.split("-");
      formData.append("DOB", `${day}/${month}/${year}`); // Send as DD/MM/YYYY
    }
    if (profile.address) formData.append('address', profile.address);
    if (profile.gender) formData.append('gender', profile.gender);
    if (profileImage instanceof File) formData.append('profilePhoto', profileImage);

    try {
      const response = await fetch(`https://quick-bites-backend.vercel.app/api/auth/admin/updateadmin-profile/${adminId}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        const admin = result.admin; // Extract from "admin" key
        const dob = admin.DOB ? new Date(admin.DOB).toISOString().split('T')[0] : '';
        setProfile({
          name: admin.userName || '',
          email: admin.email || '',
          phone: admin.phone || '',
          role: admin.role || 'Administrator',
          dob: dob,
          address: admin.address || '',
          gender: admin.gender || ''
        });
        if (admin.profilePhoto) {
          setPreviewImage(admin.profilePhoto); // Update with new Cloudinary URL
        }
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(result.message || 'Update failed');
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Update Error:", error);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <ToastContainer />
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 h-40"></div>
        <div className="p-6 relative -mt-20">
          <div className="flex items-center space-x-4">
            <label htmlFor="profileImage" className="cursor-pointer">
              <img
                className="h-24 w-24 rounded-full border-4 border-white shadow-md object-cover"
                src={previewImage}
                alt="Profile"
              />
              {isEditing && (
                <input
                  type="file"
                  id="profileImage"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              )}
            </label>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="text-2xl font-bold text-gray-800 border-b border-gray-300 focus:outline-none"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
              )}
              <p className="text-gray-500">{profile.role}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Email", name: "email", type: "email" },
              { label: "Phone", name: "phone", type: "text" },
              { label: "Date of Birth", name: "dob", type: "date" },
              { label: "Address", name: "address", type: "text" }
            ].map(({ label, name, type }) => (
              <div key={name} className="p-4 bg-orange-50 rounded-lg shadow-sm">
                <h3 className="text-sm text-gray-500">{label}</h3>
                {isEditing ? (
                  <input
                    type={type}
                    name={name}
                    value={profile[name]}
                    onChange={handleInputChange}
                    className="text-lg font-semibold text-gray-800 border-b border-gray-300 focus:outline-none w-full"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-800">{profile[name]}</p>
                )}
              </div>
            ))}

            <div className="p-4 bg-orange-50 rounded-lg shadow-sm">
              <h3 className="text-sm text-gray-500">Gender</h3>
              {isEditing ? (
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                  className="text-lg font-semibold text-gray-800 border-b border-gray-300 focus:outline-none w-full"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="text-lg font-semibold text-gray-800">{profile.gender || 'Not specified'}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={toggleDropdown}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow"
            >
              Settings
            </button>
            {isEditing ? (
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow"
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleEditToggle}
                className="px-6 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg shadow"
              >
                Edit Profile
              </button>
            )}
            <button
              onClick={() => logout(navigate)}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Profile);
