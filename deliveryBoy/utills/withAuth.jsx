import { useEffect } from "react";
import { replace, useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem("deliveryAgent-token");

      if (!token) {
        navigate("/auth", { replace: true });
      }

     }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;

// withauth
