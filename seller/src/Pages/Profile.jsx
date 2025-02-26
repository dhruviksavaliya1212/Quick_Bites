import React, { useContext, useState } from "react";
import { SellerContext } from "../Context/SellerContext";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  const { restoData, stoken, setRestoData, backend } =
    useContext(SellerContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updatedData = {
        restoId: restoData._id,
        address: restoData.address,
        email: restoData.email,
        phone: restoData.phone,
        deliverytime: restoData.deliverytime,
        timing: restoData.timing,
      };

      const { data } = await axios.post(
        `${backend}/api/restaurant/update-profile`,
        updatedData,
        { headers: { Authorization: `Bearer ${stoken}` } } 
      );
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const changeAvailability = async (restoId) => {
    const { data } = await axios.post(
      `${backend}/api/restaurant/change-availability`,
      { restoId },
      { headers: { Authorization: `Bearer ${stoken}` } } 
    );

    if (data.success) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  return (
    restoData && (
      <div className="">
        <div className=" flex flex-col gap-4 m-5">
          <div>
            <img
              src={restoData.image}
              alt=""
              className=" bg-orange-500/30 w-full sm:max-w-64 rounded-lg"
            />
          </div>
          <div className="flex-1 items-center border-stone-100 rounded-lg p-8 py-7 bg-white">
            <div className=" flex gap-5 flex-wrap">
              <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
                {restoData.name}
              </p>
              <div className=" flex items-center my-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                >
                  <rect width="14" height="14" fill=""></rect>
                  <path
                    d="M5.67163 3.99166C6.22068 2.34179 6.49521 1.51686 7 1.51686C7.50479 1.51686 7.77932 2.34179 8.32837 3.99166L8.65248 4.96556H9.60668C11.4122 4.96556 12.315 4.96556 12.4703 5.45302C12.6256 5.94049 11.8893 6.4628 10.4167 7.50744L9.67376 8.03444L9.97544 8.94095C10.5325 10.615 10.8111 11.452 10.4033 11.754C9.99553 12.056 9.27604 11.5457 7.83705 10.5249L7 9.93112L6.16295 10.5249C4.72396 11.5457 4.00447 12.056 3.5967 11.754C3.18893 11.452 3.46747 10.615 4.02456 8.94095L4.04557 8.87783C4.18081 8.47145 4.24843 8.26825 4.18684 8.08006C4.12525 7.89187 3.94958 7.76725 3.59824 7.51802C2.11566 6.46633 1.37437 5.94049 1.52971 5.45302C1.68504 4.96556 2.5878 4.96556 4.39332 4.96556H5.34752L5.67163 3.99166Z"
                    fill="#1BA672"
                  ></path>
                </svg>
                <p className=" text-green-700 font-semibold ml-1">
                  {restoData.rating}
                </p>
              </div>
            </div>
            <div className=" flex flex-col gap-1 mt-2 text-base">
              <p className=" text-zinc-700">
                <span className=" text-zinc-600 font-medium">
                  Owner Name :{" "}
                </span>{" "}
                {restoData.ownername}
              </p>
              <p className=" text-zinc-700">
                <span className=" text-zinc-600 font-medium">Email : </span>{" "}
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      setRestoData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    value={restoData.email}
                    required
                    className=" py-1 px-2 w-full bg-orange-100 border border-gray-400 rounded-md"
                  />
                ) : (
                  restoData.email
                )}
              </p>
              <p className=" text-zinc-700">
                <span className=" text-zinc-600 font-medium">Phone : </span>{" "}
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      setRestoData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    value={restoData.phone}
                    required
                    className=" py-1 px-2 w-full bg-orange-100 border border-gray-400 rounded-md"
                  />
                ) : (
                  restoData.phone
                )}
              </p>
            </div>
            <div>
              <p className=" flex items-center gap-1 text-md font-medium text-neutral-800 mt-3">
                Description
              </p>
              <p className=" text-sm text-gray-600 max-w-[700px] mt-1">
                {restoData.desc}
              </p>
            </div>
            <div>
              <p className=" flex items-center gap-1 text-md font-medium text-neutral-800 mt-3">
                Address
              </p>
              <p className=" text-sm text-gray-600 max-w-[700px] mt-1">
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      setRestoData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    value={restoData.address}
                    required
                    className=" py-1 px-2 w-full bg-orange-100 border border-gray-400 rounded-md"
                  />
                ) : (
                  restoData.address
                )}
              </p>
            </div>
            <div className=" flex flex-wrap gap-x-10 items-center justify-between">
              <div className="">
                <p className=" flex items-center gap-1 text-md font-medium text-neutral-800 mt-3">
                  Delivery Time
                </p>
                <p className=" text-sm text-gray-600 max-w-[700px] mt-1">
                  {isEdit ? (
                    <input
                      type="text"
                      onChange={(e) =>
                        setRestoData((prev) => ({
                          ...prev,
                          deliverytime: e.target.value,
                        }))
                      }
                      value={restoData.deliverytime}
                      required
                      className=" py-1 px-2 w-full bg-orange-100 border border-gray-400 rounded-md"
                    />
                  ) : (
                    restoData.deliverytime
                  )}
                </p>
              </div>
              <div>
                <p className=" flex items-center gap-1 text-md font-medium text-neutral-800 mt-3">
                  Restaurant Timing
                </p>
                <p className=" text-sm text-gray-600 max-w-[700px] mt-1">
                  {isEdit ? (
                    <input
                      type="text"
                      onChange={(e) =>
                        setRestoData((prev) => ({
                          ...prev,
                          timing: e.target.value,
                        }))
                      }
                      value={restoData.timing}
                      required
                      className=" py-1 px-2 w-full bg-orange-100 border border-gray-400 rounded-md"
                    />
                  ) : (
                    restoData.timing
                  )}
                </p>
              </div>
              <div className="flex flex-col gap-1 mt-5">
                <p>Restaurant is open?</p>
                <select onChange={()=>changeAvailability(restoData._id)} className=" px-3 py-1 border border-zinc-700 rounded w-full">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            {!isEdit ? (
              <button
                onClick={() => setIsEdit(true)}
                className=" px-10 py-2 border rounded-md text-sm  shadow-md shadow-zinc-700  font-medium mt-5 bg-orange-500 hover:scale-105 transition-all duration-400"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={updateProfile}
                className=" px-5 py-2 border bg-orange-500 shadow-md shadow-zinc-700 rounded-md text-sm mt-5 hover:scale-105 transition-all duration-400"
              >
                Save Information
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;
