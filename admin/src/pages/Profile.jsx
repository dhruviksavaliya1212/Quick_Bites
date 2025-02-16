import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import adminProfile from "../assets/adminProfile.jpg"
import withAuth from '../utills/hoc/withAuth';
import logout from '../utills/hoc/logOut';

const Profile = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Ridham Savaliya',
    email: 'Ridham@example.com',
    phone: '+91 1234567890',
    role: 'Administrator',
    dob: '2004-09-19',
    address: '29 nana varchha, Surat, Gujarat, India',
    gender: 'Male'
  });
  const [profileImage, setProfileImage] = useState(adminProfile);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };



  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 h-40"></div>
        <div className="p-6 relative -mt-20">
          <div className="flex items-center space-x-4">
            <label htmlFor="profileImage" className="cursor-pointer">
              <img
                className="h-24 w-24 rounded-full border-4 border-white shadow-md"
                src={profileImage}
                alt="Profile"
              />
              {isEditing && <input type="file" id="profileImage" className="hidden" onChange={handleImageUpload} />}
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
            <div className="p-4 bg-orange-50 rounded-lg shadow-sm">
              <h3 className="text-sm text-gray-500">Email</h3>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="text-lg font-semibold text-gray-800 border-b border-gray-300 focus:outline-none"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-800">{profile.email}</p>
              )}
            </div>
            <div className="p-4 bg-orange-50 rounded-lg shadow-sm">
              <h3 className="text-sm text-gray-500">Phone</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="text-lg font-semibold text-gray-800 border-b border-gray-300 focus:outline-none"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-800">{profile.phone}</p>
              )}
            </div>
            <div className="p-4 bg-orange-50 rounded-lg shadow-sm">
              <h3 className="text-sm text-gray-500">Date of Birth</h3>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={profile.dob}
                  onChange={handleInputChange}
                  className="text-lg font-semibold text-gray-800 border-b border-gray-300 focus:outline-none"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-800">{profile.dob}</p>
              )}
            </div>
            <div className="p-4 bg-orange-50 rounded-lg shadow-sm">
              <h3 className="text-sm text-gray-500">Address</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  className="text-lg font-semibold text-gray-800 border-b border-gray-300 focus:outline-none"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-800">{profile.address}</p>
              )}
            </div>
            <div className="p-4 bg-orange-50 rounded-lg shadow-sm">
              <h3 className="text-sm text-gray-500">Gender</h3>
              {isEditing ? (
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                  className="text-lg font-semibold text-gray-800 border-b border-gray-300 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="text-lg font-semibold text-gray-800">{profile.gender}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button onClick={toggleDropdown} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow">
              Settings
            </button>
            {isEditing ? (
              <button onClick={handleSaveProfile} className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow">
                Save
              </button>
            ) : (
              <button onClick={handleEditToggle} className="px-6 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg shadow">
                Edit Profile
              </button>
            )}
            <button onClick={() => logout(navigate)} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Profile) ;
