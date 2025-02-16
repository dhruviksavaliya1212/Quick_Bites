import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, getUserProfileData, token, backend } =
    useContext(AppContext);

  const [isEdit, setISEdit] = useState(false);

  const [image, setImage] = useState(false);

  const updateUser = async () => {
    try {
      const formData = new FormData();

      // Append other user data as form fields
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", userData.address);
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      
      // Append the image only if it's available
      if (image) {
        formData.append("image", image); // `image` here should be a File object
      }

      const { data } = await axios.post(
        backend + "/api/user/update-profile",
        formData,
        { headers: { token, 'Content-Type': 'multipart/form-data' } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserProfileData();
        setISEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    userData && (
      <div className=" pt-28 w-full flex flex-col gap-2 text-sm pb-20">
        {isEdit ? (
          <label htmlFor="image" className="">
            <div className=" inline-block relative cursor-pointer">
              <img
                src={image ? URL.createObjectURL(image) : userData.image}
                alt=""
                className="w-36 opacity-75"
              />
              <img
                src={image ? "" : assets.upload_icon}
                alt=""
                className="w-14 absolute bottom-11 right-11 bg-gray-300/30"
              />
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img src={userData.image} alt="" className="w-36" />
        )}
        {isEdit ? (
          <input
            type="text"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
            className=" bg-indigo-100 border border-zinc-600 rounded outline-none text-2xl font-medium py-1 px-3 max-w-60 mt-4"
          />
        ) : (
          <p className=" font-medium text-3xl mt-5">{userData.name}</p>
        )}
        <hr className="bg-zinc-400 h-[2px] border-none" />
        <div>
          <p className="text-neutral-800 underline mt-3">CONTACT INFORMATION</p>
          <div className=" grid grid-cols-[1fr_4fr] gap-y-2.5 mt-3 text-gray-900">
            <p className=" font-medium">Email-id: </p>
            <p>{userData.email}</p>
            <p className=" font-medium">Phone:</p>
            <div>
              {isEdit ? (
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="bg-indigo-100 border border-zinc-600 rounded outline-none text-sm font-medium py-1 px-3 max-w-60"
                />
              ) : (
                <p>{userData.phone ? userData.phone : "Please enter Phone No"}</p>
              )}
            </div>
            <p className=" font-medium">Address:</p>
            <div>
              {isEdit ? (
                <div>
                  
                  <input
                    type="text"
                    value={userData.address}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address:e.target.value
                      }))
                    }
                    className="bg-indigo-100 border border-zinc-600 rounded outline-none text-sm font-medium py-1 px-3 max-w-60 mt-1"
                  />
                </div>
              ) : (
                <p>
                  {userData.address}
                </p>
              )}
            </div>
          </div>
        </div>
        <div>
          <p className=" text-neutral-800 underline mt-3">BASIC INFORMATION</p>
          <div className=" grid grid-cols-[1fr_4fr] gap-y-2.5 mt-3 text-gray-900">
            <p className=" font-medium">Gender:</p>
            {isEdit ? (
              <select
                value={userData.gender}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
                className="bg-indigo-100 border border-zinc-600 rounded outline-none text-sm font-medium py-1 px-3 max-w-44 mt-1"
              >

                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p>{userData.gender}</p>
            )}
            <p className="font-medium">BirthDate:</p>
            {isEdit ? (
              <input
                type="date"
                value={userData.dob}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
                className="bg-indigo-100 border border-zinc-600 rounded outline-none text-sm font-medium py-1 px-3 max-w-44 mt-1"
              />
            ) : (
              <p>{userData.dob}</p>
            )}
          </div>
          <div>
            {isEdit ? (
              <button
                onClick={() => updateUser()}
                className=" px-5 py-2 rounded border border-orange-500 mt-10 hover:bg-orange-600 hover:text-white hover:scale-105 transition-all duration-300"
              >
                Save Information
              </button>
            ) : (
              <button
                onClick={() => setISEdit(true)}
                className=" px-5 py-2 rounded border border-orange-500 mt-10 hover:bg-orange-600 hover:text-white hover:scale-105 transition-all duration-300"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default MyProfile;