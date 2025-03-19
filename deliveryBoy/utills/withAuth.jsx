import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem("deliveryAgent-token");

      if (!token) {
        navigate("/auth", { replace: true });
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
