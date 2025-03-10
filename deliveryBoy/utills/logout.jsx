const logout = () => {
    localStorage.removeItem("deliveryAgent-token");
    window.location.href = "/auth";
  };
  
  export default logout;
  
  // logout
