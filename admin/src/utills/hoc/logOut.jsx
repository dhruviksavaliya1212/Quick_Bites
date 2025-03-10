import { useNavigate } from "react-router-dom";
import axios from "axios";

const logout = async (navigate) => {
  const token = localStorage.getItem("token");
  console.log("Token:", token);
  
  if (!token) {
    console.error("Token is missing.");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:3000/api/auth/admin/logout",
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // Ensure cookies are sent with the request
      }
    );
        console.log("Logout response:", response);
    localStorage.removeItem("token");
    // Redirect the user to the login page
    navigate("/login", { replace: true });
  } catch (error) {
    console.error("Logout failed:", error.response);
    // Handle the error appropriately, e.g., show an alert or toast message
  }
};

export default logout;
