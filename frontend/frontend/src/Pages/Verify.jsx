import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const {backend} = useContext(AppContext);

  const navigate = useNavigate();

  const verifyPayment = async() => {
    const {data} = await axios.post(`${backend}/api/order/verify`,{success, orderId});

    if(data.success){
      navigate('/');
      toast.success(data.message)
    } else{
      toast.error(data.message)
    }
  }

  useEffect(()=>{
    verifyPayment();
  },[])

  return (
    <div>Verify</div>
  )
}

export default Verify