// import { useNavigate } from "react-router-dom";

const logout = (navigate) => {
  // Clear the token from localStorage or sessionStorage
  localStorage.removeItem("token");
  // Redirect the user to the login page
  
  navigate("/login", { replace: true });
};

export default logout;
