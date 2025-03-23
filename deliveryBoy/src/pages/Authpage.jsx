import { useState, useEffect, memo, useContext } from "react";
import axios from "axios";
import { OrderContext } from "../../context/OrderContext";

// Reusable input field component (memoized to prevent cursor jumping)
const FormInput = memo(({ name, type = "text", placeholder, value, onChange, error }) => (
  <div className="mb-2">
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
      autoComplete="off"
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
));

// Main authentication form component
const AuthForm = () => {
  // State for form step (1 = Login, 2 = Register)
  const [currentStep, setCurrentStep] = useState(1);

  // State for form input values (5 fields)
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    secretCode: "",
    vehicleNumber: "",
    licenseNumber: "",
  });

  // State for form validation errors and loading status
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { backend } = useContext(OrderContext);

  // Update form values and clear error for the changed field
  const updateFormField = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate form fields based on the current step
  const checkFormValidity = () => {
    const errors = {};
    const { email, password, secretCode, vehicleNumber, licenseNumber } = formValues;

    // Login-specific validation
    if (currentStep === 1) {
      if (!email) errors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email format";
    }

    // Password validation (applies to both steps)
    if (!password || password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Register-specific validation
    if (currentStep === 2) {
      if (!secretCode) errors.secretCode = "Secret Code is required";
      if (!vehicleNumber) errors.vehicleNumber = "Vehicle Number is required";
      if (!licenseNumber) errors.licenseNumber = "License Number is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Filter state to include only relevant fields for submission
  const getSubmissionData = () => {
    const { email, password, secretCode, vehicleNumber, licenseNumber } = formValues;
    return currentStep === 1
      ? { email, password } // Login: only email and password
      : { password, secretCode, vehicleNumber, licenseNumber }; // Register: 4 fields, no email
  };

  // Handle registration API call
  const handleRegister = async () => {
    setLoading(true);
    try {
      const dataToSend = getSubmissionData(); // Get filtered data (no email)
      const response = await axios.post(
        `${backend}/api/delivery-agent/complete-registration`,
        dataToSend
      );
     switchFormStep();

      console.log("Registration successful:", response.data);

    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle login API call (placeholder for now)
  const handleLogin = async () => {
    setLoading(true);
    try {
      const dataToSend = getSubmissionData(); // Get filtered data (email and password)
      // Placeholder: Replace with actual login API endpoint
      const response = await axios.post(`${backend}/api/delivery-agent/agent-login`, dataToSend);
      localStorage.setItem("deliveryAgent-token",response.data.token);
      window.location.replace("/active-orders");
      console.log("Login successful:", response.data);
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission based on current step
  const submitForm = async (event) => {
    event.preventDefault();
    if (checkFormValidity()) {
      if (currentStep === 1) {
        await handleLogin();
      } else {
        await handleRegister();
      }
    }
  };

  // Toggle between Login and Register steps
  const switchFormStep = () => {
    setCurrentStep(currentStep === 1 ? 2 : 1);
    setFormErrors({});
  };

  // Render the form UI
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-100 to-orange-400 px-4">
      <form
        onSubmit={submitForm}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl space-y-4"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-orange-600">QuickBite</h1>
          <p className="text-md font-bold text-orange-600">Online Dining Solutions</p>
        </div>

        {/* Form title */}
        <h2 className="text-xl font-semibold text-center text-orange-500">
          {currentStep === 1 ? "Login as Delivery Agent" : "Register as Delivery Agent"}
        </h2>

        {/* Register-specific fields */}
        {currentStep === 2 && (
          <>
            <FormInput
              name="secretCode"
              placeholder="Secret Code"
              value={formValues.secretCode}
              onChange={updateFormField}
              error={formErrors.secretCode}
            />
            <FormInput
              name="vehicleNumber"
              placeholder="Vehicle Number"
              value={formValues.vehicleNumber}
              onChange={updateFormField}
              error={formErrors.vehicleNumber}
            />
            <FormInput
              name="licenseNumber"
              placeholder="License Number"
              value={formValues.licenseNumber}
              onChange={updateFormField}
              error={formErrors.licenseNumber}
            />
          </>
        )}

        {/* Login-specific email field */}
        {currentStep === 1 && (
          <FormInput
            name="email"
            type="email"
            placeholder="Email"
            value={formValues.email}
            onChange={updateFormField}
            error={formErrors.email}
          />
        )}

        {/* Password field (common to both steps) */}
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          value={formValues.password}
          onChange={updateFormField}
          error={formErrors.password}
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:bg-orange-300"
        >
          {loading
            ? currentStep === 1
              ? "Logging in..."
              : "Registering..."
            : currentStep === 1
            ? "Login"
            : "Register"}
        </button>

        {/* Toggle link */}
        <p className="text-center text-sm text-gray-600">
          {currentStep === 1 ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={switchFormStep}
            className="text-orange-600 font-medium hover:underline"
          >
            {currentStep === 1 ? "Register here" : "Login here"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
