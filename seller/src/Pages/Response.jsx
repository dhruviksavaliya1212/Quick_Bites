import React from 'react'
import { useContext } from 'react'
import { SellerContext } from '../Context/SellerContext'
import {useNavigate} from 'react-router-dom'
import { useState } from 'react'

const Response = () => {

  const {feedbackData} = useContext(SellerContext)
  const navigate = useNavigate()

  return (
    <div className=" mt-8 mx-5">
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
        {feedbackData && feedbackData.map((review,index) => (
          <tr key={index} onClick={()=> navigate(`/desc/${review._id}`)} className="border-b hover:bg-orange-100 cursor-pointer">
            <td className="p-2">{review._id}</td>
                <td className="p-2">{review.items.map((order,index)=>(
                  <p key={index}>{order.name}</p>
                ))}</td>
                <td className="p-2">{review.items.map((order,index)=>(
                  <p key={index}>{order.quantity}</p>
                ))}</td>
            <td className="p-2 text-wrap w-[12rem]">{review.feedback}</td>
            <td className="p-2 text-wrap w-[12rem]">{review.response === '' ? "No Response Yet " : review.response}</td>
            
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  )
}

export default Response