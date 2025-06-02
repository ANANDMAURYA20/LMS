import React, { useEffect } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { BsCollectionPlayFill, BsTrash } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";
import { GiMoneyStack } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

import Layout from "../../Layout/Layout";
import { getAllCourses, deleteCourse } from "../../Redux/Slices/CourseSlice";
import { getPaymentRecord } from "../../Redux/Slices/RazorpaySlice";
import { getStatsData } from "../../Redux/Slices/StatSlice";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Title,
  Tooltip
);

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

  const { allUsersCount, subscribedCount } = useSelector((state) => state.stat);
  const { allPayments } = useSelector((state) => state.razorpay);
  const monthlySalesRecord = [1, 3, 7, 8, 10, 0, 5];
  const myCourses = useSelector((state) => state.course.coursesData);

  // Chart data configurations remain the same
  const userData = {
    labels: ["Registered User", "Enrolled User"],
    fontColor: "#fff",
    datasets: [{
      label: "User Details",
      data: [allUsersCount, subscribedCount],
      backgroundColor: ["#EAB308", "#22C55E"],
      borderWidth: 1,
      borderColor: ["#EAB308", "#22C55E"],
    }],
  };

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    fontColor: "white",
    datasets: [{
      label: "Sales / Month",
      data: monthlySalesRecord,
      backgroundColor: ["#EF4444"],
      borderColor: ["#ffffff"],
      borderWidth: 2,
    }],
  };

  async function onCourseDelete(id) {
    if (window.confirm("Are you sure you want to delete the course?")) {
      const res = await dispatch(deleteCourse(id));
      if (res?.payload?.success) {
        await dispatch(getAllCourses());
      }
    }
  }

  useEffect(() => {
    (async () => {
      await dispatch(getAllCourses());
      await dispatch(getStatsData());
      await dispatch(getPaymentRecord());
    })();
  }, []);

  return (
    <Layout hideFooter={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.section 
          style={{ y: y1, opacity: opacity1 }}
          className="py-8 px-4 md:px-8 lg:px-16"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-4xl font-bold mb-12"
          >
            <span className="text-yellow-500 font-inter">Admin </span>
            <span className="text-violet-500 font-nunito-sans">Dashboard</span>
          </motion.h1>

          <div className="flex flex-col gap-12">
            {/* Stats Cards Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              {/* Users Stats Card */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20"
              >
                <div className="h-60">
                  <Pie
                    data={userData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          labels: {
                            color: '#fff'
                          }
                        }
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <p className="text-gray-300 mb-2">Registered Users</p>
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl font-bold text-yellow-500">{allUsersCount}</h3>
                      <FaUsers className="text-yellow-500 text-3xl" />
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <p className="text-gray-300 mb-2">Subscribed Users</p>
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl font-bold text-green-500">{subscribedCount}</h3>
                      <FaUsers className="text-green-500 text-3xl" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Sales Stats Card */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20"
              >
                <div className="h-60">
                  <Bar
                    data={salesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          labels: {
                            color: '#fff'
                          }
                        }
                      },
                      scales: {
                        y: {
                          ticks: { color: '#fff' }
                        },
                        x: {
                          ticks: { color: '#fff' }
                        }
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <p className="text-gray-300 mb-2">Subscription Count</p>
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl font-bold text-blue-500">{allPayments?.count}</h3>
                      <FcSalesPerformance className="text-3xl" />
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <p className="text-gray-300 mb-2">Total Revenue</p>
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl font-bold text-green-500">₹{allPayments?.count * 499}</h3>
                      <GiMoneyStack className="text-green-500 text-3xl" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Courses Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Courses Overview</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/course/create")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
                >
                  Create New Course
                </motion.button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-300 border-b border-white/10">
                      <th className="py-3 px-4 text-left">S No</th>
                      <th className="py-3 px-4 text-left">Course Title</th>
                      <th className="py-3 px-4 text-left">Category</th>
                      <th className="py-3 px-4 text-left">Instructor</th>
                      <th className="py-3 px-4 text-left">Lectures</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myCourses?.map((course, idx) => (
                      <motion.tr 
                        key={course._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="text-gray-300 border-b border-white/10"
                      >
                        <td className="py-3 px-4">{idx + 1}</td>
                        <td className="py-3 px-4">{course.title}</td>
                        <td className="py-3 px-4">{course.category}</td>
                        <td className="py-3 px-4">{course.createdBy}</td>
                        <td className="py-3 px-4">{course.numberOfLectures}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => navigate("/course/displaylectures", { state: { ...course } })}
                              className="bg-green-500 p-2 rounded-lg text-white"
                            >
                              <BsCollectionPlayFill />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onCourseDelete(course._id)}
                              className="bg-red-500 p-2 rounded-lg text-white"
                            >
                              <BsTrash />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
}