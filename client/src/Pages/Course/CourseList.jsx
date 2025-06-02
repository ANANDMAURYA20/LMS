import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../Redux/Slices/CourseSlice";
import CourseCard from "../../Components/CourseCard";
import Layout from "../../Layout/Layout";
import { motion } from "framer-motion";

export default function CourseList() {
  const dispatch = useDispatch();
  const { coursesData } = useSelector((state) => state.course);

  async function fetchCourses() {
    await dispatch(getAllCourses());
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="w-[95%] md:w-[90%] lg:w-[85%] mx-auto py-8">
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-lg bg-white/10 dark:bg-gray-800/30 rounded-lg p-4 md:p-6 lg:p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20"
          >
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Explore Our Courses
              </h1>
              <p className="text-gray-300 text-base md:text-lg">
                Learn from industry experts and advance your career
              </p>
            </motion.div>

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <div className="flex justify-center">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full max-w-md px-4 py-2 bg-white/5 rounded-lg backdrop-blur-sm text-white placeholder-gray-400 border border-white/10 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
                />
              </div>
            </motion.div>

            {/* Courses Grid */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              {coursesData?.map((course) => (
                <motion.div
                  key={course._id}
                  variants={item}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <CourseCard data={course} />
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {(!coursesData || coursesData.length === 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <p className="text-gray-300 text-lg md:text-xl">
                  No courses available at the moment.
                </p>
                <p className="text-gray-400 mt-2">
                  Please check back later for new courses.
                </p>
              </motion.div>
            )}

            {/* Loading State */}
            {!coursesData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center py-12"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
              </motion.div>
            )}
          </motion.section>
        </div>
      </div>
    </Layout>
  );
}
