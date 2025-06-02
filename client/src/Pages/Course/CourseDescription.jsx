import React, { useEffect } from "react";
import Layout from "../../Layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useScroll, useTransform } from "framer-motion";

export default function CourseDescription() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { role, data } = useSelector((state) => state.auth);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity1 = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    if(!state) {
      navigate("/courses");
    }
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto md:pt-12 pt-2 px-4 lg:px-20 flex flex-col text-white"
        >
          <motion.div 
            style={{ y: y1, opacity: opacity1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 py-10 relative"
          >
            {/* Left Column */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1 space-y-5"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
              >
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-auto lg:h-64 object-cover"
                  alt="thumbnail"
                  src={state?.thumbnail?.secure_url}
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="backdrop-blur-lg bg-white/10 dark:bg-gray-800/30 rounded-xl p-6 space-y-4 border border-white/20"
              >
                <div className="flex flex-col text-lg font-inter space-y-3">
                  <p className="font-semibold flex items-center space-x-2">
                    <span className="text-yellow-400 font-bold">
                      Total lectures:
                    </span>
                    <span className="text-gray-200">{state?.numberOfLectures}</span>
                  </p>

                  <p className="font-semibold flex items-center space-x-2">
                    <span className="text-yellow-400 font-bold">
                      Instructor:
                    </span>
                    <span className="text-gray-200">{state?.createdBy}</span>
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-1 space-y-8"
            >
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-3xl lg:text-4xl font-bold font-lato text-yellow-400 relative"
              >
                {state?.title}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-purple-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 0.8, delay: 1 }}
                />
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="backdrop-blur-lg bg-white/10 dark:bg-gray-800/30 rounded-xl p-6 space-y-4 border border-white/20"
              >
                <h2 className="text-2xl font-semibold font-inter text-blue-400">
                  Course Description
                </h2>
                <p className="text-lg text-gray-300 font-nunito-sans whitespace-pre-wrap">
                  {state?.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                {role === "ADMIN" || data?.subscription?.status === "active" ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      navigate("/course/displaylectures", { state: { ...state } })
                    }
                    className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl font-bold text-xl transition-all duration-300 backdrop-blur-sm shadow-lg"
                  >
                    Watch Lectures
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/checkout")}
                    className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl font-bold text-xl transition-all duration-300 backdrop-blur-sm shadow-lg"
                  >
                    Subscribe to Watch
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </Layout>
  );
}