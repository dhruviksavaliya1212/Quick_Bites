import React from 'react';

const Contact = () => {
  return (
    <div className=" pt-24 pb-16 flex items-center justify-center min-h-screen p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Contact Us</h2>
        <p className="text-gray-600 text-center mb-6">Have questions or feedback? We'd love to hear from you!</p>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input type="text" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your name" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input type="email" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your email" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Message</label>
            <textarea className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your message" rows="4"></textarea>
          </div>
          <button
          type="submit"
          className=" w-full border bg-orange-400 py-3 text-zinc-100 font-medium rounded mt-4 text-[16px] hover:bg-orange-500 hover:text-zinc-300 hover:scale-105 transition-all duration-300"
        >Send Message</button>
        </form>
        <div className="mt-6 text-center text-gray-600">
          <p>Email: quickbites@fooddelivery.com</p>
          <p>Phone: +91 9876543210</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
