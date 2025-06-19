import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../Layout/Layout";
import { FaGraduationCap, FaLaptopCode, FaPalette, FaChartLine, FaTwitter, FaLinkedin, FaGithub, FaInstagram, FaBook, FaCertificate, FaUsers, FaLightbulb } from 'react-icons/fa';
import { getAllCourses } from "../Redux/Slices/CourseSlice";
import { motion } from "framer-motion";

function HomePage() {
  const dispatch = useDispatch();
  const { coursesData } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-black py-16">
        <div className="container mx-auto flex flex-col md:flex-row items-center px-4">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
              Empower Your Learning Journey
            </h1>
            <p className="text-lg mb-8 text-gray-400">
              Discover hundreds of courses, interactive content, and a vibrant community to help you achieve your academic dreams.
            </p>
            <Link 
              to="/courses" 
              className="bg-orange-500 hover:bg-orange-600 transition px-8 py-3 rounded-full text-white font-bold shadow-lg inline-block"
            >
              Explore Courses
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80" 
              alt="Learning" 
              className="rounded-3xl shadow-2xl w-full max-w-md border-2 border-orange-500/20"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-black border-t border-orange-500/20">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Why Choose <span className="text-orange-500">LearnSmart</span>
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="bg-black/80 p-6 rounded-xl shadow-lg hover:shadow-orange-500/10 transition-all duration-300 border border-orange-500/20 hover:border-orange-500/40"
              variants={itemVariants}
            >
              <div className="bg-orange-500/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <FaBook className="text-2xl text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Quality Content</h3>
              <p className="text-gray-400">Expert-crafted courses designed for maximum learning impact</p>
            </motion.div>

            <motion.div 
              className="bg-black/80 p-6 rounded-xl shadow-lg hover:shadow-orange-500/10 transition-all duration-300 border border-orange-500/20 hover:border-orange-500/40"
              variants={itemVariants}
            >
              <div className="bg-orange-500/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <FaCertificate className="text-2xl text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Certification</h3>
              <p className="text-gray-400">Earn recognized certificates upon course completion</p>
            </motion.div>

            <motion.div 
              className="bg-black/80 p-6 rounded-xl shadow-lg hover:shadow-orange-500/10 transition-all duration-300 border border-orange-500/20 hover:border-orange-500/40"
              variants={itemVariants}
            >
              <div className="bg-orange-500/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <FaUsers className="text-2xl text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Community</h3>
              <p className="text-gray-400">Join a vibrant community of learners worldwide</p>
            </motion.div>

            <motion.div 
              className="bg-black/80 p-6 rounded-xl shadow-lg hover:shadow-orange-500/10 transition-all duration-300 border border-orange-500/20 hover:border-orange-500/40"
              variants={itemVariants}
            >
              <div className="bg-orange-500/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <FaLightbulb className="text-2xl text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Innovation</h3>
              <p className="text-gray-400">Stay ahead with cutting-edge learning methods</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-black border-t border-orange-500/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-orange-500 mb-4">Featured Courses</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our most popular courses and start your learning journey today
            </p>
          </motion.div>

          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            {coursesData?.slice(0, 3).map((course) => (
              <motion.div 
                key={course._id}
                className="bg-black/80 rounded-xl shadow-lg overflow-hidden hover:shadow-orange-500/20 transition group border border-orange-500/20 hover:border-orange-500/40"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <img 
                    src={course.thumbnail?.secure_url || "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80"} 
                    alt={course.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {course.numberOfLectures > 0 && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {course.numberOfLectures} lectures
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <FaLaptopCode className="text-orange-500 text-xl mr-2" />
                    <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                  </div>
                  <p className="text-gray-400 mb-4 line-clamp-2">{course.description}</p>
                  <Link 
                    to={`/courses/description/`} 
                    state={{ ...course }}
                    className="inline-block text-orange-500 font-semibold hover:text-orange-400 transition"
                  >
                    Learn More →
                  </Link>
                </div>
              </motion.div>
            ))}
            {/* Loading State */}
            {!coursesData && (
              <div className="col-span-3 flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            )}

            {/* Empty State */}
            {coursesData?.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500 text-lg">No courses available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-white text-lg mb-8 opacity-90">
              Join thousands of students who are already learning and growing with our platform.
              Start your journey today and unlock your potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-orange-500 hover:bg-gray-100 transition px-8 py-3 rounded-full font-bold shadow-lg inline-block"
              >
                Get Started Today
              </Link>
              <Link
                to="/courses"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 transition px-8 py-3 rounded-full font-bold inline-block"
              >
                Browse Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

export default HomePage;
