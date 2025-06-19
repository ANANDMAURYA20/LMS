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
    try {
      const response = await dispatch(login(Data));
      if (response?.payload?.success) {
        setLoginData({
          email: "",
          password: "",
        });
        
        // Get user role from response
        const userRole = response?.payload?.user?.role;
        
        // Role-based redirect
        switch(userRole) {
          case 'INSTRUCTOR':
            navigate("/instructor/courses");
            break;
          case 'ADMIN':
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/");
            break;
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout hideFooter={true} hideNav={true}>
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="backdrop-blur-lg bg-black/80 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(255,128,0,0.2)] border border-orange-500/20">
            <div className="flex flex-col items-center mb-8">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center bg-orange-500/20 backdrop-blur-sm mb-6 border border-orange-500/30"
              >
                <BsCameraFill className="w-10 h-10 text-orange-500" />
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
                    className="w-full px-4 py-3 bg-black/50 rounded-lg backdrop-blur-sm text-white placeholder-gray-400 border border-orange-500/20 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleUserInput}
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-black/50 rounded-lg backdrop-blur-sm text-white placeholder-gray-400 border border-orange-500/20 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-300">
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4 rounded border-orange-500/20 text-orange-500 focus:ring-orange-500 bg-transparent"
                  />
                  Remember me
                </label>
                <Link
                  to="/user/profile/reset-password"
                  className="text-gray-300 hover:text-orange-500 transition-colors duration-300"
                >
                  Forgot Password?
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-300 font-medium backdrop-blur-sm"
              >
                {isLoading ? "Logging in..." : "LOGIN"}
              </motion.button>

              <div className="text-center space-y-3">
                <div className="relative flex items-center justify-center">
                  <div className="h-px w-full bg-orange-500/20"></div>
                  <span className="absolute bg-black px-3 text-gray-400 text-sm">
                    or
                  </span>
                </div>

                <p className="text-gray-400">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="text-orange-500 hover:text-orange-400 transition-colors duration-300 font-medium"
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