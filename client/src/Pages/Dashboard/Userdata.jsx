import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../Redux/Slices/AuthSlice";
import Layout from "../../Layout/Layout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import { motion, useScroll, useTransform } from "framer-motion";

function Userdata() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const { role } = useSelector((state) => state.auth);
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -25]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.8], [1, 0.7]);

  // Add handleEdit function
  const handleEdit = (userId) => {
    navigate(`/admin/users/${userId}/edit`);
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await dispatch(getAllUsers());
        if (response?.payload?.success) {
          setUsers(response.payload.users);
        } else {
          throw new Error("Failed to fetch users");
        }
      } catch (error) {
        toast.error(error.message || "Error fetching users");
      } finally {
        setLoading(false);
      }
    }

    if (role === 'ADMIN') {
      fetchUsers();
    } else {
      toast.error("Unauthorized access");
      navigate("/");
    }
  }, [dispatch, navigate, role]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[90vh] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 md:p-8">
        <motion.div 
          style={{ y: y1, opacity: opacity1 }}
          className="max-w-[1600px] mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-between items-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Registered Users
            </h1>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="text-xl md:text-2xl text-blue-300 backdrop-blur-sm bg-white/10 px-6 py-3 rounded-lg"
            >
              Total Users: {users.length}
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="overflow-x-auto backdrop-blur-lg bg-white/10 rounded-xl shadow-[0_4px_16px_0_rgba(31,38,135,0.37)] border border-white/20"
          >
            <table className="w-full">
              <thead className="backdrop-blur-sm bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-lg font-semibold text-gray-200">User</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold text-gray-200">Email</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold text-gray-200">Phone</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold text-gray-200">Verification</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold text-gray-200">Role</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold text-gray-200">Subscription</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((user, index) => (
                  <motion.tr 
                    key={user._id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="h-12 w-12 flex-shrink-0"
                        >
                          {user.avatar?.secure_url ? (
                            <img
                              className="h-12 w-12 rounded-full object-cover border-2 border-blue-500"
                              src={user.avatar.secure_url}
                              alt={user.fullName}
                            />
                          ) : (
                            <FaUserCircle className="h-12 w-12 text-blue-400" />
                          )}
                        </motion.div>
                        <div className="ml-4">
                          <div className="text-lg font-medium text-gray-200">
                            {user.fullName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-lg text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 text-lg text-gray-300">{user.number || "N/A"}</td>
                    <td className="px-6 py-4">
                      <motion.span
                        whileHover={{ scale: 1.02 }}
                        className={`px-4 py-2 rounded-full text-base font-medium ${
                          user.isEmailVerified
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {user.isEmailVerified ? "Verified" : "Not Verified"}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4">
                      <motion.span
                        whileHover={{ scale: 1.02 }}
                        className={`px-4 py-2 rounded-full text-base font-medium ${
                          user.role === "ADMIN"
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {user.role}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4">
                      <motion.span
                        whileHover={{ scale: 1.02 }}
                        className={`px-4 py-2 rounded-full text-base font-medium ${
                          user.subscription?.status === "active"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {user.subscription?.status || "inactive"}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(user._id)}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      >
                        <FaEdit className="h-6 w-6" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}

export default Userdata;
