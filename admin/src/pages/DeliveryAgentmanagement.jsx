import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import withAuth from '../utills/hoc/withAuth';

const DeliveryAgentmanagement = () => {
  const [drivers, setDrivers] = useState([
    { id: 123456, name: 'Ash Driv', occupation: 'Delivery agent', commission: '5 (Flat)', revenue: '₹253.67', status: true },
    { id: 1000, name: 'Akhil', occupation: 'Student', commission: '10 (x)', revenue: '₹200.42', status: true },
    { id: 123, name: 'homi', occupation: 'Delivery Boy', commission: '10 (x)', revenue: '₹22923.53', status: false },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editDriver, setEditDriver] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDrivers = drivers.filter(driver => driver.id.toString().includes(searchTerm));

  const handleAdd = () => {
    setEditDriver(null);
    setShowModal(true);
  };

  const handleEdit = (driver) => {
    setEditDriver(driver);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      setDrivers(drivers.filter(driver => driver.id !== id));
    }
  };

  const handleSave = (driver) => {
    if (editDriver) {
      setDrivers(drivers.map(d => d.id === driver.id ? driver : d));
    } else {
      setDrivers([...drivers, { ...driver, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const toggleStatus = (id) => {
    setDrivers(drivers.map(driver => driver.id === id ? { ...driver, status: !driver.status } : driver));
  };

  return (
    <div className="p-4  min-h-screen">
      <h1 className="text-2xl font-bold mb-6 ">Driver Management</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by ID..."
          value={searchTerm}
          onChange={handleSearch}
          className="border outline-none p-2 rounded w-full md:w-1/3 mb-2 md:mb-0"
        />
        <button
          onClick={handleAdd}
          className="flex items-center bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
        >
          <FaPlus className="mr-2" /> Add Driver
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-lg rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Occupation</th>
              <th className="p-2">Commission</th>
              <th className="p-2">Revenue</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((driver) => (
              <tr key={driver.id} className="text-center border-b">
                <td className="p-2">{driver.id}</td>
                <td className="p-2">{driver.name}</td>
                <td className="p-2">{driver.occupation}</td>
                <td className="p-2">{driver.commission}</td>
                <td className="p-2">{driver.revenue}</td>
                <td className="p-2">
                  <button
                    onClick={() => toggleStatus(driver.id)}
                    className={`p-1 rounded ${driver.status ? 'bg-green-500' : 'bg-red-500'} text-white`}
                  >
                    {driver.status ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-2 flex justify-center gap-2">
                  <button onClick={() => handleEdit(driver)} className="text-blue-500 hover:text-blue-700">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(driver.id)} className="text-red-500 hover:text-red-700">
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
              {editDriver ? 'Edit Driver' : 'Add Driver'}
            </h2>
            <input
              type="text"
              placeholder="Name"
              defaultValue={editDriver?.name || ''}
              className="border p-2 w-full mb-4"
              id="driverName"
            />
            <input
              type="text"
              placeholder="Occupation"
              defaultValue={editDriver?.occupation || ''}
              className="border p-2 w-full mb-4"
              id="driverOccupation"
            />
            <input
              type="text"
              placeholder="Commission"
              defaultValue={editDriver?.commission || ''}
              className="border p-2 w-full mb-4"
              id="driverCommission"
            />
            <input
              type="text"
              placeholder="Revenue"
              defaultValue={editDriver?.revenue || ''}
              className="border p-2 w-full mb-4"
              id="driverRevenue"
            />
            <button
              onClick={() => handleSave({
                id: editDriver?.id || Date.now(),
                name: document.getElementById('driverName').value,
                occupation: document.getElementById('driverOccupation').value,
                commission: document.getElementById('driverCommission').value,
                revenue: document.getElementById('driverRevenue').value,
                status: true
              })}
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

export default withAuth(DeliveryAgentmanagement) ;
