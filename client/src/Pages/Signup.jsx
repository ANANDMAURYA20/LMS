import { useState } from "react";
import { toast } from "react-hot-toast";
import { BsPersonCircle, BsCameraFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import { createAccount } from "../Redux/Slices/AuthSlice";
import { motion } from "framer-motion";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    number: "",
    avatar: "",
    role: "STUDENT", // Default role is now STUDENT
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  }

  function getImage(event) {
    event.preventDefault();
    const uploadedImage = event.target.files[0];

    if (uploadedImage) {
      setSignupData({
        ...signupData,
        avatar: uploadedImage,
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setPreviewImage(this.result);
      });
    }
  }

  async function createNewAccount(event) {
    event.preventDefault();
    if (!signupData.email || !signupData.password || !signupData.fullName || !signupData.number) {
      toast.error("Please fill all the details");
      return;
    }

    if (signupData.fullName.length < 3) {
      toast.error("Name should be atleast of 3 characters");
      return;
    }
    if (!signupData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      toast.error("Invalid email id");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", signupData.fullName);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("number", signupData.number);
    formData.append("avatar", signupData.avatar);
    formData.append("role", signupData.role); // Add role to form data

    setIsLoading(true);
    const response = await dispatch(createAccount(formData));
    setIsLoading(false);
    
    if (response?.payload?.success) {
      setSignupData({
        fullName: "",
        email: "",
        password: "",
        number: "",
        avatar: "",
        role: "STUDENT",
      });
      setPreviewImage("");
      navigate("/login");
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
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <BsCameraFill className="w-10 h-10 text-orange-500" />
                )}
              </motion.div>
            </div>

            <form onSubmit={createNewAccount} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={signupData.fullName}
                  onChange={handleUserInput}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-black/50 rounded-lg backdrop-blur-sm text-white placeholder-gray-400 border border-orange-500/20 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
                />
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="number"
                  value={signupData.number}
                  onChange={handleUserInput}
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 bg-black/50 rounded-lg backdrop-blur-sm text-white placeholder-gray-400 border border-orange-500/20 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
                />
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={signupData.email}
                  onChange={handleUserInput}
                  placeholder="Email Address"
                  className="w-full px-4 py-3 bg-black/50 rounded-lg backdrop-blur-sm text-white placeholder-gray-400 border border-orange-500/20 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={signupData.password}
                  onChange={handleUserInput}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-black/50 rounded-lg backdrop-blur-sm text-white placeholder-gray-400 border border-orange-500/20 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
                />
              </div>

              <div className="relative">
                <label className="block text-white text-sm mb-2">Register as</label>
                <select
                  name="role"
                  value={signupData.role}
                  onChange={handleUserInput}
                  className="w-full px-4 py-3 bg-black/50 rounded-lg backdrop-blur-sm text-white placeholder-gray-400 border border-orange-500/20 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
                >
                  <option value="STUDENT">Student</option>
                  <option value="INSTRUCTOR">Instructor</option>
                </select>
              </div>

              <div className="relative">
                <label className="block text-white text-sm mb-2">Profile Picture (Optional)</label>
                <div className="flex items-center gap-4 p-3 bg-black/50 rounded-lg backdrop-blur-sm border border-orange-500/20">
                  <input
                    type="file"
                    onChange={getImage}
                    accept=".jpg, .jpeg, .png, image/*"
                    className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-300 font-medium backdrop-blur-sm mt-6"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </motion.button>

              <p className="text-center text-gray-400 mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-orange-500 hover:text-orange-400 transition-colors duration-300">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
);
}