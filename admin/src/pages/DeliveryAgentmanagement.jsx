import React, { useState } from 'react';
import { useContext } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';
import { AdminContext } from '../Context/AdminContext';

const AddDeliveryAgent = () => {
  const [agents, setAgents] = useState(false);
  const {backend} = useContext(AdminContext)

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
      <h1 className="text-xl text-zinc-800 font-semibold mb-6 "> Delivery Agents</h1>

      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-lg rounded">
          <thead>
            <tr className="bg-gray-200 text-zinc-800 text-base">
              <th className="p-2">No</th>
              <th className="p-2">Restaurant Name</th>
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
                <td className="p-2">{agent.restoname}</td>
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

    </div>
  );
};

export default AddDeliveryAgent;
