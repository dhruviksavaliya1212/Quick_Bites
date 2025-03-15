import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg('');

    try {
      const res = await axios.post('https://quick-bites-backend.vercel.app/api/auth/admin/receiveFeedback', {
        name: formData.name,
        email: formData.email,
        feedbackMsg: formData.message,
      });

      if (res.data.success) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 flex items-center justify-center min-h-screen p-4">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Contact Us</h2>
        <p className="text-gray-600 text-center mb-6">Have questions or feedback? We'd love to hear from you!</p>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your message"
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full border bg-orange-400 py-3 text-zinc-100 font-medium rounded mt-4 text-[16px] hover:bg-orange-500 hover:text-zinc-300 hover:scale-105 transition-all duration-300"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          <p>Email: quickbites.help@gmail.com</p>
          <p>Phone: +91 9876543210</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
