import React, { useState, useEffect, useContext } from 'react';
import { SellerContext } from '../Context/SellerContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Response = () => {
  const { seller } = useContext(SellerContext); // assuming seller contains sellerId
  const [feedbackData, setFeedbackData] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('seller-token');
  const decode = jwtDecode(token);
  const sellerId = decode.id;

  const fetchResponses = async () => {
    try {
      const res = await axios.post(
        'https://quick-bites-backend.vercel.app/api/seller/getallresponses',
        { sellerId }
      );

      if (res.data.success) {
        // Filter out responses with empty or null feedback
        const filteredData = res.data.ResponseData.filter(
          (review) => review.feedback && review.feedback.trim() !== ''
        );
        setFeedbackData(filteredData);
      } else {
        console.error(res.data.message);
      }
    } catch (err) {
      console.error('Error fetching feedback:', err.message);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  return (
    <div className="mt-8 mx-5">
      <h2 className="text-lg font-semibold mb-4">Customer Feedback & Seller Response</h2>
      <div className="overflow-x-auto bg-white p-4 rounded-md h-screen overflow-y-scroll">
        <table className="min-w-full text-sm text-left border-collapse border border-gray-300">
          <thead>
            <tr className="border-b bg-slate-200">
              <th className="p-2">Order Id</th>
              <th className="p-2">Food</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Feedback</th>
              <th className="p-2">Response</th>
            </tr>
          </thead>
          <tbody>
            {feedbackData.map((review, index) => (
              <tr
                key={index}
                onClick={() => navigate(`/desc/${review.orderId}`)}
                className="border-b hover:bg-orange-100 cursor-pointer"
              >
                <td className="p-2">{review.orderId}</td>
                <td className="p-2">
                  {review.items.map((item, i) => (
                    <p key={i}>{item.name}</p>
                  ))}
                </td>
                <td className="p-2">
                  {review.items.map((item, i) => (
                    <p key={i}>{item.quantity}</p>
                  ))}
                </td>
                <td className="p-2 text-wrap w-[12rem]">{review.feedback}</td>
                <td className="p-2 text-wrap w-[12rem]">
                  {review.response === '' ? 'No Response Yet' : review.response}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Response;
