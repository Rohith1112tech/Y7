import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authAPI } from "../services/api";
import { useAuthStore } from "../services/store";
import logo from "../assets/images/logo.png";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const { data } = await authAPI.login({ email, password });
      setAuth(data, data.token, rememberMe);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid Email or Password");
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20" 
      style={{ background: "linear-gradient(180deg, #F5F2EE 0%, #FAF8F5 100%)" }}
    >
      <div className="w-full max-w-[450px]">
        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong soft-shadow-lg rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 md:p-12"
          style={{ 
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(18px)"
          }}
        >
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-10"
          >
            <img 
              src={logo} 
              alt="Studio Y7" 
              className="h-14 mx-auto mb-6 object-contain" 
            />
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-10"
          >
            <h1 
              className="font-display text-3xl font-light mb-3" 
              style={{ color: "#1A1614", letterSpacing: "-0.02em" }}
            >
              Admin Login
            </h1>
            <p 
              className="text-[15px] leading-relaxed" 
              style={{ color: "#6B5F5A" }}
            >
              Login to manage bookings and customers
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label 
                htmlFor="email" 
                className="block text-[13px] font-medium mb-2"
                style={{ color: "#6B5F5A" }}
              >
                Email Address
              </label>
              <div className="relative">
                <FiMail 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" 
                  style={{ color: "#C56A45" }} 
                />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@studioy7.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-5 py-4 rounded-2xl glass text-[15px] transition-all duration-300 focus:ring-2 focus:ring-[#C56A45]/20"
                  style={{ 
                    border: "1px solid rgba(0, 0, 0, 0.05)", 
                    outline: "none", 
                    color: "#1A1614" 
                  }}
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <label 
                htmlFor="password" 
                className="block text-[13px] font-medium mb-2"
                style={{ color: "#6B5F5A" }}
              >
                Password
              </label>
              <div className="relative">
                <FiLock 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" 
                  style={{ color: "#C56A45" }} 
                />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-5 py-4 rounded-2xl glass text-[15px] transition-all duration-300 focus:ring-2 focus:ring-[#C56A45]/20"
                  style={{ 
                    border: "1px solid rgba(0, 0, 0, 0.05)", 
                    outline: "none", 
                    color: "#1A1614" 
                  }}
                />
              </div>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ 
                    accentColor: "#C56A45",
                    border: "1px solid rgba(0, 0, 0, 0.1)"
                  }}
                />
                <span className="text-[13px]" style={{ color: "#6B5F5A" }}>
                  Remember me
                </span>
              </label>
              
              <button
                type="button"
                className="text-[13px] hover:underline transition-all"
                style={{ color: "#C56A45" }}
                onClick={() => alert("Please contact administrator")}
              >
                Forgot Password?
              </button>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-5 py-3 rounded-2xl text-center text-[13px] font-medium"
                style={{ 
                  background: "rgba(197, 106, 69, 0.1)",
                  color: "#C56A45",
                  border: "1px solid rgba(197, 106, 69, 0.2)"
                }}
              >
                {error}
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              type="submit"
              disabled={loading}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-full text-[13px] font-medium text-white transition-smooth"
              style={{ 
                background: loading 
                  ? "rgba(197, 106, 69, 0.5)" 
                  : "linear-gradient(135deg, #C56A45 0%, #B85A38 100%)",
                boxShadow: "0 12px 28px rgba(197, 106, 69, 0.3), 0 4px 12px rgba(197, 106, 69, 0.2)",
                letterSpacing: "0.01em",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Logging in..." : "Login to Dashboard"}
            </motion.button>
          </form>
        </motion.div>

        {/* Back to Website */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8"
        >
          <motion.button
            onClick={() => navigate("/")}
            whileHover={{ x: -3 }}
            className="inline-flex items-center gap-2 text-[13px] font-medium transition-all"
            style={{ color: "#6B5F5A" }}
          >
            <FiArrowLeft />
            <span>Back to Website</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
