import React, { useState, useContext, useEffect } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { SellerContext } from '../Context/SellerContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";

const AddDeliveryAgent = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for adding an agent
  const [fetchingAgents, setFetchingAgents] = useState(false); // Loading state for fetching agents
  const { stoken, backend } = useContext(SellerContext);

  const [showModal, setShowModal] = useState(false);
  const [editDriver, setEditDriver] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Male');
  
  const token = localStorage.getItem("seller-token");
  const decoded = jwtDecode(token);
  const sellerId = decoded.id;

  const onSubmitHandler = async () => {
    setLoading(true); // Start loading
    try {
      const agentData = {
        firstName,
        lastName,
        contactNo,
        email,
        gender,
        sellerId
      };

      const { data } = await axios.post(
        `${backend}/api/delivery-agent/invite-agent`,
        agentData,
        { headers: { Authorization: `Bearer ${stoken}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getAgents(); // Refresh agents list
        setShowModal(false); // Close modal
        resetForm(); // Clear form inputs
      } else {
        toast.info(data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const getAgents = async () => {
    setFetchingAgents(true); // Start fetching agents
    try {
      const { data } = await axios.post(
        `${backend}/api/delivery-agent/get-specific-agents`,
        { sellerId },
        { headers: { Authorization: `Bearer ${stoken}` } }
      );
      if (data.success) {
        setAgents(data.agentData);
        toast.success("Agents loaded successfully");
      } else {
        toast.info(data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setFetchingAgents(false); // Stop fetching
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setContactNo('');
    setEmail('');
    setGender('Male');
  };

  useEffect(() => {
    getAgents();
  }, []);

  const handleAdd = () => {
    setEditDriver(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this delivery agent?')) {
        const { data } = await axios.post(
          `${backend}/api/delivery-agent/delete-agents`,
          { id }
        );
        if (data.success) {
          getAgents();
          toast.success(data.message);
        } else {
          toast.info(data.message);
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-xl text-zinc-800 font-semibold mb-6">Add Delivery Agent</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <button
          onClick={handleAdd}
          className="flex items-center bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
        >
          <FaPlus className="mr-2" /> Add Agent
        </button>
      </div>

      {fetchingAgents ? (
        <p>Loading agents...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white shadow-lg rounded">
            <thead>
              <tr className="bg-gray-200 text-zinc-800 text-base">
                <th className="p-2">No</th>
                <th className="p-2">First Name</th>
                <th className="p-2">Last Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Contact No</th>
                <th className="p-2">Gender</th>
                <th className="p-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {agents?.reverse().map((agent, index) => (
                <tr key={index} className="text-center border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{agent.firstName}</td>
                  <td className="p-2">{agent.lastName}</td>
                  <td className="p-2">{agent.email}</td>
                  <td className="p-2">{agent.contactNo}</td>
                  <td className="p-2">{agent.gender}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(agent._id)}
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
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-lg mx-4">
            <h2 className="text-lg font-bold mb-4">
              {editDriver ? 'Edit Delivery Agent' : 'Add Delivery Agent'}
            </h2>
            <input
              type="text"
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              className="border p-2 w-full mb-4"
            />
            <input
              type="text"
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              className="border p-2 w-full mb-4"
            />
            <input
              type="text"
              placeholder="Contact No"
              onChange={(e) => setContactNo(e.target.value)}
              value={contactNo}
              className="border p-2 w-full mb-4"
            />
            <input
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border p-2 w-full mb-4"
            />
            <div className='flex gap-5 mb-5'>
              <label htmlFor="gender">Gender:</label>
              <select onChange={(e) => setGender(e.target.value)} value={gender} className="border p-2">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <button
              onClick={onSubmitHandler}
              className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
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
    </div>
  );
};

export default AddDeliveryAgent;
