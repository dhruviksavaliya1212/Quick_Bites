import { createContext, useEffect, useState } from "react";
import { bestSeller } from "../assets/assets";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [cart, setCart] = useState({});
  const [food_list, setFood_list] = useState([]);
  const [restoData, setRestoData] = useState([]);
  const [userData, setUserData] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [appliedPromo, setAppliedPromo] = useState(null); // Store applied promotion
  const [discount, setDiscount] = useState(0); // S

  const backend = 'http://localhost:3000';
  const currency = "₹"
  


  // Fetch promotions
  const fetchPromotions = async () => {
    try {
      const adminId = "67d2bb8f8587944588e7cdb9"; // Replace with dynamic admin ID if needed
      const { data } = await axios.get(
        `${backend}/api/auth/admin/getallpromotions/${adminId}`
      );
      setPromotions(data.promotions);
    } catch (err) {
      toast.error("Failed to load promotions");
    }
  };

  // handle google login
  const handleLogin = async (code) => {
    const { data } = await axios.get(
      `${backend}/api/user/google-login?code=${code}`
    );

    if (data.success) {
      navigate("/");
      toast.success("Login successfull")
    }
    if (data.token) {
      localStorage.setItem("user-token", data.token);
      setToken(data.token);
    }
  };

  const addToCart = async (itemId) => {
    console.log(itemId);
    if (!cart[itemId]) {
      setCart((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCart((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    if(token){
      await axios.post(`${backend}/api/cart/add-cart`,{itemId},{headers:{token}})
    }
  };

  const removeFromCart = async (itemId) => {
    setCart((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if(token){
      await axios.post(`${backend}/api/cart/remove-cart`,{itemId},{headers:{token}})
    }
  };

  const getCartData = async(token) => {
    const {data} = await axios.post(`${backend}/api/cart/get-cart`,{},{headers:{token}});
    
    setCart(data.cartData);
  }

  // total cart amount
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cart) {
      const itemInfo = food_list.find(product => product._id == item);
      if (itemInfo) { // Check if a matching product was found
        totalAmount += itemInfo.newprice * cart[item];
      }
    }
    return totalAmount;
  };

    // calculations
    const calculateGst = () => {
      let gstAmount = (getTotalCartAmount() * 5) / 100;
      return gstAmount;
    };
    const calculateDelivery = () => {
      let deliveryFee = getTotalCartAmount() && 39;
      return deliveryFee;
    };
    const calculatePlatformFee = () => {
      let platformFee = getTotalCartAmount() && 7;
      return platformFee;
    };

  // fetch foods liist
  const fetchFoodList = async () => {
    // setFood_list(bestSeller);
    const {data} = await axios.post(`${backend}/api/food/all-foods`);

    if(data.success){
      setFood_list(data.foods)
    } else {
      toast.error(data.message)
    }
  };

  // Get all resto data
  const getRestoData = async () => {
    const {data} = await axios.post(`${backend}/api/restaurant/get-resto-data`);
    console.log(data)
    if(data.success){
      const notRequestedResto = data.restoData.filter((resto,_) => resto.isrequested === false);
      console.log(notRequestedResto)
      setRestoData(notRequestedResto)
    } else {
      toast.error(data.message)
    }
  };

  const getUserProfileData = async () => {
    try {
      const { data } = await axios.get(backend + "/api/user/get-profile", {
        headers: { token },
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      await getRestoData();
      await fetchPromotions();
      if(localStorage.getItem("user-token")){
        const token = localStorage.getItem("user-token");
        console.log(token);
        setToken(token)
        await getCartData(token);
      }
    }
    loadData();
  }, []);

  useEffect(()=>{
    if(token){
      getUserProfileData()
    } else {
      setUserData(false)
    }
  },[token])

  const values = {
    bestSeller,
    backend,
    handleLogin,
    cart,
    addToCart,
    removeFromCart,
    food_list,
    restoData,
    currency,
    getTotalCartAmount,
    calculateDelivery,
    calculateGst,
    calculatePlatformFee,
    setToken,
    token,
    userData,
    setUserData,
    getUserProfileData,
    promotions,
    appliedPromo, // Expose applied promo
    setAppliedPromo, // Method to set applied promo
    discount, // Expose discount
    setDiscount, // Method to set discount
  };

  return (
    <AppContext.Provider value={values}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
