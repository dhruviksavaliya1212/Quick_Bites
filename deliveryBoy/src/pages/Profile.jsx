import { useState } from 'react';
import { FaUser, FaMotorcycle, FaIdCard } from 'react-icons/fa';
import withAuth from '../../utills/withAuth';

function Profile() {
  const [profile] = useState({
    name: 'Rahul Kumar',
    phone: '+91 98765 43210',
    email: 'rahul.k@example.com',
    vehicleNumber: 'MH 01 AB 1234',
    licenseNumber: 'DL98765432',
    joiningDate: '2023-12-01',
    totalDeliveries: 150,
    rating: 4.8
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl">
            <FaUser />
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold">{profile.name}</h3>
            <p className="text-gray-600">Delivery Partner</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-gray-600">Phone Number</label>
              <p className="font-semibold">{profile.phone}</p>
            </div>
            <div>
              <label className="text-gray-600">Email</label>
              <p className="font-semibold">{profile.email}</p>
            </div>
            <div className="flex items-center">
              <FaMotorcycle className="text-primary mr-2" />
              <div>
                <label className="text-gray-600">Vehicle Number</label>
                <p className="font-semibold">{profile.vehicleNumber}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <FaIdCard className="text-primary mr-2" />
              <div>
                <label className="text-gray-600">License Number</label>
                <p className="font-semibold">{profile.licenseNumber}</p>
              </div>
            </div>
            <div>
              <label className="text-gray-600">Joining Date</label>
              <p className="font-semibold">{profile.joiningDate}</p>
            </div>
            <div>
              <label className="text-gray-600">Total Deliveries</label>
              <p className="font-semibold">{profile.totalDeliveries}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Profile);
