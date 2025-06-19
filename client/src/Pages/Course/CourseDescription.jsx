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
    if (!state) {
      navigate("/courses");
    }
    console.log('Role:', role);
    console.log('User Data:', data);
    console.log('Subscription Status:', data?.subscription?.status);
    console.log('Should Show Subscribe:', role === "USER" && (!data?.subscription || data?.subscription?.status !== "active"));
  }, []);

  // Function to check if instructor owns the course
  const isInstructorCourse = () => {
    return role === "INSTRUCTOR" && state?.createdBy === data?.fullName;
  };

  // Function to determine if user should see subscribe button
  const shouldShowSubscribeButton = () => {
    const isUser = role === "USER";
    const hasNoActiveSubscription = !data?.subscription || data?.subscription?.status !== "active";
    return isUser && hasNoActiveSubscription;
  };

  // Add this function to check if user can manage lectures
  const canManageLectures = () => {
    return role === "ADMIN" || isInstructorCourse();
  };

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
                className="space-y-4"
              >
                {/* Subscribe button for non-active users */}
                {shouldShowSubscribeButton() && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/checkout")}
                    className="w-full py-4 px-6 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-xl font-bold text-xl transition-all duration-300 backdrop-blur-sm shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Subscribe to Watch
                  </motion.button>
                )}

                {/* Watch Lectures button for active users */}
                {role === "USER" && data?.subscription?.status === "active" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/course/${state?._id}/lectures`)}
                    className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl font-bold text-xl transition-all duration-300 backdrop-blur-sm shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Watch Lectures
                  </motion.button>
                )}

                {/* Add Lecture Button for instructors and admins */}
                {canManageLectures() && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      navigate(`/course/${state._id}/lecture/add`, {
                        state: { ...state },
                      })
                    }
                    className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-xl font-bold text-xl transition-all duration-300 backdrop-blur-sm shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Manage Lectures
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Move the floating subscription button here, inside the main div */}
        {shouldShowSubscribeButton() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="fixed bottom-8 left-0 right-0 mx-auto px-4 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/checkout")}
              className="w-full max-w-3xl mx-auto py-4 px-6 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl font-bold text-xl transition-all duration-300 backdrop-blur-sm shadow-lg flex items-center justify-center gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Subscribe Now to Watch
              <span className="text-yellow-200 font-normal">₹499/month</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}

