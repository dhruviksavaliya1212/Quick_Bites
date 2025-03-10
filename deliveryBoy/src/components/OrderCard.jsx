import { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaRupeeSign, FaDirections, FaExclamationTriangle } from 'react-icons/fa';
import { FaEnvelope } from 'react-icons/fa';
function OrderCard({ order, onUpdateStatus }) {
  const [status, setStatus] = useState(order.status);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');

  const handleStatusUpdate = (newStatus) => {
    setStatus(newStatus);
    onUpdateStatus(order.id, newStatus);
  };

  const handleNavigate = () => {
    const encodedAddress = encodeURIComponent(order.deliveryAddress);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    console.log('Issue reported:', { orderId: order.id, issue: issueDescription });
    setShowIssueModal(false);
    setIssueDescription('');
  };

  const handleCall = () => {
    window.location.href = `tel:${order.customerPhone}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold">{order.id}</h3>
          <p className="text-gray-600">{order.restaurant}</p>
        </div>
        <div className="flex items-center bg-orange-50 px-3 py-1 rounded-full">
          <FaRupeeSign className="text-primary" />
          <span className="font-bold">{order.amount}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <FaMapMarkerAlt className="text-primary flex-shrink-0" />
            <p className="text-sm">{order.deliveryAddress}</p>
          </div>
          <button 
            onClick={handleNavigate}
            className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-full hover:bg-secondary transition-colors flex items-center justify-center gap-2"
          >
            <FaDirections />
            <span>Navigate</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <FaPhoneAlt className="text-primary flex-shrink-0" />
            <p className="text-sm">{order.customerPhone}</p>
          </div>
          <button 
            onClick={handleCall}
            className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <FaPhoneAlt />
            <span>Call</span>
          </button>

        
        </div>

        <div className="flex items-center gap-2">
         
          <div className="flex items-center gap-2 flex-1">
            <FaEnvelope className="text-primary flex-shrink-0" />
            <p className="text-sm">{order.email}</p>
          </div>
        

          <button 
            onClick={handleCall}
            className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <FaPhoneAlt />
            <span>send otp</span>
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        {status === 'pending' ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => handleStatusUpdate('accepted')}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition-colors"
            >
              Accept Order
            </button>
            <button
              onClick={() => handleStatusUpdate('rejected')}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition-colors"
            >
              Reject Order
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <select 
              value={status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="w-full p-3 border rounded-full text-center"
              disabled={status === 'rejected'}
            >
              <option value="accepted">Accepted</option>
              <option value="picked">Picked Up</option>
              <option value="delivered">Delivered</option>
            </select>
            
            <button
              onClick={() => setShowIssueModal(true)}
              className="flex items-center justify-center gap-2 text-red-500 hover:text-red-600 transition-colors p-2"
            >
              <FaExclamationTriangle />
              Report Issue
            </button>
          </div>
        )}
      </div>

      {showIssueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Report Issue</h3>
            <form onSubmit={handleIssueSubmit}>
              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4"
                rows="4"
                placeholder="Describe the issue..."
                required
              />
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-full hover:bg-secondary order-1 sm:order-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderCard;
