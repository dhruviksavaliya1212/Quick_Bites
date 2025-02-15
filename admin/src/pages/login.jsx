import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChefHat, Mail, Lock, Coffee } from "lucide-react";
import Typed from "typed.js";
import { CiMail } from "react-icons/ci";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        "Welcome to Admin HQ!",
        "Manage Your Dining ",
        "Control Your Trade!",
      ],
      typeSpeed: 50,
      backSpeed: 50,
      loop: true,
    });

    return () => typed.destroy();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-white to-orange-100 animate-gradient">
      {/* Animated background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(249,115,22,0.05)_25%,rgba(249,115,22,0.05)_50%,transparent_50%,transparent_75%,rgba(249,115,22,0.05)_75%)] bg-[length:24px_24px] animate-pattern"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-orange-500/10 overflow-hidden border border-orange-100">
          <div className="p-8 md:p-12">
            <div className="mb-8 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl mx-auto mb-6 flex items-center justify-center transform rotate-12 shadow-lg shadow-orange-500/30"
              >
                <ChefHat className="w-10 h-10 text-white transform -rotate-12" />
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-4xl font-bold text-gray-800 mb-2">
                  <span
                    ref={el}
                    className="text-orange-600 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent"
                  ></span>
                </h2>
                <p className="text-gray-600">
                  Access your restaurant management dashboard
                </p>
              </motion.div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Admin Email
                  </label>
                  <div className="relative group">
                  <Mail className="w-5 h-5  absolute left-4 top-1/2 transform text-orange-500 -translate-y-1/2 group-hover:text-orange-500 transition-colors duration-200" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-s border-2 border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 outline-none group-hover:border-orange-500 shadow-sm"
                      placeholder="admin@restaurant.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="w-5 h-5  absolute left-4 top-1/2 transform text-orange-500 -translate-y-1/2 group-hover:text-orange-500 transition-colors duration-200" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/80  border-2 border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 outline-none group-hover:border-orange-500 shadow-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-2"
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-4 focus:ring-orange-200 transition-all duration-300 relative overflow-hidden group font-semibold text-lg shadow-lg shadow-orange-500/30"
                >
                  <span className="absolute inset-0 w-0 bg-white opacity-20 transition-all duration-300 ease-out group-hover:w-full"></span>
                  <div className="flex items-center justify-center gap-2">
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Coffee className="w-5 h-5" />
                        <span>Access Dashboard</span>
                      </>
                    )}
                  </div>
                </button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <a
                href="#"
                className="text-orange-600 hover:text-orange-700 transition-colors duration-300 font-medium"
              >
                Forgot admin credentials?
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="py-4 bg-gradient-to-r from-orange-50 to-orange-100/50 text-center px-8 border-t border-orange-100"
          >
            <p className="text-sm text-gray-600">
              Need technical support?{" "}
              <a
                href="#"
                className="text-orange-600 font-medium hover:text-orange-700 transition-colors duration-300"
              >
                Contact IT Department
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
