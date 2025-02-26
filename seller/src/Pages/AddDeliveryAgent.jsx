import React, { useState } from 'react';
import { useContext } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { SellerContext } from '../Context/SellerContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';

const AddDeliveryAgent = () => {
  const [agents, setAgents] = useState(false);
  const {stoken, backend} = useContext(SellerContext)

  const [showModal, setShowModal] = useState(false);
  const [editDriver, setEditDriver] = useState(null);
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [contactNo, setcontactNo] = useState('');
  const [email, setemail] = useState('');
  const [gender, setgender] = useState('Male');

  const onSubmitHandler = async () => {
    try {

      const agentData = {
        firstName,
        lastName,
        contactNo,
        email,
        gender
      }

      console.log(agentData)
      const { data } = await axios.post(
        `${backend}/api/delivery-agent/add-agent`,
        agentData,
        { headers: { Authorization: `Bearer ${stoken}` } } 

      );

      console.log(data);

      if (data.success) {
        toast.success(data.message);
        getAgents()
        setShowModal(false)
        setfirstName('');
        setlastName("");
        setcontactNo("");
        setemail("");
        setgender("Male");
      } else {
        toast.info(data.message)
      }
    } catch (err) {
      console.log(err)
      toast.error("Something went wrong");
    }
  };

  const getAgents = async () =>  {
    try {
      const { data } = await axios.post(
        `${backend}/api/delivery-agent/get-agents`
    );
    if(data.success){
      setAgents(data.agentData)
    }
    } catch (err) {
      console.log(err)
      toast.error("Something went wrong");
    }
  }

  useEffect(()=>{
    getAgents()
  },[])

  const handleAdd = () => {
    setEditDriver(null);
    setShowModal(true);
  };

  const handleDelete = async(id) => {
    console.log(id)
    try {
      if (window.confirm('Are you sure you want to delete this delivery agent?')) {
        const {data} = await axios.post(`${backend}/api/delivery-agent/delete-agents`,{id})
        if(data.success){
          getAgents()
          toast.success(data.message)
        } else {
          toast.info(data.message)
        }
      }
    } catch (err) {
      console.log(err)
      toast.error("Something went wrong")
    }
    
  }

  return (
    <div className="p-4  min-h-screen">
      <h1 className="text-xl text-zinc-800 font-semibold mb-6 ">Add Delivery Agent</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <button
          onClick={handleAdd}
          className="flex items-center bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
        >
          <FaPlus className="mr-2" /> Add Agent
        </button>
      </div>
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
            {agents && agents.reverse().map((agent,index) => (
              <tr key={index} className="text-center border-b">
                <td className="p-2">{index+1}</td>
                <td className="p-2">{agent.firstName}</td>
                <td className="p-2">{agent.lastName}</td>
                <td className="p-2">{agent.email}</td>
                <td className="p-2">{agent.contactNo}</td>
                <td className="p-2">{agent.gender}</td>
                <td>
                <button onClick={() => handleDelete(agent._id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-lg mx-4">
            <h2 className="text-lg font-bold mb-4">
              {editDriver ? 'Edit Delivery Agent' : 'Add Delivery Agent'}
            </h2>
            <input
              type="text"
              placeholder="First Name"
              onChange={(e)=> setfirstName(e.target.value)}
              value={firstName}
              className="border p-2 w-full mb-4"
            />
            <input
              type="text"
              placeholder="Last Name"
              onChange={(e)=> setlastName(e.target.value)}
              value={lastName}
              className="border p-2 w-full mb-4"
            />
            <input
              type="text"
              placeholder="Contact No"
              onChange={(e)=> setcontactNo(e.target.value)}
              value={contactNo}
              className="border p-2 w-full mb-4"
            />
            <input
              type="text"
              placeholder="Email"
              onChange={(e)=> setemail(e.target.value)}
              value={email}
              className="border p-2 w-full mb-4"
            />
            <div className=' flex gap-5 mb-5'>
              <label htmlFor="gender">Gender : </label>
            <input
              type="radio"
              onChange={(e)=> setgender(e.target.value)}
              value='Male'
              name='gender'
              className="border"
            />
            <p>Male</p>
            <input
              type="radio"
              onChange={(e)=> setgender(e.target.value)}
              value='Female'
              name='gender'
              className="border"
            />
            <p>Female</p>
            </div>
            <button
              onClick={() => onSubmitHandler()}
              className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
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
    </div>
  );
};

export default AddDeliveryAgent;
