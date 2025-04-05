import React, { useContext, useEffect, useState } from 'react';
import { Tag, Clock, Percent, Gift, Ticket, Copy, Check } from 'lucide-react';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
import { AppContext } from '../Context/AppContext';

function App() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  const {backend} = useContext(AppContext)
 
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
      
        const adminId = "67d2bb8f8587944588e7cdb9"
        const response = await axios.get(`${backend}/api/auth/admin/getallpromotions/${adminId}`);
        setPromotions(response.data.promotions);
        setLoading(false);
      } catch (err) {
        setError('Failed to load promotions. Please try again later.');
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3 text-red-700">
          <Tag size={24} />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">


      {/* Main Content */}
      <main className="max-w-[1400px] mt-20 mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          {promotions.map((promo) => (
            <div
              key={promo._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={promo.promotionBanner} 
                  alt={promo.promotionName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-white mb-2">
                    <span className="text-3xl font-bold">{promo.promotionName}</span>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        promo.isActive 
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                      }`}
                    >
                      {promo.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-full text-lg font-medium">
                      <Percent size={20} className="mr-2" />
                      {promo.discount}
                    </span>
                    <span className="text-white text-sm">
                      Created: {new Date(promo.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-8 bg-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
                  <div className="flex items-center gap-4">
                    <Ticket className="text-orange-500" size={32} />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Offer Code</p>
                      <button
                        onClick={() => handleCopy(promo.offerCode)}
                        className="group flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <code className="text-xl font-mono font-semibold text-gray-900">
                          {promo.offerCode}
                        </code>
                        {copiedCode === promo.offerCode ? (
                          <Check size={18} className="text-green-500" />
                        ) : (
                          <Copy size={18} className="text-gray-400 group-hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-gray-500">Promotion ID:</p>
                      <button
                        onClick={() => handleCopy(promo._id)}
                        className="group flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <code className="text-sm font-mono">
                          {promo._id}
                        </code>
                        {copiedCode === promo._id ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} className="text-gray-400 group-hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
