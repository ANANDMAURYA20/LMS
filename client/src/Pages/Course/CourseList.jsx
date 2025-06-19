import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../Redux/Slices/CourseSlice";
import { Link } from "react-router-dom";
import Layout from "../../Layout/Layout";
import { motion } from "framer-motion";
import { FaLaptopCode, FaSearch } from "react-icons/fa";

export default function CourseList() {
  const dispatch = useDispatch();
  const { coursesData } = useSelector((state) => state.course);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  async function fetchCourses() {
    await dispatch(getAllCourses());
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses based on search term
  useEffect(() => {
    if (coursesData) {
      setFilteredCourses(
        coursesData.filter((course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, coursesData]);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="md:text-4xl text-2xl text-white font-inter font-[500] relative inline-block">
              Explore Our{" "}
              <span className="font-[600] font-lato text-orange-400">
                Courses
              </span>
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-orange-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </h1>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12 max-w-2xl mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses by title, category, or instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-12 py-4 bg-white/10 rounded-xl backdrop-blur-sm text-white placeholder-gray-400 border border-white/20 focus:border-orange-400/50 focus:outline-none transition-all duration-300 shadow-lg"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>

          {/* Courses Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredCourses?.map((course) => (
              <motion.div
                key={course._id}
                variants={item}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 group hover:border-orange-400/50 transition-all duration-300 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
              >
                <div className="relative">
                  <img
                    src={course.thumbnail?.secure_url || "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80"}
                    alt={course.title}
                    className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  {course.numberOfLectures > 0 && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                      {course.numberOfLectures} lectures
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <FaLaptopCode className="text-orange-400 text-xl mr-2" />
                    <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                  </div>
                  <p className="text-gray-300 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">By {course.createdBy}</span>
                    <Link
                      to="/courses/description/"
                      state={{ ...course }}
                      className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {(!filteredCourses || filteredCourses.length === 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 max-w-2xl mx-auto"
            >
              <p className="text-gray-300 text-lg md:text-xl mb-4">
                {searchTerm ? "No courses found matching your search." : "No courses available at the moment."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Clear Search
                </button>
              )}
            </motion.div>
          )}

          {/* Loading State */}
          {!coursesData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center py-12"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400"></div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
