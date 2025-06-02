import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import { login } from "../Redux/Slices/AuthSlice";
import { BsCameraFill } from "react-icons/bs";
import { motion } from "framer-motion";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  }

  async function onLogin(event) {
    event.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill all the details");
      return;
    }

    setIsLoading(true);
    const Data = { email: loginData.email, password: loginData.password };
    const response = await dispatch(login(Data));
    if (response?.payload?.success) {
      setLoginData({
        email: "",
        password: "",
      });
      navigate("/");
    }
    setIsLoading(false);
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="backdrop-blur-lg bg-white/10 dark:bg-gray-800/30 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20">
            <div className="flex flex-col items-center mb-8">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center bg-blue-500/20 dark:bg-blue-400/20 backdrop-blur-sm mb-6 border border-white/30"
              >
                <BsCameraFill className="w-10 h-10 text-white" />
              </motion.div>
            </div>

            <form onSubmit={onLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleUserInput}
                    placeholder="Username"
                    className="w-full px-4 py-3 bg-blue-900/30 dark:bg-gray-700/30 rounded-lg backdrop-blur-sm text-white placeholder-gray-300 border border-white/10 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleUserInput}
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-blue-900/30 dark:bg-gray-700/30 rounded-lg backdrop-blur-sm text-white placeholder-gray-300 border border-white/10 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-200">
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 bg-transparent"
                  />
                  Remember me
                </label>
                <Link
                  to="/user/profile/reset-password"
                  className="text-gray-200 hover:text-blue-400 transition-colors duration-300"
                >
                  Forgot Password?
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-all duration-300 font-medium backdrop-blur-sm"
              >
                {isLoading ? "Logging in..." : "LOGIN"}
              </motion.button>

              <div className="text-center space-y-3">
                <div className="relative flex items-center justify-center">
                  <div className="h-px w-full bg-gray-500/30"></div>
                  <span className="absolute bg-transparent px-3 text-gray-300 text-sm">
                    or
                  </span>
                </div>

                <p className="text-gray-300">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}