import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Bharat",
      email: "bharat@example.com",
      phone: "9876543210",
      otpVerified: true,
      flagged: false,
      joined: "May 11, 2020",
      status: true,
    },
    {
      id: 2,
      name: "Theodore Kurio",
      email: "theodore@example.com",
      phone: "8765432109",
      otpVerified: true,
      flagged: false,
      joined: "May 10, 2020",
      status: true,
    },
    {
      id: 3,
      name: "Theodore Kurio",
      email: "theodore@example.com",
      phone: "8765432109",
      otpVerified: true,
      flagged: false,
      joined: "May 10, 2020",
      status: true,
    },
    {
      id: 40,
      name: "Theodore Kurio",
      email: "test@example.com",
      phone: "12099920723",
      otpVerified: true,
      flagged: false,
      joined: "May 10, 2020",
      status: true,
    },
    {
      id: 5,
      name: "Theodore Kurio",
      email: "theodore@example.com",
      phone: "8765432109",
      otpVerified: true,
      flagged: false,
      joined: "May 10, 2020",
      status: true,
    },
    {
      id: 6,
      name: "o",
      email: "theodore@example.com",
      phone: "8765432109",
      otpVerified: true,
      flagged: false,
      joined: "May 10, 2020",
      status: true,
    },
    // Add more users as needed
  ]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Handlers
  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleEdit = (user) => {
    setSelectedUser({ ...user });
    setIsEditModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter((u) => u.id !== selectedUser.id));
    setIsDeleteModalOpen(false);
  };

  const handleEditSave = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id ? { ...selectedUser } : user
      )
    );
    setIsEditModalOpen(false);
  };

  const handleEditFieldChange = (field, value) => {
    setSelectedUser((prev) => ({ ...prev, [field]: value }));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.id.toString().includes(searchTerm) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // CSV Export
  const exportToCSV = () => {
    const header = ["ID", "Name", "Email", "Phone", "OTP Verified", "Flagged", "Joined On"];
    const rows = filteredUsers.map((user) => [
      user.id,
      user.name,
      user.email,
      user.phone,
      user.otpVerified ? "YES" : "NO",
      user.flagged ? "YES" : "NO",
      user.joined,
    ]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += header.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    // Creating download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_data.csv");
    link.click();
  };

  return (
    <div className="p-4 bg-orange-100 min-h-screen">
      <h1 className="text-xl font-bold mb-4">User Management</h1>
      <div className="bg-white p-2 shadow rounded-lg overflow-x-auto">
        {/* Search Bar */}
        <div className="flex items-center space-x-4 overflow-x-auto mb-4">
          <div className="relative w-full max-w-sm">
            <FaSearch className="absolute top-2.5 left-3 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Search by ID / Name / Email / Phone"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          {/* Items Per Page Selector */}
          <select
            className="border rounded p-2"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          {/* Export to CSV Button */}
          <button
            onClick={exportToCSV}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Export to CSV
          </button>
        </div>

        {/* User Table */}
        <table className="w-full text-left bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">OTP Verified</th>
              <th className="py-2 px-4">Flagged</th>
              <th className="py-2 px-4">Joined On</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-orange-100">
                <td className="py-2 px-4">{user.id}</td>
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.phone}</td>
                <td className="py-2 px-4">{user.otpVerified ? "YES" : "NO"}</td>
                <td className="py-2 px-4">{user.flagged ? "YES" : "NO"}</td>
                <td className="py-2 px-4">{user.joined}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center"
                  >
                    <FiEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center"
                  >
                    <MdDelete className="mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4 text-orange-600">
              Edit User Details
            </h2>
            <input
              type="text"
              value={selectedUser.name}
              onChange={(e) => handleEditFieldChange("name", e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Name"
            />
            <input
              type="email"
              value={selectedUser.email}
              onChange={(e) => handleEditFieldChange("email", e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Email"
            />
            <input
              type="text"
              value={selectedUser.phone}
              onChange={(e) => handleEditFieldChange("phone", e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Phone"
            />
            <div className="flex space-x-4 justify-end">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4 text-orange-600">
              Confirm Delete
            </h2>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <span className="font-bold">{selectedUser.name}</span>?
            </p>
            <div className="flex space-x-4 justify-end">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
